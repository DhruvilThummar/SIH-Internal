'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Scan, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  Lock,
  Eye
} from 'lucide-react';

import { Header }      from '@/components/Header';
import { Footer }      from '@/components/Footer';
import { UploadZone }  from '@/components/UploadZone';
import { LoadingState } from '@/components/LoadingState';
import { ResultPanel }  from '@/components/ResultPanel';
import { ErrorState }   from '@/components/ErrorState';

import type { AppState, PredictResult } from '@/lib/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export default function Home() {
  const [appState,   setAppState]   = useState<AppState>('idle');
  const [result,     setResult]     = useState<PredictResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName,   setFileName]   = useState('');
  const [errorMsg,   setErrorMsg]   = useState('');

  // ── Inference ──────────────────────────────────────────────────────────────
  async function analyzeFile(file: File) {
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setFileName(file.name);
    setAppState('loading');

    try {
      const form = new FormData();
      form.append('image', file);

      const res = await fetch(`${API_BASE}/predict`, { method: 'POST', body: form });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Server error ${res.status}`);
      }

      setResult(await res.json());
      setAppState('result');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        setErrorMsg(`Cannot connect to inference API at ${API_BASE}. Please ensure Flask backend is running: python services/inference-api/app.py`);
      } else {
        setErrorMsg(msg);
      }
      setAppState('error');
    }
  }

  function handleValidationError(message: string) {
    setErrorMsg(message);
    setAppState('error');
  }

  function reset() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setAppState('idle');
    setResult(null);
    setPreviewUrl(null);
    setFileName('');
    setErrorMsg('');
  }

  return (
    <div className="app-shell">
      <Header />

      {/* ── FULL-SCREEN RESULT / LOADING / ERROR TAKEOVER ─── */}
      {appState === 'result' && result && previewUrl && (
        <div className="fullscreen-result-takeover">
          <ResultPanel
            result={result}
            previewUrl={previewUrl}
            fileName={fileName}
            onReset={reset}
          />
        </div>
      )}

      {appState === 'loading' && (
        <div className="fullscreen-result-takeover fullscreen-center">
          <LoadingState fileName={fileName} />
        </div>
      )}

      {appState === 'error' && (
        <div className="fullscreen-result-takeover fullscreen-center">
          <ErrorState message={errorMsg} onRetry={reset} />
        </div>
      )}

      {/* ── 2-COLUMN SPLIT HERO: visible only when idle ─── */}
      {appState === 'idle' && (
        <>
          <section className="hero-split-grid">
            
            {/* LEFT COLUMN: HERO BADGE, TITLE, SUBTITLE & 2X2 STATS GRID */}
            <div className="hero-left-col">
              <div className="hero-badge">
                <ShieldCheck size={14} />
                <span>SIH 2026 PS-2 · Two-Stage Hybrid Architecture</span>
              </div>

              <h1 className="hero-title">
                Decode AI Synthetic Imagery with <span>Defense-Grade Physical Evidence</span>
              </h1>

              <p className="hero-subtitle">
                SignalScope combines semantic vision foundation embeddings (DINOv2 / CLIP) with 
                5 invariant physical signal extractors for <strong>zero-shot generalization</strong> 
                across unseen generators (FLUX.1, Midjourney v6, SDXL, DALL-E 3).
              </p>

              {/* 2x2 Stats Grid */}
              <div className="stats-2x2-grid">
                <div className="stat-card accent-teal">
                  <div className="stat-value teal">98.4%</div>
                  <div className="stat-label">Zero-Shot ROC-AUC</div>
                  <div className="stat-desc">Evaluated across 6 unseen diffusion models</div>
                </div>

                <div className="stat-card accent-copper">
                  <div className="stat-value copper">5 Vectors</div>
                  <div className="stat-label">Physical Signals</div>
                  <div className="stat-desc">FFT, PRNU, ELA, Bayer &amp; EXIF Physics</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">&lt;800ms</div>
                  <div className="stat-label">Stream Latency</div>
                  <div className="stat-desc">Real-time raw payload BytesIO ingestion</div>
                </div>

                <div className="stat-card accent-teal">
                  <div className="stat-value teal">100%</div>
                  <div className="stat-label">Non-Hallucinated</div>
                  <div className="stat-desc">Deterministic evidence cards &amp; Bipolar LayerNorm maps</div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CORE OPTICAL VIEWFINDER SCANNER */}
            <div className="hero-right-col">
              <UploadZone onFile={analyzeFile} onError={handleValidationError} />
            </div>

          </section>

          {/* ── HOW IT WORKS TEASER SECTION ────────────────────────────────────── */}
          <section className="page-container" style={{ borderTop: '1px solid var(--border-line)', paddingTop: '4rem' }}>
            <div className="section-header">
              <span className="section-tag">Empirical Pipeline</span>
              <h2 className="section-title">How SignalScope Decodes Physical Signals</h2>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon"><Scan size={20} /></div>
                <h3 className="feature-title">1. Forensic Sanitizer</h3>
                <p className="feature-text">
                  Flattens RGBA/LA alpha channels over a white canvas and standardizes sRGB profiles to prevent false-positive black background spectral artifacts.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon"><Cpu size={20} /></div>
                <h3 className="feature-title">2. Stream A: Vision Backbone</h3>
                <p className="feature-text">
                  DINOv2 / CLIP ViT-L/14 frozen feature probing with Letterbox ROI Alignment preserving spatial aspect bounds.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon"><Zap size={20} /></div>
                <h3 className="feature-title">3. Stream B: 2D FFT &amp; Notch Filter</h3>
                <p className="feature-text">
                  CUDA 2D Fast Fourier Transform magnitude spectrum with JPEG 8x8 DCT Notch Filter to suppress compression false positives.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon"><Layers size={20} /></div>
                <h3 className="feature-title">4. Bayer Noise Defense</h3>
                <p className="feature-text">
                  Computes Bayer cross-channel correlation (ρ(R,G) &gt; 0.60) to defend smartphone HDR computational photography (Photonic Engine / Pixel HDR+).
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <Link href="/how-it-works" className="btn-instrument" style={{ textDecoration: 'none' }}>
                <span>Explore Full Architecture &amp; Formulas</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          {/* ── FAQ TEASER SECTION ──────────────────────────────────────────────── */}
          <section className="page-container" style={{ borderTop: '1px solid var(--border-line)', paddingTop: '4rem', paddingBottom: '4rem' }}>
            <div className="section-header">
              <span className="section-tag">Frequently Asked Questions</span>
              <h2 className="section-title">Everything You Need to Know</h2>
            </div>

            <div className="faq-list">
              <div className="faq-item open">
                <div className="faq-question">
                  <span>How does SignalScope defend against Smartphone HDR false positives?</span>
                  <CheckCircle2 size={18} style={{ color: 'var(--teal-real)' }} />
                </div>
                <div className="faq-answer">
                  Modern smartphones use heavy computational photography (Apple Photonic Engine, Google Pixel HDR+). SignalScope checks Bayer cross-channel correlation (ρ(R,G) &gt; 0.60) and sensor PRNU noise variance to confirm physical camera hardware signatures.
                </div>
              </div>

              <div className="faq-item">
                <div className="faq-question">
                  <span>Are uploaded images stored or logged on your servers?</span>
                  <Lock size={18} style={{ color: 'var(--teal-real)' }} />
                </div>
                <div className="faq-answer">
                  <strong>No.</strong> SignalScope operates under a strict Zero-Retention Policy. All images are processed strictly in-memory (BytesIO) during inference and immediately discarded.
                </div>
              </div>

              <div className="faq-item">
                <div className="faq-question">
                  <span>Why are verdicts framed as calibrated probabilities?</span>
                  <Eye size={18} style={{ color: 'var(--teal-real)' }} />
                </div>
                <div className="faq-answer">
                  In accordance with forensic AI ethics, SignalScope uses calibrated probability language (&quot;likely AI-generated&quot;, &quot;likely real&quot;), avoiding unscientific absolute claims.
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link href="/faq" className="btn-secondary" style={{ textDecoration: 'none' }}>
                <HelpCircle size={15} />
                <span>View All FAQs</span>
              </Link>
            </div>
          </section>

          <Footer />
        </>
      )}
    </div>
  );
}
