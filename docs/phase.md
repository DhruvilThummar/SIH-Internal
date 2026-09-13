# SignalScope — Implementation Phases & Roadmap

---

## Phase 1: Foundation & Baseline Pipeline
- [x] Project structure initialization (`apps/web`, `services/inference-api`, `ml/src`).
- [x] Baseline linear probe model architecture (`model_utils.py`).
- [x] Responsible-language verdict formatter (`_verdict` in `predict.py`).
- [x] Initial Next.js Viewfinder UI layout with sage-paper design system.

---

## Phase 2: Multi-Vector Forensic Signal Engines
- [x] `forensics/sanitizer.py`: Alpha compositing & sRGB profile standardization.
- [x] `forensics/spectral.py`: PyTorch CUDA 2D FFT, JPEG $8 \times 8$ DCT Notch Filter, Moiré Screen Recapture Gate.
- [x] `forensics/texture.py`: Multi-patch PRNU noise residual & Bayer Cross-Channel Noise Correlation ($\rho_{R,G} > 0.60$).
- [x] `forensics/ela.py`: Pixel-level Error Level Analysis ($\Delta_{\text{ELA}}$) micro-inpainting seam detection.
- [x] `forensics/metadata.py`: EXIF metadata parsing & EXIF Physics Cross-Validation Engine.

---

## Phase 3: Two-Stage Hybrid Engine Integration
- [x] `model_utils.py`: LayerNorm-Normalized Bipolar Spatial Attribution ($S_p = A_p / \max(|A_p|)$), Letterbox aspect padding, `valid_roi` coordinates (`[ymin, xmin, ymax, xmax]`).
- [x] `predict.py`: Dual-Stream Pipeline (Letterbox Stream A + RAW Crops Stream B), Adaptive TTA Anti-Grain Defense Gating, Evidence Arbitration Matrix.
- [x] `services/inference-api/app.py`: Untouched raw stream processing via `io.BytesIO`.

---

## Phase 4: Frontend Viewfinder Dashboard Upgrade
- [x] `types.ts`: Defense-grade prediction result TypeScript interfaces.
- [x] `HeatmapCanvas.tsx`: Scalar-First Offscreen Interpolation + Zero-Point Bipolar Turbo/Cyan LUT canvas rendering bounded to `valid_roi`.
- [x] `ResultPanel.tsx`: **3-Way Multi-Spectrum Viewfinder Toggle** (📷 Optical View ↔ 🎯 AI Attribution ↔ 🔬 ELA Seams) + Faithful Structured Evidence Cards.

---

## Phase 5: Benchmark & Evaluation Suite
- [x] `evaluate.py`: Held-out evaluation suite computing ROC-AUC, AP, Balanced Accuracy, Brier Score, ECE, and Deletion & Insertion AUC curves.
- [x] `docs/architecture_twostage.md`: Comprehensive system architecture and math documentation.
