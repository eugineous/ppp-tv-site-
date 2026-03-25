'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const LOGO_URL = 'https://pub-8244b5f99b024cda91b74e1131378a14.r2.dev/LOGOS/PPPtv Logo-2.png';
const MobileMenu = dynamic(() => import('./MobileMenu'), { ssr: false });

const NAV = [
  { label: 'Home',          href: '/' },
  { label: 'Shows',         href: '/shows' },
  { label: 'News',          href: '/news' },
  { label: 'Politics',      href: '/politics' },
  { label: 'Business',      href: '/business' },
  { label: 'Entertainment', href: '/entertainment' },
  { label: 'Sports',        href: '/sports' },
  { label: 'Movies',        href: '/movies' },
  { label: 'Lifestyle',     href: '/lifestyle' },
  { label: 'Health',        href: '/health' },
  { label: 'Technology',    href: '/technology' },
  { label: 'Science',       href: '/science' },
  { label: '🔥 Trending',   href: '/trending' },
  { label: 'People',        href: '/people' },
  { label: '🔴 Live',       href: '/live' },
];

export default function Header() {
  const [scrolled, setScrolled]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery]           = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? 'rgba(0,0,0,0.97)'
          : 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
      }}
    >
      <div className="flex items-center px-4 md:px-10 h-[68px] gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center mr-2" aria-label="PPP TV Kenya Home">
          <Image
            src={LOGO_URL}
            alt="PPP TV Kenya"
            width={120}
            height={48}
            priority
            style={{ objectFit: 'contain', height: '44px', width: 'auto' }}
          />
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-0.5 flex-1 overflow-x-auto"
          style={{ scrollbarWidth: 'none' }}
          aria-label="Main navigation"
        >
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex-shrink-0 px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors duration-150 rounded"
              style={{ color: 'rgba(255,255,255,0.72)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.72)')}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          {/* Search */}
          {searchOpen ? (
            <div className="flex items-center gap-2 border border-white/30 bg-black/80 px-3 py-1.5 backdrop-blur-sm rounded">
              <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search titles, people…"
                className="bg-transparent text-white text-sm outline-none w-40 placeholder-gray-500"
                onBlur={() => { if (!query) setSearchOpen(false); }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && query.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
                  }
                  if (e.key === 'Escape') { setSearchOpen(false); setQuery(''); }
                }}
              />
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 transition-colors rounded"
              style={{ color: 'rgba(255,255,255,0.75)' }}
              aria-label="Search"
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}

          {/* Notifications bell */}
          <button
            className="hidden sm:flex p-2 transition-colors relative rounded"
            style={{ color: 'rgba(255,255,255,0.75)' }}
            aria-label="Notifications"
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#FF007A' }} />
          </button>

          {/* Profile avatar */}
          <Link
            href="/saved"
            className="hidden sm:flex w-8 h-8 rounded items-center justify-center text-white text-xs font-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#FF007A 0%,#ff4db2 100%)' }}
            aria-label="My list"
          >
            P
          </Link>

          {/* Mobile hamburger */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
