"""
test_api.py — Unit tests for Flask API endpoints (/health, /predict, /predict-url).
"""

import io
import unittest
import sys
from pathlib import Path

_SERVICE_DIR = str(Path(__file__).resolve().parent.parent.parent / "services" / "inference-api")
if _SERVICE_DIR not in sys.path:
    sys.path.insert(0, _SERVICE_DIR)

from app import create_app

class TestInferenceApi(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.app.testing = True

    def test_health_endpoint(self):
        """Verify GET /health endpoint returns HTTP 200 or 503 with expected JSON structure."""
        res = self.client.get("/health")
        self.assertIn(res.status_code, (200, 503))
        data = res.get_json()
        self.assertIn("status", data)
        self.assertIn("model_loaded", data)
        self.assertIn("version", data)

    def test_predict_no_image_field(self):
        """Verify POST /predict returns HTTP 400 when 'image' field is missing."""
        res = self.client.post("/predict")
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertIn("error", data)

    def test_predict_url_no_json(self):
        """Verify POST /predict-url returns HTTP 400 when JSON body is missing."""
        res = self.client.post("/predict-url", json={})
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertIn("error", data)

    def test_predict_url_invalid_scheme(self):
        """Verify POST /predict-url rejects ftp or unsafe schemes with HTTP 400."""
        res = self.client.post("/predict-url", json={"url": "ftp://example.com/test.jpg"})
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertIn("error", data)

if __name__ == "__main__":
    unittest.main()
