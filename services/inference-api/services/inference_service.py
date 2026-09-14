"""
inference_service.py — Controller separating API route logic from ML execution.
"""

import io
import sys
import importlib
from pathlib import Path
from config import Config

_ML_SRC = str(Path(__file__).resolve().parent.parent.parent.parent / "ml" / "src")
if _ML_SRC not in sys.path:
    sys.path.insert(0, _ML_SRC)

_model_initialized: bool = False

def initialize_model() -> bool:
    """Initializes ML model weights and temperature scaling parameters."""
    global _model_initialized
    try:
        try:
            from predict import _load_once  # type: ignore
        except ImportError:
            from ml.src.predict import _load_once  # type: ignore

        _load_once(Config.WEIGHTS_PATH, Config.TEMP_PATH)
        _model_initialized = True
        print(f"[SignalScope API] ✓ Model weights initialized from {Config.WEIGHTS_PATH}")
        return True
    except Exception as exc:
        print(f"[SignalScope API] ✗ Model initialization failed: {exc}")
        _model_initialized = False
        return False


def is_model_ready() -> bool:
    """Returns True if model weights are loaded and ready for inference."""
    return _model_initialized


def run_inference_on_bytes(raw_bytes: bytes) -> dict:
    """
    Executes defense-grade two-stage prediction pipeline on raw image bytes.
    Passes untouched BytesIO stream to preserve EXIF & JPEG quantization table.
    """
    if not _model_initialized:
        raise RuntimeError("Model is not initialized or weights are missing.")

    try:
        try:
            import predict as predict_mod  # type: ignore
        except ImportError:
            import ml.src.predict as predict_mod  # type: ignore
            
        importlib.reload(predict_mod)
        stream = io.BytesIO(raw_bytes)
        result = predict_mod.predict(
            stream,
            weights_path=Config.WEIGHTS_PATH,
            temp_path=Config.TEMP_PATH,
        )
        return result
    except Exception as exc:
        raise RuntimeError(f"Inference execution failure: {exc}") from exc
