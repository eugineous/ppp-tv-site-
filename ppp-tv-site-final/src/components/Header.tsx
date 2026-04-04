'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';

const LOGO_URL = 'https://pub-8244b5f99b024cda91b74e1131378a14.r2.dev/LOGOS/PPPtv Logo-2.png';
const MobileMenu = dynamic(() => import('./MobileMenu'), { ssr: false });

const NAV = [
  { label: 'Home',          href: '/',             color: '#FF007A' },
  { label: 'Entertainment', href: '/entertainment', color: '#BF00FF' },
  { label: 'Music',         href: '/music',         color: '#FF6B00' },
  { label: 'Celebrity',     href: '/celebrity',     color: '#FF007A' },
  { label: 'Sports',        href: '/sports',        color: '#00CFFF' },
  { label: 'Movies',        href: '/movies',        color: '#E50914' },
  { label: 'Lifestyle',     href: '/lifestyle',     color: '#00FF94' },
  { label: 'Technology',    href: '/technology',    color: '#FFE600' },
  { label: '🔥 Trending',   href: '/trending',      color: '#FF007A' },
  { label: '🌍 Swahili',    href: '/swahili',       color: '#006600' },
  { label: '🎬 Video',      href: '/video',         color: '#E50914' },
  { label: 'Shows',         href: '/shows',         color: '#BF00FF' },
  { label: 'People',        href: '/people',        color: '#00CFFF' },
  { label: 'Archive',       href: '/archive',       color: '#888' },
];

// Fetch latest headlines for ticker
async function fetchTickerHeadlines(): Promise<Array<{slug: string; title: string; category: string}>> {
  try {
    const r = await fetch(`${process.env.NEXT_PUBLIC_WORKER_URL || 'https://ppp-tv-worker.euginemicah.workers.dev'}/articles?sort=recent&limit=10`, { cache: 'no-store' });
    if (!r.ok) return [];
    const data = await r.json();
    const articles = Array.isArray(data) ? data : data.articles ?? [];
    return articles.map((a: {slug: string; rewritten_title?: string; title: string; category: string}) => ({ slug: a.slug, title: a.rewritten_title || a.title, category: a.category }));
  } catch { return []; }
}

function TickerStrip() {
  const [headlines, setHeadlines] = useState<Array<{slug: string; title: string; category: string}>>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const animRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    fetchTickerHeadlines().then(setHeadlines);
    const interval = setInterval(() => fetchTickerHeadlines().then(setHeadlines), 300000);
    return () => clearInterval(interval);
  }, []);

  const tick = useCallback(() => {
    const track = trackRef.current;
    if (track && !pausedRef.current) {
      posRef.current += 0.5;
      if (posRef.current >= track.scrollWidth / 2) posRef.current = 0;
      track.style.transform = `translateX(-${posRef.current}px)`;
    }
    animRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (!headlines.length) return;
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [headlines, tick]);

  if (!headlines.length) return null;

  const items = [...headlines, ...headlines];

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', height: '32px',
        background: 'rgba(0,0,0,0.95)', borderTop: '1px solid rgba(255,0,122,0.3)',
        overflow: 'hidden', position: 'relative',
      }}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* BREAKING label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '0 14px', background: '#FF007A', height: '100%',
        flexShrink: 0, fontSize: '.6rem', fontWeight: 900,
        letterSpacing: '.15em', textTransform: 'uppercase', color: '#fff',
        whiteSpace: 'nowrap', zIndex: 2,
      }}>
        <span style={{
          width: '6px', height: '6px', borderRadius: '50%', background: '#fff',
          animation: 'tickerDot 1s ease-in-out infinite', flexShrink: 0,
        }} />
        BREAKING
      </div>
      {/* Gradient fade on left */}
      <div style={{ position: 'absolute', left: '90px', top: 0, bottom: 0, width: '30px', background: 'linear-gradient(to right, rgba(0,0,0,0.9), transparent)', zIndex: 1, pointerEvents: 'none' }} />
      {/* Scrolling track */}
      <div style={{ flex: 1, overflow: 'hidden', height: '100%', display: 'flex', alignItems: 'center' }}>
        <div ref={trackRef} style={{ display: 'flex', alignItems: 'center', gap: 0, width: 'max-content', willChange: 'transform' }}>
          {items.map((h, i) => (
            <a key={`${h.slug}-${i}`} href={`/news/${h.slug}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '0 20px 0 16px', textDecoration: 'none',
              whiteSpace: 'nowrap', height: '32px', borderRight: '1px solid #1a1a1a',
              fontSize: '.72rem', color: '#ccc', fontWeight: 600,
              transition: 'color .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#FF007A')}
            onMouseLeave={e => (e.currentTarget.style.color = '#ccc')}
            >
              <span style={{ fontSize: '.65rem', fontWeight: 900, color: '#FF007A', minWidth: '18px', fontFamily: "'Bebas Neue',Impact,sans-serif", letterSpacing: '.04em' }}>
                {String((i % headlines.length) + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '.5rem', color: '#333' }}>▶</span>
              {h.title.length > 80 ? h.title.slice(0, 80) + '…' : h.title}
            </a>
          ))}
        </div>
      </div>
      {/* Gradient fade on right */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '40px', background: 'linear-gradient(to left, rgba(0,0,0,0.9), transparent)', pointerEvents: 'none' }} />
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeHref, setActiveHref] = useState('/');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setActiveHref(window.location.pathname);
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: scrolled ? 'rgba(0,0,0,0.98)' : 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(255,0,122,0.15)' : 'none',
        transition: 'background .3s, border-color .3s',
      }}
    >
      {/* Main nav bar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: '60px', gap: '12px', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Logo */}
        <Link href="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', marginRight: '8px' }} aria-label="PPP TV Kenya">
          <Image src={LOGO_URL} alt="PPP TV Kenya" width={110} height={44} priority style={{ objectFit: 'contain', height: '40px', width: 'auto' }} />
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, overflowX: 'auto', scrollbarWidth: 'none' }} className="hidden md:flex" aria-label="Main navigation">
          {NAV.map(item => {
            const isActive = activeHref === item.href || (item.href !== '/' && activeHref.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} style={{
                flexShrink: 0, padding: '6px 10px', fontSize: '12.5px', fontWeight: isActive ? 800 : 500,
                color: isActive ? item.color : 'rgba(255,255,255,0.7)',
                textDecoration: 'none', borderRadius: '4px', whiteSpace: 'nowrap',
                transition: 'all .15s', position: 'relative',
                borderBottom: isActive ? `2px solid ${item.color}` : '2px solid transparent',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'transparent'; }}}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', flexShrink: 0 }}>
          {/* Search */}
          {searchOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,0,122,0.4)', background: 'rgba(0,0,0,0.8)', padding: '6px 12px', borderRadius: '6px', backdropFilter: 'blur(8px)' }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="rgba(255,0,122,0.8)" strokeWidth={2.5}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input ref={inputRef} type="search" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search stories…"
                style={{ background: 'transparent', color: '#fff', fontSize: '13px', outline: 'none', width: '160px', border: 'none' }}
                onBlur={() => { if (!query) setSearchOpen(false); }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && query.trim()) window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
                  if (e.key === 'Escape') { setSearchOpen(false); setQuery(''); }
                }}
              />
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} style={{ padding: '8px', color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '6px', transition: 'all .15s' }} aria-label="Search"
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'none'; }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
          )}

          {/* Notifications */}
          <button style={{ padding: '8px', color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '6px', position: 'relative', transition: 'all .15s' }} className="hidden sm:flex" aria-label="Notifications"
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'none'; }}
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
            <span style={{ position: 'absolute', top: '6px', right: '6px', width: '7px', height: '7px', borderRadius: '50%', background: '#FF007A', border: '1.5px solid #000' }} />
          </button>

          {/* StarTimes badge */}
          <div className="hidden lg:flex" style={{ padding: '4px 10px', background: 'rgba(255,0,122,0.12)', border: '1px solid rgba(255,0,122,0.3)', borderRadius: '4px', fontSize: '10px', fontWeight: 900, color: '#FF007A', letterSpacing: '.08em', whiteSpace: 'nowrap' }}>
            CH 430
          </div>

          {/* Mobile menu */}
          <MobileMenu />
        </div>
      </div>

      {/* News Ticker — integrated into header */}
      <TickerStrip />
    </header>
  );
}
