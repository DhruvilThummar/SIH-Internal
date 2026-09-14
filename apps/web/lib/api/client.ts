// Typed API fetch client for SignalScope backend endpoints.

import type { PredictResult } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export async function analyzeImageFile(file: File): Promise<PredictResult> {
  const form = new FormData();
  form.append('image', file);

  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Inference failed with status ${res.status}`);
  }

  return (await res.json()) as PredictResult;
}

export async function analyzeImageUrl(url: string): Promise<PredictResult> {
  const res = await fetch(`${API_BASE}/predict-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `URL analysis failed with status ${res.status}`);
  }

  return (await res.json()) as PredictResult;
}

export async function checkBackendHealth(): Promise<{ status: string; model_loaded: boolean }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) {
    throw new Error(`Health check failed with status ${res.status}`);
  }
  return res.json();
}
