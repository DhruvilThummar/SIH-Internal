"""
test_validation.py — Unit tests for SSRF protection and image validation functions.
"""

import unittest
import sys
from pathlib import Path

_SERVICE_DIR = str(Path(__file__).resolve().parent.parent.parent / "services" / "inference-api")
if _SERVICE_DIR not in sys.path:
    sys.path.insert(0, _SERVICE_DIR)

try:
    from utils.validation import is_safe_url, validate_file_extension, verify_image_bytes  # type: ignore
except ImportError:
    from services.inference_api.utils.validation import is_safe_url, validate_file_extension, verify_image_bytes  # type: ignore

class TestValidationUtils(unittest.TestCase):

    def test_safe_http_url(self):
        is_safe, msg = is_safe_url("https://images.unsplash.com/photo-1506744038136-46273834b3fb")
        self.assertTrue(is_safe)

    def test_ssrf_localhost_blocked(self):
        is_safe, msg = is_safe_url("http://localhost:5000/secret")
        self.assertFalse(is_safe)
        self.assertIn("internal localhost", msg)

    def test_ssrf_private_ip_blocked(self):
        is_safe, msg = is_safe_url("http://192.168.1.1/admin")
        self.assertFalse(is_safe)
        self.assertIn("private or internal network", msg)

    def test_allowed_extensions(self):
        is_valid, ext = validate_file_extension("sample_test.jpg")
        self.assertTrue(is_valid)
        self.assertEqual(ext, ".jpg")

        is_valid_png, ext_png = validate_file_extension("photo.png")
        self.assertTrue(is_valid_png)
        self.assertEqual(ext_png, ".png")

        is_invalid, err = validate_file_extension("document.pdf")
        self.assertFalse(is_invalid)

if __name__ == "__main__":
    unittest.main()
