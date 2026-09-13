'use client';

import { useState } from 'react';

import { Header }      from '@/components/Header';
import { Footer }      from '@/components/Footer';
import { UploadZone }  from '@/components/UploadZone';
import { LoadingState } from '@/components/LoadingState';
import { ResultPanel }  from '@/components/ResultPanel';
import { ErrorState }   from '@/components/ErrorState';

import type { AppState, PredictResult } from '@/lib/types';

// ─── Config ───────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

// ─── Page — state machine only ────────────────────────────────────────────────

export default function Home() {
  const [appState,   setAppState]   = useState<AppState>('idle');
  const [result,     setResult]     = useState<PredictResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName,   setFileName]   = useState('');
  const [errorMsg,   setErrorMsg]   = useState('');

  // ── Inference ──────────────────────────────────────────────────────────────
  async function analyzeFile(file: File) {
    // Create object URL for the preview before the async call
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
        setErrorMsg(`Cannot connect to inference API at ${API_BASE}. Please start the backend service: python services/inference-api/app.py`);
      } else {
        setErrorMsg(msg);
      }
      setAppState('error');
    }
  }

  // ── Validation error (from UploadZone) ────────────────────────────────────
  function handleValidationError(message: string) {
    setErrorMsg(message);
    setAppState('error');
  }

  // ── Reset ──────────────────────────────────────────────────────────────────
  function reset() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setAppState('idle');
    setResult(null);
    setPreviewUrl(null);
    setFileName('');
    setErrorMsg('');
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="app-shell">
      <Header />

      {appState === 'idle' && (
        <UploadZone onFile={analyzeFile} onError={handleValidationError} />
      )}

      {appState === 'loading' && (
        <LoadingState fileName={fileName} />
      )}

      {appState === 'result' && result && previewUrl && (
        <ResultPanel
          result={result}
          previewUrl={previewUrl}
          fileName={fileName}
          onReset={reset}
        />
      )}

      {appState === 'error' && (
        <ErrorState message={errorMsg} onRetry={reset} />
      )}

      <Footer />
    </div>
  );
}
