'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCurrentShow, getNextShow } from '@/lib/schedule';
import type { Show } from '@/types';

export default function OnAirStrip() {
  const [current, setCurrent] = useState<Show | null>(null);
  const [next, setNext] = useState<Show | null>(null);

  useEffect(() => {
    const update = () => {
      setCurrent(getCurrentShow());
      setNext(getNextShow());
    };
    update();
    // Refresh every minute
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!current && !next) return null;

  const show = current ?? next;
  const isLive = !!current;

  return (
    <div className="bg-[#0d0d0d] border-y border-white/5 py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
        {/* Live indicator */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isLive ? (
            <>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
              <span className="text-xs font-bold text-red-400 uppercase tracking-widest">On Air</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-yellow-500" aria-hidden="true" />
              <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Up Next</span>
            </>
          )}
        </div>

        <span className="text-gray-600 text-xs" aria-hidden="true">·</span>

        <Link
          href={`/shows/${show!.slug}`}
          className="text-sm font-semibold text-white hover:text-brand-pink transition-colors"
        >
          {show!.name}
        </Link>

        <span className="text-xs text-gray-500 hidden sm:block">{show!.tagline}</span>

        <Link
          href="/live"
          className="ml-auto flex-shrink-0 px-3 py-1 bg-brand-pink text-white text-xs font-semibold rounded-full hover:bg-pink-600 transition-colors"
        >
          Watch Live →
        </Link>
      </div>
    </div>
  );
}
