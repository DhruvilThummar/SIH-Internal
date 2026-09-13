# SignalScope — Defense-Grade AI Image Detection & Optical Forensics Engine

<div align="center">

**SIH 2026 Internal Hackathon · L.J. Institute of Engineering and Technology**  
*Problem Statement PS-2: Two-Stage Hybrid Architecture & Faithful Forensic Explainability*

[![System Status](https://img.shields.io/badge/System-Operational-2C6E63?style=for-the-badge&logo=shield)](http://localhost:3000)
[![API Status](https://img.shields.io/badge/API-Healthy-B5622E?style=for-the-badge&logo=flask)](http://localhost:5000/health)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![PyTorch](https://img.shields.io/badge/ML%20Engine-PyTorch-EE4C2C?style=for-the-badge&logo=pytorch)](https://pytorch.org/)
[![Architecture](https://img.shields.io/badge/Architecture-Two--Stage%20Hybrid-20241F?style=for-the-badge)](file:///d:/Code/SIH/docs/architecture_twostage.md)

</div>

---

> **Mission Scope:** SignalScope is an enterprise forensic intelligence engine that classifies digital images as **likely real** or **likely AI-generated** with calibrated statistical confidence and empirical non-hallucinated physical evidence. Engineered specifically for **Zero-Shot Generalization** across unseen generative models (*FLUX.1, Midjourney v6, SDXL, DALL-E 3, StyleGAN 3*) and **Defense-Grade Explainability**.

---

## 📋 Table of Contents

- [🌟 Key Architecture & Features](#-key-architecture--features)
- [🏗 System Architecture Diagram](#-system-architecture-diagram)
- [🔬 Core Forensic Extractors](#-core-forensic-extractors)
- [🧮 LayerNorm Bipolar Heatmap Attribution](#-layernorm-bipolar-heatmap-attribution)
- [💻 Next.js Viewfinder Dashboard](#-nextjs-viewfinder-dashboard)
- [⚡ Quick Start Guide](#-quick-start-guide)
- [📂 Repository Structure](#-repository-structure)
- [📡 API Reference](#-api-reference)
- [📊 Training & Benchmark Evaluation](#-training--benchmark-evaluation)
- [📚 Technical Documentation Index](#-technical-documentation-index)
- [🛡 Ethics & Responsible AI Framing](#-ethics--responsible-ai-framing)

---

## 🌟 Key Architecture & Features

SignalScope combines semantic vision foundation features with low-level physical signal analysis through a novel **Two-Stage Hybrid Architecture**:

1. **Zero-Shot Semantic Feature Generalization (Stream A)**
   - Leverages frozen embeddings from **DINOv2 / CLIP ViT-L/14** backbones with L2-normalized feature linear probing.
   - Robust against generative domain shift across unseen models (*FLUX.1, Midjourney v6, SDXL, DALL-E 3, VQ-GAN, StyleGAN 3*).
   - Letterbox ROI Preserving Engine maps spatial heatmaps strictly to valid image pixel coordinates (`valid_roi`).

2. **Multi-Vector Physical Forensic Engine (Stream B)**
   - Analyzes low-level sensor noise, high-frequency spatial harmonics, and compression artifacts that diffusion models fail to synthesize consistently.
   - Includes **Bayer Cross-Channel Correlation ($\rho_{R,G} > 0.60$)** to prevent computational photography on modern smartphones (*iPhone Photonic Engine, Google Pixel HDR+*) from being misclassified as synthetic.
   - Employs a **JPEG $8 \times 8$ DCT Notch Filter** in the 2D CUDA FFT spectrum to suppress real compression grid false-positives.

3. **Faithful Non-Hallucinated Explainability**
   - Eliminates LLM vision hallucinations by serving deterministic, structured evidence strings directly from physical signal extractors.
   - Computes **LayerNorm Bipolar Spatial Attribution Heatmaps** ($S_p \in [-1.0, +1.0]$) separating synthetic anomalies (Turbo palette) from authentic optical sensor evidence (Cyan-Blue palette).

---

## 🏗 System Architecture Diagram

```
                       [ Untouched Raw Binary Stream / Image Payload ]
                                             │
                                             ▼
                                 [ Forensic Image Sanitizer ]
                                 ├── Alpha Channel Compositing (White Canvas)
                                 └── sRGB Color Space Profile Standardiser
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
          [ Stream A: ViT Backbone ]                 [ Stream B: Forensics Engine ]
          • Letterbox Aspect Padding                 • Native RAW 512x512 Crops (5 Locations)
          • L2 Feature Normalization                 • 2D Fast Fourier (FFT) + JPEG 8x8 Notch Filter
          • LayerNorm Bipolar Attribution            • Bayer Noise Correlation (corr_rg > 0.60)
          • valid_roi Coordinate Map                 • Pixel-Level Error Level Analysis (ELA)
                                                     • EXIF Physics Cross-Validation
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             ▼
                             [ Evidence Arbitration Matrix ]
                             ├── Social Media Re-compression Handling
                             ├── Smartphone Computational Photography Gate
                             ├── Localized Inpainting Seam Detector
                             └── Adaptive TTA Anti-Grain Defense Gating
                                             │
                                             ▼
                               [ Defense-Grade JSON API ]
                               ├── Verdict & Calibrated Confidence (%)
                               ├── 3-Way Viewfinder Canvas Overlay
                               └── Faithful Structured Evidence Cards
```

---

## 🔬 Core Forensic Extractors

| Module | Source File | Description & Defense Mechanism |
| :--- | :--- | :--- |
| 🧪 **Sanitizer Engine** | [sanitizer.py](file:///d:/Code/SIH/ml/src/forensics/sanitizer.py) | Flattens transparent RGBA/LA alpha channels onto a neutral white canvas to eliminate false black-background spectral artifacts. |
| 📶 **2D CUDA FFT Engine** | [spectral.py](file:///d:/Code/SIH/ml/src/forensics/spectral.py) | Computes 2D Fast Fourier Transform magnitude spectrums with a **JPEG $8 \times 8$ DCT Notch Filter** and **Screen Moiré Recapture Gate**. |
| 🔍 **PRNU & Bayer Noise Engine** | [texture.py](file:///d:/Code/SIH/ml/src/forensics/texture.py) | Evaluates spatial Photo-Response Non-Uniformity (PRNU) noise variance & **Bayer Cross-Channel Correlation ($\rho_{R,G} > 0.60$)** to defend smartphone HDR. |
| 🔬 **ELA Micro-Seam Engine** | [ela.py](file:///d:/Code/SIH/ml/src/forensics/ela.py) | Re-compresses images at 90% JPEG quality to compute pixel-level error deltas ($\Delta_{\text{ELA}}$) for local inpainting & Generative Fill detection. |
| 🛡️ **EXIF Physics Validator** | [metadata.py](file:///d:/Code/SIH/ml/src/forensics/metadata.py) | Cross-validates claimed camera Make/Model EXIF headers against physical Bayer noise and demosaicing signatures. |

---

## 🧮 LayerNorm Bipolar Heatmap Attribution

Spatial patch attributions $A_p$ are derived by backpropagating ViT patch activations through frozen LayerNorm representations:

$$A_p = \alpha_{\text{CLS} \to p} \cdot \left(w^T \operatorname{LN}(f_p)\right)$$

Normalizing with zero-point scaling yields normalized scalar scores $S_p \in [-1.0, +1.0]$:

$$S_p = \frac{A_p}{\max(|A_p|) + 1e-9}$$

### Color Palette Mapping
- **$S_p > +0.15 \implies$ Turbo Palette (AI Anomaly / Red-Yellow)**: Highlights patch regions exhibiting synthetic generative artifacts.
- **$-0.15 \le S_p \le +0.15 \implies \alpha = 0$ (Transparent / Neutral)**: Unmodified background pixels.
- **$S_p < -0.15 \implies$ Cyan-Blue Palette (Authentic Optical Camera)**: Highlights natural sensor noise and optical lens characteristics.

---

## 💻 Next.js Viewfinder Dashboard

The modern web application (`apps/web`) is built with **Next.js 16**, **Tailwind CSS**, and **Framer Motion**:

- 📷 **3-Way Viewfinder Switcher**: Toggle seamlessly between **Optical View**, 🎯 **AI Attribution Heatmap**, and 🔬 **ELA Compression Seams**.
- 🧭 **Needle Probability Gauge**: Animated gauge pointer powered by spring physics rendering calibrated AI probability ($0.0\% - 100.0\%$).
- 🗂️ **Faithful Evidence Cards**: Displays non-hallucinated empirical evidence strings for Spatial, Texture, Spectral, and Metadata verification vectors.
- 📐 **Letterbox ROI Overlay**: Offscreen canvas renderer overlays attribution maps precisely within the non-padded `valid_roi` region.

---

## ⚡ Quick Start Guide

### Prerequisites
- **Python 3.10+** (with PyTorch, Flask, OpenCV, Pillow, SciPy)
- **Node.js 18+** & **npm**

---

### Step 1: Install Python Dependencies
```powershell
pip install -r requirements.txt
```

---

### Step 2: Start the Inference API Backend
```powershell
# Run Flask Server (Terminal 1)
python services\inference-api\app.py
```
> Server starts on **`http://localhost:5000`** with pre-loaded model weights and temperature calibration.

---

### Step 3: Start the Next.js Web Dashboard
```powershell
# Run Next.js Dev Server (Terminal 2)
cd apps\web
npm install
npm run dev
```
> Dashboard launches on **`http://localhost:3000`**. Open in any modern browser!

---

### 💡 One-Shot Windows Setup Script
For quick evaluation environment setup:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\setup.ps1
```

---

## 📂 Repository Structure

```
SIH/
├── apps/
│   └── web/                      # Next.js 16 Frontend Dashboard
│       ├── app/
│       │   ├── page.tsx          # Main optical viewfinder UI
│       │   ├── layout.tsx        # App layout & IBM Plex fonts
│       │   └── globals.css       # Tactile sage design system & utility styles
│       ├── components/
│       │   ├── Header.tsx        # Instrument status readout badge
│       │   ├── UploadZone.tsx    # Corner-bracket tactical dropzone
│       │   ├── LoadingState.tsx  # Scanning reticle animation
│       │   ├── ResultPanel.tsx    # 3-Way viewfinder & evidence cards
│       │   └── HeatmapCanvas.tsx # Offscreen Turbo/Cyan overlay generator
│       └── lib/
│           ├── types.ts          # Defense-grade API interfaces
│           └── verdictMeta.ts    # Responsible verdict color mappings
├── services/
│   └── inference-api/            # Flask Defense-Grade Inference Server
│       └── app.py                # POST /predict raw stream endpoint
├── ml/
│   ├── src/                      # ML Core & Physical Forensics Engine
│   │   ├── forensics/
│   │   │   ├── sanitizer.py      # Alpha flattening & sRGB standardization
│   │   │   ├── spectral.py       # 2D CUDA FFT + JPEG 8x8 DCT Notch Filter
│   │   │   ├── texture.py        # PRNU noise residual & Bayer correlation
│   │   │   ├── ela.py           # Pixel-level Error Level Analysis
│   │   │   └── metadata.py       # EXIF header physics cross-validator
│   │   ├── model_utils.py        # LayerNorm Bipolar attribution & ROI map
│   │   ├── predict.py            # Dual-Stream pipeline & Arbitration Matrix
│   │   ├── train.py              # Two-phase transfer learning trainer
│   │   ├── calibrate.py          # Temperature scaling calibration
│   │   ├── download_dataset.py   # Hugging Face open-access streamer
│   │   └── evaluate.py           # Benchmark evaluator & Deletion/Insertion AUC
│   └── weights/                  # Model weights (best.pth) & temperature.json
├── docs/                         # Technical Documentation & Specs
│   ├── prd.md                    # Product Requirements Document
│   ├── architecture_twostage.md    # Architecture Specification & Math
│   ├── architecture.md           # System Component Breakdown & Flow
│   ├── forensics_research.md     # Forensics Research Paper & Robustness
│   ├── design.md                 # UI/UX & Color Palette Specification
│   ├── memory.md                 # Project Memory & Decisions Log
│   └── phase.md                  # Implementation Roadmap Checklist
├── scripts/
│   └── setup.ps1                 # One-shot judge environment setup
├── HOWTO_RUN.md                  # Comprehensive Dataset & Training Guide
├── requirements.txt              # Python ML & Flask dependencies
└── README.md                     # System Documentation
```

---

## 📡 API Reference

### `POST /predict`
Accepts an untouched raw image payload via `multipart/form-data` under key `image`.

#### Example Request (cURL):
```bash
curl -X POST http://localhost:5000/predict \
  -F "image=@/path/to/test_image.jpg"
```

#### JSON Response Schema:
```json
{
  "label": "likely AI-generated",
  "confidence": 0.968,
  "prob_ai": 0.968,
  "tampering_analysis": {
    "is_fully_synthetic": true,
    "has_localized_inpainting": false,
    "adversarial_noise_injected": false
  },
  "evidence": {
    "primary_spatial": "LayerNorm-normalized peak activation localized in subject patch; severe boundary blending discontinuity.",
    "secondary_texture": "Bayer demosaicing cross-correlation (corr_rg=0.12) falls far below physical CMOS optical thresholds (>0.60).",
    "spectral_frequency": "Periodic deconvolution grid harmonics identified at 45-degree radial axis.",
    "metadata_consistency": "Stripped/Synthetic color profile detected; no physical sensor CFA signature present."
  },
  "heatmap_grid": [[0.12, 0.85, ...], ...],
  "grid_dimensions": [16, 16],
  "valid_roi": [0.0, 0.125, 1.0, 0.875],
  "forensics": {
    "fft_spectrum": { "score": 85, "detail": "Periodic upsampling grid harmonics detected in 2D FFT" },
    "sensor_prnu": { "score": 92, "detail": "Synthetic multi-patch smooth noise residual" },
    "color_saturation": { "score": 12, "detail": "Bayer noise correlation: 0.12" },
    "ela_compression": { "score": 45, "detail": "Uniform quantization error distribution" }
  }
}
```

---

### `GET /health`
Returns server status and loaded model diagnostic info.

#### JSON Response:
```json
{
  "status": "ok",
  "model_loaded": true,
  "weights_path": "ml/weights/best.pth"
}
```

---

## 📊 Training & Benchmark Evaluation

### Dataset Acquisition
SignalScope is trained and evaluated across standard academic benchmarks:
- **Diffusion Models**: GenImage (`GenImage_mini`), Synthbuster (*Midjourney v6, SDXL, DALL-E 3*)
- **Inpainting & Manipulation**: DEFACTO, CASIA v2.0
- **Physical Camera Baselines**: VISION Dataset (35 smartphones), Dresden Camera Database (73 models)

For complete dataset download and execution steps, refer to [HOWTO_RUN.md](file:///d:/Code/SIH/HOWTO_RUN.md).

---

### Benchmark Evaluation Suite
To run held-out benchmark evaluation:

```powershell
python ml\src\evaluate.py --data_dir data\held_out
```

#### Evaluated Metrics:
- **ROC-AUC & Average Precision (AP)**: Multi-generator evaluation across unseen models.
- **Expected Calibration Error (ECE)**: Assesses probability calibration after temperature scaling.
- **Explainability Faithfulness**:
  - **Deletion AUC (< 0.30)**: Measures rapid drop in $P(\text{AI})$ as top spatial patches are masked.
  - **Insertion AUC (> 0.80)**: Measures rapid rise in $P(\text{AI})$ as top spatial patches are unmasked.

---

## 📚 Technical Documentation Index

Detailed architectural specs, research whitepapers, and design guidelines:

- 📄 [Product Requirements Document (PRD)](file:///d:/Code/SIH/docs/prd.md)
- 📐 [Two-Stage Hybrid Architecture Specification](file:///d:/Code/SIH/docs/architecture_twostage.md)
- 🔍 [System Component Breakdown & Flow](file:///d:/Code/SIH/docs/architecture.md)
- 🔬 [Optical Forensics Research & Robustness Matrix](file:///d:/Code/SIH/docs/forensics_research.md)
- 🎨 [UI/UX Specification & Color Tokens](file:///d:/Code/SIH/docs/design.md)
- 📖 [Project Memory & Decisions Log](file:///d:/Code/SIH/docs/memory.md)
- 🏁 [Implementation Roadmap Checklist](file:///d:/Code/SIH/docs/phase.md)
- 🛠️ [Full Execution & Training Guide](file:///d:/Code/SIH/HOWTO_RUN.md)

---

## 🛡 Ethics & Responsible AI Framing

SignalScope adheres strictly to ethical AI guidelines for forensic analysis:

- 👤 **Non-Profiling & Privacy Preservation**: Analyzes synthetic visual anomalies without performing facial recognition, biometric profiling, or personal data tracking.
- ⚖️ **Probabilistic Verdict Framing**: Replaces absolute binary claims with responsible probabilistic framing (*"likely AI-generated"*, *"likely real"*, *"uncertain — low confidence"*).
- 📜 **Empirical Transparency**: Every detection verdict is supported by transparent, physical signal evidence cards—preventing unexplainable "black-box" decision making.
- 🔬 **Scientific Disclaimer**: Prominently displays an interface notice: *"This reading presents a statistical probability index based on multi-vector spatial and frequency domain features. It is an estimation tool and not definitive legal proof."*

---

<div align="center">

**SignalScope Forensic Engine** · Built for SIH 2026 Internal Hackathon  
*Developed with PyTorch, Next.js 16, and Forensic Science.*

</div>