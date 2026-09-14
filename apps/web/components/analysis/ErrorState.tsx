'use client';

import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="upload-wrapper" role="alert" aria-live="assertive">
      <div
        className="viewfinder-box loading-viewfinder reticle-grid"
        style={{ borderColor: 'var(--copper-ai)' }}
      >
        <div className="viewfinder-corner viewfinder-corner-tl" />
        <div className="viewfinder-corner viewfinder-corner-tr" />
        <div className="viewfinder-corner viewfinder-corner-bl" />
        <div className="viewfinder-corner viewfinder-corner-br" />

        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'color-mix(in srgb, var(--copper-ai) 15%, transparent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--copper-ai)',
            marginBottom: '1rem',
          }}
        >
          <AlertCircle size={28} />
        </div>

        <p
          className="font-mono-data"
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--ink-text)',
            marginBottom: '0.4rem',
            textTransform: 'uppercase',
          }}
        >
          INSTRUMENT READOUT ERROR
        </p>

        <p
          style={{
            fontFamily: 'var(--font-prose)',
            fontSize: '0.88rem',
            color: 'var(--ink-muted)',
            textAlign: 'center',
            maxWidth: '420px',
            marginBottom: '1.5rem',
          }}
        >
          {message || 'An unexpected error occurred during image processing.'}
        </p>

        <button
          id="retry-btn"
          type="button"
          className="btn-secondary"
          onClick={onRetry}
        >
          <RotateCcw size={15} />
          <span>Reset Instrument</span>
        </button>
      </div>
    </div>
  );
}
