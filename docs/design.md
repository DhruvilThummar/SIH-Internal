# SignalScope — UI & UX Design Specification

---

## 1. Design Principles

| Principle | Application |
|-----------|-------------|
| **Responsible Framing** | Every piece of copy communicates calibrated statistical likelihood ("likely AI-generated"), never bare accusations or certainty claims. |
| **Optical Viewfinder & Instrument Metaphor** | Tactical sage-paper canvas with corner-bracket viewfinder stages (`.viewfinder-corner`) and reticle overlays. |
| **3-Way Multi-Spectrum Visualization** | Toggle seamlessly between 📷 Optical View, 🎯 AI Attribution Heatmap, and 🔬 ELA Seam Map. |
| **Zero-Point Bipolar Color Mapping** | Turbo Red/Yellow spectrum highlights synthetic AI glitches; Cyan-Blue spectrum highlights authentic optical camera anchor details. |

---

## 2. User Flow & Dashboard Architecture

```
[Optical Viewfinder Upload Stage]
        │  select or drag target image (react-dropzone)
        ▼
[Scanning Reticle Loading State]
        │  [1/3] Extracting ViT Features → [2/3] Analyzing 2D FFT & PRNU → [3/3] Calibrating Probability
        ▼
[Technical Case File Result Dashboard]
  ├── Viewfinder Stage with 3-Way Multi-Spectrum Switcher:
  │     ├── 📷 Optical View (Original Target Image)
  │     ├── 🎯 AI Attribution Heatmap (Zero-Point Bipolar Canvas)
  │     └── 🔬 ELA Compression Seam Map (Glowing Pixel-Level Inpainting Map)
  ├── Verdict Readout ("Likely AI-generated" / "Likely real" / "Uncertain — low confidence")
  ├── Horizontal Real ↔ AI Spectrum Gauge with Framer Motion Animated Needle
  ├── Faithful Structured Evidence Cards:
  │     ├── 🎯 Primary Spatial Evidence (LayerNorm Bipolar Localization)
  │     ├── 🔍 Secondary Texture & Micro-Grain Evidence (PRNU & Bayer Correlation)
  │     └── 📶 Spectral 2D Fourier Frequency Evidence (FFT Notch & Grid Spikes)
  ├── 4 Invariant Forensic Signal Cards (PRNU Noise, 2D Fourier, ELA Seams, Bayer Corr)
  └── "Target New Image" Button → returns to Viewfinder Upload
```

---

## 3. Visual Style & Palette System

### 3.1 Palette Tokens

| Token | Hex Value | Application |
|-------|-----------|-------------|
| `--sage-paper` | `#EAEBE3` | Main canvas background (tactile sage paper) |
| `--surface-card` | `#F4F5EF` | Instrument card surface |
| `--ink-text` | `#20241F` | Deep off-black ink text (high contrast) |
| `--ink-muted` | `#5A6157` | Technical labels & secondary readouts |
| `--teal-real` | `#2C6E63` | Authentic / Likely Real accent & Cyan-Blue Heatmap spectrum |
| `--copper-ai` | `#B5622E` | Synthetic / Likely AI accent & Turbo Red-Yellow Heatmap spectrum |
| `--ochre-uncertain` | `#C69214` | Inconclusive / Mid-range probability accent |

### 3.2 Typography System

- **Prose & Headings**: `IBM Plex Sans` for clean, readable section headers and descriptions.
- **Data & Readouts**: `IBM Plex Mono` for all numeric values, confidence indices, scale labels, file specs, and status indicators.
