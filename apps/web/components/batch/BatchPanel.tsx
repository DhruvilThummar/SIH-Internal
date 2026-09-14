'use client';

import React, { useState, useEffect } from 'react';
import { Layers, FileDown, RotateCcw, CheckCircle2, AlertTriangle, ShieldCheck, Loader2, ArrowLeft, Download } from 'lucide-react';
import type { PredictResult } from '../../lib/types';
import { verdictMeta } from '../../lib/verdictMeta';
import { generateForensicReport } from '../../lib/generateReport';
import { analyzeImageFile } from '../../lib/api/client';

export interface BatchItem {
  id: string;
  file: File;
  previewUrl: string;
  status: 'queued' | 'processing' | 'done' | 'error';
  result?: PredictResult;
  error?: string;
}

interface Props {
  initialFiles: File[];
  onBack: () => void;
  onSelectSingleResult: (item: BatchItem) => void;
}

export function BatchPanel({ initialFiles, onBack, onSelectSingleResult }: Props) {
  const [items, setItems] = useState<BatchItem[]>(() =>
    initialFiles.map((file, idx) => ({
      id: `${file.name}-${idx}-${Date.now()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'queued',
    }))
  );

  useEffect(() => {
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function processQueue() {
      for (let i = 0; i < items.length; i++) {
        if (cancelled) break;
        const current = items[i];

        if (current.status === 'queued') {
          setItems((prev) =>
            prev.map((item, idx) => (idx === i ? { ...item, status: 'processing' } : item))
          );

          try {
            const data = await analyzeImageFile(current.file);

            if (!cancelled) {
              setItems((prev) =>
                prev.map((item, idx) =>
                  idx === i ? { ...item, status: 'done', result: data } : item
                )
              );
            }
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            if (!cancelled) {
              setItems((prev) =>
                prev.map((item, idx) =>
                  idx === i
                    ? { ...item, status: 'error', error: msg }
                    : item
                )
              );
            }
          }
        }
      }
    }

    processQueue();

    return () => {
      cancelled = true;
    };
  }, [items.length]);

  const doneItems = items.filter((i) => i.status === 'done');
  const aiCount = doneItems.filter(
    (i) => i.result && i.result.label.toLowerCase().includes('ai')
  ).length;
  const realCount = doneItems.filter(
    (i) => i.result && i.result.label.toLowerCase().includes('real')
  ).length;

  function exportBatchCsv() {
    const csvRows = [
      ['Filename', 'Verdict', 'Calibrated Confidence (%)', 'Suspected Generator', 'FFT Score', 'PRNU Score'].join(','),
      ...doneItems.map((item) => {
        const res = item.result!;
        return [
          `"${item.file.name}"`,
          `"${res.label}"`,
          (res.confidence * 100).toFixed(1),
          `"${res.suspected_generator ?? 'Unknown'}"`,
          res.forensics?.fft_spectrum.score ?? 50,
          res.forensics?.sensor_prnu.score ?? 50,
        ].join(',');
      }),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SignalScope_Batch_Audit_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="batch-panel-container">
      <div className="batch-header-bar">
        <button onClick={onBack} className="btn-secondary btn-icon-label">
          <ArrowLeft size={16} />
          <span>Exit Batch Mode</span>
        </button>
        <div className="batch-header-title">
          <Layers size={18} className="text-sage" />
          <h2>Batch Optical Inspection ({items.length} Targets)</h2>
        </div>
        <button
          onClick={exportBatchCsv}
          disabled={doneItems.length === 0}
          className="btn-primary btn-icon-label"
        >
          <Download size={15} />
          <span>Export Audit CSV</span>
        </button>
      </div>

      <div className="batch-stats-summary">
        <div className="batch-stat-card">
          <span className="stat-label">TOTAL QUEUED</span>
          <span className="stat-value">{items.length}</span>
        </div>
        <div className="batch-stat-card">
          <span className="stat-label">PROCESSED</span>
          <span className="stat-value text-sage">{doneItems.length} / {items.length}</span>
        </div>
        <div className="batch-stat-card">
          <span className="stat-label">SYNTHETIC (AI)</span>
          <span className="stat-value text-warn">{aiCount}</span>
        </div>
        <div className="batch-stat-card">
          <span className="stat-label">AUTHENTIC (REAL)</span>
          <span className="stat-value text-sage">{realCount}</span>
        </div>
      </div>

      <div className="batch-table-wrapper">
        <table className="batch-table">
          <thead>
            <tr>
              <th>Target Image</th>
              <th>Status</th>
              <th>Verdict</th>
              <th>Confidence</th>
              <th>Origin Estimate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const meta = item.result ? verdictMeta(item.result.label) : null;
              return (
                <tr key={item.id} className="batch-row">
                  <td className="batch-cell-filename">
                    <img src={item.previewUrl} alt="" className="batch-thumb" />
                    <span>{item.file.name}</span>
                  </td>
                  <td>
                    {item.status === 'queued' && <span className="batch-badge status-queued">Queued</span>}
                    {item.status === 'processing' && <span className="batch-badge status-proc"><Loader2 size={12} className="spin" /> Scanning</span>}
                    {item.status === 'done' && <span className="batch-badge status-done"><CheckCircle2 size={12} /> Done</span>}
                    {item.status === 'error' && <span className="batch-badge status-err">Error</span>}
                  </td>
                  <td>
                    {meta ? (
                      <span className="verdict-tag" style={{ color: meta.color, borderColor: meta.color }}>
                        {meta.displayLabel}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="font-mono-data">
                    {item.result ? `${(item.result.confidence * 100).toFixed(1)}%` : '—'}
                  </td>
                  <td className="font-mono-data">
                    {item.result?.suspected_generator ?? '—'}
                  </td>
                  <td>
                    {item.result && (
                      <button
                        onClick={() => onSelectSingleResult(item)}
                        className="btn-ghost btn-sm"
                      >
                        Inspect Viewfinder
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
