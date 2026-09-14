# SignalScope — Product Requirements Document (PRD)

**Version:** 2.0  
**Project:** SignalScope  
**Hackathon:** SIH 2026 Internal · L.J. Institute of Engineering and Technology  
**Problem Statement:** PS-2 — Real vs. AI-Generated Image Assessment & Forensic Explainability  
**Status:** 🟢 Active Development  
**Last Updated:** September 2026

---

## 1. Executive Overview

SignalScope is an enterprise-grade digital image authentication system that solves two hard problems simultaneously:

1. **Zero-Shot Generalization** — Reliable detection across unseen AI generators (FLUX.1, Midjourney v6, SDXL, DALL-E 3, StyleGAN 3) without overfitting to training-set noise fingerprints.
2. **Faithful Forensic Explainability** — Non-hallucinated, deterministic evidence grounded in physical signal extraction rather than LLM text generation.

It achieves this through a **Two-Stage Hybrid Architecture**:
- **Stage 1 (Detection Engine)** — Frozen DINOv2/CLIP ViT-L/14 foundation model with L2-normalized linear probe.
- **Stage 2 (Explainability & Forensics Engine)** — LayerNorm Bipolar Heatmaps, 2D FFT Notch Filtering, Bayer Noise Correlation, Error Level Analysis, and EXIF Physics Validation.

---

## 2. Core Problem Statement

Modern generative models (FLUX.1, Midjourney v6, SDXL, DALL-E 3) produce photorealistic imagery that evades simple edge-sharpness, EXIF, or metadata checks. The challenge compounds when:
- Images are **re-compressed** on social media (WhatsApp, Instagram, Twitter)
- Images are **cropped** or **watermarks erased**
- Images are **partially inpainted** (Generative Fill, Adobe Firefly) on real photographs
- Images are **processed** through smartphone beauty/HDR filters

SignalScope bridges the generalization and explainability gap through multi-vector physical signal extraction, an Evidence Arbitration Matrix, and responsible probabilistic framing.

---

## 3. Ethical Directives

> [!IMPORTANT]
> **These rules are non-negotiable and must never be violated in any code change.**
>
> - **Synthetic Imagery Only** — Assesses scenes, objects, artwork, products, and portraits. Never used to profile real identifiable individuals.
> - **No Biometric Profiling** — Does not perform facial recognition, identity tracking, or personal attribute inference.
> - **Probabilistic Language Only** — All outputs formatted as calibrated statistical probabilities: `"likely AI-generated"` / `"likely real"` / `"uncertain — low confidence"`. Never accusatory certainty claims.
> - **Zero-Retention Policy** — All uploaded images processed strictly in-memory (`io.BytesIO`) and immediately discarded. Nothing stored server-side.

---

## 4. Functional Requirements

| ID | Requirement | Description | Status |
|----|-------------|-------------|--------|
| **FR1** | Raw Stream Ingestion | Accept JPG, PNG, WEBP (up to 16 MB) via drag-and-drop or multipart HTTP without server re-encoding | ✅ Done |
| **FR2** | Forensic Sanitizer | Flatten RGBA alpha channels onto white canvas; standardize sRGB color profile | ✅ Done |
| **FR3** | Dual-Stream Pipeline | Run Stream A (Letterbox ViT, 224×224) and Stream B (5 native RAW 512×512 crops) | ✅ Done |
| **FR4** | LayerNorm Bipolar Heatmap | Compute Sp ∈ [−1, +1]; render Turbo Red (AI) / Cyan (Authentic) overlays on valid_roi | ✅ Done |
| **FR5** | 2D FFT + DCT Notch Filter | Mask JPEG 8×8 block harmonics; compute periodic grid peak ratio | ✅ Done |
| **FR6** | Bayer Correlation Defense | Compute ρ(R,G) > 0.60 → defend smartphone HDR from false AI verdicts | ✅ Done |
| **FR7** | PRNU Noise Estimation | Multi-patch sensor noise residual for CMOS hardware fingerprint | ✅ Done |
| **FR8** | ELA Micro-Seam Detection | Re-compress at 90% JPEG quality; detect micro-inpainting via Δ_ELA | ✅ Done |
| **FR9** | EXIF Physics Validation | Cross-validate claimed camera Make/Model against Bayer/demosaicing signatures | ✅ Done |
| **FR10** | Evidence Arbitration Matrix | Fuse Stream A + Stream B; handle re-compression, TTA anti-grain, inpainting gates | ✅ Done |
| **FR11** | 3-Way Multi-Spectrum Viewfinder | UI toggle: 📷 Optical ↔ 🎯 AI Attribution Heatmap ↔ 🔬 ELA Seams | ✅ Done |
| **FR12** | Faithful Structured Evidence Cards | Non-hallucinated empirical text for Spatial, Texture, Spectral, and Metadata vectors | ✅ Done |
| **FR13** | Probability Spectrum Gauge | Spring-physics animated needle from 0%–100% AI Index | ✅ Done |
| **FR14** | Source Generator Fingerprinting | Identify suspected AI model: FLUX.1, Midjourney v6, SDXL, DALL-E 3, or Real Camera | ✅ Done |
| **FR15** | SVG Forensic Radar Chart | Spider web chart for 4 physical signal vectors (FFT · PRNU · ELA · Bayer) | ✅ Done |
| **FR16** | Downloadable PDF Report | Branded jsPDF report: gauge, radar, evidence cards, ethics disclaimer | ✅ Done |
| **FR17** | 1-Click Clipboard Export | Plain-text forensic summary copy for rapid distribution | ✅ Done |
| **FR18** | Batch / Bulk Analysis Mode | Multi-file drag & drop queue scanner with real-time progress, CSV export, per-item PDF | ✅ Done |

---

## 5. Non-Functional Requirements

| NFR | Requirement | Target |
|-----|-------------|--------|
| **NFR1** | Zero-Shot Generalization Drop | Out-of-domain ROC-AUC drop ≤ 5% vs in-domain |
| **NFR2** | Calibration Quality | ECE < 0.05 after temperature scaling |
| **NFR3** | Inference Latency | < 150 ms on GPU / < 500 ms on CPU |
| **NFR4** | Upload File Size Limit | 16 MB maximum per image |
| **NFR5** | Supported Formats | JPEG, PNG, WEBP |
| **NFR6** | Privacy & Zero-Retention | No images stored; all in-memory BytesIO processing |
| **NFR7** | Reproducibility | Clean installation via `requirements.txt` + `npm install` |
| **NFR8** | Browser Compatibility | Chrome 100+, Firefox 100+, Safari 15+ |

---

## 6. Success Metrics & Evaluation Matrix

| Evaluation Axis | Weight | Optimization Target |
|-----------------|--------|---------------------|
| **AI/ML Implementation** | 25% | ROC-AUC > 0.94 on held-out unseen generators (FLUX.1, Midjourney v6, SDXL) |
| **Technical Implementation** | 20% | Dual-stream architecture, 2D FFT CUDA notch filter, clean modular codebase |
| **Faithful Explainability** | 20% | LayerNorm Bipolar Attribution; Deletion AUC < 0.30; Insertion AUC > 0.80 |
| **User Experience & Design** | 20% | Tactile Sage Paper viewfinder design; 3-Way Spectrum Switcher; responsible framing |
| **Problem Understanding** | 15% | Robustness against social media re-compression; smartphone HDR defense |

---

## 7. Out-of-Scope

The following are explicitly **not** part of SignalScope's scope:

- Face-swap detection or deepfake video profiling of real individuals
- Political fact-checking or claim adjudication
- Real-time live stream analysis
- Training on held-out benchmark evaluation splits
- Identity tracking or personal data retention
