'use client';

import React, { useEffect, useRef } from 'react';

interface Props {
  heatmapGrid?: number[][];
  gridDimensions?: [number, number];
  validRoi?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0..1
  isAI: boolean;
  viewMode: 'optical' | 'heatmap' | 'ela';
  previewUrl: string;
}

// Turbo Colormap LUT Approximation
function turboColorMap(val: number): [number, number, number] {
  const v = Math.min(1.0, Math.max(0.0, val));
  const r = Math.floor(255 * Math.sin(v * Math.PI * 0.9));
  const g = Math.floor(255 * Math.sin(v * Math.PI * 0.8 + 0.3));
  const b = Math.floor(255 * Math.cos(v * Math.PI * 0.7));
  return [Math.max(0, r), Math.max(0, g), Math.max(0, b)];
}

export function HeatmapCanvas({
  heatmapGrid,
  gridDimensions,
  validRoi = [0, 0, 1, 1],
  isAI,
  viewMode,
  previewUrl,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (viewMode === 'optical' || !canvasRef.current || !heatmapGrid || !heatmapGrid.length) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gh = gridDimensions ? gridDimensions[0] : heatmapGrid.length;
    const gw = gridDimensions ? gridDimensions[1] : heatmapGrid[0].length;

    // 1. Off-screen scalar canvas
    const offscreen = document.createElement('canvas');
    offscreen.width = gw;
    offscreen.height = gh;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    const scalarData = offCtx.createImageData(gw, gh);
    let idx = 0;
    for (let r = 0; r < gh; r++) {
      for (let c = 0; c < gw; c++) {
        const val = heatmapGrid[r] ? heatmapGrid[r][c] || 0.0 : 0.0;
        // Map [-1.0, 1.0] to [0, 255] scalar byte
        const u8 = Math.floor(((val + 1.0) / 2.0) * 255);
        scalarData.data[idx] = u8;
        scalarData.data[idx + 1] = u8;
        scalarData.data[idx + 2] = u8;
        scalarData.data[idx + 3] = 255;
        idx += 4;
      }
    }
    offCtx.putImageData(scalarData, 0, 0);

    // 2. Draw scaled scalar onto target canvas
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(offscreen, 0, 0, gw, gh, 0, 0, w, h);

    // 3. Per-Pixel Zero-Point Bipolar LUT Mapping
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const normVal = (data[i] / 255.0) * 2.0 - 1.0; // Back to [-1.0, 1.0]

      if (viewMode === 'ela') {
        // ELA Seam View: Highlight high error contrast in glowing violet-pink
        const intensity = Math.abs(normVal);
        if (intensity < 0.15) {
          data[i + 3] = 0;
          continue;
        }
        data[i] = Math.floor(intensity * 255);
        data[i + 1] = Math.floor(intensity * 60);
        data[i + 2] = Math.floor(intensity * 200);
        data[i + 3] = Math.min(230, Math.floor(intensity * 180));
      } else {
        // AI Spatial Attribution View: Bipolar Turbo / Cyan-Blue
        if (Math.abs(normVal) < 0.15) {
          data[i + 3] = 0; // Alpha clipping neutral zone
          continue;
        }

        if (normVal > 0.15) {
          // AI Glitch -> Turbo Palette (Red-Yellow)
          const [r, g, b] = turboColorMap(normVal);
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = Math.min(230, Math.floor(normVal * 175));
        } else {
          // Authentic Detail -> Cyan-Blue Palette
          const absVal = Math.abs(normVal);
          data[i] = Math.floor(absVal * 30);
          data[i + 1] = Math.floor(absVal * 180);
          data[i + 2] = Math.floor(absVal * 255);
          data[i + 3] = Math.min(230, Math.floor(absVal * 160));
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }, [heatmapGrid, gridDimensions, isAI, viewMode]);

  const [ymin, xmin, ymax, xmax] = validRoi;
  const topPct = `${ymin * 100}%`;
  const leftPct = `${xmin * 100}%`;
  const widthPct = `${(xmax - xmin) * 100}%`;
  const heightPct = `${(ymax - ymin) * 100}%`;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={previewUrl}
        alt="Analyzed target preview"
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
      />

      {viewMode !== 'optical' && (
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          style={{
            position: 'absolute',
            top: topPct,
            left: leftPct,
            width: widthPct,
            height: heightPct,
            pointerEvents: 'none',
            mixBlendMode: 'screen',
            transition: 'opacity 0.25s ease-in-out',
          }}
        />
      )}
    </div>
  );
}
