"""
test_pipeline.py — Integration test for end-to-end ML prediction pipeline.
"""

import io
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
    from ml.src.predict import predict
except ImportError:
    from predict import predict  # type: ignore

class TestMLPipelineIntegration(unittest.TestCase):

    def setUp(self):
        # Generate random RGB test image bytes
        img_array = np.random.randint(0, 255, (256, 256, 3), dtype=np.uint8)
        img = Image.fromarray(img_array)
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=90)
        self.img_bytes = buf.getvalue()

    def test_predict_pipeline_execution(self):
        """End-to-end predict() execution must return structured PredictResult dict."""
        stream = io.BytesIO(self.img_bytes)
        result = predict(stream)

        self.assertIn("label", result)
        self.assertIn("confidence", result)
        self.assertIn(result["label"], ["likely AI-generated", "likely real", "uncertain — low confidence"])
        self.assertGreaterEqual(result["confidence"], 0.0)
        self.assertLessEqual(result["confidence"], 1.0)
        self.assertIn("forensics", result)
        self.assertIn("fft_spectrum", result["forensics"])
        self.assertIn("sensor_prnu", result["forensics"])

if __name__ == "__main__":
    unittest.main()
