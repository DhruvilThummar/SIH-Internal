# SignalScope — Implementation Roadmap & Milestones

**Last Updated:** September 2026

---

## Legend

| Symbol | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[ ]` | Pending |
| `[~]` | In Progress |

---

## Phase 1 — Foundation & Baseline Pipeline ✅

- [x] Project monorepo structure: `apps/web`, `services/inference-api`, `ml/src`
- [x] Baseline linear probe model architecture (`model_utils.py`)
- [x] Responsible-language verdict formatter (`_verdict` in `predict.py`)
- [x] Initial Next.js viewfinder UI with Tactile Sage Paper design system
- [x] Flask inference API with `POST /predict` and `GET /health` routes
- [x] TypeScript API type definitions (`types.ts`, `verdictMeta.ts`)

---

## Phase 2 — Multi-Vector Forensic Signal Engines ✅

- [x] `forensics/sanitizer.py` — Alpha channel compositing onto white canvas & sRGB ICC profile standardization
- [x] `forensics/spectral.py` — PyTorch CUDA 2D FFT magnitude spectrum + JPEG 8×8 DCT Notch Filter + Moiré Screen Recapture Gate
- [x] `forensics/texture.py` — Multi-patch PRNU sensor noise residual & Bayer Cross-Channel Correlation (ρ(R,G) > 0.60)
- [x] `forensics/ela.py` — Pixel-level Error Level Analysis (Δ_ELA) for micro-inpainting seam detection
- [x] `forensics/metadata.py` — EXIF metadata parsing & EXIF Physics Cross-Validation Engine

---

## Phase 3 — Two-Stage Hybrid Engine Integration ✅

- [x] `model_utils.py` — LayerNorm-Normalized Bipolar Spatial Attribution (Sp ∈ [−1.0, +1.0]), Letterbox ROI aspect padding, `valid_roi` coordinate mapping
- [x] `predict.py` — Dual-Stream Pipeline (Letterbox Stream A + RAW Crops Stream B), Adaptive TTA Anti-Grain Defense Gating, Evidence Arbitration Matrix
- [x] `services/inference-api/app.py` — Raw `io.BytesIO` stream ingestion preserving EXIF & JPEG quantization tables
- [x] `app.py` — Dynamic `importlib.reload` for hot-reload without Flask restart

---

## Phase 4 — Frontend Viewfinder Dashboard ✅

- [x] `HeatmapCanvas.tsx` — Scalar-First Offscreen Interpolation + Zero-Point Bipolar Turbo/Cyan LUT canvas rendering bounded to `valid_roi`
- [x] `ResultPanel.tsx` — 3-Way Multi-Spectrum Viewfinder Toggle (📷 Optical ↔ 🎯 AI Attribution ↔ 🔬 ELA Seams) + Animated Probability Needle Gauge + Faithful Structured Evidence Cards
- [x] `UploadZone.tsx` — Corner-bracket tactical dropzone with react-dropzone + multi-file batch support
- [x] `LoadingState.tsx` — 3-phase scanning reticle animation with progress indicators
- [x] `ErrorState.tsx` — Error state with diagnostic message and retry CTA

---

## Phase 5 — Benchmark & Evaluation Suite ✅

- [x] `evaluate.py` — Held-out benchmark suite: ROC-AUC, AP, Balanced Accuracy, Brier Score, ECE, Deletion & Insertion AUC curves
- [x] `calibrate.py` — Temperature scaling calibration fitting T* on validation logits
- [x] `train.py` — Two-phase transfer learning trainer with JPEG re-compression augmentations
- [x] `download_dataset.py` — Hugging Face open-access GenImage streamer
- [x] `docs/architecture.md` — Master two-stage hybrid architecture & math formulation documentation

---

## Phase 6 — Advanced Enterprise Features & Forensic Reporting ✅

- [x] `lib/generateReport.ts` — Branded jsPDF forensic PDF report: probability gauge, radar chart, evidence cards, ethics disclaimer
- [x] `components/ForensicRadarChart.tsx` — Responsive SVG spider/radar chart (2D Fourier · PRNU Sensor · ELA Seams · Bayer Correlation)
- [x] `components/ResultPanel.tsx` — 1-Click Copy Evidence Summary with visual toast notification
- [x] `ml/src/predict.py` — Source Generator Origin Fingerprinting: FLUX.1, Midjourney v6, SDXL, DALL-E 3, or Optical CMOS Sensor
- [x] `components/BatchPanel.tsx` — Bulk Image Queue Scanner: multi-file drag & drop, real-time progress, CSV export, per-item PDF downloads
- [x] All documentation updated: `README.md`, `HOWTO_RUN.md`, `docs/` files

---

## Phase 7 — Extended Analysis Modes 🔜 Planned

- [ ] `components/ComparePanel.tsx` — Side-by-side dual image forensic comparison (Original vs. Tampered)
- [ ] `services/inference-api/app.py` — `POST /predict-url` endpoint: fetch image from URL server-side
- [ ] `components/UploadZone.tsx` — URL paste input tab + Compare Mode toggle
- [ ] `components/VideoPanel.tsx` — Video frame extraction + per-frame AI confidence timeline
- [ ] `components/ShareCard.tsx` — Social share card: html2canvas verdict image for Twitter/WhatsApp

---

## Phase 8 — Production Hardening 🔜 Future

- [ ] `tests/unit/` — pytest unit tests for all forensic extractors and predict pipeline
- [ ] `tests/integration/` — End-to-end API integration test suite
- [ ] Docker containerization for inference API + CI/CD pipeline
- [ ] Rate limiting, request logging, and API key authentication
- [ ] Progressive Web App (PWA) manifest for offline-capable deployment
