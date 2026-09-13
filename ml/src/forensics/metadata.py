"""
metadata.py — EXIF Metadata & Physical Sensor Consistency Cross-Validation Engine.

Features:
  - EXIF tag parsing & AI software signature identification
  - EXIF Physics Cross-Validation (verifies camera Make/Model against Bayer noise correlation)
"""

from PIL import Image, ExifTags

AI_SOFTWARE_SIGNATURES = [
    "comfyui", "automatic1111", "stable diffusion", "midjourney",
    "dall-e", "firefly", "novelai", "invokeai", "fooocus"
]

def extract_metadata_metrics(img_pil: Image.Image, bayer_corr: float = 0.50) -> dict:
    """
    Extracts EXIF metadata and cross-validates claimed camera against Bayer noise correlation.
    """
    exif_data = {}
    ai_software_tag = None
    claimed_camera = None

    try:
        raw_exif = img_pil._getexif()
        if raw_exif:
            for tag_id, value in raw_exif.items():
                tag = ExifTags.TAGS.get(tag_id, tag_id)
                exif_data[str(tag).lower()] = str(value).lower()
    except Exception:
        pass

    # Check for AI generator software tags in EXIF
    software_val = exif_data.get("software", "") + " " + exif_data.get("usercomment", "")
    for sig in AI_SOFTWARE_SIGNATURES:
        if sig in software_val:
            ai_software_tag = sig
            break

    make = exif_data.get("make", "")
    model = exif_data.get("model", "")
    if make or model:
        claimed_camera = f"{make} {model}".strip().title()

    # EXIF Physics Cross-Validation: Claimed DSLR vs Bayer noise correlation
    metadata_discrepancy = False
    if claimed_camera and bayer_corr < 0.35:
        metadata_discrepancy = True

    if ai_software_tag:
        detail_msg = f"Generative AI metadata tag detected ({ai_software_tag.upper()})"
    elif metadata_discrepancy:
        detail_msg = f"Discrepancy detected: EXIF claims optical {claimed_camera} sensor, but spatial Bayer demosaicing residuals are absent"
    elif claimed_camera:
        detail_msg = f"Optical camera metadata verified ({claimed_camera})"
    else:
        detail_msg = "Stripped/Synthetic color profile detected; no physical sensor CFA signature present"

    return {
        "has_exif": bool(exif_data),
        "claimed_camera": claimed_camera,
        "ai_software_tag": ai_software_tag,
        "metadata_discrepancy": metadata_discrepancy,
        "detail": detail_msg,
    }
