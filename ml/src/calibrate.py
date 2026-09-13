"""
calibrate.py — Post-hoc temperature scaling for SignalScope.

Why this exists:
    The PRD explicitly flags false positives (real photos flagged as AI-generated)
    as costly. Raw softmax outputs from neural networks tend to be overconfident —
    a 90% softmax score rarely means "90% accurate". Temperature scaling is a
    simple, principled fix: we learn one scalar T that divides the logits before
    softmax, which flattens the probability distribution until it matches empirical
    accuracy on the validation set.

Method:
    T* = argmin  NLL( softmax(logits / T), true_labels )
    over the SAME held-out validation slice used during training.

    IMPORTANT — split integrity:
    train.py writes ml/weights/val_manifest.txt listing the exact file paths that
    landed in the val split. calibrate.py reads that manifest to guarantee it
    calibrates on the IDENTICAL images, not a re-sampled approximation.
    If the manifest is missing, calibrate.py falls back to re-splitting with a
    loud warning — the fallback is mathematically equivalent only if nothing in
    --val_dir changed between training and calibration.

Usage (recommended — uses train.py's exact val split):
    python ml/src/calibrate.py \\
        --weights      ml/weights/best.pth \\
        --val_manifest ml/weights/val_manifest.txt

Usage (fallback — re-splits; only safe if dataset hasn't changed):
    python ml/src/calibrate.py \\
        --weights ml/weights/best.pth \\
        --val_dir /path/to/dataset
"""

import argparse
import json
import sys
import warnings
from pathlib import Path
from typing import List, Tuple

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from PIL import Image
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import StratifiedShuffleSplit
from torch.utils.data import DataLoader, Dataset, Subset
from torchvision import datasets

sys.path.insert(0, str(Path(__file__).parent))
from model_utils import get_transform, load_model

WEIGHTS_DIR   = Path(__file__).parent.parent / "weights"  # ml/weights/
DEF_MANIFEST  = WEIGHTS_DIR / "val_manifest.txt"
VAL_SPLIT     = 0.20
BATCH_SIZE    = 32
NUM_WORKERS   = 0


# ─── Manifest-based dataset ───────────────────────────────────────────────────

class ManifestDataset(Dataset):
    """
    Loads only the image files listed in a val_manifest.txt produced by train.py.
    Infers the label from the parent directory name (ImageFolder convention:
    real/ → 0, fake/ → 1  per the class_to_idx mapping).
    """

    def __init__(self, manifest_path: Path, class_to_idx: dict,
                 transform=None):
        self.transform    = transform
        self.class_to_idx = class_to_idx
        paths = manifest_path.read_text().splitlines()
        paths = [p.strip() for p in paths if p.strip()]
        # Resolve label from parent dir name
        self.samples: List[Tuple[str, int]] = []
        skipped = 0
        for p in paths:
            parent = Path(p).parent.name.lower()
            if "real" in parent:
                self.samples.append((p, 0))
            elif "ai" in parent or "fake" in parent or "synth" in parent:
                self.samples.append((p, 1))
            else:
                skipped += 1
        if skipped:
            warnings.warn(
                f"ManifestDataset: {skipped} paths skipped "
                f"(parent dir not in class_to_idx={list(class_to_idx.keys())})"
            )

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, idx: int):
        path, label = self.samples[idx]
        img = Image.open(path).convert("RGB")
        if self.transform:
            img = self.transform(img)
        return img, label


# ─── Temperature scaler ───────────────────────────────────────────────────────

class TemperatureScaler(nn.Module):
    """Wraps a single learnable scalar T applied as logits / T."""

    def __init__(self):
        super().__init__()
        self.temperature = nn.Parameter(torch.ones(1))

    def forward(self, logits: torch.Tensor) -> torch.Tensor:
        return logits / self.temperature.clamp(min=0.01)


# ─── Helpers ──────────────────────────────────────────────────────────────────

@torch.no_grad()
def collect_logits(model: nn.Module, loader: DataLoader,
                   device: torch.device) -> tuple[torch.Tensor, torch.Tensor]:
    """Forward-pass over the loader; return raw logits and true labels."""
    model.eval()
    all_logits, all_labels = [], []
    for imgs, lbls in loader:
        imgs = imgs.to(device)
        all_logits.append(model(imgs).cpu())
        all_labels.append(lbls)
    return torch.cat(all_logits), torch.cat(all_labels)


def expected_calibration_error(probs: np.ndarray, labels: np.ndarray,
                               n_bins: int = 15) -> float:
    """
    ECE — measures the gap between confidence and empirical accuracy.
    Lower is better calibrated.
    """
    bins = np.linspace(0.0, 1.0, n_bins + 1)
    ece  = 0.0
    n    = len(probs)
    for lo, hi in zip(bins[:-1], bins[1:]):
        mask = (probs >= lo) & (probs < hi)
        if mask.sum() == 0:
            continue
        acc  = labels[mask].mean()
        conf = probs[mask].mean()
        ece += abs(acc - conf) * mask.sum() / n
    return float(ece)


# ─── Entry point ──────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Temperature-scale calibration for SignalScope"
    )
    parser.add_argument(
        "--weights", required=True,
        help="Path to best.pth checkpoint produced by train.py",
    )
    parser.add_argument(
        "--val_manifest",
        default=str(DEF_MANIFEST),
        help="Path to val_manifest.txt written by train.py (preferred). "
             "Defaults to ml/weights/val_manifest.txt.",
    )
    parser.add_argument(
        "--val_dir", default=None,
        help="Dataset root — used as FALLBACK only when --val_manifest is absent. "
             "WARNING: re-splitting here risks calibrating on training data if "
             "the dataset changed since training.",
    )
    parser.add_argument("--lr",     type=float, default=0.01)
    parser.add_argument("--epochs", type=int,   default=50)
    args = parser.parse_args()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[calibrate] Device: {device}")

    # ── Load model ────────────────────────────────────────────────────────────
    model = load_model(args.weights, device=device)

    # ── Validation loader — manifest-first ────────────────────────────────────
    manifest = Path(args.val_manifest)
    if manifest.exists():
        print(f"[calibrate] Using val manifest: {manifest}")
        # Infer class_to_idx from the checkpoint's class_to_idx.json if present
        class_idx_path = Path(args.weights).parent / "class_to_idx.json"
        if class_idx_path.exists():
            with open(class_idx_path) as f:
                class_to_idx = json.load(f)
        else:
            # Fallback: standard ImageFolder convention
            class_to_idx = {"real": 0, "fake": 1}
            warnings.warn(
                f"class_to_idx.json not found at {class_idx_path}. "
                f"Using default: {class_to_idx}. "
                "Re-train to generate the file, or supply it manually."
            )
        val_ds = ManifestDataset(
            manifest, class_to_idx=class_to_idx,
            transform=get_transform(train=False),
        )
        val_loader = DataLoader(
            val_ds, batch_size=BATCH_SIZE,
            shuffle=False, num_workers=NUM_WORKERS,
        )
    else:
        # ── Fallback: re-split (fragile — warn loudly) ────────────────────────
        warnings.warn(
            f"\n{'='*70}\n"
            f"  VAL MANIFEST NOT FOUND: {manifest}\n"
            f"  Falling back to re-splitting --val_dir with the same random seed.\n"
            f"  This is ONLY safe if the dataset hasn't changed since training.\n"
            f"  Re-run train.py to generate a manifest, then re-run calibrate.py.\n"
            f"{'='*70}",
            stacklevel=1,
        )
        if not args.val_dir:
            raise SystemExit(
                "ERROR: Neither --val_manifest nor --val_dir supplied. "
                "Cannot build a validation set."
            )
        full_ds = datasets.ImageFolder(
            args.val_dir, transform=get_transform(train=False)
        )
        labels  = [s[1] for s in full_ds.samples]
        spl     = StratifiedShuffleSplit(n_splits=1, test_size=VAL_SPLIT, random_state=42)
        _, val_idx = next(spl.split(labels, labels))
        val_ds     = Subset(full_ds, val_idx)
        val_loader = DataLoader(
            val_ds, batch_size=BATCH_SIZE,
            shuffle=False, num_workers=NUM_WORKERS,
        )

    # ── Collect logits ────────────────────────────────────────────────────────
    print(f"[calibrate] Collecting validation logits ({len(val_ds):,} samples)...")
    logits, true_labels = collect_logits(model, val_loader, device)
    labels_np = true_labels.numpy()

    # Before calibration metrics
    probs_before = torch.softmax(logits, dim=1)[:, 1].numpy()
    auc_before   = roc_auc_score(labels_np, probs_before)
    ece_before   = expected_calibration_error(probs_before, labels_np)
    print(f"  Before calibration → AUC={auc_before:.4f}  ECE={ece_before:.4f}")

    # ── Fit temperature via LBFGS / Scipy minimize ───────────────────────────
    from scipy.optimize import minimize

    logits_np = (logits[:, 1] - logits[:, 0]).numpy()

    def nll_cost(temp):
        t = temp[0]
        scaled = logits_np / max(t, 1e-4)
        prob = 1.0 / (1.0 + np.exp(-np.clip(scaled, -20.0, 20.0)))
        eps = 1e-12
        loss = -np.mean(labels_np * np.log(prob + eps) + (1.0 - labels_np) * np.log(1.0 - prob + eps))
        return loss

    res = minimize(nll_cost, x0=[1.5], bounds=[(0.01, 10.0)], method='L-BFGS-B')
    T = float(res.x[0])

    # After calibration metrics
    probs_after = 1.0 / (1.0 + np.exp(-np.clip(logits_np / T, -20.0, 20.0)))
    auc_after   = roc_auc_score(labels_np, probs_after) if len(np.unique(labels_np)) > 1 else auc_before
    ece_after   = expected_calibration_error(probs_after, labels_np)
    print(f"  After  calibration → AUC={auc_after:.4f}  ECE={ece_after:.4f}  Optimal T={T:.4f}")

    if T < 1.0:
        print("  Note: T < 1 means the model was underconfident on this val slice — unusual.")
    else:
        print(f"  T={T:.4f} > 1 → calibration softened overconfident raw softmax outputs.")

    # ── Persist ───────────────────────────────────────────────────────────────
    out_path = Path(args.weights).parent / "temperature.json"
    with open(out_path, "w") as f:
        json.dump({"temperature": T, "ece_before": ece_before, "ece_after": ece_after}, f, indent=2)
    print(f"\n✓ Temperature written to: {out_path}")
    print(
        f"\nNext step:\n"
        f"  python ml/src/predict.py --image <path_to_any_image.jpg>"
    )


if __name__ == "__main__":
    main()
