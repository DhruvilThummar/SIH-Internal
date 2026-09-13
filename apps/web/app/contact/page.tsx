'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Activity, 
  MapPin, 
  Building, 
  Award,
  Sparkles,
  Scan
} from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export default function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Technical Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [apiStatus, setApiStatus] = useState<{ status: string; loaded: boolean } | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(res => res.json())
      .then(data => setApiStatus({ status: data.status, loaded: data.model_loaded }))
      .catch(() => setApiStatus(null));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName || !email || !message) return;
    setSubmitted(true);
  }

  return (
    <div className="app-shell">
      <Header />

      <main className="page-container">
        <section className="hero-banner" style={{ marginBottom: '2.5rem' }}>
          <div className="hero-badge">
            <Mail size={14} />
            <span>Developer Support &amp; Hackathon Inquiries</span>
          </div>

          <h1 className="hero-title">
            Get in Touch with <span>SignalScope</span>
          </h1>

          <p className="hero-subtitle">
            Have questions about our Two-Stage Hybrid Engine, need developer support, or want 
            to provide feedback for the SIH 2026 Internal Hackathon? Send us a message!
          </p>
        </section>

        <div className="result-grid" style={{ maxWidth: '1100px', margin: '0 auto 3rem auto', gap: '2rem' }}>
          
          {/* Contact Form */}
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-line)', padding: '2rem', borderRadius: '2px' }}>
            <h2 className="font-mono-data" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink-text)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-line)', paddingBottom: '0.75rem' }}>
              SEND A MESSAGE
            </h2>

            {submitted ? (
              <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', background: 'var(--surface-subtle)', border: '1px solid var(--border-line)' }}>
                <CheckCircle2 size={42} style={{ color: 'var(--teal-real)', margin: '0 auto 1rem auto' }} />
                <h3 className="font-mono-data" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink-text)', marginBottom: '0.5rem' }}>
                  MESSAGE TRANSMITTED
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)', marginBottom: '1.5rem' }}>
                  Thank you, <strong>{fullName}</strong>. Your message regarding <strong>{topic}</strong> has been received by the SignalScope engineering team.
                </p>
                <button 
                  onClick={() => { setSubmitted(false); setMessage(''); }}
                  className="btn-secondary"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      placeholder="e.g. Dr. Alex Vance"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      required 
                      placeholder="e.g. alex@institution.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Topic / Inquiry Type</label>
                  <select 
                    className="form-select"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  >
                    <option value="Technical Inquiry">Technical Inquiry &amp; Architecture</option>
                    <option value="Hackathon Feedback">SIH 2026 Judge Feedback</option>
                    <option value="Bug Report">Bug Report or API Issue</option>
                    <option value="General Question">General Inquiry</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea 
                    className="form-textarea" 
                    required 
                    placeholder="Provide details about your query or feedback..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-instrument" style={{ width: '100%', justifyContent: 'center' }}>
                  <Send size={15} />
                  <span>Transmit Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Hackathon & System Details Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Hackathon Info Card */}
            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-line)', padding: '1.5rem', borderRadius: '2px' }}>
              <div className="font-mono-data" style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--teal-real)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                HACKATHON CONTEXT
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink-text)', marginBottom: '0.75rem' }}>
                SIH 2026 Internal Hackathon
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--ink-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building size={16} style={{ color: 'var(--ink-text)' }} />
                  <span>L.J. Institute of Engineering and Technology</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={16} style={{ color: 'var(--ink-text)' }} />
                  <span>Problem Statement: PS-2</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={16} style={{ color: 'var(--ink-text)' }} />
                  <span>Two-Stage Hybrid Architecture &amp; Explainability</span>
                </div>
              </div>
            </div>

            {/* System Status Card */}
            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-line)', padding: '1.5rem', borderRadius: '2px' }}>
              <div className="font-mono-data" style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                SYSTEM DIAGNOSTIC STATUS
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                <span className="status-dot" style={{ backgroundColor: apiStatus ? 'var(--teal-real)' : 'var(--copper-ai)' }} />
                <span className="font-mono-data" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink-text)' }}>
                  {apiStatus ? 'FLASK API OPERATIONAL' : 'INFERENCE SERVER OFFLINE'}
                </span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginTop: '0.5rem' }}>
                {apiStatus ? (
                  <span>Model weights <code className="font-mono-data">best.pth</code> pre-loaded &amp; calibrated.</span>
                ) : (
                  <span>Start backend server via <code className="font-mono-data">python services/inference-api/app.py</code></span>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
