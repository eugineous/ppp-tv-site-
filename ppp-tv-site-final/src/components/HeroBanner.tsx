'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { timeAgo } from '@/lib/utils';
import type { Article } from '@/types';

interface HeroBannerProps {
  articles: Article[];
}

const INTERVAL = 7000;

export default function HeroBanner({ articles }: HeroBannerProps) {
  const [idx, setIdx]       = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const items = articles.slice(0, 5);

  function startCycle(startIdx: number) {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progRef.current)  clearInterval(progRef.current);
    setProgress(0);
    const step = 100 / (INTERVAL / 80);
    progRef.current = setInterval(() => setProgress(p => Math.min(p + step, 100)), 80);
    timerRef.current = setInterval(() => {
      setIdx(i => (i + 1) % items.length);
      setProgress(0);
    }, INTERVAL);
  }

  useEffect(() => {
    startCycle(0);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progRef.current)  clearInterval(progRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  function goTo(i: number) {
    setIdx(i);
    startCycle(i);
  }

  const article = items[idx];
  if (!article) return null;

  return (
    <div className="hero-section">
      {/* Progress bar */}
      <div className="hero-progress-bar">
        <div className="hero-progress-fill" style={{ width: `${progress}%`, background: '#FF007A' }} />
      </div>

      {/* Background slides */}
      <div className="hero-bg">
        {items.map((a, i) => (
          <div key={a.slug} className="hero-bg-slide" style={{ opacity: i === idx ? 1 : 0 }}>
            {a.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.imageUrl} alt={a.title} className="hero-bg-img" />
            )}
          </div>
        ))}
      </div>

      {/* Gradients */}
      <div className="hero-gradient-bottom" />
      <div className="hero-gradient-left" />

      {/* Content */}
      <div className="hero-content">
        <div className="hero-brief">
          <span style={{ background: '#FF007A', color: '#fff', padding: '2px 8px', borderRadius: '2px', fontSize: '10px', fontWeight: 900, letterSpacing: '.1em', textTransform: 'uppercase' }}>
            {article.category}
          </span>
          <span>·</span>
          <span>{timeAgo(article.publishedAt)}</span>
        </div>

        <div className="hero-title">{article.title}</div>

        {article.excerpt && (
          <div className="hero-excerpt">{article.excerpt}</div>
        )}

        <div className="hero-meta">
          {article.sourceName && <><span>{article.sourceName}</span><span className="hero-dot">·</span></>}
          <span>{timeAgo(article.publishedAt)}</span>
        </div>

        <div className="hero-actions">
          <Link href={`/news/${article.slug}`} className="hero-btn-primary">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Read Now
          </Link>
          <Link href={`/news/${article.slug}`} className="hero-btn-secondary">
            More Info
          </Link>
        </div>

        {/* Dots */}
        {items.length > 1 && (
          <div className="hero-dots">
            {items.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className="hero-dot-btn"
                style={{ width: i === idx ? 24 : 12, background: i === idx ? '#FF007A' : 'rgba(255,255,255,.3)' }}
                aria-label={`Go to slide ${i + 1}`} />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip (desktop) */}
      {items.length > 1 && (
        <div className="hero-thumbs">
          {items.filter((_, i) => i !== idx).slice(0, 3).map((a) => (
            <button key={a.slug} className="hero-thumb-btn"
              style={{ borderColor: 'transparent' }}
              onClick={() => goTo(items.indexOf(a))}>
              {a.imageUrl && <img src={a.imageUrl} alt={a.title} className="hero-thumb-img" />}
              <div className="hero-thumb-overlay">
                <span className="hero-thumb-title">{a.title}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
