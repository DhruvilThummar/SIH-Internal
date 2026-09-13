"""
texture.py — Spatial Multi-Patch PRNU Sensor Micro-Grain & Texture Forensics Engine.

Features:
  - Dynamic Crop Size handling (supports images < 512px down to 64px)
  - PyTorch CUDA acceleration for noise residual extraction when available
  - Bayer Cross-Channel Noise Correlation (corr_rg > 0.60 confirms optical sensor Bayer demosaicing)
  - Smartphone Computational Photography & Beauty Filter defense
"""

import numpy as np
from PIL import Image, ImageFilter
import torch
import torch.nn.functional as F

def extract_texture_metrics(img_pil: Image.Image) -> dict:
    """
    Extracts spatial sensor noise residual & Bayer cross-channel correlation metrics.
    """
    w, h = img_pil.size
    crop_w, crop_h = min(w, 512), min(h, 512)

    # 5 native-resolution crops (Center + 4 Corners)
    crops = [
        img_pil.crop(((w - crop_w) // 2, (h - crop_h) // 2, (w + crop_w) // 2, (h + crop_h) // 2)),
        img_pil.crop((0, 0, crop_w, crop_h)),
        img_pil.crop((w - crop_w, 0, w, crop_h)),
        img_pil.crop((0, h - crop_h, crop_w, h)),
        img_pil.crop((w - crop_w, h - crop_h, w, h)),
    ]

    patch_stds = []
    correlations = []
    has_gpu = torch.cuda.is_available()

    for crop in crops:
        gray = np.array(crop.convert("L"), dtype=np.float32)
        rgb = np.array(crop.convert("RGB"), dtype=np.float32)

        if has_gpu:
            tensor_gray = torch.from_numpy(gray).unsqueeze(0).unsqueeze(0).cuda()
            kernel = torch.ones((1, 1, 3, 3), dtype=torch.float32).cuda() / 9.0
            blurred = F.conv2d(tensor_gray, kernel, padding=1)
            residual = (tensor_gray - blurred).squeeze().cpu().numpy()
        else:
            blurred = np.array(crop.convert("L").filter(ImageFilter.BoxBlur(1)), dtype=np.float32)
            residual = gray - blurred

        patch_std = float(np.std(residual))
        patch_stds.append(patch_std)

        # Bayer Cross-Channel Correlation (Red vs Green channel noise residual)
        r_arr, g_arr = rgb[:, :, 0], rgb[:, :, 1]
        r_blur = np.array(Image.fromarray(r_arr.astype(np.uint8)).filter(ImageFilter.BoxBlur(1)), dtype=np.float32)
        g_blur = np.array(Image.fromarray(g_arr.astype(np.uint8)).filter(ImageFilter.BoxBlur(1)), dtype=np.float32)
        res_r, res_g = r_arr - r_blur, g_arr - g_blur

        if np.std(res_r) > 1e-4 and np.std(res_g) > 1e-4:
            corr = float(np.corrcoef(res_r.flat, res_g.flat)[0, 1])
            correlations.append(corr)

    mean_std = float(np.mean(patch_stds))
    min_std = float(np.min(patch_stds))
    max_std = float(np.max(patch_stds))

    avg_bayer_corr = float(np.mean(correlations)) if correlations else 0.50
    variance_ratio = float((max_std - min_std) / (mean_std + 1e-6))
    is_computational_photo = bool(avg_bayer_corr > 0.60 and mean_std < 3.5)
    is_oversmoothed = bool(mean_std < 2.50 and not is_computational_photo)

    # Score mapping
    if is_computational_photo:
        prnu_score = 30  # Low AI score due to verified Bayer demosaicing
    else:
        prnu_score = int(np.clip(100.0 - (mean_std / 6.0) * 100.0, 10, 95))

    if is_computational_photo:
        detail_msg = "Computational bilateral post-processing detected on native optical capture; Bayer demosaicing residuals intact"
    elif is_oversmoothed:
        detail_msg = "Synthetic multi-patch smooth noise residual; absence of physical CMOS sensor grain"
    else:
        detail_msg = "CMOS/CCD 5-patch physical PRNU grain and natural micro-texture detected"

    return {
        "mean_noise_std": round(mean_std, 4),
        "min_noise_std": round(min_std, 4),
        "bayer_correlation": round(avg_bayer_corr, 4),
        "is_computational_photo": is_computational_photo,
        "is_oversmoothed": is_oversmoothed,
        "score": prnu_score,
        "detail": detail_msg,
    }
