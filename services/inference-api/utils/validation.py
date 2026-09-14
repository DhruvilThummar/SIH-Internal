"""
validation.py — SSRF protection, URL validation, and image decoding verification.
"""

import io
import ipaddress
import urllib.parse
from pathlib import Path
from PIL import Image, UnidentifiedImageError
from config import Config

def is_safe_url(url: str) -> tuple[bool, str]:
    """
    Validates URL scheme and verifies domain/IP is not localhost or private range (SSRF defense).
    """
    if not url or not isinstance(url, str):
        return False, "URL must be a non-empty string."

    parsed = urllib.parse.urlparse(url.strip())
    if parsed.scheme not in ("http", "https"):
        return False, f"Invalid URL scheme '{parsed.scheme}'. Only http and https are allowed."

    hostname = parsed.hostname
    if not hostname:
        return False, "Invalid URL host."

    # Check for localhost/loopback/private IP targets
    if hostname.lower() in ("localhost", "127.0.0.1", "0.0.0.0", "::1"):
        return False, "Access to internal localhost addresses is prohibited."

    try:
        ip = ipaddress.ip_address(hostname)
        if ip.is_private or ip.is_loopback or ip.is_reserved or ip.is_link_local:
            return False, "Access to private or internal network addresses is prohibited."
    except ValueError:
        # Hostname is a domain name, not a raw IP string
        pass

    return True, "URL is valid."


def validate_file_extension(filename: str) -> tuple[bool, str]:
    """Checks if file extension is allowed."""
    ext = Path(filename).suffix.lower()
    if ext not in Config.ALLOWED_EXTENSIONS:
        return False, f"Unsupported file extension '{ext}'. Accepted: {sorted(Config.ALLOWED_EXTENSIONS)}"
    return True, ext


def verify_image_bytes(raw_bytes: bytes) -> tuple[bool, str]:
    """Verifies that raw bytes form a valid decodable image."""
    if not raw_bytes or len(raw_bytes) == 0:
        return False, "Empty payload received."

    if len(raw_bytes) > Config.MAX_UPLOAD_BYTES:
        return False, f"Payload size exceeds maximum allowed limit of {Config.MAX_UPLOAD_BYTES // (1024*1024)}MB."

    try:
        Image.open(io.BytesIO(raw_bytes)).verify()
        return True, "Valid image payload."
    except UnidentifiedImageError:
        return False, "Corrupted image or unknown image format."
    except Exception as exc:
        return False, f"Failed to decode image payload: {exc}"
