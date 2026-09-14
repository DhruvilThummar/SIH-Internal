"""
config.py — Central configuration management for SignalScope Flask API.
"""

import os
from pathlib import Path

_REPO_ROOT = Path(__file__).resolve().parent.parent.parent

class Config:
    PORT: int = int(os.environ.get("PORT", 5000))
    WEIGHTS_PATH: str = os.environ.get(
        "SIGNALSCOPE_WEIGHTS",
        str(_REPO_ROOT / "ml" / "weights" / "best.pth"),
    )
    TEMP_PATH: str = os.environ.get(
        "SIGNALSCOPE_TEMP",
        str(_REPO_ROOT / "ml" / "weights" / "temperature.json"),
    )
    ALLOWED_EXTENSIONS: frozenset[str] = frozenset({".jpg", ".jpeg", ".png", ".webp"})
    MAX_UPLOAD_BYTES: int = 16 * 1024 * 1024  # 16 MB
    URL_FETCH_TIMEOUT: int = 10  # seconds
    USER_AGENT: str = "SignalScope-DefenseGrade-Inference/2.0"
