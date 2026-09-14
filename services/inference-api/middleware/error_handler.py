"""
error_handler.py — Global HTTP error handlers for Flask app.
"""

from flask import Flask, jsonify
from werkzeug.exceptions import HTTPException

def register_error_handlers(app: Flask) -> None:
    """Registers standard JSON error response handlers."""
    
    @app.errorhandler(HTTPException)
    def handle_http_exception(exc: HTTPException):
        response = exc.get_response()
        return jsonify({
            "error": exc.description,
            "status_code": exc.code,
        }), exc.code

    @app.errorhandler(400)
    def bad_request(exc):
        return jsonify({"error": "Bad Request: " + str(exc)}), 400

    @app.errorhandler(415)
    def unsupported_media_type(exc):
        return jsonify({"error": "Unsupported Media Type: " + str(exc)}), 415

    @app.errorhandler(422)
    def unprocessable_entity(exc):
        return jsonify({"error": "Unprocessable Entity: " + str(exc)}), 422

    @app.errorhandler(500)
    def internal_error(exc):
        return jsonify({"error": "Internal Server Error during inference execution."}), 500
