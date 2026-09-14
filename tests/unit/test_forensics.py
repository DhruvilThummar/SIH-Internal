"""
test_forensics.py — Unit tests for Stage B forensic extractors (ELA, Spectral, Texture).
"""

import unittest
import sys
import numpy as np
from PIL import Image
from pathlib import Path

_REPO_ROOT = Path(__file__).resolve().parent.parent.parent
_ML_SRC = str(_REPO_ROOT / "ml" / "src")
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))
if _ML_SRC not in sys.path:
    sys.path.insert(0, _ML_SRC)

try:
    from ml.src.forensics.ela import extract_ela_metrics
    from ml.src.forensics.spectral import extract_spectral_metrics
    from ml.src.forensics.texture import extract_texture_metrics
    from ml.src.forensics.sanitizer import sanitize_image
except ImportError:
    from forensics.ela import extract_ela_metrics  # type: ignore
    from forensics.spectral import extract_spectral_metrics  # type: ignore
    from forensics.texture import extract_texture_metrics  # type: ignore
    from forensics.sanitizer import sanitize_image  # type: ignore

class TestForensicExtractors(unittest.TestCase):

    def setUp(self):
        # Create a synthetic 128x128 RGB numpy test image
        img_array = np.random.randint(0, 255, (128, 128, 3), dtype=np.uint8)
        self.test_img = Image.fromarray(img_array)

    def test_sanitizer_normalizes_to_rgb(self):
        """Sanitizer must convert RGBA white-canvas and return RGB PIL Image."""
        rgba_img = Image.new("RGBA", (64, 64), (255, 0, 0, 128))
        sanitized = sanitize_image(rgba_img)
        self.assertEqual(sanitized.mode, "RGB")

    def test_ela_score_bounds(self):
        """ELA score must return dict with score float between 0 and 100."""
        res = extract_ela_metrics(self.test_img)
        self.assertIn("score", res)
        self.assertIn("detail", res)
        self.assertGreaterEqual(res["score"], 0)
        self.assertLessEqual(res["score"], 100)

    def test_spectral_score_bounds(self):
        """Spectral 2D FFT score must return dict with score float between 0 and 100."""
        res = extract_spectral_metrics(self.test_img)
        self.assertIn("score", res)
        self.assertIn("detail", res)
        self.assertGreaterEqual(res["score"], 0)
        self.assertLessEqual(res["score"], 100)

    def test_texture_score_bounds(self):
        """Texture & PRNU score must return dict with score float between 0 and 100."""
        res = extract_texture_metrics(self.test_img)
        self.assertIn("score", res)
        self.assertIn("detail", res)
        self.assertGreaterEqual(res["score"], 0)
        self.assertLessEqual(res["score"], 100)

if __name__ == "__main__":
    unittest.main()
