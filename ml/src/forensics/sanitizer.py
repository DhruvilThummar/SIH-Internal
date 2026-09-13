"""
sanitizer.py — Image Preprocessing & Sanitization Engine.

Features:
  - RGBA / LA Alpha Channel Compositing over a neutral canvas (prevents black background artifacts in FFT)
  - Color space profile sRGB standardization & ICC drift removal
"""

from PIL import Image, ImageCms

def sanitize_input_image(img_pil: Image.Image) -> Image.Image:
    """
    Sanitizes raw input image for consistent forensic feature extraction.
    """
    # 1. Handle Alpha / Transparency Compositing
    if img_pil.mode in ("RGBA", "LA") or (img_pil.mode == "P" and "transparency" in img_pil.info):
        alpha = img_pil.convert("RGBA").split()[-1]
        bg = Image.new("RGBA", img_pil.size, (255, 255, 255, 255))
        bg.paste(img_pil, mask=alpha)
        img_pil = bg.convert("RGB")
    else:
        img_pil = img_pil.convert("RGB")

    # 2. Standardize Color Space to sRGB
    try:
        if "icc_profile" in img_pil.info:
            srgb_profile = ImageCms.createProfile("sRGB")
            img_io = ImageCms.ImageCmsProfile(img_pil.info["icc_profile"])
            img_pil = ImageCms.profileToProfile(img_pil, img_io, srgb_profile)
    except Exception:
        pass  # Fall back to standard RGB convert if ICC profile reading fails

    return img_pil
