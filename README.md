# SignalScope — Defense-Grade AI Image Detection & Optical Forensics Engine

**SIH 2026 Internal Hackathon · L.J. Institute of Engineering and Technology**  
**Problem Statement: PS-2 · Two-Stage Hybrid Architecture & Faithful Forensic Explainability**  

[![System Status](https://img.shields.io/badge/System-Operational-2C6E63?style=for-the-badge&logo=shield)](http://localhost:3000)
[![API Status](https://img.shields.io/badge/API-Healthy-B5622E?style=for-the-badge&logo=flask)](http://localhost:5000/health)
[![Architecture](https://img.shields.io/badge/Architecture-Two--Stage%20Hybrid-20241F?style=for-the-badge)](./docs/architecture_twostage.md)

> **Scope:** SignalScope classifies digital images as *likely real* or *likely AI-generated* with calibrated confidence and non-hallucinated empirical evidence. Designed specifically for **Zero-Shot Generalization** across unseen generators (FLUX.1, Midjourney v6, SDXL, DALL-E 3, StyleGAN 3) and **Defense-Grade Forensic Explainability**.

---

## 🌟 Key Architecture & Breakthrough Features

SignalScope employs an enterprise **Two-Stage Hybrid Architecture**:

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

### 1. Zero-Shot Detection Engine (Stream A)
- **Vision Foundation Backbone**: Vision Transformer (DINOv2 / CLIP ViT-L/14) with frozen feature embeddings and L2-normalized linear probing.
- **Letterbox ROI Alignment**: Aspect-ratio preserved padding with `valid_roi: [ymin, xmin, ymax, xmax]` metadata so spatial heatmaps bound strictly to valid image content.

### 2. Multi-Vector Physical Forensic Extractors (Stream B)
- 🧪 **Sanitizer Engine** ([sanitizer.py](file:///d:/Code/SIH/ml/src/forensics/sanitizer.py)): Flattens RGBA/LA alpha channels over a neutral white canvas to eliminate false black background FFT artifacts.
- 📶 **2D CUDA FFT Engine** ([spectral.py](file:///d:/Code/SIH/ml/src/forensics/spectral.py)): Computes 2D Fast Fourier Transform magnitude spectrums with a **JPEG $8 \times 8$ DCT Notch Filter** to prevent compressed real photos from triggering false-positive AI spectral spikes. Includes a **Screen Moiré Recapture Gate**.
- 🔍 **PRNU & Bayer Correlation Engine** ([texture.py](file:///d:/Code/SIH/ml/src/forensics/texture.py)): Evaluates spatial PRNU noise variance and **Bayer Cross-Channel Correlation ($\rho_{R,G} > 0.60$)** to defend smartphone computational photography (iPhone Photonic Engine / Pixel HDR+ / Beauty Filters).
- 🔬 **Error Level Analysis (ELA) Engine** ([ela.py](file:///d:/Code/SIH/ml/src/forensics/ela.py)): Re-compresses images at 90% JPEG quality to compute pixel-level error deltas ($\Delta_{\text{ELA}}$) for micro-inpainting and Generative Fill seam detection.
- 🛡️ **EXIF Physics Cross-Validation** ([metadata.py](file:///d:/Code/SIH/ml/src/forensics/metadata.py)): Verifies claimed EXIF camera Make/Model against physical Bayer noise correlation.

### 3. LayerNorm Bipolar Spatial Attribution Heatmap
Computes LayerNorm-normalized patch attribution $A_p = \alpha_{\text{CLS} \to p} \cdot \left(w^T \operatorname{LN}(f_p)\right)$ with **Zero-Point Anchored Scaling**:

$$S_p = \frac{A_p}{\max(|A_p|) + 1e-9}$$

- $S_p > +0.15 \implies$ **Turbo Palette** (AI Glitch / Red-Yellow)
- $-0.15 \le S_p \le +0.15 \implies \alpha = 0$ (Transparent / Neutral background)
- $S_p < -0.15 \implies$ **Cyan-Blue Palette** (Authentic Optical Camera Evidence)

### 4. Interactive Viewfinder Dashboard (`apps/web`)
- **3-Way Multi-Spectrum Switcher**: 📷 **Optical View** ↔ 🎯 **AI Attribution Heatmap** ↔ 🔬 **ELA Compression Seams**.
- **Real ↔ AI Probability Spectrum Gauge**: Animated needle pointer powered by `framer-motion` spring physics.
- **Faithful Structured Evidence Cards**: Non-hallucinated empirical evidence strings for Primary Spatial, Secondary Texture, Spectral Frequency, and Metadata Verification.

---

## ⚡ Quick Start — Run in under 5 minutes

### 1 — Start the Inference API Backend

```powershell
# Terminal 1 — Start Flask Inference Server
python services\inference-api\app.py
```
*Server starts on `http://localhost:5000` with pre-loaded model weights and calibration.*

### 2 — Start the Next.js Web Dashboard

```powershell
# Terminal 2 — Start Frontend Dashboard
cd apps\web
npm run dev
```
*Dashboard opens on `http://localhost:3000`.*

---

## 📂 Repository Layout

```
SIH/
├── apps/
│   └── web/                   # Next.js 16 Frontend Dashboard
│       ├── app/
│       │   ├── page.tsx       # Single-page optical viewfinder application
│       │   ├── layout.tsx     # Root layout & IBM Plex fonts
│       │   └── globals.css    # Sage paper tactile design tokens
│       ├── components/
│       │   ├── Header.tsx     # Instrument status readout badge
│       │   ├── UploadZone.tsx # Corner-bracket dropzone
│       │   ├── LoadingState.tsx # Scanning reticle vertical line animation
│       │   ├── ResultPanel.tsx # 3-Way viewfinder & evidence cards
│       │   └── HeatmapCanvas.tsx # Offscreen scalar Turbo/Cyan canvas overlay
│       └── lib/
│           ├── types.ts       # Defense-grade JSON interfaces
│           └── verdictMeta.ts # Responsible-language color mappings
├── services/
│   └── inference-api/         # Flask Defense-Grade Inference Server
│       └── app.py             # POST /predict (Raw BytesIO stream ingestion)
├── ml/
│   ├── src/                   # Machine Learning & Forensics Engine
│   │   ├── forensics/
│   │   │   ├── sanitizer.py   # Alpha compositing & sRGB profile standardization
│   │   │   ├── spectral.py    # 2D CUDA FFT + JPEG 8x8 DCT Notch Filter + Moiré Gate
│   │   │   ├── texture.py     # PRNU noise residual & Bayer correlation (corr_rg > 0.60)
│   │   │   ├── ela.py        # Pixel-level Error Level Analysis micro-inpainting seams
│   │   │   └── metadata.py    # EXIF metadata parser & physics cross-validation
│   │   ├── model_utils.py     # LayerNorm Bipolar Attribution & letterbox ROI map
│   │   ├── predict.py         # Dual-Stream pipeline & Evidence Arbitration Matrix
│   │   ├── train.py           # Two-phase transfer learning trainer
│   │   ├── calibrate.py       # Temperature scaling calibration
│   │   └── evaluate.py        # Benchmark evaluator & Deletion/Insertion AUC curves
│   └── weights/               # Checkpoint best.pth + temperature.json
├── docs/                      # Technical Documentation
│   ├── prd.md                 # Product Requirements Document
│   ├── architecture_twostage.md # Two-Stage Hybrid Architecture & Math
│   ├── architecture.md        # System Component Breakdown & Data Flow
│   ├── forensics_research.md  # Research Paper & Robustness Matrix
│   ├── design.md              # UI/UX Specification & Color Palette
│   ├── memory.md              # Project Memory & Decisions Log
│   └── phase.md               # Implementation Roadmap Checklist
├── scripts/
│   └── setup.ps1              # One-shot judge environment setup
├── requirements.txt           # Python dependencies
└── README.md                  # System Documentation
```

---

## 📡 API Reference

### `POST /predict`
Accepts untouched raw binary image payload (multipart/form-data with field `image`).

**Response Schema:**
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
  "heatmap_grid": [...],
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

### `GET /health`
Returns server readiness and model state:
```json
{
  "status": "ok",
  "model_loaded": true,
  "weights_path": "ml/weights/best.pth"
}
```

---

## 📊 Benchmark & Faithfulness Evaluation

Run the held-out evaluation suite:

```bash
python ml/src/evaluate.py --data_dir data/held_out
```

Computes:
- **ROC-AUC & AP**: Overall & per unseen generator split (FLUX.1, Midjourney v6, SDXL, DALL-E 3).
- **Calibration Metrics**: Expected Calibration Error (ECE) & Brier Score.
- **Explainability Faithfulness**:
  - **Deletion AUC** ($< 0.30$): Steep decline in $P(\text{AI})$ as top activated patches are masked.
  - **Insertion AUC** ($> 0.80$): Rapid rise in $P(\text{AI})$ as top activated patches are unmasked.

---

## 🛡️ Ethics & Responsible Framing

- **No Profiling of Real Individuals**: Assesses synthetic imagery (scenes, artwork, objects, portraits, products) without identifying or profiling specific real people.
- **Likelihood Framing**: Every verdict uses calibrated probability language (*"likely AI-generated"* / *"likely real"* / *"uncertain — low confidence"*), never bare accusatory claims.
- **Disclaimers**: UI displays a permanent scientific disclaimer: *"This reading presents a statistical probability index based on frequency domain features. It is an estimation and not definitive legal proof."*
#   S I H - I n t e r n a l  
 