'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface MobileMenuProps {
  onClose: () => void;
}

const MENU_SECTIONS = [
  {
    heading: 'News & Content',
    links: [
      { label: 'Latest News', href: '/?cat=News' },
      { label: 'Entertainment', href: '/?cat=Entertainment' },
      { label: 'Sports', href: '/?cat=Sports' },
      { label: 'Music', href: '/?cat=Music' },
      { label: 'Lifestyle', href: '/?cat=Lifestyle' },
      { label: 'Events', href: '/events' },
    ],
  },
  {
    heading: 'PPP TV',
    links: [
      { label: 'Shows', href: '/shows' },
      { label: 'Hosts', href: '/hosts' },
      { label: 'Schedule', href: '/schedule' },
      { label: 'Video', href: '/video' },
      { label: 'Live', href: '/live' },
    ],
  },
  {
    heading: 'More',
    links: [
      { label: 'Artists', href: '/artists' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Saved', href: '/saved' },
    ],
  },
];

export default function MobileMenu({ onClose }: MobileMenuProps) {
  // Lock body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
        <Link href="/" className="font-bebas text-2xl text-white tracking-widest" onClick={onClose}>
          PPP<span className="text-brand-pink">TV</span>
        </Link>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6" aria-label="Mobile navigation">
        {MENU_SECTIONS.map((section) => (
          <div key={section.heading}>
            <p className="text-xs font-semibold text-brand-pink uppercase tracking-widest mb-3">
              {section.heading}
            </p>
            <ul className="space-y-1">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="block py-2.5 px-3 text-base text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom search */}
      <div className="px-4 pb-6 pt-2 border-t border-white/10">
        <Link
          href="/search"
          className="flex items-center gap-3 w-full px-4 py-3 bg-white/10 rounded-xl text-gray-300 hover:text-white transition-colors"
          onClick={onClose}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search articles…
        </Link>
      </div>
    </div>
  );
}
