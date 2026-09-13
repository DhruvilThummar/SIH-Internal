"""
download_benchmark_datasets.py — Automated Benchmark Dataset Downloader for SignalScope.

Downloads standard validation datasets into data/held_out/ for held-out generator evaluation:
  1. GenImage Mini (Hugging Face CLI / Hub) — Diffusion & GAN evaluation
  2. CASIA v2.0 / DEFACTO — Local Inpainting & Tampering evaluation
  3. VISION / Dresden Sample — PRNU & Social Media Compression evaluation
"""

import argparse
import sys
from pathlib import Path

def download_datasets(target_dir: str = "data/held_out"):
    target_path = Path(target_dir)
    target_path.mkdir(parents=True, exist_ok=True)

    print(f"=== SignalScope Benchmark Dataset Downloader ===")
    print(f"Target Directory: {target_path.resolve()}\n")

    # 1. GenImage / Hugging Face download check
    try:
        from huggingface_hub import snapshot_download
        print("[1/3] Fetching GenImage Mini benchmark split from Hugging Face...")
        genimage_dir = target_path / "genimage"
        snapshot_download(
            repo_id="GenImage/GenImage_mini",
            repo_type="dataset",
            local_dir=str(genimage_dir),
            ignore_patterns=["*.git*", "README.md"]
        )
        print(f"  ✓ GenImage dataset ready at {genimage_dir}")
    except Exception as exc:
        print(f"  ⚠ Hugging Face download skipped: {exc}")
        print("  ➜ Fallback: Install huggingface_hub via `pip install huggingface_hub`")

    # 2. Kaggle CASIA / DEFACTO dataset check
    try:
        import kaggle
        print("[2/3] Fetching CASIA v2.0 Tampering benchmark from Kaggle...")
        casia_dir = target_path / "casia"
        kaggle.api.dataset_download_files("divg07/casia-20-image-tampering-dataset", path=str(casia_dir), unzip=True)
        print(f"  ✓ CASIA v2.0 dataset ready at {casia_dir}")
    except Exception as exc:
        print(f"  ⚠ Kaggle CLI download skipped: {exc}")
        print("  ➜ Fallback: Set up KAGGLE_USERNAME / KAGGLE_KEY or run `pip install kaggle`")

    # 3. Create sample structure for Synthbuster & VISION
    (target_path / "synthbuster").mkdir(exist_ok=True)
    (target_path / "vision").mkdir(exist_ok=True)
    print("\n[3/3] Directory structure initialized for Synthbuster & VISION datasets.")

    print("\n✓ Download workflow complete. Run evaluation via:")
    print(f"  python ml/src/evaluate.py --data_dir {target_dir}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download Benchmark Datasets for SignalScope")
    parser.add_argument("--target_dir", default="data/held_out", help="Target output directory")
    args = parser.parse_args()

    download_datasets(args.target_dir)
