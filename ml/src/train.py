"""
train.py — Transfer-learning training script for SignalScope.

Two-phase strategy:
  Phase 1 — Freeze EfficientNet-B0 backbone, train only the 2-class head (5 epochs).
             Fast convergence; avoids overwriting pretrained features early.
  Phase 2 — Unfreeze the last 2 MBConv blocks, fine-tune at a lower LR (10 epochs).
             Lets the model adapt higher-level feature representations to AI-artifact patterns.

Best checkpoint saved by *val ROC-AUC* (not accuracy), matching the PRD primary metric.

Usage:
    python model/train.py --data_dir /path/to/dataset

Dataset layout expected (ImageFolder-compatible):
    data_dir/
        real/            ← real photographs
        fake/            ← AI-generated images
        (or ai-generated/ — either name works via ImageFolder label detection)
"""

import argparse
import copy
import json
import sys
import time
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import StratifiedShuffleSplit
from torch.utils.data import DataLoader, Subset
from torchvision import datasets

# ── Allow running as `python ml/src/train.py` from the repo root ─────────────
sys.path.insert(0, str(Path(__file__).parent))
from model_utils import (
    LABEL_NAMES, build_model, freeze_backbone,
    get_transform, unfreeze_last_blocks,
)

# ─── Constants ─────────────────────────────────────────────────────────────────
WEIGHTS_DIR    = Path(__file__).parent.parent / "weights"  # ml/weights/
WEIGHTS_DIR.mkdir(exist_ok=True)
BEST_WEIGHTS   = WEIGHTS_DIR / "best.pth"
MANIFEST_PATH  = WEIGHTS_DIR / "val_manifest.txt"  # exact val split for calibrate.py

PHASE1_EPOCHS  = 5
PHASE2_EPOCHS  = 10
PHASE1_LR      = 1e-3
PHASE2_LR      = 1e-4
BATCH_SIZE     = 32
VAL_SPLIT      = 0.20   # 80/20 stratified train/val
NUM_WORKERS    = 0       # 0 keeps Windows DataLoader happy; increase on Linux


# ─── Data loading ─────────────────────────────────────────────────────────────

def load_splits(data_dir: str, val_split: float = VAL_SPLIT):
    """
    Build stratified 80/20 train/val subsets from an ImageFolder dataset.

    Returns:
        train_subset, val_subset, class_weights (np.ndarray), class_to_idx (dict)
    """
    data_dir = Path(data_dir)

    # Load once to get labels for stratification
    full_ds = datasets.ImageFolder(str(data_dir))
    # Filter out non-binary classes like 'held_out'
    valid_classes = {k: v for k, v in full_ds.class_to_idx.items() if k.lower() in ("real", "fake", "ai-generated")}
    valid_class_indices = set(valid_classes.values())

    valid_samples = [s for s in full_ds.samples if s[1] in valid_class_indices]
    if not valid_samples:
        valid_samples = full_ds.samples

    # Map labels to binary 0 and 1 (0: real, 1: ai-generated)
    class_map = {orig_idx: (0 if "real" in k.lower() else 1) for k, orig_idx in valid_classes.items()}
    mapped_samples = [(s[0], class_map.get(s[1], 0)) for s in valid_samples]

    probe = full_ds
    probe.samples = mapped_samples
    labels = [s[1] for s in mapped_samples]

    splitter = StratifiedShuffleSplit(n_splits=1, test_size=val_split, random_state=42)
    train_idx, val_idx = next(splitter.split(labels, labels))

    train_ds = datasets.ImageFolder(str(data_dir), transform=get_transform(train=True))
    val_ds   = datasets.ImageFolder(str(data_dir), transform=get_transform(train=False))
    train_ds.samples = mapped_samples
    val_ds.samples = mapped_samples

    train_sub = Subset(train_ds, train_idx)
    val_sub   = Subset(val_ds,   val_idx)

    train_labels  = np.array([labels[i] for i in train_idx])
    class_counts  = np.bincount(train_labels, minlength=2).astype(float)
    class_weights = (1.0 / np.maximum(class_counts, 1.0)) / (1.0 / np.maximum(class_counts, 1.0)).sum()

    print(f"  Train: {len(train_sub):,}  Val: {len(val_sub):,}")
    print(f"  class_to_idx : {valid_classes}")
    print(f"  class_weights: real={class_weights[0]:.3f}  ai-gen={class_weights[1]:.3f}")

    # ── Persist the exact val split so calibrate.py uses IDENTICAL files ──────
    # Re-running StratifiedShuffleSplit on the full dataset would give the same
    # indices only if nothing in data_dir changes between train and calibrate.
    # Writing the manifest eliminates that fragility entirely.
    val_paths = [probe.samples[i][0] for i in val_idx]
    with open(MANIFEST_PATH, "w") as f:
        for p in val_paths:
            f.write(p + "\n")
    print(f"  Val manifest  → {MANIFEST_PATH}  ({len(val_paths):,} paths)")

    return train_sub, val_sub, class_weights, probe.class_to_idx


# ─── Evaluation helper ─────────────────────────────────────────────────────────

@torch.no_grad()
def eval_epoch(model: nn.Module, loader: DataLoader,
               criterion: nn.Module, device: torch.device):
    """One full validation pass. Returns (avg_loss, roc_auc)."""
    model.eval()
    all_probs, all_labels, total_loss = [], [], 0.0

    for imgs, lbls in loader:
        imgs, lbls = imgs.to(device), lbls.to(device)
        logits     = model(imgs)
        loss       = criterion(logits, lbls)
        total_loss += loss.item() * imgs.size(0)
        probs       = torch.softmax(logits, dim=1)[:, 1].cpu().numpy()
        all_probs.extend(probs)
        all_labels.extend(lbls.cpu().numpy())

    avg_loss = total_loss / len(loader.dataset)
    auc = (roc_auc_score(all_labels, all_probs)
           if len(set(all_labels)) > 1 else 0.5)
    return avg_loss, auc


# ─── Training loop ─────────────────────────────────────────────────────────────

def train_phase(
    model: nn.Module,
    train_loader: DataLoader,
    val_loader: DataLoader,
    optimizer: optim.Optimizer,
    scheduler,
    criterion: nn.Module,
    device: torch.device,
    n_epochs: int,
    phase_label: str,
    best_auc: float,
) -> tuple[float, dict]:
    """
    Generic training loop for one phase.

    Returns:
        (best_auc_so_far, best_state_dict)
        Checkpoint is also written to BEST_WEIGHTS on every improvement.
    """
    best_state = None

    for epoch in range(1, n_epochs + 1):
        model.train()
        running_loss = 0.0
        t0 = time.time()

        for imgs, lbls in train_loader:
            imgs, lbls = imgs.to(device), lbls.to(device)
            optimizer.zero_grad()
            loss = criterion(model(imgs), lbls)
            loss.backward()
            optimizer.step()
            running_loss += loss.item() * imgs.size(0)

        train_loss = running_loss / len(train_loader.dataset)
        val_loss, val_auc = eval_epoch(model, val_loader, criterion, device)
        elapsed = time.time() - t0

        marker = ""
        if val_auc > best_auc:
            best_auc   = val_auc
            best_state = copy.deepcopy(model.state_dict())
            torch.save(
                {"model_state_dict": best_state, "val_auc": best_auc},
                BEST_WEIGHTS,
            )
            marker = "  ✓ best"

        print(
            f"  [{phase_label}] ep {epoch:02d}/{n_epochs} | "
            f"train_loss={train_loss:.4f}  val_loss={val_loss:.4f}  "
            f"val_AUC={val_auc:.4f}  ({elapsed:.1f}s){marker}"
        )

        if scheduler is not None:
            scheduler.step(val_auc)

    return best_auc, best_state


# ─── Entry point ───────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="SignalScope — train EfficientNet-B0 classifier"
    )
    parser.add_argument(
        "--data_dir", required=True,
        help="Root dataset dir with real/ and fake/ (or ai-generated/) subfolders",
    )
    parser.add_argument("--batch_size",     type=int, default=BATCH_SIZE)
    parser.add_argument("--phase1_epochs",  type=int, default=PHASE1_EPOCHS)
    parser.add_argument("--phase2_epochs",  type=int, default=PHASE2_EPOCHS)
    parser.add_argument(
        "--phase2_blocks", type=int, default=2,
        help="Number of EfficientNet-B0 tail MBConv blocks to unfreeze in Phase 2",
    )
    args = parser.parse_args()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"\n[SignalScope] Device : {device}")
    print(f"[SignalScope] Weights: {BEST_WEIGHTS}\n")

    # ── Data ──────────────────────────────────────────────────────────────────
    print("Loading dataset...")
    data_path = Path(args.data_dir)
    if not data_path.exists():
        print(f"\n❌ Error: Dataset directory '{args.data_dir}' not found.")
        print("Creating dataset folder structure...")
        (data_path / "real").mkdir(parents=True, exist_ok=True)
        (data_path / "ai-generated").mkdir(parents=True, exist_ok=True)
        print(f"✓ Folder structure created at: {data_path.resolve()}")
        print("\nPlease place your training images into:")
        print(f"  📁 {data_path.resolve() / 'real'}          (Real camera photos)")
        print(f"  📁 {data_path.resolve() / 'ai-generated'}  (AI-generated images)")
        print(f"\nOr specify your existing dataset path:")
        print(f"  python ml/src/train.py --data_dir <path_to_your_dataset>")
        sys.exit(1)

    try:
        train_sub, val_sub, class_weights, class_to_idx = load_splits(args.data_dir)
    except (FileNotFoundError, Exception) as exc:
        print(f"\n❌ Could not load dataset from '{args.data_dir}': {exc}")
        print("Ensure 'data' contains subdirectories with image files, e.g.:")
        print(f"  {data_path.resolve()}/real/")
        print(f"  {data_path.resolve()}/ai-generated/")
        sys.exit(1)

    # Persist class_to_idx so predict.py can verify label alignment
    binary_class_to_idx = {"real": 0, "ai-generated": 1}
    with open(WEIGHTS_DIR / "class_to_idx.json", "w") as f:
        json.dump(binary_class_to_idx, f, indent=2)

    cw = torch.tensor(class_weights, dtype=torch.float32).to(device)
    criterion = nn.CrossEntropyLoss(weight=cw)

    train_loader = DataLoader(
        train_sub, batch_size=args.batch_size,
        shuffle=True, num_workers=NUM_WORKERS, pin_memory=False,
    )
    val_loader = DataLoader(
        val_sub, batch_size=args.batch_size,
        shuffle=False, num_workers=NUM_WORKERS, pin_memory=False,
    )

    # ── Model ─────────────────────────────────────────────────────────────────
    model    = build_model(num_classes=2).to(device)
    best_auc = 0.0

    # ── Phase 1: frozen backbone, head only ───────────────────────────────────
    print("\n=== Phase 1 — Train head only (backbone frozen) ===")
    freeze_backbone(model)
    trainable_p1 = sum(p.numel() for p in model.parameters() if p.requires_grad)
    print(f"  Trainable params: {trainable_p1:,}")

    opt1 = optim.Adam(
        filter(lambda p: p.requires_grad, model.parameters()), lr=PHASE1_LR
    )
    sched1 = optim.lr_scheduler.ReduceLROnPlateau(
        opt1, mode="max", patience=2, factor=0.5
    )
    best_auc, _ = train_phase(
        model, train_loader, val_loader, opt1, sched1,
        criterion, device, args.phase1_epochs, "P1", best_auc,
    )

    # ── Phase 2: unfreeze last N blocks, fine-tune ────────────────────────────
    print(f"\n=== Phase 2 — Fine-tune (last {args.phase2_blocks} blocks unfrozen) ===")
    unfreeze_last_blocks(model, n_blocks=args.phase2_blocks)
    trainable_p2 = sum(p.numel() for p in model.parameters() if p.requires_grad)
    print(f"  Trainable params: {trainable_p2:,}")

    opt2 = optim.Adam(
        filter(lambda p: p.requires_grad, model.parameters()), lr=PHASE2_LR
    )
    sched2 = optim.lr_scheduler.ReduceLROnPlateau(
        opt2, mode="max", patience=3, factor=0.5
    )
    best_auc, _ = train_phase(
        model, train_loader, val_loader, opt2, sched2,
        criterion, device, args.phase2_epochs, "P2", best_auc,
    )

    print(f"\n✓ Training complete.  Best val AUC: {best_auc:.4f}")
    print(f"  Checkpoint → {BEST_WEIGHTS}")
    print(
        f"\nNext step:\n"
        f"  python ml/src/calibrate.py "
        f"--weights {BEST_WEIGHTS} "
        f"--val_dir {args.data_dir}"
    )


if __name__ == "__main__":
    main()
