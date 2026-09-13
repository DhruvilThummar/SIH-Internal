import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <div style={{ fontWeight: 700, letterSpacing: '0.05em', color: 'var(--ink-text)', marginBottom: '0.25rem' }}>
            SIGNAL<span>SCOPE</span> OPTICAL INSTRUMENT
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>
            SIH 2026 Internal Hackathon · L.J. Institute of Engineering and Technology · PS-2
          </div>
        </div>

        <nav className="footer-links" aria-label="Footer Navigation">
          <Link href="/" className="footer-link">Scanner</Link>
          <Link href="/how-it-works" className="footer-link">How It Works</Link>
          <Link href="/faq" className="footer-link">FAQ</Link>
          <Link href="/privacy-policy" className="footer-link">Privacy Policy</Link>
          <Link href="/contact" className="footer-link">Contact Us</Link>
        </nav>
      </div>

      <div className="footer-bottom">
        <div>
          <span>CALIBRATED PROBABILISTIC FORENSICS</span>
          <span style={{ margin: '0 0.5rem', opacity: 0.4 }}>|</span>
          <span>ZERO-RETENTION IN-MEMORY PROCESSING</span>
        </div>

        <div>
          <span>VER 1.0.4</span>
          <span style={{ margin: '0 0.5rem', opacity: 0.4 }}>|</span>
          <span>© 2026 SIGNALSCOPE ENGINE</span>
        </div>
      </div>
    </footer>
  );
}
