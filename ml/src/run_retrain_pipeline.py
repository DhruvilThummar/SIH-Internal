"""
run_retrain_pipeline.py — Sequential execution of Training, Calibration, and Evaluation.
"""

import sys
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent

def run_step(cmd_list, description):
    print(f"\n========================================================")
    print(f"  {description}")
    print(f"========================================================")
    result = subprocess.run(cmd_list, cwd=str(REPO_ROOT), text=True)
    if result.returncode != 0:
        print(f"❌ Error during step: {description}")
        sys.exit(result.returncode)
    print(f"✓ Step complete: {description}")

def main():
    # 1. Retrain model (Phase 1 + Phase 2)
    run_step(
        [sys.executable, "ml/src/train.py", "--data_dir", "data", "--phase1_epochs", "3", "--phase2_epochs", "5"],
        "Phase 1 & 2 Model Training (train.py)"
    )

    # 2. Temperature Calibration
    run_step(
        [sys.executable, "ml/src/calibrate.py", "--weights", "ml/weights/best.pth", "--val_manifest", "ml/weights/val_manifest.txt"],
        "Post-Hoc Temperature Scaling Calibration (calibrate.py)"
    )

    # 3. Held-out Evaluation
    run_step(
        [sys.executable, "ml/src/evaluate.py", "--data_dir", "data/held_out"],
        "Empirical Benchmark Evaluation (evaluate.py)"
    )

    print("\n🎉 Full Retraining, Calibration & Evaluation Pipeline Succeeded!")

if __name__ == "__main__":
    main()
