"""
health.py — GET /health endpoint route blueprint.
"""

from flask import Blueprint, jsonify
from config import Config
from services.inference_service import is_model_ready

health_bp = Blueprint("health", __name__)

@health_bp.get("/health")
def health_check():
    """Liveness & readiness health check endpoint."""
    ready = is_model_ready()
    return jsonify({
        "status": "ok" if ready else "degraded",
        "model_loaded": ready,
        "weights_path": Config.WEIGHTS_PATH,
        "version": "2.0.0",
    }), 200 if ready else 503
