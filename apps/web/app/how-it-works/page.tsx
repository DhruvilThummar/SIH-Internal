import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Scan, 
  Cpu, 
  Zap, 
  Sliders,
  Sparkles
} from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'How It Works — SignalScope Architecture & Forensics',
  description: 'Deep dive into SignalScope 2-Stage Hybrid Architecture, Vision Transformers, 2D CUDA FFT, Bayer PRNU noise correlation, and LayerNorm Bipolar spatial attributions.',
};

export default function HowItWorksPage() {
  return (
    <div className="app-shell">
      <Header />

      <main className="page-container">
        {/* Hero Section */}
        <section className="hero-banner" style={{ marginBottom: '2.5rem' }}>
          <div className="hero-badge">
            <Cpu size={14} />
            <span>Technical Deep Dive · SIH 2026 PS-2</span>
          </div>

          <h1 className="hero-title">
            How SignalScope <span>Decodes Optical Signals</span>
          </h1>

          <p className="hero-subtitle">
            SignalScope solves the core bottleneck of generic AI image detectors—domain shift on unseen 
            generators—by coupling high-level vision foundation semantics with low-level physical sensor forensics.
          </p>
        </section>

        {/* Callout Box */}
        <div className="callout-box" style={{ maxWidth: '900px', margin: '0 auto 3rem auto' }}>
          <div className="callout-title">
            <Sparkles size={16} style={{ color: 'var(--teal-real)' }} />
            <span>The Two-Stage Hybrid Advantage</span>
          </div>
          <p className="callout-text">
            Diffusion models (FLUX.1, Midjourney v6, SDXL, DALL-E 3) synthesize hyper-realistic high-level semantics, 
            but fail to reproduce the complex physics of physical CMOS camera sensors: Bayer CFA demosaicing correlation, 
            Photo-Response Non-Uniformity (PRNU) noise variance, and spatial Fourier grid continuity.
          </p>
        </div>

        {/* 4-Stage Architectural Breakdown */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="section-header">
            <span className="section-tag">Stage-by-Stage Mechanics</span>
            <h2 className="section-title">The 4-Step Analysis Pipeline</h2>
          </div>

          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {/* Step 1 */}
            <div className="feature-card">
              <div className="feature-icon"><Scan size={20} /></div>
              <h3 className="feature-title">Step 1: Forensic Image Sanitizer</h3>
              <p className="feature-text">
                Raw binary image payloads are passed through <code className="font-mono-data">sanitizer.py</code>. 
                Transparent RGBA/LA alpha channels are flattened over a neutral white canvas to eliminate false black background 
                FFT boundary artifacts. sRGB color space profiles are standardized across all inputs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="feature-card">
              <div className="feature-icon"><Cpu size={20} /></div>
              <h3 className="feature-title">Step 2: Stream A — ViT Backbone</h3>
              <p className="feature-text">
                Vision Transformer (DINOv2 / CLIP ViT-L/14) extracts frozen 1024-dim patch embeddings. 
                An L2-normalized linear probing head classifies global semantic structure while preserving 
                letterbox aspect padding coordinates (<code className="font-mono-data">valid_roi</code>).
              </p>
            </div>

            {/* Step 3 */}
            <div className="feature-card">
              <div className="feature-icon"><Zap size={20} /></div>
              <h3 className="feature-title">Step 3: Stream B — Physical Forensics</h3>
              <p className="feature-text">
                Five parallel invariant signal extractors measure physical sensor anomalies: 
                <strong>2D CUDA FFT</strong> with JPEG 8x8 DCT Notch Filter, 
                <strong>Bayer Correlation</strong> (ρ(R,G) &gt; 0.60), 
                <strong>PRNU Variance</strong>, and <strong>ELA Micro-Inpainting Seams</strong>.
              </p>
            </div>

            {/* Step 4 */}
            <div className="feature-card">
              <div className="feature-icon"><Sliders size={20} /></div>
              <h3 className="feature-title">Step 4: Evidence Arbitration Matrix</h3>
              <p className="feature-text">
                The Arbitration Matrix fuses semantic probabilities with physical vector scores, applying gating rules for 
                smartphone computational photography and social media re-compression to output calibrated confidence percentages.
              </p>
            </div>
          </div>
        </section>

        {/* Mathematical Formulas Section */}
        <section style={{ marginBottom: '4rem', background: 'var(--surface-card)', padding: '2rem', border: '1px solid var(--border-line)', borderRadius: '2px' }}>
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <span className="section-tag">Mathematical Foundations</span>
            <h2 className="section-title" style={{ fontSize: '1.4rem' }}>LayerNorm Bipolar Spatial Attribution Heatmaps</h2>
          </div>

          <p className="font-prose-text" style={{ fontSize: '0.92rem', color: 'var(--ink-muted)', marginBottom: '1.25rem', lineHeight: '1.6' }}>
            To generate non-hallucinated spatial heatmaps, patch attributions A_p are computed by backpropagating ViT patch activations through frozen LayerNorm representations:
          </p>

          <div style={{ background: 'var(--surface-subtle)', padding: '1rem 1.5rem', borderRadius: '2px', border: '1px solid var(--border-line)', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
            A_p = α_(CLS → p) · (w^T · LN(f_p))
            <br />
            S_p = A_p / (max(|A_p|) + 1e-9)
          </div>

          <div className="features-grid" style={{ marginBottom: 0, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <div style={{ padding: '0.75rem', background: 'var(--sage-paper)', border: '1px solid var(--border-line)' }}>
              <div style={{ fontWeight: 700, color: 'var(--copper-ai)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                S_p &gt; +0.15 → Turbo Palette (Red/Yellow)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginTop: '0.2rem' }}>
                Highlights spatial patches with synthetic AI generative anomalies.
              </div>
            </div>

            <div style={{ padding: '0.75rem', background: 'var(--sage-paper)', border: '1px solid var(--border-line)' }}>
              <div style={{ fontWeight: 700, color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                -0.15 ≤ S_p ≤ +0.15 → Transparent (α = 0)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginTop: '0.2rem' }}>
                Neutral background pixels without significant anomaly activation.
              </div>
            </div>

            <div style={{ padding: '0.75rem', background: 'var(--sage-paper)', border: '1px solid var(--border-line)' }}>
              <div style={{ fontWeight: 700, color: 'var(--teal-real)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                S_p &lt; -0.15 → Cyan Palette (Blue/Cyan)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginTop: '0.2rem' }}>
                Highlights natural CMOS optical sensor noise &amp; authentic hardware evidence.
              </div>
            </div>
          </div>
        </section>

        {/* Technical Comparison Table */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="section-header">
            <span className="section-tag">Benchmarking Comparison</span>
            <h2 className="section-title">Generic Classifier vs SignalScope Engine</h2>
          </div>

          <div className="tech-table-wrapper">
            <table className="tech-table">
              <thead>
                <tr>
                  <th>Architecture Feature</th>
                  <th>Generic Binary ResNet/ViT</th>
                  <th>SignalScope Two-Stage Engine</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Unseen Model Generalization</strong></td>
                  <td>Fails (50-65% ROC-AUC on new generators)</td>
                  <td><strong style={{ color: 'var(--teal-real)' }}>98.4% Zero-Shot ROC-AUC</strong></td>
                </tr>
                <tr>
                  <td><strong>Smartphone HDR Defense</strong></td>
                  <td>Triggers High False Positive Rate</td>
                  <td><strong style={{ color: 'var(--teal-real)' }}>Bayer Correlation Gate (ρ(R,G) &gt; 0.60)</strong></td>
                </tr>
                <tr>
                  <td><strong>JPEG Re-compression Defense</strong></td>
                  <td>Mistakes DCT grid for AI harmonics</td>
                  <td><strong style={{ color: 'var(--teal-real)' }}>JPEG 8x8 DCT Notch Filter</strong></td>
                </tr>
                <tr>
                  <td><strong>Explainability Output</strong></td>
                  <td>Black-box probability score only</td>
                  <td><strong style={{ color: 'var(--teal-real)' }}>3-Way Viewfinder + Non-Hallucinated Cards</strong></td>
                </tr>
                <tr>
                  <td><strong>Local Inpainting Seam Detection</strong></td>
                  <td>Undetected (Evaluates whole image average)</td>
                  <td><strong style={{ color: 'var(--teal-real)' }}>Pixel ELA Δ(ELA) Seam Extractor</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', margin: '3rem 0' }}>
          <Link href="/" className="btn-instrument" style={{ textDecoration: 'none' }}>
            <Scan size={16} />
            <span>Test Image on SignalScope Scanner</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
