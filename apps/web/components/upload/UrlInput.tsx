'use client';

import { useState } from 'react';
import { Link2, ArrowRight, ShieldAlert, Sparkles, Globe, Lock, Cpu, Image as ImageIcon, X } from 'lucide-react';
import { SAMPLE_IMAGE_URLS } from '../../constants/forensics';

interface UrlInputProps {
  onAnalyzeUrl: (url: string) => void;
  disabled?: boolean;
}

export function UrlInput({ onAnalyzeUrl, disabled = false }: UrlInputProps) {
  const [inputUrl, setInputUrl] = useState('');
  const [validationErr, setValidationErr] = useState('');

  function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setValidationErr('');

    const trimmed = inputUrl.trim();
    if (!trimmed) {
      setValidationErr('Please enter a valid image URL.');
      return;
    }

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setValidationErr('URL must start with http:// or https://');
      return;
    }

    onAnalyzeUrl(trimmed);
  }

  function handleSelectSample(url: string) {
    setInputUrl(url);
    setValidationErr('');
    onAnalyzeUrl(url);
  }

  return (
    <div className="vf-url-container">
      {/* Corner Brackets Signature Motif */}
      <span className="vf-corner vf-tl" />
      <span className="vf-corner vf-tr" />
      <span className="vf-corner vf-bl" />
      <span className="vf-corner vf-br" />

      {/* Header bar */}
      <div className="vf-url-header">
        <div className="vf-url-title-group">
          <Globe size={16} className="vf-url-icon" />
          <span className="vf-url-title">Remote Image Forensic URL Analysis</span>
        </div>
        <div className="vf-ssrf-badge">
          <Lock size={12} />
          <span>SSRF-Protected Pipeline</span>
        </div>
      </div>

      {/* URL Input Form */}
      <form onSubmit={handleSubmit} className="vf-url-form">
        <div className="vf-url-input-wrapper">
          <Link2 className="vf-url-input-icon" size={18} />
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste direct image URL (e.g. https://domain.com/sample.jpg)..."
            disabled={disabled}
            className="vf-url-field"
          />
          {inputUrl && (
            <button
              type="button"
              onClick={() => setInputUrl('')}
              className="vf-url-clear-btn"
              title="Clear input"
            >
              <X size={14} />
            </button>
          )}
          <button
            type="submit"
            disabled={disabled || !inputUrl.trim()}
            className="vf-url-submit-btn"
          >
            <span>Analyze</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {validationErr && (
          <div className="vf-url-error">
            <ShieldAlert size={14} />
            <span>{validationErr}</span>
          </div>
        )}
      </form>

      {/* Sample Verification Presets */}
      <div className="vf-samples-section">
        <div className="vf-samples-header">
          <Sparkles size={14} className="text-[var(--teal-real)]" />
          <span>Try sample verification images:</span>
        </div>

        <div className="vf-samples-grid">
          {SAMPLE_IMAGE_URLS.map((sample, idx) => {
            const isSampleAI = sample.type.toLowerCase().includes('ai') || sample.type.toLowerCase().includes('synthetic');
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample.url)}
                disabled={disabled}
                className={`vf-sample-card ${isSampleAI ? 'sample-ai' : 'sample-real'}`}
              >
                <div className="vf-sample-card-head">
                  <div className={`vf-sample-badge-pill ${isSampleAI ? 'copper' : 'teal'}`}>
                    {isSampleAI ? <Cpu size={12} /> : <ImageIcon size={12} />}
                    <span>{sample.type}</span>
                  </div>
                </div>
                <div className="vf-sample-card-body">
                  <span className="vf-sample-label">{sample.label}</span>
                  <span className="vf-sample-hint">Click to trigger instant forensic analysis</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Security & Ingestion Parameters Strip */}
      <div className="vf-url-footer-strip">
        <span>CORS Stream Validation</span>
        <span className="vf-spec-sep">•</span>
        <span>10s Fetch Timeout</span>
        <span className="vf-spec-sep">•</span>
        <span>Max 16 MB Stream</span>
      </div>

    </div>
  );
}
