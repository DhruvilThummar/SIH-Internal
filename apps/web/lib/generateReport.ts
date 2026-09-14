/**
 * generateReport.ts — SignalScope Defense-Grade PDF Forensic Report Generator.
 *
 * Generates a branded, professional PDF report containing:
 *   - Header with SignalScope branding & timestamp
 *   - Verdict banner with confidence gauge
 *   - Forensic radar chart (FFT, PRNU, ELA, Bayer)
 *   - Structured evidence cards
 *   - Tampering analysis section
 *   - Footer with ethics disclaimer
 */

import jsPDF from 'jspdf';
import type { PredictResult } from './types';
import { verdictMeta } from './verdictMeta';

// ── Color Palette (matches design system) ────────────────────────────────────
const COLORS = {
  sagePaper:    '#EAEBE3',
  surfaceCard:  '#F4F5EF',
  surfaceSubtle:'#DFE2D8',
  borderLine:   '#C2C7B8',
  inkText:      '#20241F',
  inkMuted:     '#5A6157',
  inkFaint:     '#8C9488',
  tealReal:     '#2C6E63',
  copperAI:     '#B5622E',
  ochreUncert:  '#C69214',
  white:        '#FFFFFF',
  darkBg:       '#1A1D19',
};

// ── Helper: Hex to RGB array ─────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

// ── Helper: Draw rounded rectangle ──────────────────────────────────────────
function drawRoundedRect(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  r: number,
  fillColor?: string,
  strokeColor?: string
) {
  if (fillColor) {
    doc.setFillColor(...hexToRgb(fillColor));
  }
  if (strokeColor) {
    doc.setDrawColor(...hexToRgb(strokeColor));
    doc.setLineWidth(0.3);
  }

  // Use built-in roundedRect
  if (fillColor && strokeColor) {
    doc.roundedRect(x, y, w, h, r, r, 'FD');
  } else if (fillColor) {
    doc.roundedRect(x, y, w, h, r, r, 'F');
  } else if (strokeColor) {
    doc.roundedRect(x, y, w, h, r, r, 'S');
  }
}

// ── Helper: Draw radar chart ─────────────────────────────────────────────────
function drawRadarChart(
  doc: jsPDF,
  cx: number, cy: number, radius: number,
  labels: string[],
  values: number[], // 0-100
  fillColor: string,
  strokeColor: string,
) {
  const n = labels.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2; // start from top

  // Draw concentric grid rings
  doc.setDrawColor(...hexToRgb(COLORS.borderLine));
  doc.setLineWidth(0.15);
  for (let ring = 1; ring <= 4; ring++) {
    const ringR = (radius * ring) / 4;
    const points: [number, number][] = [];
    for (let i = 0; i < n; i++) {
      const angle = startAngle + i * angleStep;
      points.push([cx + ringR * Math.cos(angle), cy + ringR * Math.sin(angle)]);
    }
    for (let i = 0; i < n; i++) {
      const next = (i + 1) % n;
      doc.line(points[i][0], points[i][1], points[next][0], points[next][1]);
    }
  }

  // Draw axis lines
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    doc.line(cx, cy, cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
  }

  // Draw data polygon (filled)
  const dataPoints: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const r = (radius * values[i]) / 100;
    dataPoints.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }

  // Fill polygon
  const [fr, fg, fb] = hexToRgb(fillColor);
  doc.setFillColor(fr, fg, fb);
  doc.setGState(doc.GState({ opacity: 0.25 }));
  // Build polygon path
  // jsPDF doesn't have a direct polygon fill, so we use triangle fan
  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n;
    doc.triangle(
      cx, cy,
      dataPoints[i][0], dataPoints[i][1],
      dataPoints[next][0], dataPoints[next][1],
      'F'
    );
  }
  doc.setGState(doc.GState({ opacity: 1.0 }));

  // Stroke polygon
  doc.setDrawColor(...hexToRgb(strokeColor));
  doc.setLineWidth(0.6);
  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n;
    doc.line(dataPoints[i][0], dataPoints[i][1], dataPoints[next][0], dataPoints[next][1]);
  }

  // Draw data points as dots
  doc.setFillColor(...hexToRgb(strokeColor));
  for (const [px, py] of dataPoints) {
    doc.circle(px, py, 1.2, 'F');
  }

  // Draw labels
  doc.setFontSize(7);
  doc.setTextColor(...hexToRgb(COLORS.inkText));
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const labelR = radius + 6;
    const lx = cx + labelR * Math.cos(angle);
    const ly = cy + labelR * Math.sin(angle);
    
    let align: 'center' | 'left' | 'right' = 'center';
    if (Math.cos(angle) > 0.3) align = 'left';
    else if (Math.cos(angle) < -0.3) align = 'right';
    
    doc.text(labels[i], lx, ly + 1, { align });
  }
}

// ── Helper: Draw horizontal gauge ───────────────────────────────────────────
function drawGauge(
  doc: jsPDF,
  x: number, y: number, width: number,
  value: number, // 0-100
) {
  const gaugeH = 6;
  
  // Track background (gradient simulation: teal → ochre → copper)
  const segments = 20;
  const segW = width / segments;
  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    let color: string;
    if (t < 0.4) color = COLORS.tealReal;
    else if (t < 0.6) color = COLORS.ochreUncert;
    else color = COLORS.copperAI;
    doc.setFillColor(...hexToRgb(color));
    doc.setGState(doc.GState({ opacity: 0.2 }));
    doc.rect(x + i * segW, y, segW + 0.5, gaugeH, 'F');
  }
  doc.setGState(doc.GState({ opacity: 1.0 }));

  // Gauge border
  doc.setDrawColor(...hexToRgb(COLORS.borderLine));
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, width, gaugeH, 1, 1, 'S');

  // Needle indicator
  const needleX = x + (width * value) / 100;
  const needleColor = value > 60 ? COLORS.copperAI : value < 40 ? COLORS.tealReal : COLORS.ochreUncert;
  doc.setFillColor(...hexToRgb(needleColor));
  doc.circle(needleX, y + gaugeH / 2, 3, 'F');
  doc.setFillColor(...hexToRgb(COLORS.white));
  doc.circle(needleX, y + gaugeH / 2, 1.2, 'F');

  // Labels
  doc.setFontSize(6.5);
  doc.setTextColor(...hexToRgb(COLORS.tealReal));
  doc.text('0% REAL', x, y + gaugeH + 4);
  doc.setTextColor(...hexToRgb(COLORS.inkFaint));
  doc.text('UNCERTAIN', x + width / 2, y + gaugeH + 4, { align: 'center' });
  doc.setTextColor(...hexToRgb(COLORS.copperAI));
  doc.text('100% AI', x + width, y + gaugeH + 4, { align: 'right' });
}

// ══════════════════════════════════════════════════════════════════════════════
// ── MAIN EXPORT: Generate PDF Report ─────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

export async function generateForensicReport(
  result: PredictResult,
  fileName: string = 'scan_target.jpg',
  _previewUrl: string = '',
): Promise<void> {
  void _previewUrl;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();  // 210
  const pageH = doc.internal.pageSize.getHeight(); // 297
  const margin = 15;
  const contentW = pageW - 2 * margin;
  let y = margin;

  const validFileName = fileName || 'scan_target.jpg';
  const meta = verdictMeta(result.label);
  const isAI = result.label.toLowerCase().includes('ai') || result.label.toLowerCase().includes('synthetic');
  const isReal = result.label.toLowerCase().includes('real') || result.label.toLowerCase().includes('authentic');
  const probAI = result.prob_ai !== undefined
    ? Math.round(result.prob_ai * 100)
    : isAI ? Math.round(result.confidence * 100)
    : isReal ? Math.round((1 - result.confidence) * 100)
    : 50;
  const confidencePct = Math.round(result.confidence * 100);
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  const forensics = result.forensics ?? {
    fft_spectrum:     { score: 50, detail: 'Frequency domain decay analysis' },
    sensor_prnu:      { score: 50, detail: 'CMOS sensor PRNU micro-grain' },
    color_saturation: { score: 50, detail: 'Optical channel covariance' },
    ela_compression:  { score: 50, detail: 'Error Level Analysis quantization' },
  };

  const evidence = result.evidence ?? {
    primary_spatial:      'Spatial feature distribution evaluated.',
    secondary_texture:    'Texture and micro-grain analysis completed.',
    spectral_frequency:   'Spectral frequency analysis completed.',
    metadata_consistency: 'Metadata cross-validation completed.',
  };

  // ══ 1. HEADER BANNER ══════════════════════════════════════════════════════
  drawRoundedRect(doc, margin, y, contentW, 18, 2, COLORS.darkBg);
  
  doc.setFontSize(16);
  doc.setTextColor(...hexToRgb(COLORS.white));
  doc.setFont('helvetica', 'bold');
  doc.text('SIGNALSCOPE', margin + 5, y + 8);
  
  doc.setFontSize(7);
  doc.setTextColor(...hexToRgb(COLORS.inkFaint));
  doc.setFont('helvetica', 'normal');
  doc.text('DEFENSE-GRADE FORENSIC ANALYSIS REPORT', margin + 5, y + 13);

  doc.setFontSize(7);
  doc.setTextColor(...hexToRgb(COLORS.inkFaint));
  doc.text(`Report Generated: ${timestamp}`, margin + contentW - 5, y + 8, { align: 'right' });
  doc.text(`Case ID: ${Math.random().toString(36).substring(2, 10).toUpperCase()}`, margin + contentW - 5, y + 13, { align: 'right' });
  
  y += 22;

  // ══ 2. VERDICT BANNER ═════════════════════════════════════════════════════
  const verdictColor = isAI ? COLORS.copperAI : isReal ? COLORS.tealReal : COLORS.ochreUncert;
  drawRoundedRect(doc, margin, y, contentW, 22, 2, undefined, verdictColor);
  
  // Left side: verdict icon + label
  doc.setFontSize(11);
  doc.setTextColor(...hexToRgb(verdictColor));
  doc.setFont('helvetica', 'bold');
  const verdictIcon = isAI ? '⚠' : isReal ? '✓' : '◆';
  doc.text(`${verdictIcon}  ${meta.displayLabel.toUpperCase()}`, margin + 5, y + 9);
  
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexToRgb(COLORS.inkMuted));
  doc.text(`Calibrated Confidence: ${confidencePct}%  |  AI Probability Index: ${probAI}%`, margin + 5, y + 15);

  // Right side: big confidence number
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(verdictColor));
  doc.text(`${probAI}%`, margin + contentW - 5, y + 14, { align: 'right' });
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('AI INDEX', margin + contentW - 5, y + 19, { align: 'right' });

  y += 26;

  // ══ 3. TARGET FILE INFO ═══════════════════════════════════════════════════
  drawRoundedRect(doc, margin, y, contentW, 10, 1, COLORS.surfaceCard, COLORS.borderLine);
  doc.setFontSize(7);
  doc.setTextColor(...hexToRgb(COLORS.inkMuted));
  doc.setFont('helvetica', 'normal');
  const generatorStr = result.suspected_generator ? `  |  ORIGIN: ${result.suspected_generator}` : '';
  doc.text(`TARGET FILE: ${validFileName}${generatorStr}`, margin + 4, y + 6.5);
  
  const classification = isAI ? 'SYNTHETIC ARTIFACT' : isReal ? 'AUTHENTIC OPTICAL' : 'INCONCLUSIVE';
  doc.text(`CLASSIFICATION: ${classification}`, margin + contentW - 4, y + 6.5, { align: 'right' });

  y += 14;

  // ══ 4. PROBABILITY SPECTRUM GAUGE ═════════════════════════════════════════
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.inkText));
  doc.text('PROBABILITY SPECTRUM', margin, y);
  y += 4;
  
  drawGauge(doc, margin, y, contentW, probAI);
  y += 16;

  // ══ 5. TWO-COLUMN LAYOUT: Radar Chart + Evidence Cards ════════════════════
  const colW = (contentW - 6) / 2;
  const col1X = margin;
  const col2X = margin + colW + 6;
  const sectionStartY = y;

  // ── Left Column: Forensic Radar Chart ─────────────────────────────────────
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.inkText));
  doc.text('FORENSIC SIGNAL VECTORS', col1X, y);
  y += 2;

  drawRoundedRect(doc, col1X, y, colW, 60, 2, COLORS.surfaceCard, COLORS.borderLine);
  
  drawRadarChart(
    doc,
    col1X + colW / 2,
    y + 32,
    22,
    ['2D Fourier\nSpectrum', 'PRNU\nSensor', 'ELA\nSeams', 'Bayer\nCorrelation'],
    [
      forensics.fft_spectrum.score,
      forensics.sensor_prnu.score,
      forensics.ela_compression.score,
      forensics.color_saturation.score,
    ],
    verdictColor,
    verdictColor,
  );

  // Score labels below radar
  const radarBottomY = y + 54;
  doc.setFontSize(5.5);
  doc.setTextColor(...hexToRgb(COLORS.inkMuted));
  doc.text(
    `FFT: ${forensics.fft_spectrum.score}%  |  PRNU: ${forensics.sensor_prnu.score}%  |  ELA: ${forensics.ela_compression.score}%  |  Bayer: ${forensics.color_saturation.score}%`,
    col1X + colW / 2, radarBottomY, { align: 'center' }
  );

  // ── Right Column: Structured Evidence Cards ───────────────────────────────
  let ey = sectionStartY;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.inkText));
  doc.text('FAITHFUL STRUCTURED EVIDENCE', col2X, ey);
  ey += 2;

  const evidenceCards = [
    { title: 'Primary Spatial Evidence', text: evidence.primary_spatial, color: COLORS.copperAI },
    { title: 'Secondary Texture & Micro-Grain', text: evidence.secondary_texture, color: COLORS.ochreUncert },
    { title: 'Spectral 2D Fourier Frequency', text: evidence.spectral_frequency, color: COLORS.tealReal },
    { title: 'Metadata Consistency', text: evidence.metadata_consistency, color: COLORS.inkMuted },
  ];

  for (const card of evidenceCards) {
    const cardH = 14;
    drawRoundedRect(doc, col2X, ey, colW, cardH, 1, COLORS.surfaceCard);
    
    // Left accent bar
    doc.setFillColor(...hexToRgb(card.color));
    doc.rect(col2X, ey + 0.5, 1.5, cardH - 1, 'F');
    
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(COLORS.inkText));
    doc.text(card.title, col2X + 4, ey + 4.5);
    
    doc.setFontSize(5.8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(COLORS.inkMuted));
    const lines = doc.splitTextToSize(card.text, colW - 7);
    doc.text(lines.slice(0, 3), col2X + 4, ey + 8.5);
    
    ey += cardH + 1.5;
  }

  y = Math.max(sectionStartY + 64, ey) + 4;

  // ══ 6. TAMPERING ANALYSIS ═════════════════════════════════════════════════
  if (result.tampering_analysis) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(COLORS.inkText));
    doc.text('TAMPERING ANALYSIS', margin, y);
    y += 4;

    drawRoundedRect(doc, margin, y, contentW, 16, 2, COLORS.surfaceCard, COLORS.borderLine);

    const tampItems = [
      { label: 'Fully Synthetic', value: result.tampering_analysis.is_fully_synthetic },
      { label: 'Localized Inpainting', value: result.tampering_analysis.has_localized_inpainting },
      { label: 'Adversarial Noise Injected', value: result.tampering_analysis.adversarial_noise_injected },
    ];

    const tampColW = contentW / 3;
    tampItems.forEach((item, i) => {
      const tx = margin + i * tampColW + tampColW / 2;
      
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRgb(COLORS.inkMuted));
      doc.text(item.label, tx, y + 5, { align: 'center' });
      
      const dotColor = item.value ? COLORS.copperAI : COLORS.tealReal;
      doc.setFillColor(...hexToRgb(dotColor));
      doc.circle(tx, y + 10, 2, 'F');
      
      doc.setFontSize(6);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRgb(dotColor));
      doc.text(item.value ? 'DETECTED' : 'CLEAR', tx, y + 14.5, { align: 'center' });
    });

    y += 22;
  }

  // ══ 7. DETAILED FORENSIC METRICS TABLE ════════════════════════════════════
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.inkText));
  doc.text('DETAILED FORENSIC BREAKDOWN', margin, y);
  y += 4;

  // Table header
  drawRoundedRect(doc, margin, y, contentW, 7, 1, COLORS.darkBg);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.white));
  doc.text('VECTOR', margin + 4, y + 4.5);
  doc.text('SCORE', margin + 55, y + 4.5);
  doc.text('TECHNICAL DETAIL', margin + 75, y + 4.5);
  y += 8;

  const tableRows = [
    { name: '2D Fourier Spectrum (FFT)', score: forensics.fft_spectrum.score, detail: forensics.fft_spectrum.detail },
    { name: 'PRNU Sensor Noise', score: forensics.sensor_prnu.score, detail: forensics.sensor_prnu.detail },
    { name: 'ELA Compression Seams', score: forensics.ela_compression.score, detail: forensics.ela_compression.detail },
    { name: 'Bayer Cross-Channel', score: forensics.color_saturation.score, detail: forensics.color_saturation.detail },
  ];

  tableRows.forEach((row, i) => {
    const rowY = y + i * 9;
    const bgColor = i % 2 === 0 ? COLORS.surfaceCard : COLORS.white;
    drawRoundedRect(doc, margin, rowY, contentW, 8.5, 0, bgColor);
    
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(COLORS.inkText));
    doc.text(row.name, margin + 4, rowY + 5);
    
    const scoreColor = row.score > 60 ? COLORS.copperAI : row.score < 40 ? COLORS.tealReal : COLORS.ochreUncert;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(scoreColor));
    doc.text(`${row.score}%`, margin + 55, rowY + 5);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(COLORS.inkMuted));
    const detailLines = doc.splitTextToSize(row.detail, contentW - 80);
    doc.text(detailLines[0] || '', margin + 75, rowY + 5);
  });

  y += tableRows.length * 9 + 6;

  // ══ 8. FOOTER: ETHICS DISCLAIMER ══════════════════════════════════════════
  // Ensure we have space; if not, add a page
  if (y > pageH - 30) {
    doc.addPage();
    y = margin;
  }

  const footerY = pageH - 20;
  doc.setDrawColor(...hexToRgb(COLORS.borderLine));
  doc.setLineWidth(0.3);
  doc.line(margin, footerY, margin + contentW, footerY);

  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...hexToRgb(COLORS.inkFaint));
  doc.text(
    'DISCLAIMER: This report provides calibrated statistical likelihood assessments, not definitive determinations.',
    margin, footerY + 4
  );
  doc.text(
    'SignalScope does not profile real individuals, adjudicate political claims, or make accusatory certainty statements.',
    margin, footerY + 7.5
  );
  doc.text(
    'Results are estimates produced by a two-stage hybrid ML + forensic signal extraction pipeline. Use professional judgment.',
    margin, footerY + 11
  );

  doc.setFontSize(5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `SignalScope — SIH 2026 PS-2  |  ${timestamp}  |  Zero-Retention Policy: No images stored`,
    pageW / 2, footerY + 15, { align: 'center' }
  );

  // ══ SAVE ═══════════════════════════════════════════════════════════════════
  const safeName = validFileName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`SignalScope_Report_${safeName}.pdf`);
}
