"""
prepare_dataset.py — Dataset structure validator and helper script for SignalScope.

Checks and prepares datasets for production training:
  • Creates ImageFolder structure if missing (`data_dir/real` and `data_dir/ai-generated`)
  • Scans for corrupt or unreadable image files (JPG/PNG/WEBP)
  • Reports class counts and real/AI balance

Usage:
    python ml/src/prepare_dataset.py --data_dir data/
"""

import argparse
import sys
from pathlib import Path
from PIL import Image

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

def validate_dataset(data_dir: str, auto_create: bool = True):
    data_path = Path(data_dir)
    
    if not data_path.exists():
        if auto_create:
            print(f"[prepare_dataset] Directory '{data_dir}' not found. Creating dataset structure...")
            (data_path / "real").mkdir(parents=True, exist_ok=True)
            (data_path / "ai-generated").mkdir(parents=True, exist_ok=True)
            print(f"✓ Created folder structure at: {data_path.resolve()}\n")
            print("Please add your images into these subfolders:")
            print(f"  📁 {data_path.resolve() / 'real'}          (Real camera photographs)")
            print(f"  📁 {data_path.resolve() / 'ai-generated'}  (AI generated images: Midjourney, SDXL, FLUX, DALL-E)\n")
            print("After adding your images, re-run:")
            print(f"  python ml/src/prepare_dataset.py --data_dir {data_dir}")
            return
        else:
            print(f"[prepare_dataset] ❌ Error: Directory '{data_dir}' does not exist.")
            sys.exit(1)

    subdirs = [d for d in data_path.iterdir() if d.is_dir()]
    if not subdirs:
        (data_path / "real").mkdir(exist_ok=True)
        (data_path / "ai-generated").mkdir(exist_ok=True)
        print(f"[prepare_dataset] Created missing subfolders 'real' and 'ai-generated' inside {data_path.resolve()}.")
        print("Please place your training images into 'real' and 'ai-generated' subfolders.")
        return

    print(f"=== SignalScope Dataset Health Check ===")
    print(f"Dataset root: {data_path.resolve()}\n")

    total_images = 0
    corrupt_count = 0
    class_stats = {}

    for sub in subdirs:
        files = [f for f in sub.rglob("*") if f.suffix.lower() in SUPPORTED_EXTENSIONS]
        valid_files = []

        print(f"Scanning category: '{sub.name}' ({len(files)} files found)...")
        for f in files:
            try:
                with Image.open(f) as img:
                    img.verify()
                valid_files.append(f)
            except Exception:
                print(f"  ⚠ Corrupt file detected: {f}")
                corrupt_count += 1

        class_stats[sub.name] = len(valid_files)
        total_images += len(valid_files)

    print("\n--- Health Summary ---")
    for cat, count in class_stats.items():
        pct = (count / total_images * 100) if total_images > 0 else 0
        print(f"  • Category '{cat}': {count:,} images ({pct:.1f}%)")

    print(f"  • Total valid images: {total_images:,}")
    print(f"  • Corrupt files removed/skipped: {corrupt_count}")

    if total_images == 0:
        print(f"\n⚠ Warning: No images found in {data_path.resolve()}.")
        print("Please copy your JPG/PNG/WEBP images into the 'real' and 'ai-generated' subfolders before training.")
    elif total_images < 50:
        print("\n⚠ Warning: Dataset contains fewer than 50 images. For production performance, train on 1,000+ real & AI images.")
        print(f"You can proceed with training test: python ml/src/train.py --data_dir {data_dir}")
    else:
        print("\n✅ Dataset health check passed! Ready for training.")
        print("\nTo start production training:")
        print(f"  python ml/src/train.py --data_dir {data_dir}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SignalScope Dataset Health Check")
    parser.add_argument("--data_dir", required=True, help="Path to dataset directory")
    args = parser.parse_args()
    validate_dataset(args.data_dir)
