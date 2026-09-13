# SignalScope — Production Training, Dataset Setup & Execution Guide (`HOWTO_RUN.md`)

This guide explains how to acquire standard multi-generator AI benchmarks (GenImage, Synthbuster, DEFACTO, CASIA v2.0, VISION, Dresden) and run training, calibration, benchmark evaluation, and production deployment for **SignalScope**.

---

## 📁 1. Standard Benchmark Datasets Overview

Validation datasets are categorized into three core forensic domains:

### Category 1: AI-Generated & Diffusion Detection Datasets
| Dataset | Source | Description |
|---------|--------|-------------|
| **GenImage** | Hugging Face (`GenImage/GenImage_mini`) | Premier AI benchmark with over 1M+ images across Stable Diffusion v1.4/v1.5, Midjourney, DALL-E, GLIDE, VQDM, BigGAN vs ImageNet real photos. |
| **Synthbuster** | Zenodo Open-Access Repository | Ideal for evaluating high-resolution modern diffusion models (Midjourney v5/v6, DALL-E 3, SDXL, Adobe Firefly). |

### Category 2: Local Inpainting & Tampering Datasets (ELA & Seams)
| Dataset | Source | Description |
|---------|--------|-------------|
| **DEFACTO** | `defactodataset.github.io` | 220,000+ images with ground truth binary masks for inpainting, micro-manipulation, and copy-move seam testing. |
| **CASIA v2.0 / Columbia** | Kaggle (`divg07/casia-20-image-tampering-dataset`) | Classic academic benchmark for splicing and uncompressed editing forensics. |

### Category 3: PRNU, Sensor Noise & Social Media Compression
| Dataset | Source | Description |
|---------|--------|-------------|
| **VISION Dataset** | University of Florence (VIPER Lab) | Native images from 35 smartphones paired with WhatsApp/Facebook re-compressed versions for double-JPEG and PRNU testing. |
| **Dresden Database** | TU Dresden Research Portal | 14,000+ RAW unprocessed images from 73 camera models; gold standard for camera sensor PRNU baselines. |

---

## 📥 2. Automated Dataset Downloader (Open-Access Hugging Face Streaming)

Run the direct open-access streaming script (no Kaggle API or registration required):

```powershell
# 1. Install Hugging Face Datasets library
pip install datasets pillow

# 2. Run open-access Tiny-GenImage dataset streamer
python ml\src\download_dataset.py
```

### Manual CLI Quick Commands:

```powershell
# 1. Fetch GenImage Mini from Hugging Face CLI:
pip install huggingface_hub
huggingface-cli download GenImage/GenImage_mini --repo-type dataset --local-dir data/held_out/genimage

# 2. Fetch CASIA v2.0 from Kaggle CLI:
pip install kaggle
kaggle datasets download -d divg07/casia-20-image-tampering-dataset -p data/held_out/casia --unzip
```

---

## 🩺 3. Dataset Health Check & Structure

Ensure your dataset directory is structured as follows:

```
data/
├── real/                      ← Real camera photographs (ImageNet / MS-COCO / Flickr30k)
│   ├── photo_001.jpg
│   └── ...
├── ai-generated/              ← Synthetic images (Midjourney v6, FLUX.1, SDXL, DALL-E 3)
│   ├── midjourney_001.jpg
│   ├── flux_002.png
│   └── ...
└── held_out/                  ← Held-out evaluation splits (GenImage, Synthbuster, CASIA)
    ├── genimage/
    ├── casia/
    └── synthbuster/
```

Run dataset validation:

```powershell
python ml\src\prepare_dataset.py --data_dir data
```

---

## 🏋️ 4. Model Training Pipeline

Train SignalScope's Vision Foundation Linear Probe:

```powershell
python ml\src\train.py --data_dir data --phase1_epochs 5 --phase2_epochs 10
```

- **Phase 1 (Epochs 1–5)**: Warm-up classification probe head.
- **Phase 2 (Epochs 6–15)**: Fine-tune backbone feature blocks at lower learning rate (`1e-4`).
- **Generalization Augmentations**: Applies JPEG re-compression (quality 50–95), Gaussian blur, color jitter, and random resize cropping.

---

## 🎯 5. Temperature Scaling Calibration

Fit temperature $T^*$ on validation logits to eliminate overconfident probabilities:

```powershell
python ml\src\calibrate.py --weights ml\weights\best.pth --val_manifest ml\weights\val_manifest.txt
```

---

## 📊 6. Benchmark Evaluation Suite

Run the held-out benchmark evaluation suite:

```powershell
python ml\src\evaluate.py --data_dir data\held_out
```

Computes AUROC, Average Precision (AP), Balanced Accuracy, Brier Score, ECE, and **Deletion & Insertion AUC curves**.

---

## 🚀 7. Running Production Services

Start the backend API and Next.js frontend:

```powershell
# Terminal 1 — Python Flask Inference Backend:
python services\inference-api\app.py

# Terminal 2 — Next.js Web Dashboard:
cd apps\web
npm run dev
```

Open `http://localhost:3000` in your browser to scan target images!
