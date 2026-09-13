# SignalScope — Two-Stage Hybrid Architecture & Defense-Grade Forensic Engine

## 1. Executive Summary

SignalScope is an enterprise-grade digital image authentication system engineered specifically for:
1. **Zero-Shot Generalization**: Reliable detection across unseen AI image generators (FLUX.1, Midjourney v6, SDXL, DALL-E 3, StyleGAN 3) without overfitting to training set noise fingerprints.
2. **Faithful Forensic Explainability**: Non-hallucinated empirical evidence coupled with Zero-Point Anchored Bipolar Spatial Attribution heatmaps ($S_p$) and Pixel-Level Error Level Analysis (ELA).

---

## 2. System Pipeline Architecture

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

---

## 3. Mathematical & Forensic Formulations

### 3.1 LayerNorm Bipolar Spatial Attribution ($S_p$)
For Vision Transformer (ViT) backbones, patch attribution $A_p$ is computed on LayerNorm-normalized patch features $\operatorname{LN}(f_p)$ projected through probe weights $w$:

$$A_p = \alpha_{\text{CLS} \to p} \cdot \left(w^T \operatorname{LN}(f_p)\right)$$

where $\alpha_{\text{CLS} \to p}$ represents the last-layer self-attention weights from the `[CLS]` token to patch $p$.

Normalized via **Zero-Point Anchored Scaling**:

$$S_p = \frac{A_p}{\max(|A_p|) + 1e-9}$$

- $S_p > +0.15 \implies$ Turbo Palette (AI Glitch / Red-Yellow)
- $-0.15 \le S_p \le +0.15 \implies \alpha = 0$ (Transparent / Neutral background)
- $S_p < -0.15 \implies$ Cyan-Blue Palette (Authentic Optical Camera Evidence)

### 3.2 JPEG $8 \times 8$ DCT Grid Notch Filter
Fundamental JPEG block boundary frequencies are masked out in 2D FFT magnitude spectrum $\mathcal{M}(u, v)$ to prevent compressed real photographs from triggering false-positive AI spectral spikes:

$$\text{Mask}_{\text{JPEG}}(u, v) = \begin{cases} 0 & \text{if } u \text{ or } v \equiv 0 \pmod{H/8, W/8} \\ 1 & \text{otherwise} \end{cases}$$

### 3.3 Bayer Cross-Channel Noise Correlation ($\rho_{R, G}$)
Optical camera sensors produce correlated noise residuals across RGB channels due to Bayer demosaicing interpolation:

$$\rho_{R, G} = \frac{\operatorname{Cov}(R_{\text{res}}, G_{\text{res}})}{\sigma_{R_{\text{res}}} \cdot \sigma_{G_{\text{res}}}}$$

- $\rho_{R, G} > 0.60 \implies$ Verified Optical Sensor (defends iPhone/Pixel beauty filters & bokeh from false positive AI verdicts)
- $\rho_{R, G} \le 0.60$ with low noise std $\implies$ Synthetic AI Diffusion

### 3.4 Pixel-Level Error Level Analysis ($\Delta_{\text{ELA}}$)
Micro-inpainting and Generative Fill edits are localized by re-compressing the image at a known 90% JPEG quality factor:

$$\Delta_{\text{ELA}} = |I_{\text{orig}} - I_{\text{JPEG}}| \times 15.0$$

High localized quantization contrast ($\text{Ratio} > 4.2$) pinpoints inpainted seams and object manipulation.

---

## 4. Benchmark & Faithfulness Evaluation Protocol

### 4.1 Standard Benchmark Datasets
SignalScope is evaluated across three core benchmark categories:
1. **AI-Generated & Diffusion Detection Datasets**:
   - **GenImage** (`GenImage/GenImage_mini` on Hugging Face): 1M+ images (Stable Diffusion v1.4/v1.5, Midjourney, DALL-E, GLIDE, VQDM, BigGAN vs ImageNet real photos).
   - **Synthbuster** (Zenodo): High-resolution modern diffusion benchmark (Midjourney v5, DALL-E 3, SDXL, Adobe Firefly).
2. **Local Inpainting & Tampering Datasets**:
   - **DEFACTO**: 220,000+ images with ground truth masks for inpainting and ELA seam testing.
   - **CASIA v2.0 / Columbia**: Academic benchmark for splicing and uncompressed editing.
3. **PRNU, Sensor Noise & Social Media Compression**:
   - **VISION Dataset**: 35 smartphones, WhatsApp/Facebook double-JPEG re-compressed versions.
   - **Dresden Database**: 14,000+ RAW unprocessed images from 73 camera models.

Automated CLI Downloader: `python ml/src/download_benchmark_datasets.py --target_dir data/held_out`

### 4.2 Evaluation Metrics
1. **Classification Metrics**:
   - **ROC-AUC**: Overall & per unseen generator split (FLUX.1, Midjourney v6, SDXL, DALL-E 3).
   - **Average Precision (AP)** & **Balanced Accuracy**.
   - **Brier Score** & **Expected Calibration Error (ECE)** (Temperature scaling calibration).
2. **Explainability Faithfulness Metrics**:
   - **Deletion AUC**: Measures drop in $P(\text{AI})$ as top activated patches are masked.
   - **Insertion AUC**: Measures rise in $P(\text{AI})$ as top activated patches are unmasked.

---

## 5. API Payload & Response Schema

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
