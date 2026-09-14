"""
predict.py — Route blueprint for POST /predict (file upload) & POST /predict-url (remote image URL).
"""

from flask import Blueprint, jsonify, request
from utils.validation import validate_file_extension, verify_image_bytes
from utils.url_fetcher import fetch_image_from_url
from services.inference_service import is_model_ready, run_inference_on_bytes

predict_bp = Blueprint("predict", __name__)


@predict_bp.post("/predict")
def predict_file_route():
    """Multipart file upload inference endpoint."""
    if not is_model_ready():
        return jsonify({"error": "Model weights unavailable or uninitialized."}), 503

    if "image" not in request.files:
        return jsonify({"error": "Missing 'image' multipart field."}), 400

    file = request.files["image"]
    if not file or file.filename == "":
        return jsonify({"error": "Uploaded file is empty."}), 400

    is_valid_ext, ext = validate_file_extension(file.filename)
    if not is_valid_ext:
        return jsonify({"error": ext}), 415

    raw_bytes = file.read()
    is_valid_img, val_msg = verify_image_bytes(raw_bytes)
    if not is_valid_img:
        return jsonify({"error": val_msg}), 422

    try:
        result = run_inference_on_bytes(raw_bytes)
        return jsonify(result), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@predict_bp.post("/predict-url")
def predict_url_route():
    """Remote image URL inference endpoint (Phase 7)."""
    if not is_model_ready():
        return jsonify({"error": "Model weights unavailable or uninitialized."}), 503

    data = request.get_json(silent=True)
    if not data or "url" not in data:
        return jsonify({"error": "JSON body must contain 'url' field."}), 400

    url = data["url"]
    raw_bytes, error_msg = fetch_image_from_url(url)
    if error_msg:
        return jsonify({"error": error_msg}), 400

    try:
        result = run_inference_on_bytes(raw_bytes)
        return jsonify(result), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
