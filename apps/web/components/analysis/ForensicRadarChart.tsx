'use client';

import React from 'react';

interface Props {
  scores: {
    fft: number;       // 0-100
    prnu: number;      // 0-100
    ela: number;       // 0-100
    bayer: number;     // 0-100
  };
  verdictColor: string; // CSS color string (var(--copper-ai) etc)
}

export function ForensicRadarChart({ scores, verdictColor }: Props) {
  const size = 180;
  const center = size / 2;
  const radius = 60;

  const axes = [
    { label: '2D Fourier', value: scores.fft },
    { label: 'PRNU Sensor', value: scores.prnu },
    { label: 'ELA Seams', value: scores.ela },
    { label: 'Bayer Corr', value: scores.bayer },
  ];

  const n = axes.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2; // Top

  // Calculate vertex points for data polygon
  const polygonPoints = axes.map((axis, i) => {
    const angle = startAngle + i * angleStep;
    const r = (radius * Math.min(100, Math.max(0, axis.value))) / 100;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  // Concentric grid rings (25%, 50%, 75%, 100%)
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0.4rem 0' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Concentric Grid Rings */}
        {rings.map((ringScale, idx) => {
          const ringPoints = axes.map((_, i) => {
            const angle = startAngle + i * angleStep;
            const r = radius * ringScale;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(' ');

          return (
            <polygon
              key={idx}
              points={ringPoints}
              fill="none"
              stroke="var(--border-line)"
              strokeWidth={idx === 3 ? "1.2" : "0.6"}
              strokeDasharray={idx < 3 ? "2 2" : undefined}
              opacity={0.6}
            />
          );
        })}

        {/* Axis Lines */}
        {axes.map((_, i) => {
          const angle = startAngle + i * angleStep;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="var(--border-line)"
              strokeWidth="0.8"
              opacity={0.5}
            />
          );
        })}

        {/* Data Polygon Fill */}
        <polygon
          points={polygonPoints}
          fill={verdictColor}
          fillOpacity={0.22}
          stroke={verdictColor}
          strokeWidth="1.8"
        />

        {/* Vertex Dots & Score Badges */}
        {axes.map((axis, i) => {
          const angle = startAngle + i * angleStep;
          const r = (radius * Math.min(100, Math.max(0, axis.value))) / 100;
          const cx = center + r * Math.cos(angle);
          const cy = center + r * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="3.5"
              fill={verdictColor}
              stroke="#fff"
              strokeWidth="1"
            />
          );
        })}
      </svg>
    </div>
  );
}
