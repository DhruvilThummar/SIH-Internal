# SignalScope — UI/UX Design Specification

---

## 1. Design Philosophy

SignalScope's interface is designed around the metaphor of a **military-grade optical instrument** — a viewfinder that a forensic analyst would use in the field. Every design decision reinforces two core principles:

| Principle | Application |
|-----------|-------------|
| **Responsible Framing** | Every piece of UI copy communicates calibrated statistical likelihood ("likely AI-generated"), never absolute accusations or certainty claims |
| **Instrument Aesthetics** | Tactical sage-paper canvas with corner-bracket viewfinder stages, reticle grids, and monospace data readouts |
| **3-Way Multi-Spectrum Visualization** | Toggle seamlessly between 📷 Optical View, 🎯 AI Attribution Heatmap, and 🔬 ELA Seam Map |
| **Zero-Point Bipolar Color Mapping** | Turbo Red/Yellow = synthetic AI glitch; Cyan-Blue = authentic optical camera anchor |
| **Non-Hallucinated Evidence** | All evidence text strings are deterministically computed from physical signal extractors — never LLM-generated |

---

## 2. User Flow & Application State Machine

```
[Idle — Optical Viewfinder Upload Stage]
        │  drag & drop or click (react-dropzone)
        │  Accepts: .jpg .jpeg .png .webp (max 16 MB)
        │  Modes: Single Image | Batch Queue | (Planned: URL | Compare | Video)
        ▼
[Loading — Scanning Reticle Animation]
        │  Phase 1/3 → Extracting ViT Foundation Features
        │  Phase 2/3 → Analyzing 2D FFT & PRNU Physical Signals
        │  Phase 3/3 → Calibrating Composite Probability
        ▼
[Result — Technical Case File Dashboard]
   ├── LEFT: Viewfinder Stage (3-Way Multi-Spectrum Switcher)
   │     ├── 📷 Optical View — Original target image
   │     ├── 🎯 AI Attribution Heatmap — Turbo/Cyan LayerNorm bipolar canvas
   │     └── 🔬 ELA Compression Seam Map — Glowing pixel-level inpainting map
   │
   └── RIGHT: Case File Readout Panel
         ├── Verdict Banner ("Likely AI-generated" / "Likely real" / "Uncertain")
         ├── Suspected Origin Badge (FLUX.1 / Midjourney v6 / SDXL / Real Camera)
         ├── Horizontal Real ↔ AI Probability Spectrum Gauge (Framer Motion spring needle)
         ├── Faithful Structured Evidence Cards (3 cards):
         │     ├── 🎯 Primary Spatial Evidence (LayerNorm bipolar localization)
         │     ├── 🔍 Secondary Texture & Micro-Grain (PRNU + Bayer correlation)
         │     └── 📶 Spectral 2D Fourier Frequency (FFT notch & grid spikes)
         ├── SVG Forensic Radar Chart (FFT · PRNU · ELA · Bayer 4-vector spider)
         ├── 4 Invariant Forensic Signal Metric Cards (PRNU · 2D Fourier · ELA Seams · Bayer Corr)
         ├── Calibrated Confidence % + Classification label
         └── Action Buttons:
               ├── [PDF Report] — Download branded forensic PDF
               ├── [Copy Summary] — 1-click clipboard export
               └── [Target New Image] — Return to Upload Stage
```

---

## 3. Visual Style & Color System

### 3.1 Color Palette Tokens

| CSS Token | Hex | Application |
|-----------|-----|-------------|
| `--sage-paper` | `#EAEBE3` | Main canvas background — tactile sage paper |
| `--surface-card` | `#F4F5EF` | Instrument card surface |
| `--surface-subtle` | `#EEEEE6` | Secondary surface (evidence card backgrounds) |
| `--ink-text` | `#20241F` | Deep off-black — primary headings & data |
| `--ink-muted` | `#5A6157` | Secondary labels, readout annotations |
| `--border-line` | `rgba(90,97,87,0.25)` | Subtle borders & dashed dividers |
| `--teal-real` | `#2C6E63` | Authentic / Likely Real — Cyan-Blue heatmap spectrum |
| `--copper-ai` | `#B5622E` | Synthetic / Likely AI — Turbo Red-Yellow heatmap spectrum |
| `--ochre-uncertain` | `#C69214` | Inconclusive / Mid-range probability |

### 3.2 Heatmap Color Encoding

| Sp Score | Canvas Color | Meaning |
|----------|--------------|---------|
| $S_p > +0.15$ | Turbo palette (Red → Yellow) | AI generative artifact |
| $-0.15 \leq S_p \leq +0.15$ | Transparent (α = 0) | No signal |
| $S_p < -0.15$ | Cyan-Blue palette | Authentic optical evidence |

---

## 4. Typography System

| Usage | Font | Weight | Size |
|-------|------|--------|------|
| **Headings & Prose** | IBM Plex Sans | 400–700 | Variable |
| **Data & Readouts** | IBM Plex Mono | 400–600 | 0.65rem – 0.85rem |
| **Verdict Label** | IBM Plex Mono | 700 | 1.35rem |
| **Confidence Score** | IBM Plex Mono | 700 | 1.0rem |

**Rule:** Any numeric value, confidence index, scale label, file name, status indicator, or forensic metric must use `IBM Plex Mono`. Prose, headings, and descriptions use `IBM Plex Sans`.

---

## 5. Component Design Language

### Viewfinder Corner Brackets

The `.viewfinder-corner` system creates a tactical corner-bracket overlay on all major panels:

```css
.viewfinder-box {
  position: relative;
  border: 1px solid var(--border-line);
}
.viewfinder-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: var(--ink-muted);
  border-style: solid;
}
.viewfinder-corner-tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
.viewfinder-corner-tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
.viewfinder-corner-bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
.viewfinder-corner-br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }
```

### Button Hierarchy

| Class | Usage | Style |
|-------|-------|-------|
| `.btn-instrument` | Primary action (PDF Report) | Dark ink fill, high contrast |
| `.btn-secondary` | Secondary action (Copy, Reset) | Ghost / outline style |
| `.btn-toggle` | Spectrum switcher tabs | Active state uses verdict color |

### Probability Spectrum Gauge

- Horizontal track: Real (teal) → Uncertain → AI (copper)
- Animated needle: Framer Motion spring physics (`stiffness: 70, damping: 15`)
- Tick marks: 5 evenly spaced marks including center uncertainty marker

---

## 6. Batch Scanner Panel Design

`BatchPanel.tsx` presents a command-center aesthetic:

- **Queue Table**: Each image row shows status icon, file name, AI Index %, verdict badge, and action buttons
- **Status Icons**: 🟡 Queued → 🔵 Scanning → ✅ Done → ❌ Error
- **Global Actions**: Export All CSV, Clear Queue, Back to Single Mode
- **Per-Item Actions**: View Full Result (→ navigates to ResultPanel), Download PDF

---

## 7. Accessibility & Responsive Design

| Requirement | Implementation |
|-------------|----------------|
| Color contrast | All text/background combinations meet WCAG AA (4.5:1 minimum) |
| Screen reader | `aria-label` on all interactive elements, `role="status"` on verdict |
| Keyboard nav | All buttons and tabs keyboard-focusable with visible focus ring |
| Responsive layout | 2-column grid collapses to single column at < 768px viewport |
| Reduced motion | Framer Motion respects `prefers-reduced-motion` media query |
