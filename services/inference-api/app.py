"""
app.py — Defense-grade Flask inference API application factory and server entrypoint.
"""

import os
import sys
from pathlib import Path
from flask import Flask
from flask_cors import CORS

_CURRENT_DIR = Path(__file__).resolve().parent
if str(_CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(_CURRENT_DIR))

from config import Config
from middleware.error_handler import register_error_handlers
from services.inference_service import initialize_model
from routes.health import health_bp
from routes.predict import predict_bp

def create_app() -> Flask:
    """Creates and configures Flask application instance."""
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = Config.MAX_UPLOAD_BYTES

    # Configure CORS for defense dashboard frontend
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Register error handling middleware
    register_error_handlers(app)

    # Register API Route Blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(predict_bp)

    # Load machine learning model weights at startup
    initialize_model()

    return app

app = create_app()

if __name__ == "__main__":
    port = Config.PORT
    print(f"[SignalScope API v2.0] Defense-grade server listening on http://0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
