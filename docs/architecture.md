# SignalScope — System Architecture

---

## 1. System Overview

```
User (Browser Interface)
       │  Upload Target Image (JPG / PNG / WEBP)
       ▼
Next.js Frontend (Upload Zone + 3-Way Viewfinder Dashboard)
       │  POST /predict  (Untouched Raw Binary Stream)
       ▼
Flask Defense-Grade Inference API
       │  Sanitize → Dual-Stream Execution → Arbitration
       ▼
┌────────────────────────────────────────────────────────┐
│ Stream A: Vision Foundation Backbone (Letterbox Input)  │
│ └── LayerNorm Bipolar Attribution Heatmap              │
├────────────────────────────────────────────────────────┤
│ Stream B: Multi-Vector Forensics Engine (RAW Crops)    │
│ ├── 2D Fast Fourier Spectrum + JPEG 8x8 DCT Notch      │
│ ├── Bayer Cross-Channel Correlation (corr_rg > 0.60)   │
│ ├── Pixel-Level Error Level Analysis (ELA Seams)       │
│ └── EXIF Physics Cross-Validation Engine               │
└────────────────────────────────────────────────────────┘
       │  Calibrated Ensemble Probability + Structured Evidence Cards
       ▼
Responsible-Language Formatter ("likely AI-generated", never "fake")
       │
       ▼
JSON API Response → Frontend renders 3-Way Viewfinder Overlay
```

---

## 2. System Components

### 2.1 Frontend (`apps/web`)

- **Framework**: Next.js (TypeScript) + Vanilla CSS + Framer Motion.
- **Upload Zone**: `UploadZone.tsx` with corner-bracket viewfinder aesthetic and `react-dropzone`.
- **Viewfinder Dashboard**: `ResultPanel.tsx` featuring a **3-Way Multi-Spectrum Switcher**:
  - 📷 **Optical View**: Original input image.
  - 🎯 **AI Attribution Heatmap**: LayerNorm Bipolar Turbo/Cyan canvas overlay bounded strictly to `valid_roi`.
  - 🔬 **ELA Compression Seam Map**: Glowing pixel-level inpainting seam map.
- **Case File Readout**:
  - Horizontal Real ↔ AI Probability Spectrum Gauge with animated needle indicator.
  - Faithful Structured Evidence Cards (Primary Spatial, Secondary Texture, Spectral Frequency, Metadata Verification).
  - 4 Invariant Forensic Signal Cards (PRNU Noise, 2D Fourier, ELA Seams, Bayer Correlation).

### 2.2 Inference API (`services/inference-api`)

- **Framework**: Flask + Flask-CORS.
- **Endpoint**: `POST /predict` accepts multipart raw image stream, passes `io.BytesIO` directly to prevent re-compression artifacts.
- **Singleton Model Loader**: Pre-loads model weights and temperature scaling once at startup.

### 2.3 Machine Learning & Forensics Engine (`ml/src`)

| Module | File | Purpose |
|--------|------|---------|
| **Sanitizer** | `forensics/sanitizer.py` | Alpha channel compositing (neutral white canvas) & sRGB ICC standardization. |
| **Spectral Engine** | `forensics/spectral.py` | PyTorch CUDA 2D FFT, JPEG $8 \times 8$ DCT Notch Filter, Screen Moiré Recapture Gate. |
| **Texture Engine** | `forensics/texture.py` | Multi-patch PRNU spatial noise residual & Bayer Cross-Channel Correlation (`corr_rg > 0.60`). |
| **ELA Engine** | `forensics/ela.py` | Pixel-level Error Level Analysis ($\Delta_{\text{ELA}}$) for micro-inpainting seam detection. |
| **Metadata Engine** | `forensics/metadata.py` | EXIF metadata parsing & EXIF Physics Cross-Validation. |
| **Model Utils** | `model_utils.py` | Letterbox padding, LayerNorm Bipolar Attribution, and `valid_roi` coordinate mapping. |
| **Predictor** | `predict.py` | Dual-Stream pipeline, Evidence Arbitration Matrix, and Adaptive TTA Gating. |
| **Evaluator** | `evaluate.py` | Held-out evaluation suite (AUROC, AP, ECE, Brier Score, Deletion & Insertion AUC curves). |

---

## 3. Data Flow

```
1. Image Upload (Browser)
       │  Binary Stream
       ▼
2. Forensic Sanitization
       │  Alpha Composited RGB + sRGB Profile
       ▼
3. Dual-Stream Parallel Feature Extraction
       ├── Stream A: Vision Foundation Backbone (LayerNorm Bipolar Heatmap)
       └── Stream B: 5 Native RAW Crops (FFT Notch + Bayer Corr + ELA + EXIF)
       ▼
4. Evidence Arbitration & Ensemble Fusion
       │  Resolves social media re-compression conflicts & smartphone beauty filters
       ▼
5. Responsible-Language Verdict Formatting
       │  "likely AI-generated" / "likely real" / "uncertain — low confidence"
       ▼
6. JSON Response Delivery to Frontend Dashboard
```

---

## 4. Repository Structure

```
SIH/
├── apps/
│   └── web/                   # Next.js Frontend Dashboard
│       ├── app/
│       ├── components/
│       │   ├── Header.tsx
│       │   ├── UploadZone.tsx
│       │   ├── LoadingState.tsx
│       │   ├── ResultPanel.tsx
│       │   └── HeatmapCanvas.tsx
│       └── lib/
├── services/
│   └── inference-api/         # Flask Inference API
│       └── app.py
├── ml/
│   ├── src/                   # Machine Learning & Forensics Engine
│   │   ├── forensics/
│   │   │   ├── sanitizer.py
│   │   │   ├── spectral.py
│   │   │   ├── texture.py
│   │   │   ├── ela.py
│   │   │   └── metadata.py
│   │   ├── model_utils.py
│   │   ├── predict.py
│   │   ├── train.py
│   │   ├── calibrate.py
│   │   └── evaluate.py
│   └── weights/               # Checkpoint weights & temperature.json
└── docs/                      # Technical System Documentation
```
