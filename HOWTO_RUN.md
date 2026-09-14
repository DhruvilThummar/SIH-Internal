# SignalScope — Training, Dataset & Execution Guide

This guide covers: acquiring benchmark datasets, running model training, temperature calibration, benchmark evaluation, and launching production services for **SignalScope**.

---

## 📁 1. Benchmark Datasets Overview

### Category 1 — AI-Generated & Diffusion Detection

| Dataset | Source | Description |
|---------|--------|-------------|
| **GenImage Mini** | Hugging Face `GenImage/GenImage_mini` | 1M+ images: SD v1.4/v1.5, Midjourney, DALL-E, GLIDE, VQDM, BigGAN vs ImageNet real photos |
| **Synthbuster** | Zenodo Open-Access | High-resolution modern diffusion: Midjourney v5/v6, DALL-E 3, SDXL, Adobe Firefly |

### Category 2 — Local Inpainting & Tampering (ELA Seams)

| Dataset | Source | Description |
|---------|--------|-------------|
| **DEFACTO** | `defactodataset.github.io` | 220K+ images with ground truth binary masks for inpainting, copy-move, and splicing seam testing |
| **CASIA v2.0 / Columbia** | Kaggle `divg07/casia-20-image-tampering-dataset` | Academic benchmark for splicing and uncompressed editing forensics |

### Category 3 — PRNU, Sensor Noise & Social Media Compression

| Dataset | Source | Description |
|---------|--------|-------------|
| **VISION Dataset** | University of Florence (VIPER Lab) | Native images from 35 smartphones + WhatsApp/Facebook double-JPEG re-compressed versions |
| **Dresden Database** | TU Dresden Research Portal | 14K+ RAW unprocessed images from 73 camera models — gold standard for PRNU baselines |

---

## 📥 2. Dataset Download

### Option A — Automated Hugging Face Streamer (No Registration)

```powershell
# Install dependencies
pip install datasets pillow

# Stream open-access GenImage dataset
python ml\src\download_dataset.py
```

### Option B — Hugging Face CLI

```powershell
pip install huggingface_hub
huggingface-cli download GenImage/GenImage_mini --repo-type dataset --local-dir data/held_out/genimage
```

### Option C — Kaggle CLI (CASIA v2.0)

```powershell
pip install kaggle
kaggle datasets download -d divg07/casia-20-image-tampering-dataset -p data/held_out/casia --unzip
```

---

## 🗂 3. Required Dataset Directory Structure

Before training or evaluation, ensure the `data/` directory is structured as follows:

```
data/
├── real/                         ← Real camera photographs (ImageNet / VISION / Dresden)
│   ├── photo_001.jpg
│   └── ...
├── ai-generated/                 ← Synthetic images (Midjourney v6, FLUX.1, SDXL, DALL-E 3)
│   ├── midjourney_001.jpg
│   ├── flux_002.png
│   └── ...
└── held_out/                     ← Held-out evaluation splits (never used in training)
    ├── genimage/
    ├── casia/
    └── synthbuster/
```

**Validate your dataset structure:**

```powershell
python ml\src\prepare_dataset.py --data_dir data
```

---

## 🩺 4. Dataset Health Check

The validation script checks:
- Minimum image count per class (real / ai-generated)
- Valid image file integrity (can be decoded by Pillow)
- No overlap between train and held-out splits
- Directory structure compliance

---

## 🏋 5. Model Training

Train SignalScope's Vision Foundation Linear Probe in two phases:

```powershell
python ml\src\train.py --data_dir data --phase1_epochs 5 --phase2_epochs 10
```

### Training Phases

| Phase | Epochs | Strategy |
|-------|--------|---------|
| **Phase 1 — Probe Warmup** | 1–5 | Train classification probe head only; backbone frozen |
| **Phase 2 — Fine-tune** | 6–15 | Fine-tune upper backbone feature blocks at LR = 1e-4 |

### Generalization Augmentations

Applied during training to simulate post-processing attacks:

| Augmentation | Parameters | Purpose |
|-------------|------------|---------|
| JPEG Re-compression | Quality 50–95% random | Social media robustness |
| Gaussian Blur | σ = 0.3–1.5 | Anti-forensics smoothing defense |
| Color Jitter | Brightness/Contrast/Saturation ±20% | Lighting variation |
| Random Resize Crop | 0.85–1.0 scale | Cropping attack robustness |
| Horizontal Flip | 50% probability | Geometric augmentation |

---

## 🎯 6. Temperature Scaling Calibration

After training, fit the temperature parameter $T^*$ on validation logits to eliminate overconfident probabilities:

```powershell
python ml\src\calibrate.py \
  --weights ml\weights\best.pth \
  --val_manifest ml\weights\val_manifest.txt
```

This outputs `ml/weights/temperature.json` with the fitted $T^*$ value.

**Target:** Expected Calibration Error (ECE) < 0.05

---

## 📊 7. Benchmark Evaluation

Run the complete held-out benchmark evaluation suite:

```powershell
python ml\src\evaluate.py --data_dir data\held_out
```

### Computed Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| **ROC-AUC** | Multi-generator zero-shot classification area under curve | > 0.94 |
| **Average Precision (AP)** | Precision-recall area under curve | Maximize |
| **Balanced Accuracy** | Equal-weight accuracy across real/AI classes | > 0.90 |
| **Brier Score** | Probabilistic forecast quality | Minimize |
| **ECE** | Expected Calibration Error after temperature scaling | < 0.05 |
| **Deletion AUC** | P(AI) drop rate as top patches progressively masked | < 0.30 |
| **Insertion AUC** | P(AI) rise rate as top patches progressively restored | > 0.80 |

---

## 🚀 8. Running Production Services

### Step 1 — Install Python Dependencies

```powershell
pip install -r requirements.txt
```

### Step 2 — Start Flask Inference API

```powershell
# Terminal 1
python services\inference-api\app.py
```

> API starts at **`http://localhost:5000`**  
> Health check: `GET http://localhost:5000/health`

### Step 3 — Start Next.js Web Dashboard

```powershell
# Terminal 2
cd apps\web
npm install
npm run dev
```

> Dashboard opens at **`http://localhost:3000`**

### One-Shot Windows Setup

```powershell
powershell -ExecutionPolicy Bypass -File scripts\setup.ps1
```

---

## 🔧 9. Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SIGNALSCOPE_WEIGHTS` | `ml/weights/best.pth` | Path to trained model weights |
| `SIGNALSCOPE_TEMP` | `ml/weights/temperature.json` | Path to temperature calibration file |
| `PORT` | `5000` | Flask API port |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` | Next.js API base URL (set in `apps/web/.env.local`) |

---

## 🧪 10. Testing

### Unit Tests (Physical Extractors)

```powershell
python -m pytest tests/unit/ -v
```

### Integration Tests (End-to-End API)

```powershell
python -m pytest tests/integration/ -v
```

### Quick API Smoke Test

```powershell
curl -X POST http://localhost:5000/predict -F "image=@data/test_sample.jpg"
```

---

## 📝 11. Troubleshooting

| Issue | Solution |
|-------|---------|
| `Model weights not yet available` (503) | Ensure `ml/weights/best.pth` exists; run training first |
| `Cannot connect to inference API` | Start Flask server: `python services\inference-api\app.py` |
| CUDA out of memory | Set `CUDA_VISIBLE_DEVICES=""` to force CPU inference |
| `PIL.UnidentifiedImageError` | Verify the uploaded file is a valid JPEG/PNG/WEBP |
| Next.js `CORS error` | Ensure `NEXT_PUBLIC_API_URL` in `.env.local` matches Flask port |
