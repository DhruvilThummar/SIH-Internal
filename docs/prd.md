# SignalScope — Product Requirements Document (PRD)

**Project Name:** SignalScope  
**Hackathon:** SIH 2026 — L.J. Institute of Engineering and Technology  
**Problem Statement:** PS-2 — Real vs. AI-Generated Image Assessment & Forensic Explainability  

---

## 1. Executive Overview

SignalScope is an enterprise-grade digital image authentication system engineered to solve the core challenge in AI image detection: **Zero-Shot Generalization across unseen AI generators** (FLUX.1, Midjourney v6, SDXL, DALL-E 3, StyleGAN 3) combined with **Faithful Forensic Explainability**.

Rather than relying on generic CNN classifiers that overfit to specific training set noise fingerprints, SignalScope employs a **Two-Stage Hybrid Architecture**:
1. **Stage 1 (Robust Detection Engine)**: Vision Foundation Backbone (DINOv2 / CLIP ViT-L/14) with frozen feature embeddings and L2-normalized linear probing.
2. **Stage 2 (Explainability & Forensic Engine)**: LayerNorm Bipolar Spatial Attribution heatmaps, 2D FFT Spectral Notch Filtering, Bayer Cross-Channel Correlation, and Pixel-Level Error Level Analysis (ELA).

---

## 2. Core Problem Statement

Modern generative models (Midjourney v6, FLUX.1, SDXL, DALL-E 3) produce photorealistic imagery that bypasses simple edge sharpness or superficial metadata checks. Furthermore, when images are re-compressed on social media (WhatsApp, Instagram), standard spectral detectors fail. SignalScope bridges this generalization and explainability gap through multi-vector physical signal extraction and an Evidence Arbitration Matrix.

---

## 3. Scope & Ethical Directives

> [!IMPORTANT]
> **Hard Ethics & Safety Rules**:
> - **Synthetic Imagery Assessment Only**: Focuses on scenes, artwork, objects, portraits, and product imagery.
> - **No Profiling of Real Individuals**: Does not profile, track, or make claims about real identifiable persons.
> - **Likelihood Framing**: All outputs are formatted as calibrated statistical probabilities ("likely AI-generated" / "likely real" / "uncertain — low confidence"), never accusatory certainty claims.

---

## 4. Functional Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| **FR1** | Untouched Raw Stream Ingestion | Accepts JPG, PNG, WEBP images via drag-and-drop or multipart HTTP payload without server re-encoding. |
| **FR2** | Dual-Stream Execution Pipeline | Runs Stream A (Letterbox ViT feature extraction) and Stream B (5 native RAW crop forensic signal extractors) in parallel. |
| **FR3** | LayerNorm Bipolar Spatial Attribution | Generates $S_p$ heatmap grid ($S_p > +0.15 \implies$ Red AI Glitch, $S_p < -0.15 \implies$ Cyan Authentic Detail). |
| **FR4** | 2D FFT JPEG Notch Filtering | Masks out fundamental $8 \times 8$ and $16 \times 16$ JPEG block boundary harmonics before computing spectral peak ratios. |
| **FR5** | Bayer Cross-Channel Correlation | Computes $\rho_{R, G} > 0.60$ to defend smartphone computational photography (iPhone Photonic Engine / Pixel HDR+) against false positive AI verdicts. |
| **FR6** | Pixel-Level ELA Inpainting Seam Map | Re-compresses image at 90% JPEG quality to highlight micro-inpainting seams and Generative Fill edits. |
| **FR7** | 3-Way Multi-Spectrum Viewfinder | Frontend UI toggle between Optical View, AI Attribution Heatmap, and ELA Compression Seams. |
| **FR8** | Faithful Structured Evidence Cards | Formulates non-hallucinated empirical text strings for Primary Spatial, Secondary Texture, Spectral Frequency, and Metadata Verification. |

---

## 5. Non-Functional Requirements

- **Zero-Shot Generalization Drop**: Out-of-Domain ROC-AUC drop ($\text{AUC}_{\text{in-domain}} - \text{AUC}_{\text{unseen}}$) $\le 5\%$.
- **Calibrated Probabilities**: Temperature scaling calibration ($T^*$) ensuring Expected Calibration Error (ECE) $< 0.05$.
- **Latency**: Inference response time $< 150\text{ ms}$ on GPU / $< 500\text{ ms}$ on CPU.
- **Reproducibility**: Clean installation via standard dependencies, fully documented CLI and API interfaces.

---

## 6. Success Metrics & Evaluation Matrix

| Axis | Weight | Optimization Target |
|------|--------|---------------------|
| **AI/ML Implementation** | 25% | ROC-AUC $> 0.94$ on held-out unseen generators (FLUX.1, Midjourney v6, SDXL). |
| **Technical Implementation** | 20% | Dual-Stream architecture, 2D FFT CUDA notch filter, clean modular codebase. |
| **Faithful Explainability** | 20% | LayerNorm Bipolar Attribution, low Deletion AUC ($< 0.30$), high Insertion AUC ($> 0.80$). |
| **User Experience & Design** | 20% | Tactile Sage Paper Viewfinder design system, 3-Way Multi-Spectrum Switcher, responsible framing. |
| **Problem Understanding** | 15% | Robustness against social media re-compression, smartphone computational photography defense. |
