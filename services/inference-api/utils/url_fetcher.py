"""
url_fetcher.py — Remote image HTTP stream fetcher with timeouts and SSRF checks.
"""

import urllib.request
import urllib.error
import requests
from config import Config
from utils.validation import is_safe_url, verify_image_bytes

def fetch_image_from_url(url: str) -> tuple[bytes | None, str | None]:
    """
    Safely fetches raw image bytes from a remote URL.
    Returns (bytes, None) on success or (None, error_message) on failure.
    """
    is_safe, msg = is_safe_url(url)
    if not is_safe:
        return None, msg

    headers = {
        "User-Agent": Config.USER_AGENT,
        "Accept": "image/jpeg,image/png,image/webp,*/*;q=0.8",
    }

    try:
        resp = requests.get(
            url,
            headers=headers,
            timeout=Config.URL_FETCH_TIMEOUT,
            stream=True,
        )
        if resp.status_code != 200:
            return None, f"Remote server returned HTTP status {resp.status_code}."

        content_length = resp.headers.get("Content-Length")
        if content_length and int(content_length) > Config.MAX_UPLOAD_BYTES:
            return None, f"Remote image size ({int(content_length)//(1024*1024)}MB) exceeds limit of {Config.MAX_UPLOAD_BYTES//(1024*1024)}MB."

        raw_bytes = resp.content
        is_valid, val_msg = verify_image_bytes(raw_bytes)
        if not is_valid:
            return None, val_msg

        return raw_bytes, None

    except requests.exceptions.Timeout:
        return None, f"Request timed out after {Config.URL_FETCH_TIMEOUT} seconds while fetching remote image."
    except requests.exceptions.RequestException as exc:
        return None, f"Failed to fetch remote image: {exc}"
