'use client';

import { motion } from 'framer-motion';
import { Loader2, Radio } from 'lucide-react';

interface Props {
  fileName?: string;
}

export function LoadingState({ fileName }: Props) {
  return (
    <div
      className="upload-wrapper"
      role="status"
      aria-live="polite"
      aria-label="Scanning image, please wait"
    >
      <div className="viewfinder-box loading-viewfinder reticle-grid">
        {/* Corner Brackets */}
        <div className="viewfinder-corner viewfinder-corner-tl" />
        <div className="viewfinder-corner viewfinder-corner-tr" />
        <div className="viewfinder-corner viewfinder-corner-bl" />
        <div className="viewfinder-corner viewfinder-corner-br" />

        {/* Animated Scanning Bar */}
        <motion.div
          className="scan-line"
          animate={{
            top: ['10%', '90%', '10%'],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            color: 'var(--teal-real)',
            marginBottom: '1rem',
          }}
        >
          <Loader2 className="spin" size={24} />
          <Radio size={20} />
        </div>

        <p
          className="font-mono-data"
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--ink-text)',
            letterSpacing: '0.04em',
            marginBottom: '0.4rem',
            textTransform: 'uppercase',
          }}
        >
          ANALYZING IMAGE FREQUENCY & PATTERNS
        </p>

        {fileName && (
          <p
            className="font-mono-data"
            style={{
              fontSize: '0.78rem',
              color: 'var(--ink-muted)',
              marginBottom: '1.25rem',
            }}
          >
            TARGET: {fileName}
          </p>
        )}

        <div
          className="font-mono-data"
          style={{
            fontSize: '0.7rem',
            color: 'var(--ink-faint)',
            display: 'flex',
            gap: '1.25rem',
          }}
        >
          <span>[1/3] EXTRACTING FEATURES</span>
          <span>[2/3] RUNNING INFERENCE</span>
          <span>[3/3] CALIBRATING PROBABILITY</span>
        </div>
      </div>
    </div>
  );
}
