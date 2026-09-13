import { Scan, Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="site-header" role="banner">
      <div className="header-brand">
        <Scan className="brand-icon" size={20} strokeWidth={2.2} />
        <div className="logo-mark">
          SIGNAL<span>SCOPE</span>
        </div>
        <span className="logo-tag font-mono-data">OPTICAL READOUT</span>
      </div>

      <div className="header-status font-mono-data">
        <span className="status-dot" />
        <Activity size={14} style={{ color: 'var(--teal-real)' }} />
        <span>INSTRUMENT READY</span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span style={{ color: 'var(--ink-muted)' }}>SIH 2026</span>
      </div>
    </header>
  );
}
