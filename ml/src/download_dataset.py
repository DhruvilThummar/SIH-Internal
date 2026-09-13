"""
download_dataset.py — Direct Open-Access Dataset Ingestion via Hugging Face Streaming.

Streams TheKernel01/Tiny-GenImage directly without registration or Kaggle API tokens:
  - Real images saved to: data/held_out/real/ and data/real/
  - Fake images saved to: data/held_out/fake/ (and data/held_out/ai-generated/)
  - Test sample saved to: data/test_sample.jpg
"""

import os
from pathlib import Path
from PIL import Image

def download_open_access_dataset(target_samples: int = 50):
    os.makedirs("data/held_out/real", exist_ok=True)
    os.makedirs("data/held_out/fake", exist_ok=True)
    os.makedirs("data/held_out/ai-generated", exist_ok=True)
    os.makedirs("data/real", exist_ok=True)
    os.makedirs("data/ai-generated", exist_ok=True)

    print("Hugging Face પરથી રેડી-ટુ-યુઝ Tiny-GenImage ડેટા સ્ટ્રીમ થઈ રહ્યો છે...")

    try:
        from datasets import load_dataset
        dataset = load_dataset("TheKernel01/Tiny-GenImage", split="train", streaming=True)

        real_count = 0
        fake_count = 0

        for sample in dataset:
            label = sample.get("label", sample.get("target", 0))
            img = sample["image"].convert("RGB")

            # Check if label is real (0 or string "real")
            if (label == 0 or str(label).lower() in ("real", "0")) and real_count < target_samples:
                img.save(f"data/held_out/real/real_{real_count:03d}.jpg", "JPEG")
                img.save(f"data/real/real_{real_count:03d}.jpg", "JPEG")
                if real_count == 0:
                    img.save("data/test_sample.jpg", "JPEG")
                real_count += 1

            # Check if label is fake (1 or string "fake")
            elif (label == 1 or str(label).lower() in ("fake", "1", "ai-generated")) and fake_count < target_samples:
                img.save(f"data/held_out/fake/fake_{fake_count:03d}.jpg", "JPEG")
                img.save(f"data/held_out/ai-generated/ai_{fake_count:03d}.jpg", "JPEG")
                img.save(f"data/ai-generated/ai_{fake_count:03d}.jpg", "JPEG")
                fake_count += 1

            if real_count >= target_samples and fake_count >= target_samples:
                break

        print(f"✓ પૂર્ણ: {real_count} Real અને {fake_count} Fake ઇમેજ data/held_out/ માં સેવ થઈ ગઈ છે.")
        print(f"✓ CLI test sample saved at data/test_sample.jpg")

    except Exception as exc:
        print(f"⚠ Hugging Face streaming error: {exc}")
        print("➜ Make sure `pip install datasets pillow` is installed.")


if __name__ == "__main__":
    download_open_access_dataset(target_samples=250)
