'use client';

import React, { useEffect, useRef } from 'react';

interface Props {
  heatmapGrid?: number[][];
  gridDimensions?: [number, number];
  validRoi?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0..1
  isAI?: boolean;
  viewMode?: 'optical' | 'heatmap' | 'ela';
  previewUrl: string;
}

export function HeatmapCanvas({
  heatmapGrid,
  gridDimensions,
  validRoi = [0, 0, 1, 1],
  isAI = true,
  viewMode = 'heatmap',
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
      const normVal = (data[i] / 255.0) * 2.0 - 1.0;

      if (viewMode === 'ela') {
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
        if (Math.abs(normVal) < 0.15) {
          data[i + 3] = 0;
          continue;
        }

        if (normVal > 0.15) {
          data[i] = Math.floor(220 * normVal);
          data[i + 1] = Math.floor(80 * normVal);
          data[i + 2] = 40;
          data[i + 3] = Math.min(220, Math.floor(normVal * 200 + 40));
        } else {
          data[i] = 20;
          data[i + 1] = Math.floor(180 * Math.abs(normVal));
          data[i + 2] = Math.floor(220 * Math.abs(normVal));
          data[i + 3] = Math.min(200, Math.floor(Math.abs(normVal) * 180 + 30));
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [heatmapGrid, gridDimensions, isAI, viewMode]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <img
        src={previewUrl}
        alt="Forensic Viewfinder Preview"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
      {viewMode !== 'optical' && (
        <canvas
          ref={canvasRef}
          width={512}
          height={512}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}
