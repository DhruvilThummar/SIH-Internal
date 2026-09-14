# CHANGELOG — SignalScope

All notable changes to SignalScope are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [Unreleased] — Phase 7

### Planned
- `ComparePanel.tsx` — Side-by-side dual image forensic comparison (Original vs. Tampered)
- `POST /predict-url` — Server-side image URL fetching and analysis
- `VideoPanel.tsx` — Video frame extraction + per-frame AI confidence timeline
- `ShareCard.tsx` — Social share card generation (html2canvas verdict image)

---

## [2.0.0] — Phase 6 Complete — September 2026

### Added
- **PDF Forensic Report Generator** (`lib/generateReport.ts`) — Branded jsPDF report with probability gauge arc, forensic radar chart, evidence cards, and ethics disclaimer
- **SVG Forensic Radar Chart** (`components/ForensicRadarChart.tsx`) — Responsive spider web chart visualizing 4 physical signal vectors (FFT · PRNU · ELA · Bayer)
- **1-Click Copy Evidence Summary** — Clipboard export button in `ResultPanel.tsx` with visual toast notification
- **Source Generator Origin Fingerprinting** (`ml/src/predict.py`) — Rule-based forensic classifier identifying FLUX.1, Midjourney v6, SDXL, DALL-E 3, or Optical CMOS Sensor
- **Batch / Bulk Image Analysis Mode** (`components/BatchPanel.tsx`) — Multi-file drag & drop queue scanner with real-time progress, CSV export, and per-item PDF downloads
- **Suspected Origin Badge** in `ResultPanel.tsx` — Displays identified generator with confidence
- **Dynamic Module Hot-Reload** (`services/inference-api/app.py`) — `importlib.reload` for `predict.py` without Flask restart

### Improved
- All documentation rewritten: `README.md`, `HOWTO_RUN.md`, `docs/prd.md`, `docs/architecture.md`, `docs/phase.md`, `docs/memory.md`, `docs/forensics_research.md`, `docs/design.md`
- `UploadZone.tsx` — Multi-file selection support for batch mode
- Repository folder structure: added `tests/unit/`, `tests/integration/`, `docs/assets/`

---

## [1.5.0] — Phase 5 Complete

### Added
- `evaluate.py` — Held-out benchmark evaluation suite: ROC-AUC, AP, Balanced Accuracy, Brier Score, ECE, Deletion & Insertion AUC curves
- `calibrate.py` — Temperature scaling calibration: fits $T^*$ on validation logits
- `download_dataset.py` — Hugging Face open-access GenImage streamer

---

## [1.0.0] — Phases 1–4 Complete

### Added
- **Two-Stage Hybrid Architecture** — Stream A (ViT Backbone) + Stream B (5-Vector Physical Forensics)
- **Forensic Sanitizer** (`forensics/sanitizer.py`) — Alpha compositing + sRGB standardization
- **2D CUDA FFT + JPEG DCT Notch Filter** (`forensics/spectral.py`)
- **Bayer Cross-Channel Noise Correlation** + **PRNU** (`forensics/texture.py`)
- **Pixel-Level ELA** (`forensics/ela.py`)
- **EXIF Physics Validator** (`forensics/metadata.py`)
- **LayerNorm Bipolar Attribution Heatmap** (`model_utils.py`)
- **3-Way Multi-Spectrum Viewfinder** (`components/ResultPanel.tsx`)
- **Animated Probability Spectrum Gauge** (Framer Motion spring physics)
- **Flask Defense-Grade Inference API** (`services/inference-api/app.py`)
- **Next.js Tactical Sage Paper Design System** (`apps/web/app/globals.css`)
- **Faithful Structured Evidence Cards** (non-hallucinated deterministic text)
