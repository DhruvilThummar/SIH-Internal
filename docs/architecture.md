# SignalScope — Master Architecture Specification

<div align="center">

**SIH 2026 Internal Hackathon · L.J. Institute of Engineering and Technology**  
*Problem Statement PS-2 · Two-Stage Hybrid Architecture & Faithful Forensic Explainability*

</div>

---

## 1. Executive Summary

SignalScope is engineered for two critical objectives:

1. **Zero-Shot Generalization** — Reliable detection across unseen AI image generators (*FLUX.1, Midjourney v6, SDXL, DALL-E 3, StyleGAN 3*) without overfitting to training-set noise fingerprints.
2. **Faithful Forensic Explainability** — Non-hallucinated empirical evidence grounded in physical signal extraction, coupled with Zero-Point Anchored Bipolar Spatial Attribution heatmaps and Pixel-Level Error Level Analysis.

---

## 2. Full System Pipeline

```
                   [ Untouched Raw Binary Stream / Image Payload ]
                                         │
                                         ▼
                             [ Forensic Image Sanitizer ]
                             ├── Alpha Channel Compositing (White Canvas)
                             └── sRGB Color Space Profile Standardizer
                                         │
                     ┌───────────────────┴───────────────────┐
                     ▼                                       ▼
        [ Stream A: ViT Backbone ]           [ Stream B: Physical Forensics Engine ]
        • Letterbox Aspect Padding            • 5× Native RAW 512×512 Crops
        • L2 Feature Normalization              (Top-Left, Top-Right, Bottom-Left,
        • LayerNorm Bipolar Attribution          Bottom-Right, Center)
        • valid_roi Coordinate Mapping        • 2D FFT + JPEG 8×8 DCT Notch Filter
                                              • Bayer Noise Correlation (ρ(R,G) > 0.60)
                                              • PRNU Sensor Noise Residual
                                              • Pixel-Level Error Level Analysis (ELA)
                                              • EXIF Physics Cross-Validation
                     │                                       │
                     └───────────────────┬───────────────────┘
                                         ▼
                           [ Evidence Arbitration Matrix ]
                           ├── Social Media Re-compression Gate
                           ├── Smartphone Computational Photography Gate
                           ├── Localized Inpainting Seam Detector
                           └── Adaptive TTA Anti-Grain Defense Gating
                                         │
                                         ▼
                             [ Defense-Grade JSON Response ]
                             ├── Verdict + Calibrated Confidence (%)
                             ├── Suspected Generator Origin Badge
                             ├── LayerNorm Bipolar Heatmap Grid
                             ├── 4 Forensic Signal Vector Scores
                             └── 4 Faithful Non-Hallucinated Evidence Strings
```

---

## 3. Mathematical & Forensic Formulations

### 3.1 LayerNorm Bipolar Spatial Attribution (Sp)

Patch attribution $A_p$ is computed on LayerNorm-normalized patch features $\operatorname{LN}(f_p)$ projected through probe weights $w$:

$$A_p = \alpha_{\text{CLS} \to p} \cdot \left(w^T \operatorname{LN}(f_p)\right)$$

where $\alpha_{\text{CLS} \to p}$ represents the last-layer self-attention weight from the `[CLS]` token to patch $p$.

Normalized via **Zero-Point Anchored Scaling**:

$$S_p = \frac{A_p}{\max(|A_p|) + 1\text{e-}9} \in [-1.0, +1.0]$$

| Score Range | Color Palette | Interpretation |
|-------------|---------------|----------------|
| $S_p > +0.15$ | 🔴 **Turbo (Red–Yellow)** | AI generative artifact detected |
| $-0.15 \leq S_p \leq +0.15$ | Transparent (α = 0) | Neutral background — no signal |
| $S_p < -0.15$ | 🔵 **Cyan–Blue** | Authentic optical camera evidence |

---

### 3.2 JPEG 8×8 DCT Grid Notch Filter

Fundamental JPEG block boundary frequencies are zeroed out in the 2D FFT magnitude spectrum $\mathcal{M}(u, v)$ to prevent real compressed photographs from triggering false-positive AI spectral spikes:

$$\text{Mask}_{\text{JPEG}}(u, v) = \begin{cases} 0 & \text{if } u \text{ or } v \equiv 0 \pmod{H/8,\ W/8} \\ 1 & \text{otherwise} \end{cases}$$

High-frequency grid peak ratio after masking:

$$\text{PeakRatio} = \frac{\max_{(u,v) \in \text{mask}} |F(u,v)|}{\text{mean}_{(u,v) \in \text{mask}} |F(u,v)| + 1\text{e-}9}$$

- $\text{PeakRatio} > 1.85 \implies$ Periodic upsampling harmonics detected (neural deconvolution artifact)

---

### 3.3 Bayer Cross-Channel Noise Correlation (ρ(R,G))

Optical camera sensors produce correlated noise residuals across RGB channels due to Bayer demosaicing interpolation:

$$\rho_{R,G} = \frac{\operatorname{Cov}(R_{\text{res}},\ G_{\text{res}})}{\sigma_{R_{\text{res}}} \cdot \sigma_{G_{\text{res}}}}$$

| Outcome | Interpretation |
|---------|----------------|
| $\rho_{R,G} > 0.60$ | ✅ Verified Optical Sensor — defends iPhone/Pixel HDR from false AI verdicts |
| $\rho_{R,G} \leq 0.60$ | 🚨 No physical sensor correlation — consistent with AI synthesis |

---

### 3.4 Pixel-Level Error Level Analysis (Δ_ELA)

Micro-inpainting and Generative Fill edits are isolated by re-compressing at a known 90% JPEG quality factor:

$$\Delta_{\text{ELA}} = |I_{\text{orig}} - I_{\text{JPEG}_{90}}| \times 15.0$$

- $\text{Ratio} > 4.2 \implies$ Localized inpainting seam detected (high quantization contrast vs surrounding optical pixels)

---

### 3.5 Ensemble Meta-Calibrator Fusion

$$P_{\text{composite}}(\text{AI}) = 0.80 \cdot P_{\text{ViT}}(\text{AI}) + 0.10 \cdot S_{\text{PRNU}} + 0.05 \cdot S_{\text{FFT}} + 0.05 \cdot S_{\text{ELA}}$$

**Verdict Mapping:**

| Composite Score | Verdict |
|-----------------|---------|
| $> 0.60$ | `likely AI-generated` |
| $< 0.40$ | `likely real` |
| $0.40 - 0.60$ | `uncertain — low confidence` |

---

### 3.6 Temperature Scaling Calibration

Neural output logits $z$ are calibrated via:

$$P_{\text{calibrated}} = \operatorname{softmax}(z / T^*)$$

where $T^* = 0.6589$ is fit on validation logits to minimize Expected Calibration Error (ECE). Target: **ECE < 0.05**.

---

## 4. System Components Breakdown

### 4.1 Frontend — `apps/web`

**Framework:** Next.js (TypeScript) + Vanilla CSS + Framer Motion + HTML5 Canvas

| Component | File | Description |
|-----------|------|-------------|
| **App Shell** | `app/page.tsx` | State machine: idle → loading → result → error → batch |
| **Upload Zone** | `components/UploadZone.tsx` | Corner-bracket viewfinder dropzone with `react-dropzone` |
| **Loading State** | `components/LoadingState.tsx` | 3-phase scanning reticle animation |
| **Result Panel** | `components/ResultPanel.tsx` | 3-Way Viewfinder + Gauge + Evidence Cards |
| **Heatmap Canvas** | `components/HeatmapCanvas.tsx` | Turbo/Cyan bipolar canvas overlay (bounded to `valid_roi`) |
| **Radar Chart** | `components/ForensicRadarChart.tsx` | SVG spider chart: FFT · PRNU · ELA · Bayer |
| **Batch Panel** | `components/BatchPanel.tsx` | Multi-file queue scanner with CSV + PDF export |
| **Error State** | `components/ErrorState.tsx` | Error display with retry CTA |
| **Report Engine** | `lib/generateReport.ts` | jsPDF branded forensic report generator |

**UI State Machine:**
```
idle ──► loading ──► result
 │                     │
 └──► error ◄──────────┘
 └──► batch
```

---

### 4.2 Inference API — `services/inference-api`

**Framework:** Flask + Flask-CORS

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/predict` | POST | Accepts `multipart/form-data` with `image` key; returns full forensic JSON |
| `/health` | GET | Returns model load status and weights path |

**Key Design Decisions:**
- Accepts raw `io.BytesIO` stream — no server-side re-encoding preserves EXIF & quantization tables
- Dynamic `importlib.reload` for hot-reload without Flask restart
- Singleton model loader: weights and temperature loaded once at startup

---

### 4.3 Machine Learning & Forensics Engine — `ml/src`

| Module | File | Defense Mechanism |
|--------|------|-------------------|
| **Sanitizer** | `forensics/sanitizer.py` | Alpha → white canvas; sRGB ICC standardization |
| **Spectral Engine** | `forensics/spectral.py` | 2D CUDA FFT + JPEG 8×8 DCT Notch + Moiré Screen Gate |
| **Texture Engine** | `forensics/texture.py` | PRNU noise residual + Bayer ρ(R,G) > 0.60 defense |
| **ELA Engine** | `forensics/ela.py` | Δ_ELA re-compression seam detection at 90% JPEG quality |
| **Metadata Engine** | `forensics/metadata.py` | EXIF Make/Model physics cross-validation |
| **Model Utils** | `model_utils.py` | Letterbox padding, LayerNorm attribution, valid_roi mapping |
| **Predictor** | `predict.py` | Dual-stream pipeline + Arbitration Matrix + Generator Fingerprinting |
| **Trainer** | `train.py` | Two-phase transfer learning with JPEG augmentation |
| **Calibrator** | `calibrate.py` | Temperature scaling T* on validation logits |
| **Evaluator** | `evaluate.py` | AUROC, AP, ECE, Brier, Deletion & Insertion AUC |

---

## 5. Benchmark Datasets & Evaluation Protocol

### 5.1 Benchmark Datasets

| Category | Dataset | Description |
|----------|---------|-------------|
| AI Detection | **GenImage Mini** | 1M+ images: SD v1.4/v1.5, Midjourney, DALL-E, GLIDE vs ImageNet |
| AI Detection | **Synthbuster** | Midjourney v5/v6, DALL-E 3, SDXL, Adobe Firefly |
| Inpainting | **DEFACTO** | 220K+ images with ground truth inpainting masks |
| Tampering | **CASIA v2.0** | Academic splicing & uncompressed editing benchmark |
| Sensor/PRNU | **VISION Dataset** | 35 smartphones with WhatsApp/Facebook re-compressed variants |
| Sensor/PRNU | **Dresden Database** | 14K+ RAW images from 73 camera models |

### 5.2 Evaluation Metrics

| Metric | Target | Purpose |
|--------|--------|---------|
| **ROC-AUC** | > 0.94 | Multi-generator zero-shot classification |
| **Average Precision (AP)** | Maximize | Precision-recall area under curve |
| **Balanced Accuracy** | > 0.90 | Equal weighting across real/AI classes |
| **Brier Score** | Minimize | Probabilistic forecast quality |
| **ECE** | < 0.05 | Calibration quality after temperature scaling |
| **Deletion AUC** | < 0.30 | Faithfulness: P(AI) drops as top patches masked |
| **Insertion AUC** | > 0.80 | Faithfulness: P(AI) rises as top patches restored |

---

## 6. API Payload Schema

### Request

```http
POST /predict
Content-Type: multipart/form-data

image: <binary image file>
```

### Response

```json
{
  "label": "likely AI-generated",
  "confidence": 0.968,
  "prob_ai": 0.968,
  "suspected_generator": "Midjourney v6",
  "generator_confidence": 0.85,
  "tampering_analysis": {
    "is_fully_synthetic": true,
    "has_localized_inpainting": false,
    "adversarial_noise_injected": false
  },
  "evidence": {
    "primary_spatial": "LayerNorm peak activation in subject patch; boundary blending discontinuity.",
    "secondary_texture": "Bayer corr_rg=0.12 — below CMOS threshold (>0.60).",
    "spectral_frequency": "Periodic deconvolution grid harmonics at 45° radial axis.",
    "metadata_consistency": "Synthetic color profile; no physical CFA sensor signature."
  },
  "heatmap_grid": [[0.12, 0.85], ["..."]],
  "grid_dimensions": [16, 16],
  "valid_roi": [0.0, 0.125, 1.0, 0.875],
  "forensics": {
    "fft_spectrum":     { "score": 85, "detail": "Periodic upsampling grid harmonics in 2D FFT" },
    "sensor_prnu":      { "score": 92, "detail": "Synthetic smooth noise residual across 5 patches" },
    "color_saturation": { "score": 12, "detail": "Bayer noise correlation: 0.12" },
    "ela_compression":  { "score": 45, "detail": "Uniform quantization error distribution" }
  }
}
```

---

## 7. Robustness Attack Surface

| Attack Vector | Naive Detector | SignalScope Defense |
|---------------|----------------|---------------------|
| Watermark Removal | ❌ Fails | ✅ PRNU + Bayer residual across image body |
| Cropping / Resizing | ❌ Fails | ✅ Letterbox ROI + valid_roi bounded extraction |
| Social Media Re-compression | ❌ Fails | ✅ Evidence Arbitration Matrix handles suppressed FFT spikes |
| Smartphone Beauty Filters / Bokeh | ❌ Fails | ✅ Bayer ρ(R,G) > 0.60 confirms optical sensor |
| Micro-Inpainting / Generative Fill | ❌ Fails | ✅ Pixel-level ELA seam isolation (Ratio > 4.2) |
| Adversarial Anti-Forensics Grain | ❌ Fails | ✅ Adaptive TTA 3×3 Gaussian denoising (σ=0.5) |
