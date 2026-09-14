'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  UploadCloud, ScanLine, Link2, FileUp, FolderOpen,
  Lock, Shield, Crosshair, Zap,
} from 'lucide-react';
import { UrlInput } from './UrlInput';

const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png':  ['.png'],
  'image/webp': ['.webp'],
};
const MAX_BYTES = 16 * 1024 * 1024; // 16 MB

interface Props {
  onFile: (file: File) => void;
  onUrl?: (url: string) => void;
  onBatchFiles?: (files: File[]) => void;
  onError: (message: string) => void;
}

export function UploadZone({ onFile, onUrl, onBatchFiles, onError }: Props) {
  const [activeTab, setActiveTab] = useState<'file' | 'url'>('file');

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept:    ACCEPTED_TYPES,
    maxSize:   MAX_BYTES,
    multiple:  true,
    noClick:   false,
    noKeyboard: false,
    onDropAccepted: (files) => {
      if (files.length > 1 && onBatchFiles) {
        onBatchFiles(files);
      } else if (files[0]) {
        onFile(files[0]);
      }
    },
    onDropRejected: (rejections) => {
      const error = rejections[0]?.errors[0];
      if (error?.code === 'file-too-large')        onError('File exceeds maximum size limit of 16 MB.');
      else if (error?.code === 'file-invalid-type') onError('Unsupported format. Use JPG, PNG, or WebP.');
      else                                          onError(error?.message ?? 'Invalid file selected.');
    },
  });

  return (
    <div className="vf-scanner-shell">

      {/* ── Instrument Header Bar ── */}
      <div className="vf-header-bar">
        <div className="vf-header-left">
          <ScanLine size={14} className="vf-scan-icon" />
          <span className="vf-header-label">OPTICAL VIEWFINDER SCANNER</span>
          <span className="vf-live-dot" aria-hidden="true" />
        </div>

        {/* Tab switcher */}
        <div className="vf-tab-switcher" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'file'}
            type="button"
            className={`vf-tab ${activeTab === 'file' ? 'vf-tab-active' : ''}`}
            onClick={() => setActiveTab('file')}
          >
            <FileUp size={12} />
            <span>File Upload</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'url'}
            type="button"
            className={`vf-tab ${activeTab === 'url' ? 'vf-tab-active' : ''}`}
            onClick={() => setActiveTab('url')}
          >
            <Link2 size={12} />
            <span>URL Analysis</span>
          </button>
        </div>
      </div>

      {/* ── Drop Zone Panel ── */}
      {activeTab === 'file' ? (
        <div
          {...getRootProps()}
          id="upload-zone"
          tabIndex={0}
          className={`vf-drop-zone ${isDragActive ? 'vf-drag-active' : ''}`}
        >
          {/* Corner brackets */}
          <span className="vf-corner vf-tl" />
          <span className="vf-corner vf-tr" />
          <span className="vf-corner vf-bl" />
          <span className="vf-corner vf-br" />

          {/* Hidden native file input */}
          <input {...getInputProps()} id="file-input" />

          {/* Scan sweep line (animated on drag) */}
          {isDragActive && <div className="vf-scan-sweep" aria-hidden="true" />}

          {/* Central icon block */}
          <div className="vf-icon-ring" aria-hidden="true">
            {isDragActive
              ? <Crosshair size={30} className="vf-icon-inner vf-icon-pulse" />
              : <UploadCloud size={30} className="vf-icon-inner" />
            }
          </div>

          <p className="vf-cta-primary">
            {isDragActive ? 'TARGET LOCKED — RELEASE TO SCAN' : 'POSITION IMAGE IN VIEWFINDER'}
          </p>
          <p className="vf-cta-sub">
            Drag &amp; drop single image or batch folder (JPG, PNG, WebP ≤ 16 MB)
          </p>

          {/* Action buttons */}
          <div className="vf-action-row" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="vf-btn-primary" onClick={() => open()}>
              <FileUp size={15} />
              <span>Browse Image File</span>
            </button>
            <button type="button" className="vf-btn-secondary" onClick={() => open()}>
              <FolderOpen size={15} />
              <span>Batch Directory</span>
            </button>
          </div>

          {/* Footer spec strip */}
          <div className="vf-spec-strip">
            <div className="vf-format-badges">
              {['JPG', 'PNG', 'WEBP'].map(f => (
                <span key={f} className="vf-badge">{f}</span>
              ))}
            </div>

            <div className="vf-spec-right">
              <span className="vf-retention-badge">
                <Lock size={10} />
                <span>ZERO RETENTION</span>
              </span>
              <span className="vf-spec-sep">·</span>
              <span className="vf-spec-dim">MAX 16 MB</span>
              <span className="vf-spec-sep">·</span>
              <span className="vf-spec-dim" style={{ color: 'var(--teal-real)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Zap size={10} />
                &lt;800ms
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* URL tab */
        <div className="vf-url-panel">
          <div className="vf-url-header">
            <Shield size={14} className="vf-url-header-icon" />
            <span>Remote Image Forensic URL Analysis</span>
          </div>
          <UrlInput onAnalyzeUrl={(url) => onUrl ? onUrl(url) : onError('URL handler missing.')} />
        </div>
      )}
    </div>
  );
}
