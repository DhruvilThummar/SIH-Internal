# Project Memory — SignalScope

> [!IMPORTANT]
> **Read this file first before making any changes to this repo.** This is the authoritative context file for any AI assistant or team member working on SignalScope.

---

## Project Identity

| Field | Value |
|-------|-------|
| **Name** | SignalScope |
| **Event** | SIH 2026 Internal Hackathon, L.J. Institute of Engineering and Technology |
| **Problem Statement** | PS-2 — Real vs. AI-Generated Image Assessment & Forensic Explainability |
| **Architecture** | Enterprise Two-Stage Hybrid Pipeline + Multi-Vector Forensics Engine |

---

## Hard Constraints & Ethical Directives (never violate)

### Ethics & Safety Rules (non-negotiable)

- Synthetic imagery assessment only — scenes, objects, artwork, products, and portraits.
- No face-swap profiling or claims about specific real identifiable individuals.
- No political claim adjudication.
- All outputs framed as calibrated statistical probabilities ("likely AI-generated" / "likely real" / "uncertain — low confidence"), never accusatory certainty claims.

### Data Integrity & Interface Stability

- Never train or tune on held-out benchmark evaluation splits.
- The `predict(image_input)` signature accepts both image file paths and untouched raw `io.BytesIO` streams.

---

## System Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js (TypeScript), Vanilla CSS, Framer Motion, HTML5 Canvas. |
| **Backend API** | Flask, Flask-CORS, raw stream ingestion via `io.BytesIO`. |
| **ML & Detection Engine** | PyTorch, Vision Foundation Backbones (DINOv2 / CLIP ViT-L/14), L2-Normalized Linear Probe. |
| **Forensics Signal Extractors** | PyTorch CUDA 2D FFT, JPEG $8 \times 8$ DCT Notch Filter, Bayer Noise Correlation ($\rho_{R,G}$), ELA Quantization Delta ($\Delta_{\text{ELA}}$), EXIF Physics Validation. |
| **Evaluation Suite** | AUROC, AP, Balanced Accuracy, Brier Score, ECE, Deletion & Insertion AUC curves (`evaluate.py`). |

---

## Key System Documents

| File | Purpose |
|------|---------|
| [`prd.md`](./prd.md) | Product requirements, functional/non-functional specs, success metrics. |
| [`architecture_twostage.md`](./architecture_twostage.md) | Two-stage hybrid pipeline architecture, math formulations, API payload schema. |
| [`architecture.md`](./architecture.md) | System overview, repo structure, data flow, component breakdown. |
| [`forensics_research.md`](./forensics_research.md) | Mathematical foundations of optical forensics and robustness matrix. |
| [`design.md`](./design.md) | Viewfinder aesthetic, 3-Way Multi-Spectrum Switcher, color system. |
| [`phase.md`](./phase.md) | Multi-stage implementation roadmap and milestones. |

---

## Key Architectural Decisions

1. **Two-Stage Hybrid Architecture**: Vision Foundation backbone linear probe for zero-shot generalization + 5 invariant forensic signal extractors.
2. **LayerNorm Bipolar Spatial Attribution**: Zero-Point Anchored scaling ($S_p = A_p / \max(|A_p|)$) rendering Turbo Red for AI glitches and Cyan-Blue for authentic optical camera anchors.
3. **JPEG $8 \times 8$ DCT Notch Filter**: Masks fundamental block boundary harmonics in 2D FFT to prevent false positives on compressed real images.
4. **Bayer Noise Correlation Defense**: Computes $\rho_{R,G} > 0.60$ to defend smartphone computational photography (iPhone Photonic Engine / Pixel HDR+) against false positive AI verdicts.
5. **3-Way Multi-Spectrum Viewfinder UI**: Toggle between 📷 Optical View, 🎯 AI Attribution Heatmap, and 🔬 ELA Seams on Next.js.
