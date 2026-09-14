# Project Memory — SignalScope

> [!IMPORTANT]
> **Read this file first before making any changes to this repo.** This is the authoritative context file for any AI assistant or team member working on SignalScope. All architectural decisions and hard constraints are documented here.

---

## 1. Project Identity

| Field | Value |
|-------|-------|
| **Name** | SignalScope |
| **Event** | SIH 2026 Internal Hackathon, L.J. Institute of Engineering and Technology |
| **Problem Statement** | PS-2 — Real vs. AI-Generated Image Assessment & Forensic Explainability |
| **Architecture** | Two-Stage Hybrid Pipeline + Multi-Vector Physical Forensics Engine |
| **Status** | Phase 6 Complete — Phase 7 (Extended Modes) Planned |

---

## 2. Hard Constraints (Never Violate)

### Ethics & Safety Rules

- **Synthetic imagery assessment only** — scenes, objects, artwork, products, and portraits.
- **No face-swap or biometric profiling** of real identifiable individuals.
- **No political claim adjudication**.
- **Probabilistic language only** — All outputs: `"likely AI-generated"` / `"likely real"` / `"uncertain — low confidence"`. Never accusatory certainty.
- **Zero-Retention Policy** — All images processed strictly in-memory (`io.BytesIO`) and immediately discarded. Nothing stored server-side.

### Data Integrity

- **Never train or tune on held-out benchmark evaluation splits.**
- The `predict(image_input)` function signature accepts both file paths and raw `io.BytesIO` streams — do not break this.

### Interface Stability

- `POST /predict` must always return the full JSON schema (see `docs/architecture.md` §6).
- `GET /health` must always return `status`, `model_loaded`, and `weights_path`.
- `PredictResult` TypeScript interface (`lib/types.ts`) is consumed by multiple components — changes require updating all consumers.

---

## 3. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js (TypeScript), Vanilla CSS, Framer Motion, HTML5 Canvas |
| **Backend API** | Flask, Flask-CORS, raw stream ingestion via `io.BytesIO` |
| **ML Engine** | PyTorch, DINOv2/CLIP ViT-L/14 (frozen), L2-Normalized Linear Probe |
| **Forensic Extractors** | 2D CUDA FFT, JPEG 8×8 DCT Notch, Bayer ρ(R,G), ELA Δ, EXIF Physics |
| **Report Generation** | jsPDF (native canvas drawing — no html2canvas) |
| **Animation** | Framer Motion (spring physics for gauge needle) |
| **Evaluation Suite** | AUROC, AP, Balanced Accuracy, Brier Score, ECE, Deletion & Insertion AUC |

---

## 4. Key Architectural Decisions

1. **Two-Stage Hybrid Architecture** — ViT Foundation backbone for zero-shot generalization (Stream A) + 5 invariant forensic extractors for physical evidence (Stream B). Both streams run in parallel.

2. **LayerNorm Bipolar Spatial Attribution** — Zero-Point Anchored scaling ($S_p = A_p / \max(|A_p|)$) renders Turbo Red for AI glitches and Cyan-Blue for authentic optical camera anchors. Avoids gradient-only saliency maps.

3. **JPEG 8×8 DCT Notch Filter** — Masks fundamental block boundary harmonics in 2D FFT to prevent false positives on compressed real images. Critical for social media robustness.

4. **Bayer Noise Correlation Defense** — $\rho_{R,G} > 0.60$ confirms physical optical sensor demosaicing. Defends iPhone Photonic Engine / Pixel HDR+ from false AI verdicts.

5. **Raw `io.BytesIO` Stream Ingestion** — Flask passes untouched bytes to `predict()` to preserve original EXIF metadata and JPEG quantization tables for spectral analysis.

6. **Dynamic `importlib.reload` in Flask** — `app.py` reloads `predict.py` module on each request to pick up hot-code changes without restarting the server.

7. **jsPDF Native Drawing for PDF Reports** — PDF report generator (`generateReport.ts`) draws all elements (gauge arc, radar chart, confidence bars) natively via jsPDF canvas methods — no html2canvas dependency, no DOM capture lag.

8. **SVG Forensic Radar Chart** — `ForensicRadarChart.tsx` renders a responsive SVG spider web chart for 4 physical vectors (FFT · PRNU · ELA · Bayer). No chart library dependency.

9. **Source Generator Origin Fingerprinting** — Rule-based forensic classifier in `predict.py` identifies FLUX.1, Midjourney v6, SDXL, DALL-E 3, or Optical CMOS Sensor based on spectral grid harmonics, over-smoothing, and quantization deltas.

10. **Batch / Bulk Analysis Mode** — `BatchPanel.tsx` implements a client-side queue scanner with real-time status per image, global CSV export, and per-item PDF download triggers.

---

## 5. User Decisions & Preferences

| Decision | Outcome |
|----------|---------|
| Analysis History (persisted results) | ❌ **Rejected** — not needed |
| Dark / Light Mode toggle | ❌ **Rejected** — keep Tactile Sage Paper design |
| PDF Forensic Report | ✅ **Approved & Implemented** |
| Forensic Radar Chart | ✅ **Approved & Implemented** |
| Copy to Clipboard | ✅ **Approved & Implemented** |
| Source Generator Fingerprinting | ✅ **Approved & Implemented** |
| Batch Analysis Mode | ✅ **Approved & Implemented** |
| Image Comparison Mode (Side-by-Side) | 🔜 **Planned — Phase 7** |
| URL Image Analysis | 🔜 **Planned — Phase 7** |
| Video Frame Analysis | 🔜 **Planned — Phase 7** |
| Social Share Card | 🔜 **Planned — Phase 7** |

---

## 6. Key File Map

| File | Purpose |
|------|---------|
| [`apps/web/app/page.tsx`](../apps/web/app/page.tsx) | Main state machine: idle → loading → result → batch → error |
| [`apps/web/components/ResultPanel.tsx`](../apps/web/components/ResultPanel.tsx) | Full result dashboard with viewfinder, gauge, evidence cards, actions |
| [`apps/web/components/BatchPanel.tsx`](../apps/web/components/BatchPanel.tsx) | Bulk image queue scanner |
| [`apps/web/components/HeatmapCanvas.tsx`](../apps/web/components/HeatmapCanvas.tsx) | Turbo/Cyan bipolar canvas overlay renderer |
| [`apps/web/components/ForensicRadarChart.tsx`](../apps/web/components/ForensicRadarChart.tsx) | SVG radar chart component |
| [`apps/web/lib/generateReport.ts`](../apps/web/lib/generateReport.ts) | jsPDF forensic report generator |
| [`apps/web/lib/types.ts`](../apps/web/lib/types.ts) | TypeScript API interfaces — `PredictResult`, `AppState` |
| [`services/inference-api/app.py`](../services/inference-api/app.py) | Flask API with dynamic module reload |
| [`ml/src/predict.py`](../ml/src/predict.py) | Core dual-stream inference + Arbitration Matrix + Generator Fingerprinting |
| [`ml/src/model_utils.py`](../ml/src/model_utils.py) | LayerNorm attribution, letterbox padding, valid_roi mapping |
| [`ml/src/forensics/`](../ml/src/forensics/) | All physical signal extractor modules |

---

## 7. System Documents Index

| File | Purpose |
|------|---------|
| [`docs/prd.md`](./prd.md) | Product requirements, functional/non-functional specs, success metrics |
| [`docs/architecture.md`](./architecture.md) | Two-stage hybrid architecture, math formulations, component breakdown, API schema |
| [`docs/forensics_research.md`](./forensics_research.md) | Optical forensics theory, robustness matrix, mathematical foundations |
| [`docs/design.md`](./design.md) | Viewfinder aesthetic, 3-Way Spectrum Switcher, color system |
| [`docs/phase.md`](./phase.md) | Multi-stage implementation roadmap and milestones |
| [`HOWTO_RUN.md`](../HOWTO_RUN.md) | Dataset acquisition, training, calibration, and production deployment guide |
