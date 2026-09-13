'use client';

import { useDropzone } from 'react-dropzone';
import { UploadCloud, Focus, ShieldCheck } from 'lucide-react';

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
    <div className="upload-wrapper">
      {/* Instrument Title & Subtitle */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-prose)',
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--ink-text)',
            marginBottom: '0.5rem',
          }}
        >
          Optical Authenticity Scanner
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-prose)',
            color: 'var(--ink-muted)',
            fontSize: '0.95rem',
            maxWidth: '540px',
            margin: '0 auto',
          }}
        >
          Target an image to compute a calibrated probability index (Real vs Synthetic AI-Generated).
        </p>
      </div>

      {/* Viewfinder Drop Zone */}
      <div
        {...getRootProps()}
        className={`viewfinder-box upload-drop-zone reticle-grid ${
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

        <div className="upload-icon-ring">
          {isDragActive ? (
            <Focus size={28} strokeWidth={2} />
          ) : (
            <UploadCloud size={28} strokeWidth={2} />
          )}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              fontSize: '1rem',
              color: 'var(--ink-text)',
              marginBottom: '0.35rem',
            }}
          >
            {isDragActive ? 'TARGET LOCKED — DROP TO SCAN' : 'POSITION IMAGE IN VIEWFINDER'}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--ink-muted)',
            }}
          >
            Drag & drop image file or click anywhere in viewfinder
          </p>
        </div>

        <button
          id="choose-file-btn"
          type="button"
          className="btn-instrument"
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
            marginTop: '1.5rem',
            fontSize: '0.7rem',
            color: 'var(--ink-faint)',
            display: 'flex',
            gap: '1rem',
          }}
        >
          <span>FORMATS: JPG · PNG · WEBP</span>
          <span>•</span>
          <span>MAX: 16 MB</span>
        </div>
      </div>

      {/* Disclaimer */}
      <div
        style={{
          marginTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--ink-muted)',
          fontSize: '0.76rem',
        }}
      >
        <ShieldCheck size={16} style={{ color: 'var(--teal-real)' }} />
        <span>
          Evaluates synthetic artifacts only. For general authenticity assessment.
        </span>
      </div>
    </div>
  );
}
