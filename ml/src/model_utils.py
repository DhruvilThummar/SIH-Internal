"""
model_utils.py — Shared preprocessing, model-building, and label utilities.

Imported identically by train.py, calibrate.py, predict.py, and evaluate.py.
All preprocessing happens through get_transform() — never duplicated elsewhere.
"""

import io
import random
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from torchvision import models, transforms
from PIL import Image

# ─── Label constants ───────────────────────────────────────────────────────────
LABEL_NAMES: dict[int, str] = {0: "real", 1: "ai-generated"}
LABEL_IDX:   dict[str, int] = {v: k for k, v in LABEL_NAMES.items()}

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD  = [0.229, 0.224, 0.225]
IMAGE_SIZE    = 224


# ─── Custom augmentation ───────────────────────────────────────────────────────

class JPEGCompression:
    """Simulate JPEG compression artifacts at a random quality level."""

    def __init__(self, quality_range: tuple[int, int] = (50, 95)):
        self.quality_range = quality_range

    def __call__(self, img: Image.Image) -> Image.Image:
        quality = random.randint(*self.quality_range)
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG", quality=quality)
        buffer.seek(0)
        return Image.open(buffer).copy()


# ─── Transform pipelines ───────────────────────────────────────────────────────

def get_transform(train: bool = False) -> transforms.Compose:
    """Return the torchvision transform pipeline."""
    if train:
        return transforms.Compose([
            transforms.Resize((IMAGE_SIZE + 32, IMAGE_SIZE + 32)),
            transforms.RandomResizedCrop(IMAGE_SIZE, scale=(0.70, 1.0)),
            transforms.RandomHorizontalFlip(p=0.5),
            transforms.RandomApply([JPEGCompression(quality_range=(50, 95))], p=0.50),
            transforms.RandomApply(
                [transforms.GaussianBlur(kernel_size=3, sigma=(0.1, 2.0))], p=0.30
            ),
            transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.10),
            transforms.ToTensor(),
            transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
        ])
    else:
        return transforms.Compose([
            transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
            transforms.ToTensor(),
            transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
        ])


def letterbox_image(img_pil: Image.Image, target_size: int = IMAGE_SIZE) -> tuple[torch.Tensor, list[float]]:
    """
    Aspect-ratio preserving letterbox transform to target_size x target_size.
    Returns:
        tensor: Normalized PyTorch tensor (1, 3, target_size, target_size)
        valid_roi: [ymin, xmin, ymax, xmax] normalized coordinates (0.0 to 1.0)
    """
    w, h = img_pil.size
    scale = min(target_size / w, target_size / h)
    nw, nh = int(round(w * scale)), int(round(h * scale))

    resized = img_pil.resize((nw, nh), Image.Resampling.BILINEAR)
    new_img = Image.new("RGB", (target_size, target_size), (128, 128, 128))

    pad_left = (target_size - nw) // 2
    pad_top = (target_size - nh) // 2
    new_img.paste(resized, (pad_left, pad_top))

    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])
    tensor = transform(new_img).unsqueeze(0)

    ymin = float(pad_top / target_size)
    xmin = float(pad_left / target_size)
    ymax = float((pad_top + nh) / target_size)
    xmax = float((pad_left + nw) / target_size)

    return tensor, [ymin, xmin, ymax, xmax]


# ─── Model construction ────────────────────────────────────────────────────────

def build_model(num_classes: int = 2) -> nn.Module:
    """EfficientNet-B0 baseline or Vision Foundation linear probe model."""
    weights = models.EfficientNet_B0_Weights.IMAGENET1K_V1
    model   = models.efficientnet_b0(weights=weights)

    num_features      = model.classifier[1].in_features  # 1280
    model.classifier  = nn.Sequential(
        nn.Dropout(p=0.2, inplace=True),
        nn.Linear(num_features, num_classes),
    )
    return model


def load_model(weights_path: str, device: torch.device = None) -> nn.Module:
    """Build model and load weights."""
    if device is None:
        device = torch.device("cpu")

    model = build_model(num_classes=2)
    checkpoint = torch.load(weights_path, map_location=device, weights_only=False)

    if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
        state_dict = checkpoint["model_state_dict"]
    else:
        state_dict = checkpoint

    model.load_state_dict(state_dict)
    model.to(device)
    model.eval()
    return model


# ─── Grad-CAM / Bipolar Zero-Point Spatial Heatmap helper ────────────────────

def compute_spatial_heatmap(model: nn.Module, tensor: torch.Tensor, valid_roi: list[float] = None) -> dict:
    """
    Compute Zero-Point Anchored Bipolar Spatial Attribution Heatmap.
    S_p = A_p / max(|A_p|)
    Values > +0.15 indicate AI Glitch (Turbo Spectrum)
    Values < -0.15 indicate Authentic Camera Anchors (Cyan-Blue Spectrum)
    """
    model.eval()
    with torch.no_grad():
        if hasattr(model, "features"):
            feats = model.features(tensor)  # (1, C, H_f, W_f) e.g. (1, 1280, 7, 7)
            weights = model.classifier[1].weight[1] - model.classifier[1].weight[0]  # (1280,)
            cam = torch.einsum("c, bchw -> bhw", weights, feats)[0].cpu().numpy()
        else:
            cam = np.zeros((7, 7), dtype=np.float32)

    gh, gw = cam.shape

    # Mask out letterbox padding area if valid_roi provided
    if valid_roi:
        ymin, xmin, ymax, xmax = valid_roi
        r_ymin, r_ymax = int(round(ymin * gh)), int(round(ymax * gh))
        r_xmin, r_xmax = int(round(xmin * gw)), int(round(xmax * gw))
        mask = np.zeros_like(cam, dtype=bool)
        mask[r_ymin:r_ymax, r_xmin:r_xmax] = True
        cam[~mask] = 0.0

    # Zero-Point Anchored Normalization
    abs_max = float(np.max(np.abs(cam))) + 1e-9
    norm_cam = cam / abs_max  # range [-1.0, 1.0]

    return {
        "heatmap_grid": norm_cam.tolist(),
        "grid_dimensions": [gh, gw],
        "valid_roi": valid_roi or [0.0, 0.0, 1.0, 1.0],
    }


# ─── Freeze / unfreeze helpers ────────────────────────────────────────────────

def freeze_backbone(model: nn.Module) -> None:
    """Freeze backbone parameters except classifier head."""
    for name, param in model.named_parameters():
        param.requires_grad = ("classifier" in name)


def unfreeze_last_blocks(model: nn.Module, n_blocks: int = 2) -> None:
    """Unfreeze last N blocks for fine-tuning."""
    for param in model.parameters():
        param.requires_grad = False
    for param in model.classifier.parameters():
        param.requires_grad = True
    if hasattr(model, "features"):
        feature_blocks = list(model.features.children())
        for block in feature_blocks[-n_blocks:]:
            for param in block.parameters():
                param.requires_grad = True

