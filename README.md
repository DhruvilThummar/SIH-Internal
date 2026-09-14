# SignalScope — Defense-Grade AI Image Forensics Engine

<div align="center">

**SIH 2026 Internal Hackathon · L.J. Institute of Engineering and Technology**  
*Problem Statement PS-2 · Two-Stage Hybrid Architecture & Faithful Forensic Explainability*

[![System](https://img.shields.io/badge/System-Operational-2C6E63?style=for-the-badge&logo=shield)](http://localhost:3000)
[![API](https://img.shields.io/badge/API-Healthy-B5622E?style=for-the-badge&logo=flask)](http://localhost:5000/health)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js_15-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![PyTorch](https://img.shields.io/badge/ML-PyTorch_2.0-EE4C2C?style=for-the-badge&logo=pytorch)](https://pytorch.org/)
[![License](https://img.shields.io/badge/License-MIT-20241F?style=for-the-badge)](./LICENSE)

</div>

---

> **Mission:** SignalScope is an enterprise forensic intelligence engine that classifies digital images as **likely real** or **likely AI-generated** with calibrated confidence and **non-hallucinated physical evidence** — engineered for Zero-Shot Generalization across unseen generators (FLUX.1, Midjourney v6, SDXL, DALL-E 3, StyleGAN 3).

---

## 📋 Table of Contents

- [✨ Key Features](#-key-features)
- [🏗 Architecture Overview](#-architecture-overview)
- [🔬 Image Processing Pipeline](#-image-processing-pipeline)
- [🧠 Models & ML Backbones](#-models--ml-backbones)
- [📊 Forensic Parameters](#-forensic-parameters)
- [⚖️ Verdict Generation](#️-verdict-generation)
- [💻 Web Dashboard & UI Modes](#-web-dashboard--ui-modes)
- [⚡ Quick Start](#-quick-start)
- [📂 Repository Structure](#-repository-structure)
- [📡 API Reference](#-api-reference)
- [📊 Training & Evaluation](#-training--evaluation)
- [📚 Documentation](#-documentation)
- [🛡 Ethics & Responsible AI](#-ethics--responsible-ai)

---

## ✨ Key Features

| Feature | Status | Description |
|---------|--------|-------------|
| **Two-Stage Hybrid Detection** | ✅ Live | ViT Backbone (Stream A) + 5-Vector Physical Forensics (Stream B) |
| **Optical Viewfinder Scanner** | ✅ Live | Tactical HUD reticle dropzone with batch folder & drag-and-drop ingestion |
| **Remote URL Forensic Analysis** | ✅ Live | SSRF-protected URL fetch (`POST /predict-url`) with stream cap & 10s timeout |
| **Dual Target Compare Mode** | ✅ Live | Side-by-side Image A vs Image B comparative readout with differential metric deltas |
| **Tactical Radar Loading HUD** | ✅ Live | Target-aware processing screen with 5-stage pipeline step ticker & laser sweep |
| **3-Way Viewfinder Canvas** | ✅ Live | Interactive switch: Optical View ↔ AI Attribution Heatmap ↔ ELA Seams |
| **Forensic Radar Chart** | ✅ Live | SVG spider chart visualizing 4 signal vectors (FFT, PRNU, ELA, Bayer) |
| **Origin Generator Attribution** | ✅ Live | Fingerprints FLUX.1, Midjourney v6, SDXL, DALL-E 3, or Real Camera |
| **Defense PDF Report** | ✅ Live | Downloadable report with calibrated gauges, radar charts, & evidence cards |
| **Batch Analysis Mode** | ✅ Live | Multi-file queue scanner with CSV export and per-item PDF generation |
| **1-Click Copy Summary** | ✅ Live | Instant plain-text clipboard export for rapid distribution |
| **LayerNorm Bipolar Heatmap** | ✅ Live | Zero-point bipolar spatial attribution canvas overlay |

---

## 🏗 Architecture Overview

SignalScope employs a **Two-Stage Hybrid Architecture** that fuses semantic vision intelligence with low-level physical signal analysis:

```
                   [ Untouched Raw Binary Stream / Remote Image URL ]
                                          │
                                          ▼
                             [ Forensic Image Sanitizer ]
                             ├── Alpha Channel → White Canvas
                             └── sRGB Color Profile Standardizer
                                          │
                        ┌─────────────────┴─────────────────┐
                        ▼                                   ▼
          [ Stream A: ViT Backbone ]       [ Stream B: Physical Forensics ]
          • Letterbox Aspect Padding        • 5× Native RAW 512×512 Crops
          • L2 Feature Normalization        • 2D FFT + JPEG 8×8 DCT Notch
          • LayerNorm Bipolar Attribution   • Bayer Noise Correlation (ρ > 0.60)
          • valid_roi Coordinate Map        • Pixel-Level ELA Seam Analysis
                                            • EXIF Physics Cross-Validation
                        │                                   │
                        └─────────────────┬─────────────────┘
                                          ▼
                            [ Evidence Arbitration Matrix ]
                            ├── Social Media Re-compression Gate
                            ├── Smartphone Computational Photo Gate
                            ├── Localized Inpainting Seam Detector
                            └── Adaptive TTA Anti-Grain Defense
                                          │
                                          ▼
                              [ Defense-Grade JSON API ]
                              ├── Verdict + Calibrated Confidence
                              ├── 3-Way Viewfinder Canvas Overlay
                              ├── Forensic Radar Chart Vectors
                              └── Faithful Structured Evidence Cards
```

---

## 🔬 Image Processing Pipeline

### Step 1 — Image Ingestion & Preprocessing

1. **Raw Stream / URL Ingestion**:
   - Accepts raw multipart form data (`io.BytesIO`) or remote URLs via SSRF-safe fetcher (`utils/url_fetcher.py`).
2. **Forensic Sanitizer** (`ml/src/forensics/sanitizer.py`):
   - Flattens RGBA/LA transparent alpha channels onto a neutral white canvas.
   - Standardizes ICC color profiles to sRGB to prevent false-positive spectral artifacts.
3. **Dual-Stream Execution**:
   - **Stream A**: Letterbox ROI aspect padding → 224×224 resize → ViT feature probing.
   - **Stream B**: 5 native RAW 512×512 crops (4 corners + center) without spatial interpolation.

### Step 2 — Forensic Signal Extraction

| Extractor | Source File | Signal |
|-----------|-------------|--------|
| **2D CUDA FFT + DCT Notch** | `ml/src/forensics/spectral.py` | Periodic grid harmonics from neural upsampling |
| **PRNU Noise Estimator** | `ml/src/forensics/texture.py` | CMOS silicon sensor photo-response non-uniformity |
| **Bayer Correlation** | `ml/src/forensics/texture.py` | ρ(R,G) > 0.60 → physical optical sensor confirmed |
| **ELA Quantization** | `ml/src/forensics/ela.py` | Micro-inpainting seam contrast delta (Δ_ELA) |
| **EXIF Physics** | `ml/src/forensics/metadata.py` | Camera Make/Model cross-validated against sensor noise |

### Step 3 — Verdict & Response

The **Evidence Arbitration Matrix** fuses all signals into a composite verdict and serializes the full result as a structured JSON response.

---

## 🧠 Models & ML Backbones

### Stream A — Vision Foundation Backbone

| Component | Detail |
|-----------|--------|
| **Backbone** | DINOv2 / CLIP ViT-L/14 (frozen parameters) |
| **Embedding Space** | 768-dimensional patch token features |
| **Probe Head** | L2-Normalized Linear Probe (lightweight classification head) |
| **Spatial Attribution** | LayerNorm Bipolar Attribution Heatmap ($S_p \in [-1.0, +1.0]$) |

### Stream B — Physical Forensics Extractors

| Component | Detail |
|-----------|--------|
| **FFT Engine** | PyTorch CUDA 2D Fast Fourier Transform + JPEG 8×8 DCT Notch Filter |
| **PRNU Engine** | Sensor noise residual: $K = \text{Mean}(I_{\text{crop}} - \text{Denoise}(I_{\text{crop}}))$ |
| **Bayer Engine** | Cross-channel correlation: $\rho(R,G)$ |
| **ELA Engine** | Re-compress at 90% JPEG quality → measure $\Delta_{\text{ELA}}$ |
| **EXIF Engine** | Validates camera Make/Model against physical Bayer/demosaicing signature |

### Source Generator Fingerprinting

Rule-based forensic classifier analyzing spectral grid harmonics, over-smoothing patterns, and quantization deltas to identify the suspected AI generator:

| Generator | Identifying Signal |
|-----------|--------------------|
| 🎨 **FLUX.1 (Schnell/Dev)** | High-frequency deconvolution grid spikes, smooth textures |
| 🎨 **Midjourney v6** | Characteristic color palette distribution + soft edge blending |
| 🎨 **Stable Diffusion XL** | Periodic 8×8 upsampling harmonics + CLIP embedding signature |
| 🎨 **DALL-E 3** | Uniform ELA quantization + RLHF fine-tuning smoothness |
| 📷 **Optical CMOS Sensor** | $\rho(R,G) > 0.60$ + high PRNU variance confirmed |

---

## 📊 Forensic Parameters

| Parameter | Formula / Threshold | Purpose |
|-----------|---------------------|---------|
| **Periodic Grid Peak Ratio** | $\text{PeakRatio} > 1.8$ | Detects neural upsampling lattice harmonics |
| **Bayer Noise Correlation** | $\rho(R,G) > 0.60$ | Defends iPhone/Pixel beauty filters from false AI verdicts |
| **PRNU Noise Residual** | $K = \text{Mean}(I - \text{Denoise}(I))$ | Confirms silicon sensor hardware noise |
| **ELA Seam Delta** | $\Delta_{\text{ELA}} = \|I - \text{JPEG}_{90}(I)\|$ | Highlights localized inpainting seams |
| **LayerNorm Attribution** | $S_p = \frac{A_p}{\max(|A_p|) + 1e-9}$ | Turbo Red (AI) vs Cyan (Authentic) spatial map |
| **Temperature Calibration** | $T^* = 0.6589$ | Ensures Expected Calibration Error (ECE) $< 0.05$ |

---

## ⚖️ Verdict Generation

### Ensemble Meta-Calibrator Fusion

$$P_{\text{composite}}(\text{AI}) = 0.80 \cdot P_{\text{ViT}}(\text{AI}) + 0.10 \cdot S_{\text{PRNU}} + 0.05 \cdot S_{\text{FFT}} + 0.05 \cdot S_{\text{ELA}}$$

### Responsible Verdict Mapping

| Composite Score | Verdict | Classification |
|-----------------|---------|----------------|
| **> 0.60** | **likely AI-generated** | Synthetic Artifact |
| **< 0.40** | **likely real** | Authentic Optical Image |
| **0.40 – 0.60** | **uncertain — low confidence** | Inconclusive |

---

## 💻 Web Dashboard & UI Modes

The **Next.js** frontend (`apps/web`) delivers an enterprise military-instrument-inspired forensic dashboard:

| UI Component | Description |
|-------------|-------------|
| **Optical Viewfinder Scanner** | Scaled HUD reticle card (`UploadZone.tsx`) with file upload and sample verification chips |
| **Remote URL Analysis Mode** | SSRF-safe URL input (`UrlInput.tsx`) with instant verification sample cards |
| **Dual Target Compare Readout** | Side-by-side comparative inspection (`ComparePanel.tsx`) with differential delta table |
| **Tactical Radar Loading HUD** | Processing screen (`LoadingState.tsx`) featuring real-time image preview and 5-stage step ticker |
| **3-Way Viewfinder Canvas** | Toggle: 📷 Optical Raw ↔ 🎯 AI Attribution Heatmap ↔ 🔬 ELA Seams |
| **Classification Verdict Banner** | Color-coded verdict card with calibrated confidence meter and probability split strip |
| **Forensic Radar Chart** | SVG spider chart: FFT · PRNU · ELA · Bayer |
| **Origin Fingerprint Badge** | Identified generator callout (e.g. FLUX.1 / Midjourney v6 / Real Camera) |
| **Faithful Evidence Cards** | 4 non-hallucinated empirical text cards (Spatial · Texture · Spectral · Metadata) |
| **Defense PDF Report** | Branded jsPDF report generator with gauges, radar charts, and ethics disclaimers |
| **Batch Scanner Panel** | Multi-file queue with real-time progress, CSV + PDF export |

---

## ⚡ Quick Start

### Prerequisites

- **Python 3.10+** with `pip`
- **Node.js 18+** with `npm`
- GPU optional (CPU inference fully supported)

### 1 — Install Python Dependencies

```powershell
pip install -r requirements.txt
```

### 2 — Start the Flask Inference API

```powershell
# Terminal 1
python services\inference-api\app.py
```

> API starts at **`http://localhost:5000`**

### 3 — Start the Next.js Dashboard

```powershell
# Terminal 2
cd apps\web
npm install
npm run dev
```

> Dashboard opens at **`http://localhost:3000`**

---

## 📂 Repository Structure

```
SIH/
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI workflow (lint, test)
├── apps/
│   └── web/                          # Next.js 15 Defense Dashboard
│       ├── app/                      # App router pages & global layout
│       ├── components/
│       │   ├── common/              # Header (w/ Compare toggle), Footer
│       │   ├── upload/              # UploadZone (w/ URL tab), UrlInput
│       │   ├── analysis/            # ResultPanel, HeatmapCanvas, ForensicRadarChart, LoadingState
│       │   ├── batch/               # BatchPanel
│       │   ├── compare/             # ComparePanel (Side-by-side dual target readout)
│       │   └── index.ts             # Barrel re-export file
│       ├── hooks/                   # Custom React state hooks (useInference, useCompare)
│       └── lib/
│           ├── api/                 # Typed fetch client with error middleware
│           ├── types.ts             # Shared TypeScript API interfaces
│           └── generateReport.ts    # jsPDF defense report generator
│
├── services/
│   └── inference-api/               # Flask Defense Inference API v2.0
│       ├── app.py                   # Flask application factory entrypoint
│       ├── config.py                # Typed environment configuration
│       ├── middleware/              # Error handling & security middleware
│       ├── routes/                  # Health check & predict endpoints (/predict, /predict-url)
│       ├── services/                # Decoupled inference service controller
│       ├── utils/                   # SSRF protection, URL fetcher, image decoder
│       └── README.md                # Backend API documentation
│
├── ml/                              # Machine Learning Core Engine
│   ├── weights/                     # Pretrained weights (best.pth) & temperature JSON
│   └── src/
│       ├── data/                    # Dataset streaming & preparation scripts
│       ├── training/                # Trainer, calibrator, evaluator scripts
│       ├── models/                  # ViT / DINOv2 backbones & linear probe
│       ├── forensics/               # Stage B physical extractors (FFT, PRNU, ELA, Bayer, EXIF)
│       ├── predict.py               # Primary two-stage inference controller
│       └── README.md                # ML technical documentation
│
├── tests/                           # Testing Suite
│   ├── unit/                        # Unit tests (test_api, test_validation, test_forensics)
│   └── integration/                 # End-to-end integration test
│
├── scripts/                         # DevOps & Diagnostics Scripts
│   ├── run_tests.py                 # Automated test suite runner
│   ├── verify_environment.py        # Environment sanity checker
│   └── setup.ps1                    # One-shot judge environment setup
│
├── docs/                            # Defense Technical Documentation
│   ├── prd.md                       # Product Requirements Document v2.0
│   ├── architecture.md              # System Architecture & Diagrams
│   ├── design.md                    # Tactile Sage Design System Guide
│   ├── phase.md                     # Phase 1-8 Roadmap & Milestone Specs
│   ├── memory.md                    # Architectural Decisions Log
│   ├── forensics_research.md        # Physical Forensics Research Paper
│   └── schemas/                     # JSON Schema response specifications
│
├── README.md                        # ← You are here
├── HOWTO_RUN.md                     # Dataset acquisition & training guide
├── CONTRIBUTING.md                  # Contribution guide & code standards
└── requirements.txt                 # Python dependencies
```

---

## 📡 API Reference

### 1. `POST /predict` — Direct Image Payload

Accepts a raw image via `multipart/form-data` under key `image`. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp` (max 16 MB).

**Request:**
```bash
curl -X POST http://localhost:5000/predict \
  -F "image=@/path/to/target.jpg"
```

### 2. `POST /predict-url` — Remote URL Analysis

Accepts a JSON payload containing direct image URL `url`. Includes SSRF protection, 10s fetch timeout, and 16 MB stream cap.

**Request:**
```bash
curl -X POST http://localhost:5000/predict-url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb"}'
```

**Response Schema (`/predict` & `/predict-url`):**
```json
{
  "label": "likely AI-generated",
  "confidence": 0.968,
  "prob_ai": 0.968,
  "suspected_generator": "FLUX.1 (Schnell/Dev)",
  "generator_confidence": 0.88,
  "tampering_analysis": {
    "is_fully_synthetic": true,
    "has_localized_inpainting": false,
    "adversarial_noise_injected": false
  },
  "evidence": {
    "primary_spatial": "LayerNorm peak activation localized in subject patch.",
    "secondary_texture": "Bayer corr_rg=0.12 — below CMOS threshold (>0.60).",
    "spectral_frequency": "Periodic deconvolution grid harmonics at 45° radial axis.",
    "metadata_consistency": "Synthetic color profile; no physical sensor CFA signature."
  },
  "heatmap_grid": [[0.12, 0.85, 0.94]],
  "grid_dimensions": [16, 16],
  "valid_roi": [0.0, 0.125, 1.0, 0.875],
  "forensics": {
    "fft_spectrum":     { "score": 88, "detail": "Periodic upsampling grid harmonics in 2D FFT" },
    "sensor_prnu":      { "score": 92, "detail": "Synthetic smooth noise residual across 5 patches" },
    "color_saturation": { "score": 12, "detail": "Bayer noise correlation: 0.12" },
    "ela_compression":  { "score": 85, "detail": "Uniform quantization error distribution" }
  }
}
```

### 3. `GET /health` — Service Diagnostic

```json
{
  "status": "ok",
  "model_loaded": true,
  "weights_path": "ml/weights/best.pth"
}
```

---

## 📊 Training & Evaluation

### Benchmark Datasets

| Category | Dataset | Source |
|----------|---------|--------|
| AI Detection | GenImage Mini | Hugging Face `GenImage/GenImage_mini` |
| AI Detection | Synthbuster | Zenodo (Midjourney v5/v6, DALL-E 3, SDXL) |
| Inpainting/Tampering | DEFACTO | defactodataset.github.io |
| Inpainting/Tampering | CASIA v2.0 | Kaggle `divg07/casia-20-image-tampering-dataset` |
| Sensor/PRNU | VISION Dataset | University of Florence — 35 smartphones |
| Sensor/PRNU | Dresden Database | TU Dresden — 73 camera models |

### Evaluation Commands

```powershell
# Train the model
python ml\src\training\train.py --data_dir data --phase1_epochs 5 --phase2_epochs 10

# Calibrate temperature
python ml\src\training\calibrate.py --weights ml\weights\best.pth

# Run benchmark evaluation
python ml\src\training\evaluate.py --data_dir data\held_out
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Architecture Specification](./docs/architecture.md) | Two-stage hybrid architecture, math formulations, component breakdown |
| [Product Requirements (PRD)](./docs/prd.md) | Functional/non-functional requirements, success metrics |
| [Implementation Roadmap](./docs/phase.md) | Phase-by-phase milestone checklist |
| [Forensics Research](./docs/forensics_research.md) | Optical forensics theory & robustness matrix |
| [UI/UX Design Spec](./docs/design.md) | Color palette, typography, dashboard architecture |
| [Project Memory & Decisions](./docs/memory.md) | Authoritative context file for contributors |
| [Training & Dataset Guide](./HOWTO_RUN.md) | Datasets, training, calibration, evaluation |

---

## 🛡 Ethics & Responsible AI

SignalScope is designed with forensic ethics at its core:

- **Non-Profiling** — Analyzes synthetic visual anomalies only. No facial recognition, biometric profiling, or personal data tracking.
- **Probabilistic Framing** — All outputs use responsible probabilistic language (*"likely AI-generated"*, *"likely real"*, *"uncertain — low confidence"*) — never absolute accusations.
- **Empirical Transparency** — Every verdict is backed by transparent physical signal evidence cards. No black-box decisions.
- **Zero-Retention** — All images processed strictly in-memory (`io.BytesIO`) and immediately discarded. Nothing stored server-side.
- **Scientific Disclaimer** — Interface prominently states: *"This reading presents a statistical probability index based on multi-vector spatial and frequency domain features. It is an estimation tool and not definitive legal proof."*

---

<div align="center">

**SignalScope Forensic Engine** · SIH 2026 · L.J. Institute of Engineering and Technology  
*Built with PyTorch · Next.js 15 · Flask · Forensic Science*

</div>