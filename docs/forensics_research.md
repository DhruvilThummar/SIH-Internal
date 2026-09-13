# SignalScope — Optical Forensics & Synthetic Image Detection Research

---

## 1. Executive Summary

Modern AI generative architectures (Midjourney v6, FLUX.1, Stable Diffusion XL, DALL-E 3, StyleGAN 3) generate photorealistic pixels. However, simple detection methods—such as checking visible watermarks, EXIF tags, or basic edge contrast—fail when images are **cropped, watermarks are erased, images are re-compressed on social media, or elements are micro-inpainted**.

**SignalScope** establishes a **production-grade multi-vector optical forensic engine** combining **Vision Foundation Model features (DINOv2 / CLIP ViT-L/14)** with **five invariant physical forensic extractors**:
1. **LayerNorm-Normalized Bipolar Spatial Attribution**
2. **2D Fast Fourier Transform (FFT) Magnitude Spectrum + JPEG $8 \times 8$ DCT Notch Filter**
3. **Multi-Patch PRNU Sensor Noise Residual + Bayer Cross-Channel Correlation**
4. **Pixel-Level Error Level Analysis (ELA) Quantization Delta**
5. **EXIF Physics Cross-Validation Engine**

---

## 2. Robustness Matrix Against Post-Processing Attacks

| Attack / Modification | Superficial Detector (Fails) | SignalScope Defense-Grade Extractor (Succeeds) |
|-----------------------|------------------------------|--------------------------------------------------|
| **Watermark Removal** | ❌ Fails (relies on watermark) | ✅ **Multi-Patch PRNU & Bayer Correlation**: Analyzes micro-pixel noise entropy and Bayer demosaicing residuals across image body. |
| **Cropping / Resizing** | ❌ Fails (relies on fixed resolution) | ✅ **Letterbox Aspect Padding & `valid_roi`**: Bounds spatial heatmap and feature extraction strictly to valid image content. |
| **Social Media Re-compression** | ❌ Fails (compression erases simple high frequencies) | ✅ **Evidence Arbitration Matrix**: Handles high ViT confidence paired with suppressed FFT grid spikes without contradiction. |
| **Smartphone Beauty Filters / Bokeh** | ❌ Fails (mistakes smooth skin for AI over-smoothing) | ✅ **Bayer Noise Correlation ($\rho_{R,G} > 0.60$)**: Confirms optical sensor demosaicing even on smooth iPhone/Pixel selfies. |
| **Micro-Inpainting / Generative Fill** | ❌ Fails (global classifier reports Real) | ✅ **Pixel-Level ELA Seam Engine**: Re-compress at 90% JPEG factor to isolate localized quantization contrast ($\text{Ratio} > 4.2$). |
| **Adversarial Anti-Forensics Grain** | ❌ Fails (fooled by 2% synthetic film grain) | ✅ **Adaptive TTA Anti-Grain Defense**: $3 \times 3$ Gaussian denoising pass ($\sigma=0.5$) reveals underlying synthetic substrate. |

---

## 3. Mathematical Formulations

### 3.1 LayerNorm Bipolar Spatial Attribution ($S_p$)
Attribution is computed on LayerNorm-normalized patch features $\operatorname{LN}(f_p)$ projected through probe weights $w$:

$$A_p = \alpha_{\text{CLS} \to p} \cdot \left(w^T \operatorname{LN}(f_p)\right)$$

Normalized via **Zero-Point Anchored Scaling**:

$$S_p = \frac{A_p}{\max(|A_p|) + 1e-9}$$

- $S_p > +0.15 \implies$ Turbo Palette (AI Glitch / Red-Yellow)
- $-0.15 \le S_p \le +0.15 \implies \alpha = 0$ (Transparent / Neutral background)
- $S_p < -0.15 \implies$ Cyan-Blue Palette (Authentic Optical Camera Evidence)

### 3.2 2D Fourier (FFT) Power Spectrum & JPEG $8 \times 8$ DCT Notch Filter
Natural optical images follow a scale-invariant spatial frequency power spectrum decay law:

$$P(f_x, f_y) \propto \frac{1}{(f_x^2 + f_y^2)^{\alpha/2}}, \quad \text{where } \alpha \approx 2.0$$

Generative deconvolution upsamplers introduce periodic grid spikes. To prevent JPEG compression block boundaries from triggering false positive AI spikes, fundamental JPEG frequencies ($H/8, W/8$) are zeroed out:

$$\text{Mask}_{\text{JPEG}}(u, v) = \begin{cases} 0 & \text{if } u \text{ or } v \equiv 0 \pmod{H/8, W/8} \\ 1 & \text{otherwise} \end{cases}$$

High-frequency peak ratio:

$$\text{PeakRatio} = \frac{\max_{(u,v) \in \text{mask}} |F(u,v)|}{\text{mean}_{(u,v) \in \text{mask}} |F(u,v)| + 1e-9}$$

- $\text{PeakRatio} > 1.85 \implies$ Periodic upsampling grid harmonics detected.

### 3.3 Bayer Cross-Channel Noise Correlation ($\rho_{R,G}$)
Authentic optical camera sensors introduce multiplicative physical noise $K(x,y)$. Bayer demosaicing interpolates adjacent color pixels, producing high inter-channel correlation:

$$\rho_{R, G} = \frac{\sum (R_{\text{res}} - \bar{R}_{\text{res}})(G_{\text{res}} - \bar{G}_{\text{res}})}{\sqrt{\sum (R_{\text{res}} - \bar{R}_{\text{res}})^2 \sum (G_{\text{res}} - \bar{G}_{\text{res}})^2}}$$

- $\rho_{R, G} > 0.60 \implies$ Verified Optical Sensor (defends iPhone/Pixel beauty filters & bokeh from false positive AI verdicts).

### 3.4 Pixel-Level Error Level Analysis ($\Delta_{\text{ELA}}$)
Micro-inpainting seams are isolated by re-compressing the image at a known 90% JPEG quality factor:

$$\Delta_{\text{ELA}} = |I_{\text{orig}} - I_{\text{JPEG}}| \times 15.0$$

Inpainted regions display significant quantization error contrast ratios ($\text{Ratio} > 4.2$) compared to surrounding unedited optical pixels.
