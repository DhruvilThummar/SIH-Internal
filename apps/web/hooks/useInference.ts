// Custom hook managing single image / URL inference state and execution.

import { useState } from 'react';
import type { AppState, PredictResult } from '../lib/types';
import { analyzeImageFile, analyzeImageUrl } from '../lib/api/client';

export function useInference() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [result, setResult] = useState<PredictResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function runFileInference(file: File) {
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setFileName(file.name);
    setAppState('loading');

    try {
      const res = await analyzeImageFile(file);
      setResult(res);
      setAppState('result');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErrorMsg(msg);
      setAppState('error');
    }
  }

  async function runUrlInference(url: string) {
    setPreviewUrl(url);
    setFileName(url.split('/').pop() || 'remote-image.jpg');
    setAppState('loading');

    try {
      const res = await analyzeImageUrl(url);
      setResult(res);
      setAppState('result');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErrorMsg(msg);
      setAppState('error');
    }
  }

  function reset() {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setAppState('idle');
    setResult(null);
    setPreviewUrl(null);
    setFileName('');
    setErrorMsg('');
  }

  return {
    appState,
    setAppState,
    result,
    previewUrl,
    fileName,
    errorMsg,
    runFileInference,
    runUrlInference,
    reset,
  };
}
