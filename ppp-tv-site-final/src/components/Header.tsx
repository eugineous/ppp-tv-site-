'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MobileMenu = dynamic(() => import('./MobileMenu'), { ssr: false });

const NAV_ITEMS = [
  { label: 'News', href: '/?cat=News' },
  {
    label: 'Entertainment',
    href: '/?cat=Entertainment',
    children: [
      { label: 'Music', href: '/?cat=Music' },
      { label: 'Lifestyle', href: '/?cat=Lifestyle' },
      { label: 'Events', href: '/events' },
    ],
  },
  { label: 'Sports', href: '/?cat=Sports' },
  {
    label: 'Shows',
    href: '/shows',
    children: [
      { label: 'All Shows', href: '/shows' },
      { label: 'Schedule', href: '/schedule' },
      { label: 'Hosts', href: '/hosts' },
    ],
  },
  { label: 'Video', href: '/video' },
  { label: 'Live', href: '/live' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 h-14 bg-black border-b-[3px] border-brand-pink" aria-label="Site header">
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 font-bebas text-2xl text-white tracking-widest hover:text-brand-pink transition-colors">
            PPP<span className="text-brand-pink">TV</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation" ref={dropdownRef}>
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <button
                    className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors flex items-center gap-1"
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    aria-expanded={openDropdown === item.label}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors block"
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown */}
                {item.children && openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-44 bg-[#111] border border-white/10 rounded-lg shadow-xl py-1 z-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link
              href="/saved"
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10 hidden sm:block"
              aria-label="Saved articles"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
