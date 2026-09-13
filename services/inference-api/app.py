"""
app.py — Flask inference API for SignalScope Defense-Grade System.

Routes:
    POST /predict   — multipart/form-data with 'image' field → JSON verdict
    GET  /health    — liveness check
"""

import io
import os
import sys
import tempfile
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image, UnidentifiedImageError

_ML_SRC = str(Path(__file__).resolve().parent.parent.parent / "ml" / "src")
if _ML_SRC not in sys.path:
    sys.path.insert(0, _ML_SRC)

try:
    from predict import _load_once, predict  # type: ignore
except ImportError:
    from ml.src.predict import _load_once, predict  # type: ignore

_REPO_ROOT = Path(__file__).parent.parent.parent

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

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = MAX_UPLOAD_BYTES
CORS(app, resources={r"/*": {"origins": "*"}})

_model_ready: bool = False
try:
    _load_once(WEIGHTS_PATH, TEMP_PATH)
    _model_ready = True
    print(f"[SignalScope API] ✓ Model ready from {WEIGHTS_PATH}")
except Exception as exc:
    print(f"[SignalScope API] ✗ Model initialization failed: {exc}")


@app.get("/health")
def health():
    return jsonify({
        "status":       "ok",
        "model_loaded": _model_ready,
        "weights_path": WEIGHTS_PATH,
    })


@app.post("/predict")
def predict_route():
    if not _model_ready:
        return jsonify({"error": "Model weights not yet available."}), 503

    if "image" not in request.files:
        return jsonify({"error": "No 'image' field in request."}), 400

    file = request.files["image"]
    if not file or file.filename == "":
        return jsonify({"error": "Empty file or filename."}), 400

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        return jsonify({
            "error": f"Unsupported file type '{ext}'.",
            "accepted": sorted(ALLOWED_EXTENSIONS),
        }), 415

    try:
        raw_bytes = file.read()
        # Verify valid image header without decoding entire pixel payload
        Image.open(io.BytesIO(raw_bytes)).verify()
    except Exception:
        return jsonify({"error": "File could not be decoded as a valid image."}), 422

    try:
        # Pass untouched raw BytesIO stream to preserve EXIF & JPEG quantization table
        result = predict(io.BytesIO(raw_bytes), weights_path=WEIGHTS_PATH, temp_path=TEMP_PATH)
    except Exception as exc:
        return jsonify({"error": f"Inference failed: {exc}"}), 500

    return jsonify(result)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"[SignalScope API] Starting defense-grade server on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
