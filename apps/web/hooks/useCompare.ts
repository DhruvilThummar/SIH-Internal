// Custom hook managing side-by-side dual image comparison state.

import { useState } from 'react';
import type { PredictResult } from '../lib/types';
import { analyzeImageFile, analyzeImageUrl } from '../lib/api/client';

export interface CompareSlot {
  file?: File;
  url?: string;
  previewUrl: string;
  name: string;
  result?: PredictResult;
  loading: boolean;
  error?: string;
}

export function useCompare() {
  const [slotA, setSlotA] = useState<CompareSlot | null>(null);
  const [slotB, setSlotB] = useState<CompareSlot | null>(null);

  async function setAndAnalyzeSlotA(input: File | string) {
    let preview: string;
    let name: string;
    if (typeof input === 'string') {
      preview = input;
      name = input.split('/').pop() || 'Remote Image A';
    } else {
      preview = URL.createObjectURL(input);
      name = input.name;
    }

    setSlotA({ previewUrl: preview, name, loading: true });

    try {
      const res = typeof input === 'string' 
        ? await analyzeImageUrl(input) 
        : await analyzeImageFile(input);
      setSlotA({ previewUrl: preview, name, result: res, loading: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setSlotA({ previewUrl: preview, name, loading: false, error: msg });
    }
  }

  async function setAndAnalyzeSlotB(input: File | string) {
    let preview: string;
    let name: string;
    if (typeof input === 'string') {
      preview = input;
      name = input.split('/').pop() || 'Remote Image B';
    } else {
      preview = URL.createObjectURL(input);
      name = input.name;
    }

    setSlotB({ previewUrl: preview, name, loading: true });

    try {
      const res = typeof input === 'string' 
        ? await analyzeImageUrl(input) 
        : await analyzeImageFile(input);
      setSlotB({ previewUrl: preview, name, result: res, loading: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setSlotB({ previewUrl: preview, name, loading: false, error: msg });
    }
  }

  function resetCompare() {
    if (slotA?.previewUrl.startsWith('blob:')) URL.revokeObjectURL(slotA.previewUrl);
    if (slotB?.previewUrl.startsWith('blob:')) URL.revokeObjectURL(slotB.previewUrl);
    setSlotA(null);
    setSlotB(null);
  }

  return {
    slotA,
    slotB,
    setAndAnalyzeSlotA,
    setAndAnalyzeSlotB,
    resetCompare,
  };
}
