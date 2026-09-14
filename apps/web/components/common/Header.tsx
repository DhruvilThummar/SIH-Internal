'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scan, Activity, Cpu, HelpCircle, ShieldCheck, Mail, Columns } from 'lucide-react';

interface HeaderProps {
  onCompareClick?: () => void;
}

export function Header({ onCompareClick }: HeaderProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Scanner', path: '/', icon: Scan },
    { name: 'How It Works', path: '/how-it-works', icon: Cpu },
    { name: 'FAQ', path: '/faq', icon: HelpCircle },
    { name: 'Privacy Policy', path: '/privacy-policy', icon: ShieldCheck },
    { name: 'Contact Us', path: '/contact', icon: Mail },
  ];

  return (
    <header className="site-header" role="banner">
      <div className="header-brand">
        <Link href="/" className="flex items-center gap-3 text-decoration-none color-inherit">
          <Scan className="brand-icon" size={22} strokeWidth={2.2} />
          <div className="logo-mark">
            SIGNAL<span>SCOPE</span>
          </div>
        </Link>
        <span className="logo-tag font-mono-data">OPTICAL READOUT</span>
      </div>

      <nav className="header-nav" aria-label="Main Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={14} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {onCompareClick && (
          <button
            type="button"
            onClick={onCompareClick}
            className="nav-link compare-nav-btn"
            title="Open side-by-side image comparison mode"
          >
            <Columns size={14} className="text-sage" />
            <span>Compare Mode</span>
          </button>
        )}
      </nav>

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
