'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const POLL_INTERVAL = 120_000; // 2 minutes

export default function LiveUpdater() {
  const router = useRouter();
  const [newCount, setNewCount] = useState(0);
  const lastSlugRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const workerBase = process.env.NEXT_PUBLIC_WORKER_URL ?? '';
    if (!workerBase) return;

    async function checkForNew() {
      try {
        const res = await fetch(`${workerBase}/articles?sort=recent&limit=1`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const articles = Array.isArray(data) ? data : data.articles ?? [];
        if (!articles.length) return;
        const latestSlug = articles[0].slug;
        if (lastSlugRef.current === null) {
          lastSlugRef.current = latestSlug;
          return;
        }
        if (latestSlug !== lastSlugRef.current) {
          // New article arrived — count how many are new
          const res2 = await fetch(`${workerBase}/articles?sort=recent&limit=10`, { cache: 'no-store' });
          if (!res2.ok) return;
          const data2 = await res2.json();
          const recent = Array.isArray(data2) ? data2 : data2.articles ?? [];
          const idx = recent.findIndex((a: { slug: string }) => a.slug === lastSlugRef.current);
          const count = idx === -1 ? 1 : idx;
          setNewCount(count);
          lastSlugRef.current = latestSlug;
        }
      } catch { /* silent */ }
    }

    // Initial check after 5s
    const init = setTimeout(checkForNew, 5000);
    timerRef.current = setInterval(checkForNew, POLL_INTERVAL);

    return () => {
      clearTimeout(init);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function refresh() {
    setNewCount(0);
    router.refresh();
  }

  if (newCount === 0) return null;

  return (
    <button
      onClick={refresh}
      aria-live="polite"
      style={{
        position: 'fixed', top: '70px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999,
        background: '#FF007A',
        color: '#fff',
        border: 'none',
        borderRadius: '999px',
        padding: '.55rem 1.4rem',
        fontSize: '.78rem',
        fontWeight: 900,
        letterSpacing: '.06em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        boxShadow: '0 4px 24px rgba(255,0,122,.5)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        animation: 'slideDown .3s ease',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: '1rem' }}>🔥</span>
      {newCount} new article{newCount > 1 ? 's' : ''} — tap to refresh
    </button>
  );
}
