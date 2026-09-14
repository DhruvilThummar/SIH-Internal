"""
verify_environment.py — Sanity checker verifying dependencies, Python version, and model weights.
"""

import sys
import os
from pathlib import Path

_REPO_ROOT = Path(__file__).resolve().parent.parent

def check_env():
    print("=========================================================")
    print(" SignalScope Environment Sanity Checker")
    print("=========================================================")

    # 1. Python Version
    py_ver = sys.version.split()[0]
    print(f"[+] Python Version: {py_ver}")

    # 2. Key Package Imports
    packages = ["torch", "torchvision", "PIL", "flask", "flask_cors", "requests"]
    for pkg in packages:
        try:
            __import__(pkg)
            print(f"[+] Package '{pkg}': Available ✓")
        except ImportError:
            print(f"[!] Package '{pkg}': MISSING ✗")

    # 3. Model Weights Check
    weights_path = _REPO_ROOT / "ml" / "weights" / "best.pth"
    temp_path = _REPO_ROOT / "ml" / "weights" / "temperature.json"

    if weights_path.exists():
        size_mb = weights_path.stat().st_size / (1024 * 1024)
        print(f"[+] Weights File '{weights_path.name}': Present ({size_mb:.2f} MB) ✓")
    else:
        print(f"[!] Weights File '{weights_path.name}': Not found (Fallback initialization active) ✗")

    if temp_path.exists():
        print(f"[+] Temperature Params '{temp_path.name}': Present ✓")
    else:
        print(f"[!] Temperature Params '{temp_path.name}': Not found ✗")

    print("=========================================================")

if __name__ == "__main__":
    check_env()
