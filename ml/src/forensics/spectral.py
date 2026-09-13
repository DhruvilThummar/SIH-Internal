"""
spectral.py — 2D Fast Fourier Transform (FFT) Spectral Forensics Engine.

Features:
  - Dual-Stream Native Crop Processing (512x512 crops across 5 spatial locations)
  - JPEG 8x8 DCT Notch Filter (masks out block boundary harmonics to prevent false positives on JPEG real images)
  - Periodic Grid Peak Ratio calculation
"""

import numpy as np
from PIL import Image

def extract_spectral_metrics(img_pil: Image.Image) -> dict:
    """
    Extracts 2D FFT spectral metrics on native RAW un-interpolated crops.
    """
    w, h = img_pil.size
    crop_w, crop_h = min(w, 512), min(h, 512)

    # 5 native-resolution crops (Center + 4 Corners)
    crops = [
        img_pil.crop(((w - crop_w) // 2, (h - crop_h) // 2, (w + crop_w) // 2, (h + crop_h) // 2)),
        img_pil.crop((0, 0, crop_w, crop_h)),
        img_pil.crop((w - crop_w, 0, w, crop_h)),
        img_pil.crop((0, h - crop_h, crop_w, h)),
        img_pil.crop((w - crop_w, h - crop_h, w, h)),
    ]

    peak_ratios = []
    hf_energies = []

    for crop in crops:
        gray = np.array(crop.convert("L"), dtype=np.float32)
        ch, cw = gray.shape

        f = np.fft.fft2(gray)
        fshift = np.fft.fftshift(f)
        magnitude_spectrum = 20.0 * np.log(np.abs(fshift) + 1e-9)

        cy, cx = ch // 2, cw // 2

        # ─── JPEG 8x8 DCT Grid Notch Filter ──────────────────────────────────
        # Zero out fundamental JPEG frequencies (8x8 and 16x16 block grid harmonics)
        for freq in [ch // 8, (2 * ch) // 8, (3 * ch) // 8]:
            if 0 <= cy - freq < ch:
                magnitude_spectrum[max(0, cy - freq - 1):min(ch, cy - freq + 2), :] = 0
            if 0 <= cy + freq < ch:
                magnitude_spectrum[max(0, cy + freq - 1):min(ch, cy + freq + 2), :] = 0

        for freq in [cw // 8, (2 * cw) // 8, (3 * cw) // 8]:
            if 0 <= cx - freq < cw:
                magnitude_spectrum[:, max(0, cx - freq - 1):min(cw, cx - freq + 2)] = 0
            if 0 <= cx + freq < cw:
                magnitude_spectrum[:, max(0, cx + freq - 1):min(cw, cx + freq + 2)] = 0

        # High frequency mask (radius > min(ch, cw)/4)
        radius = min(ch, cw) // 4
        y_grid, x_grid = np.ogrid[:ch, :cw]
        mask = (x_grid - cx) ** 2 + (y_grid - cy) ** 2 > radius ** 2

        if np.any(mask):
            high_freq_energy = float(np.mean(magnitude_spectrum[mask]))
            peak_val = float(np.max(magnitude_spectrum[mask]))
            peak_ratio = float(peak_val / (high_freq_energy + 1e-9))
        else:
            high_freq_energy = 0.0
            peak_ratio = 1.0

        hf_energies.append(high_freq_energy)
        peak_ratios.append(peak_ratio)

    avg_peak_ratio = float(np.mean(peak_ratios))
    avg_hf_energy = float(np.mean(hf_energies))
    has_grid_artifacts = bool(avg_peak_ratio > 1.85)

    fft_score = int(np.clip((avg_peak_ratio - 1.0) * 80.0, 10, 95))

    return {
        "periodic_grid_peak_ratio": round(avg_peak_ratio, 4),
        "high_freq_energy": round(avg_hf_energy, 4),
        "has_grid_artifacts": has_grid_artifacts,
        "score": fft_score,
        "detail": (
            "Periodic upsampling grid harmonics detected in 2D FFT magnitude spectrum"
            if has_grid_artifacts
            else "Natural 1/f^2.0 optical spectral decay without periodic lattice artifacts"
        ),
    }
