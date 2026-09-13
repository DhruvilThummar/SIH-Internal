import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  FileText, 
  Cpu, 
  CheckCircle2, 
  Scan 
} from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — SignalScope Optical Forensics',
  description: 'SignalScope strict zero-retention privacy policy, in-memory processing guarantees, and non-profiling ethical AI standards.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="app-shell">
      <Header />

      <main className="page-container" style={{ maxWidth: '900px' }}>
        <section className="hero-banner" style={{ marginBottom: '2.5rem' }}>
          <div className="hero-badge">
            <ShieldCheck size={14} />
            <span>Zero-Retention Privacy Guarantee</span>
          </div>

          <h1 className="hero-title">
            Privacy Policy &amp; <span>Ethical Guarantees</span>
          </h1>

          <p className="hero-subtitle">
            SignalScope is engineered to respect digital privacy, enforce zero image retention, 
            and adhere to strict forensic AI ethics.
          </p>
        </section>

        {/* Highlight Banner */}
        <div className="callout-box" style={{ marginBottom: '2.5rem' }}>
          <div className="callout-title">
            <Lock size={16} style={{ color: 'var(--teal-real)' }} />
            <span>100% In-Memory Processing — Zero File Storage</span>
          </div>
          <p className="callout-text">
            When you upload an image for forensic scanning, the payload is converted to an in-memory 
            <code className="font-mono-data">BytesIO</code> stream in Python. It is analyzed in real-time by the inference pipeline and immediately purged from system RAM. <strong>No images are saved to disk, logged, or retained.</strong>
          </p>
        </div>

        {/* Detailed Policy Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>
          
          {/* Section 1 */}
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-line)', padding: '1.5rem', borderRadius: '2px' }}>
            <h2 className="font-mono-data" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink-text)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={18} style={{ color: 'var(--teal-real)' }} />
              1. Zero Image Retention Policy
            </h2>
            <p style={{ fontSize: '0.92rem', lineHeight: '1.6', color: 'var(--ink-muted)' }}>
              SignalScope does not maintain a database of uploaded images. Images uploaded through the web application or directly via the <code className="font-mono-data">POST /predict</code> API endpoint exist solely within volatile execution memory for the duration of the HTTP request (typically &lt; 800ms). Once the JSON response is delivered, memory references are unlinked and released.
            </p>
          </div>

          {/* Section 2 */}
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-line)', padding: '1.5rem', borderRadius: '2px' }}>
            <h2 className="font-mono-data" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink-text)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <EyeOff size={18} style={{ color: 'var(--teal-real)' }} />
              2. Non-Profiling &amp; Privacy Preservation
            </h2>
            <p style={{ fontSize: '0.92rem', lineHeight: '1.6', color: 'var(--ink-muted)' }}>
              SignalScope evaluates signal-level physical features (2D CUDA FFT frequency spectra, Bayer noise correlation, and LayerNorm patch attributions). It does <strong>NOT</strong> perform facial recognition, identity resolution, demographic classification, biometric profiling, or personal data tracking.
            </p>
          </div>

          {/* Section 3 */}
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-line)', padding: '1.5rem', borderRadius: '2px' }}>
            <h2 className="font-mono-data" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink-text)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} style={{ color: 'var(--teal-real)' }} />
              3. Data Transmission &amp; API Security
            </h2>
            <p style={{ fontSize: '0.92rem', lineHeight: '1.6', color: 'var(--ink-muted)' }}>
              All client-server communications occur over isolated binary HTTP stream channels. No third-party analytics scripts or external image tracking trackers are embedded in the SignalScope application.
            </p>
          </div>

          {/* Section 4 */}
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-line)', padding: '1.5rem', borderRadius: '2px' }}>
            <h2 className="font-mono-data" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink-text)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} style={{ color: 'var(--teal-real)' }} />
              4. Probabilistic Framing &amp; Responsible AI Ethics
            </h2>
            <p style={{ fontSize: '0.92rem', lineHeight: '1.6', color: 'var(--ink-muted)' }}>
              In compliance with scientific forensic standards, all detection verdicts are rendered using calibrated statistical confidence scores (<code className="font-mono-data">&quot;likely AI-generated&quot;</code> / <code className="font-mono-data">&quot;likely real&quot;</code>). SignalScope explicitly avoids making accusatory or uncalibrated binary claims.
            </p>
          </div>

        </div>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Link href="/" className="btn-instrument" style={{ textDecoration: 'none' }}>
            <Scan size={15} />
            <span>Return to Scanner</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
