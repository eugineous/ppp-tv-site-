'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MobileMenu = dynamic(() => import('./MobileMenu'), { ssr: false });

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Top 10', href: '/?sort=trending' },
  { label: 'Trending', href: '/?cat=trending' },
  { label: 'What to Watch', href: '/shows' },
  { label: 'News', href: '/?cat=News' },
  { label: 'Entertainment', href: '/?cat=Entertainment' },
  { label: 'Sports', href: '/?cat=Sports' },
  { label: 'Music', href: '/?cat=Music' },
  { label: 'Live', href: '/live' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      {/* Top bar — Netflix red strip with logo + nav */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
        style={{ background: scrolled ? '#000' : 'rgba(0,0,0,0.92)' }}
      >
        {/* Red accent line */}
        <div style={{ height: 3, background: '#E50914' }} />

        <div className="flex items-center justify-between px-4 md:px-8 h-14 gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <span className="font-bebas text-[#E50914] text-3xl tracking-widest leading-none">PPP</span>
            <span className="font-bebas text-white text-3xl tracking-widest leading-none">TV</span>
          </Link>

          {/* Desktop nav — scrollable */}
          <nav className="hidden md:flex items-center gap-0 overflow-x-auto scrollbar-hide flex-1 mx-4" aria-label="Main navigation">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex-shrink-0 px-3 py-1 text-[13px] font-medium text-[#ccc] hover:text-white transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: search + profile */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {searchOpen ? (
              <input
                autoFocus
                type="search"
                placeholder="Search…"
                className="bg-black border border-white/30 text-white text-sm px-3 py-1.5 outline-none w-44 placeholder-gray-500"
                onBlur={() => setSearchOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = `/search?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`;
                  }
                }}
              />
            ) : (
              <button onClick={() => setSearchOpen(true)} className="p-2 text-[#ccc] hover:text-white" aria-label="Search">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}

            <Link href="/saved" className="hidden sm:flex w-8 h-8 rounded bg-[#E50914] items-center justify-center text-white text-xs font-bold" aria-label="My list">
              P
            </Link>

            <button className="md:hidden p-2 text-[#ccc] hover:text-white" onClick={() => setMobileOpen(true)} aria-label="Menu">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
    </>
  );
}
