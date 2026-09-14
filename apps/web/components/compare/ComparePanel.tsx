'use client';

import { useState } from 'react';
import {
  Columns2,
  ArrowLeft,
  Upload,
  Link2,
  Cpu,
  BarChart3,
  Sparkles,
  RefreshCw,
  ScanLine,
  ArrowRightLeft,
  Target,
  X,
  ArrowRight,
} from 'lucide-react';
import { useCompare, type CompareSlot } from '../../hooks/useCompare';
import { HeatmapCanvas } from '../HeatmapCanvas';
import type { PredictResult } from '../../lib/types';
import { SAMPLE_IMAGE_URLS } from '../../constants/forensics';

interface ComparePanelProps {
  onBack: () => void;
}

export function ComparePanel({ onBack }: ComparePanelProps) {
  const { slotA, slotB, setAndAnalyzeSlotA, setAndAnalyzeSlotB, resetCompare } = useCompare();

  function loadSamplePreset() {
    if (SAMPLE_IMAGE_URLS.length >= 2) {
      setAndAnalyzeSlotA(SAMPLE_IMAGE_URLS[0].url);
      setAndAnalyzeSlotB(SAMPLE_IMAGE_URLS[1].url);
    }
  }

  function handleSwap() {
    if (slotA && slotB) {
      const prevA = slotA;
      const prevB = slotB;
      if (prevB.url || prevB.file) setAndAnalyzeSlotA(prevB.url || prevB.file!);
      if (prevA.url || prevA.file) setAndAnalyzeSlotB(prevA.url || prevA.file!);
    }
  }

  const bothLoaded = !!(slotA?.result && slotB?.result);

  return (
    <div className="cp-shell">

      {/* ── Instrument Header Bar ── */}
      <div className="cp-header-bar">
        <div className="cp-header-left">
          <button onClick={onBack} className="cp-back-btn">
            <ArrowLeft size={14} />
            <span>Exit Compare</span>
          </button>

          <div className="cp-title-group">
            <Columns2 size={16} className="cp-title-icon" />
            <span className="cp-title-text">DUAL TARGET COMPARATIVE READOUT</span>
            <span className="cp-live-dot" aria-hidden />
          </div>
        </div>

        <div className="cp-header-right">
          <button
            type="button"
            onClick={loadSamplePreset}
            className="cp-action-btn"
            title="Load benchmark synthetic vs authentic preset"
          >
            <Sparkles size={13} />
            <span>Load Sample Preset</span>
          </button>

          {(slotA || slotB) && (
            <button
              type="button"
              onClick={handleSwap}
              disabled={!slotA || !slotB}
              className="cp-action-btn"
            >
              <ArrowRightLeft size={13} />
              <span>Swap A/B</span>
            </button>
          )}

          <button type="button" onClick={resetCompare} className="cp-ghost-btn">
            <RefreshCw size={13} />
            <span>Reset Slots</span>
          </button>
        </div>
      </div>

      {/* ── Slot Status Strip ── */}
      <div className="cp-status-strip">
        <SlotStatusPip label="A" slot={slotA} />
        <div className="cp-status-vs">VS</div>
        <SlotStatusPip label="B" slot={slotB} />
      </div>

      {/* ── Dual Slot Grid ── */}
      <div className="cp-grid">
        <CompareSlotCard
          slotId="A"
          title="TARGET A — BASELINE IMAGE"
          accentColor="var(--teal-real)"
          slot={slotA}
          onSelectFile={(f) => setAndAnalyzeSlotA(f)}
          onSelectUrl={(u) => setAndAnalyzeSlotA(u)}
        />
        <CompareSlotCard
          slotId="B"
          title="TARGET B — COMPARISON IMAGE"
          accentColor="var(--copper-ai)"
          slot={slotB}
          onSelectFile={(f) => setAndAnalyzeSlotB(f)}
          onSelectUrl={(u) => setAndAnalyzeSlotB(u)}
        />
      </div>

      {/* ── Delta Summary ── */}
      {bothLoaded && (
        <ComparativeDeltaSummary
          resA={slotA!.result!}
          resB={slotB!.result!}
          nameA={slotA!.name}
          nameB={slotB!.name}
        />
      )}
    </div>
  );
}

// ── Slot Status Pip ────────────────────────────────────────────────────────────
function SlotStatusPip({ label, slot }: { label: string; slot: CompareSlot | null }) {
  const state = !slot ? 'empty' : slot.loading ? 'loading' : slot.result ? 'ready' : 'empty';
  return (
    <div className={`cp-pip cp-pip-${state}`}>
      <span className="cp-pip-label">TGT {label}</span>
      <span className="cp-pip-state">
        {state === 'empty' && '— AWAITING INPUT'}
        {state === 'loading' && '⬤ ANALYZING…'}
        {state === 'ready' && '✓ RESULT READY'}
      </span>
    </div>
  );
}

// ── Slot Card ─────────────────────────────────────────────────────────────────
interface CompareSlotCardProps {
  slotId: string;
  title: string;
  accentColor: string;
  slot: CompareSlot | null;
  onSelectFile: (file: File) => void;
  onSelectUrl: (url: string) => void;
}

function CompareSlotCard({ slotId, title, accentColor, slot, onSelectFile, onSelectUrl }: CompareSlotCardProps) {
  const [urlInput, setUrlInput] = useState('');
  const [showUrl, setShowUrl] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) onSelectFile(e.dataTransfer.files[0]);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) onSelectFile(e.target.files[0]);
  }

  function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (urlInput.trim()) { onSelectUrl(urlInput.trim()); setShowUrl(false); }
  }

  /* ── LOADING ── */
  if (slot?.loading) {
    return (
      <div className="cp-slot-card cp-slot-loading">
        <span className="cp-corner cp-tl" style={{ borderColor: accentColor }} />
        <span className="cp-corner cp-tr" style={{ borderColor: accentColor }} />
        <span className="cp-corner cp-bl" style={{ borderColor: accentColor }} />
        <span className="cp-corner cp-br" style={{ borderColor: accentColor }} />
        <div className="cp-scan-sweep" style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }} />
        <div className="cp-spinner" style={{ borderTopColor: accentColor }} />
        <p className="cp-loading-title">ANALYZING DUAL-STREAM FORENSICS</p>
        <p className="cp-loading-sub">TARGET {slotId}: {slot.name}</p>
      </div>
    );
  }

  /* ── RESULT ── */
  if (slot?.result) {
    const res = slot.result;
    const isAI = res.label.toLowerCase().includes('ai');
    const verdictColor = isAI ? 'var(--copper-ai)' : 'var(--teal-real)';

    return (
      <div className="cp-slot-card cp-slot-result">
        <span className="cp-corner cp-tl" style={{ borderColor: accentColor }} />
        <span className="cp-corner cp-tr" style={{ borderColor: accentColor }} />
        <span className="cp-corner cp-bl" style={{ borderColor: accentColor }} />
        <span className="cp-corner cp-br" style={{ borderColor: accentColor }} />

        {/* Card header */}
        <div className="cp-card-header" style={{ borderColor: `color-mix(in srgb, ${accentColor} 30%, transparent)` }}>
          <div className="cp-card-header-left">
            <ScanLine size={13} style={{ color: accentColor }} />
            <span className="cp-card-title">{title}</span>
          </div>
          <span className="cp-card-filename">{slot.name}</span>
        </div>

        {/* Heatmap */}
        <div className="cp-heatmap-wrap">
          <HeatmapCanvas
            previewUrl={slot.previewUrl}
            heatmapGrid={res.heatmap_grid}
            gridDimensions={res.grid_dimensions}
            validRoi={res.valid_roi}
          />
        </div>

        {/* Verdict banner */}
        <div className="cp-verdict-banner" style={{
          borderLeftColor: verdictColor,
          background: `color-mix(in srgb, ${verdictColor} 7%, transparent)`,
        }}>
          <div>
            <span className="cp-verdict-label">CLASSIFICATION</span>
            <div className="cp-verdict-value" style={{ color: verdictColor }}>{res.label}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="cp-verdict-label">CONFIDENCE</span>
            <div className="cp-verdict-value" style={{ color: verdictColor }}>
              {(res.confidence * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Suspected origin */}
        {res.suspected_generator && (
          <div className="cp-origin-row">
            <span className="cp-origin-label">
              <Cpu size={12} style={{ color: accentColor }} />
              Suspected Origin
            </span>
            <strong className="cp-origin-value">{res.suspected_generator}</strong>
          </div>
        )}

        {/* Metrics mini-table */}
        <div className="cp-metrics-table">
          {[
            { label: '2D Fourier Spectrum',   score: res.forensics?.fft_spectrum.score },
            { label: 'PRNU Sensor Residual',  score: res.forensics?.sensor_prnu.score },
            { label: 'ELA Compression Seams', score: res.forensics?.ela_compression.score },
            { label: 'Color Ch. Covariance',  score: res.forensics?.color_saturation.score },
          ].map(({ label, score }) => {
            const s = score ?? 50;
            const pct = s;
            return (
              <div key={label} className="cp-metric-row">
                <span className="cp-metric-label">{label}</span>
                <div className="cp-metric-bar-wrap">
                  <div
                    className="cp-metric-bar"
                    style={{
                      width: `${pct}%`,
                      background: s > 65 ? 'var(--copper-ai)' : s < 35 ? 'var(--teal-real)' : 'var(--ochre-uncertain)',
                    }}
                  />
                </div>
                <strong className="cp-metric-score">{s}/100</strong>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── EMPTY ── */
  return (
    <div
      className="cp-slot-card cp-slot-empty"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <span className="cp-corner cp-tl" style={{ borderColor: accentColor }} />
      <span className="cp-corner cp-tr" style={{ borderColor: accentColor }} />
      <span className="cp-corner cp-bl" style={{ borderColor: accentColor }} />
      <span className="cp-corner cp-br" style={{ borderColor: accentColor }} />

      {/* Slot ID badge */}
      <div className="cp-slot-id-badge" style={{ color: accentColor, borderColor: `color-mix(in srgb, ${accentColor} 35%, transparent)` }}>
        <Target size={16} />
        <span>TGT {slotId}</span>
      </div>

      <h3 className="cp-empty-title">{title}</h3>
      <p className="cp-empty-sub">Drag &amp; drop target image or choose an input source below</p>

      {!showUrl ? (
        <div className="cp-empty-actions">
          <label className="cp-input-btn" style={{ background: accentColor, borderColor: accentColor }}>
            <Upload size={13} />
            <span>Browse File</span>
            <input type="file" accept="image/*" onChange={handleFileChange} hidden />
          </label>
          <button
            type="button"
            onClick={() => setShowUrl(true)}
            className="cp-input-btn cp-input-btn-outline"
            style={{ borderColor: `color-mix(in srgb, ${accentColor} 50%, var(--border-line))`, color: accentColor }}
          >
            <Link2 size={13} />
            <span>Image URL</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleUrlSubmit} className="cp-url-form">
          <div className="cp-url-input-row">
            <Link2 size={14} className="cp-url-icon" style={{ color: accentColor }} />
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste image URL (https://…)"
              className="cp-url-field"
              autoFocus
            />
          </div>
          <div className="cp-url-actions">
            <button type="submit" className="cp-input-btn" style={{ background: accentColor, borderColor: accentColor }}>
              <ArrowRight size={13} />
              <span>Analyze</span>
            </button>
            <button type="button" onClick={() => setShowUrl(false)} className="cp-ghost-inline-btn">
              <X size={13} />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Delta Summary ──────────────────────────────────────────────────────────────
function ComparativeDeltaSummary({
  resA, resB, nameA, nameB,
}: { resA: PredictResult; resB: PredictResult; nameA: string; nameB: string }) {
  const probDiff  = Math.abs((resA.confidence - resB.confidence) * 100);
  const fftDiff   = (resA.forensics?.fft_spectrum.score ?? 50) - (resB.forensics?.fft_spectrum.score ?? 50);
  const prnuDiff  = (resA.forensics?.sensor_prnu.score ?? 50)  - (resB.forensics?.sensor_prnu.score ?? 50);

  const metrics = [
    {
      label: 'Confidence Delta',
      value: `${probDiff.toFixed(1)}%`,
      color: 'var(--ink-text)',
      desc: resA.label === resB.label ? 'Both targets yield matching verdict classifications' : 'Divergent verdict between target images',
    },
    {
      label: 'FFT Frequency Δ',
      value: `${fftDiff > 0 ? '+' : ''}${fftDiff} pts`,
      color: fftDiff > 0 ? 'var(--copper-ai)' : 'var(--teal-real)',
      desc: fftDiff > 0 ? `${nameA} shows higher high-freq grid spike anomaly` : `${nameB} shows higher high-freq grid anomaly`,
    },
    {
      label: 'PRNU Noise Δ',
      value: `${prnuDiff > 0 ? '+' : ''}${prnuDiff} pts`,
      color: prnuDiff < 0 ? 'var(--teal-real)' : 'var(--copper-ai)',
      desc: prnuDiff < 0 ? `${nameB} exhibits stronger optical camera sensor noise` : `${nameA} exhibits stronger optical camera sensor noise`,
    },
  ];

  return (
    <div className="cp-delta-card">
      <div className="cp-delta-header">
        <BarChart3 size={16} className="cp-delta-icon" />
        <span className="cp-delta-title">COMPARATIVE DIFFERENTIAL FORENSIC SUMMARY</span>
      </div>

      <div className="cp-delta-grid">
        {metrics.map(({ label, value, color, desc }) => (
          <div key={label} className="cp-delta-stat">
            <span className="cp-delta-label">{label}</span>
            <strong className="cp-delta-value" style={{ color }}>{value}</strong>
            <span className="cp-delta-desc">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
