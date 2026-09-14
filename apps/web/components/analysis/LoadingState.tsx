'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Lock, Fingerprint, Radio } from 'lucide-react';

interface Props {
  fileName?: string;
  previewUrl?: string;
}

const STAGES = [
  { step: '01/05', title: 'Forensic Sanitizer & Channel Normalization', detail: 'Standardizing sRGB color space & flattening alpha channels' },
  { step: '02/05', title: 'DINOv2 / CLIP Semantic Vision Probing', detail: 'Extracting 1024-dim spatial embeddings across 5 patch ROIs' },
  { step: '03/05', title: '2D FFT Spectral Magnitude Decomposition', detail: 'Notch filtering 8x8 DCT grid artifacts & high-frequency roll-off' },
  { step: '04/05', title: 'PRNU Micro-Grain & Bayer Cross-Correlation', detail: 'Evaluating sensor photo-response non-uniformity residuals' },
  { step: '05/05', title: 'Ensemble Calibration & Verdict Synthesis', detail: 'Bipolar LayerNorm scaling & zero-shot confidence scoring' },
];

export function LoadingState({ fileName, previewUrl }: Props) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    // Stage ticker interval
    const stageTimer = setInterval(() => {
      setCurrentStageIdx((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 700);

    // Smooth progress counter
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 120);

    return () => {
      clearInterval(stageTimer);
      clearInterval(progressTimer);
    };
  }, []);

  const stage = STAGES[currentStageIdx];

  return (
    <div
      className="load-state-shell"
      role="status"
      aria-live="polite"
      aria-label="Scanning target image with defense-grade physical evidence pipeline"
    >
      <div className="viewfinder-box load-viewfinder reticle-grid">
        {/* Tactical Viewfinder Corner Brackets */}
        <span className="vf-corner vf-tl" />
        <span className="vf-corner vf-tr" />
        <span className="vf-corner vf-bl" />
        <span className="vf-corner vf-br" />

        {/* Top Telemetry Header Bar */}
        <div className="load-header-bar">
          <div className="load-header-left">
            <Radio size={14} className="load-radio-pulse" />
            <span className="load-header-title">TACTICAL FORENSIC SCANNER</span>
            <span className="load-live-dot" />
          </div>
          <div className="load-header-right font-mono-data">
            <Lock size={12} className="text-[var(--teal-real)]" />
            <span>Zero Retention Ingestion</span>
          </div>
        </div>

        {/* Central HUD Scanner Stage */}
        <div className="load-hud-stage">

          {/* Background Image Preview Stage (if present) */}
          {previewUrl && (
            <div className="load-image-preview-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Target scanning preview" className="load-target-img" />
              <div className="load-img-overlay" />
            </div>
          )}

          {/* Concentric Pulsing Radar Rings */}
          <div className="load-radar-rings">
            <div className="radar-ring ring-1" />
            <div className="radar-ring ring-2" />
            <div className="radar-ring ring-3" />
            <div className="radar-crosshair-h" />
            <div className="radar-crosshair-v" />
          </div>

          {/* Animated Vertical Dual Laser Sweep */}
          <motion.div
            className="load-laser-beam"
            animate={{ top: ['5%', '92%', '5%'] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Central Target Scanner Icon Hub */}
          <div className="load-icon-hub">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="load-hub-ring"
            />
            <Scan size={36} className="load-hub-icon" />
          </div>

          {/* Filename Chip */}
          {fileName && (
            <div className="load-file-chip font-mono-data">
              <Fingerprint size={13} className="text-[var(--teal-real)]" />
              <span className="load-file-name" title={fileName}>
                TARGET: {fileName}
              </span>
            </div>
          )}
        </div>

        {/* Stage Ticker & Progress Section */}
        <div className="load-progress-section">
          {/* Progress Bar & Counter */}
          <div className="load-meter-row">
            <div className="load-meter-track">
              <motion.div
                className="load-meter-fill"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.15 }}
              />
            </div>
            <span className="load-progress-num font-mono-data">{progress}%</span>
          </div>

          {/* Dynamic Stage Ticker Text */}
          <div className="load-stage-card">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage.step}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="load-stage-content"
              >
                <div className="load-stage-head">
                  <span className="load-stage-step font-mono-data">{stage.step}</span>
                  <span className="load-stage-title font-mono-data">{stage.title}</span>
                </div>
                <p className="load-stage-detail">{stage.detail}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pipeline Vectors Footer Strip */}
          <div className="load-vectors-strip font-mono-data">
            <span className={currentStageIdx >= 0 ? 'active' : ''}>[DINOv2 / CLIP]</span>
            <span className={currentStageIdx >= 2 ? 'active' : ''}>[2D FFT]</span>
            <span className={currentStageIdx >= 3 ? 'active' : ''}>[PRNU NOISE]</span>
            <span className={currentStageIdx >= 3 ? 'active' : ''}>[BAYER CORR]</span>
            <span className={currentStageIdx >= 4 ? 'active' : ''}>[PROB CALIB]</span>
          </div>
        </div>

      </div>
    </div>
  );
}
