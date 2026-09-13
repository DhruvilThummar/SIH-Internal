r"""
ela.py — Pixel-Level Error Level Analysis (ELA) Engine for Micro-Inpainting & Seam Detection.

Features:
  - Re-compresses image at 90% JPEG quality factor
  - Computes pixel-level error delta: \Delta_{ELA} = |I_{orig} - I_{JPEG}| * 15.0
  - Detects micro-inpainting seams and Generative Fill localized edits
"""

import io
import numpy as np
from PIL import Image

def extract_ela_metrics(img_pil: Image.Image) -> dict:
    """
    Extracts Error Level Analysis (ELA) re-compression metrics.
    """
    rgb = img_pil.convert("RGB")
    w, h = rgb.size

    # Re-compress at 90% JPEG quality
    buf = io.BytesIO()
    rgb.save(buf, format="JPEG", quality=90)
    buf.seek(0)
    recompressed = Image.open(buf).convert("RGB")

    orig_arr = np.array(rgb, dtype=np.float32)
    recomp_arr = np.array(recompressed, dtype=np.float32)

    ela_map = np.abs(orig_arr - recomp_arr) * 15.0
    mean_ela = float(np.mean(ela_map))
    max_ela = float(np.max(ela_map))

    # Grid patch variance to locate localized inpainting contrast
    pw, ph = max(1, w // 8), max(1, h // 8)
    patch_means = []
    for j in range(8):
        for i in range(8):
            patch = ela_map[j*ph:(j+1)*ph, i*pw:(i+1)*pw]
            if patch.size > 0:
                patch_means.append(float(np.mean(patch)))

    max_patch_mean = max(patch_means) if patch_means else mean_ela
    contrast_ratio = float(max_patch_mean / (mean_ela + 1e-6))
    has_micro_inpainting = bool(contrast_ratio > 4.2 and max_ela > 65.0)

    ela_score = int(np.clip((mean_ela / 25.0) * 100.0, 10, 95))

    return {
        "mean_ela_delta": round(mean_ela, 4),
        "max_ela_contrast_ratio": round(contrast_ratio, 4),
        "has_micro_inpainting": has_micro_inpainting,
        "score": ela_score,
        "detail": (
            "Localized JPEG quantization boundary discrepancy detected (Micro-inpainting / Generative Fill seam)"
            if has_micro_inpainting
            else "Uniform quantization error distribution across entire image surface"
        ),
    }
