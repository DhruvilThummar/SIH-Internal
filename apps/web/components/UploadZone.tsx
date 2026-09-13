'use client';

import { useDropzone } from 'react-dropzone';
import { UploadCloud, Focus, ShieldCheck, Scan } from 'lucide-react';

const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};
const MAX_BYTES = 16 * 1024 * 1024; // 16 MB

interface Props {
  onFile: (file: File) => void;
  onError: (message: string) => void;
}

export function UploadZone({ onFile, onError }: Props) {
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: ACCEPTED_TYPES,
    maxSize: MAX_BYTES,
    multiple: false,
    noClick: false,
    onDropAccepted: (files) => {
      if (files[0]) onFile(files[0]);
    },
    onDropRejected: (rejections) => {
      const error = rejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        onError('File exceeds maximum size limit of 16 MB.');
      } else if (error?.code === 'file-invalid-type') {
        onError('Unsupported file format. Please upload JPG, PNG, or WebP.');
      } else {
        onError(error?.message ?? 'Invalid file selected.');
      }
    },
  });

  return (
    <div className="upload-wrapper flex flex-col h-full w-full">
      {/* Instrument Title Badge Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border-line)]">
        <div className="flex items-center gap-2 font-mono-data text-xs font-bold text-[var(--ink-text)] tracking-wider uppercase">
          <Scan size={15} className="text-[var(--teal-real)]" />
          <span>OPTICAL VIEWFINDER SCANNER</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono-data text-[0.7rem] text-[var(--teal-real)]">
          <span className="w-2 h-2 rounded-full bg-[var(--teal-real)] animate-pulse inline-block" />
          <span>LIVE RETICLE</span>
        </div>
      </div>

      {/* Viewfinder Drop Zone */}
      <div
        {...getRootProps()}
        className={`viewfinder-box upload-drop-zone reticle-grid flex-1 ${
          isDragActive ? 'drag-active' : ''
        }`}
        id="upload-zone"
      >
        {/* Signature Viewfinder Corner Brackets */}
        <div className="viewfinder-corner viewfinder-corner-tl" />
        <div className="viewfinder-corner viewfinder-corner-tr" />
        <div className="viewfinder-corner viewfinder-corner-bl" />
        <div className="viewfinder-corner viewfinder-corner-br" />

        <input {...getInputProps()} id="file-input" />

        <div className="upload-icon-ring mb-4">
          {isDragActive ? (
            <Focus size={32} strokeWidth={2} />
          ) : (
            <UploadCloud size={32} strokeWidth={2} />
          )}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: 'var(--ink-text)',
              marginBottom: '0.4rem',
              letterSpacing: '0.02em',
            }}
          >
            {isDragActive ? 'TARGET LOCKED — DROP TO SCAN' : 'POSITION IMAGE IN VIEWFINDER'}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--ink-muted)',
            }}
          >
            Drag &amp; drop image file or click anywhere in viewfinder
          </p>
        </div>

        <button
          id="choose-file-btn"
          type="button"
          className="btn-instrument mb-4"
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
        >
          Select Target Image
        </button>

        {/* Technical Specs Footer */}
        <div
          className="font-mono-data"
          style={{
            fontSize: '0.72rem',
            color: 'var(--ink-faint)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'var(--surface-subtle)',
            padding: '0.35rem 0.85rem',
            borderRadius: '2px',
            border: '1px solid var(--border-line)',
          }}
        >
          <span>FORMATS: JPG · PNG · WEBP</span>
          <span>|</span>
          <span>MAX: 16 MB</span>
        </div>
      </div>

      {/* Security Guarantee Note */}
      <div
        style={{
          marginTop: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--ink-muted)',
          fontSize: '0.75rem',
        }}
      >
        <ShieldCheck size={15} style={{ color: 'var(--teal-real)' }} />
        <span>In-memory processing only · Zero server image retention.</span>
      </div>
    </div>
  );
}
