'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { timeAgo, decodeEntities, truncate } from '@/lib/utils';
import type { Article } from '@/types';

interface Props { articles: Article[]; }

const INTERVAL = 5000; // 5 seconds per slide

export default function Top10Row({ articles }: Props) {
  const items = articles.slice(0, 10);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animDir, setAnimDir] = useState<'left' | 'right'>('left');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((idx: number, dir: 'left' | 'right' = 'left') => {
    setAnimDir(dir);
    setActive(idx);
  }, []);

  const prev = useCallback(() => {
    setAnimDir('right');
    setActive(p => (p - 1 + items.length) % items.length);
  }, [items.length]);

  const next = useCallback(() => {
    setAnimDir('left');
    setActive(p => (p + 1) % items.length);
  }, [items.length]);

  // Auto-advance — continuous loop, never stops
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setAnimDir('left');
      setActive(prev => (prev + 1) % items.length);
    }, INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, items.length]);

  if (items.length === 0) return null;

  const article = items[active];
  const title = decodeEntities(article.title);
  const excerpt = decodeEntities(article.excerpt);

  return (
    <section
      className="top10-section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Top 10 in Kenya"
    >
      {/* Section header */}
      <div className="top10-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '4px', height: '28px', background: '#FFE600', borderRadius: '2px' }} />
          <div>
            <div className="top10-header-title">Top 10 in Kenya</div>
            <div className="top10-header-sub">Most Viewed Today</div>
          </div>
        </div>
        {/* Nav arrows */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '.72rem', color: '#555', fontWeight: 700 }}>{active + 1} / {items.length}</span>
          <button onClick={prev} className="top10-nav-btn" aria-label="Previous">‹</button>
          <button onClick={next} className="top10-nav-btn" aria-label="Next">›</button>
        </div>
      </div>

      {/* Main featured card */}
      <div className="top10-featured">
        {/* Big rank number */}
        <div className="top10-rank-bg">{active + 1}</div>

        {/* Image */}
        <div className="top10-img-wrap">
          {article.imageUrl ? (
            <img
              key={article.slug}
              src={article.imageUrl}
              alt={title}
              className="top10-img"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="top10-img-fallback">
              <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '5rem', color: 'rgba(255,255,255,.06)' }}>
                {article.category}
              </span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="top10-img-gradient" />
          {/* Accent bar */}
          <div className="top10-img-accent" />
          {/* Rank badge */}
          <span className="top10-rank-badge">#{active + 1}</span>
        </div>

        {/* Content */}
        <div className="top10-content">
          <span className="top10-cat-chip">{article.category}</span>
          <h2 className="top10-title">{title}</h2>
          {excerpt && <p className="top10-excerpt">{truncate(excerpt, 160)}</p>}
          <div className="top10-meta">
            <span>{article.sourceName}</span>
            <span style={{ color: '#333' }}>·</span>
            <span>{timeAgo(article.publishedAt)}</span>
          </div>
          <a href={`/news/${article.slug}`} className="top10-read-btn">
            Read Full Story →
          </a>
        </div>
      </div>

      {/* Progress bar */}
      <div className="top10-progress-track">
        <div
          className="top10-progress-fill"
          key={`${active}-${paused}`}
          style={{ animationDuration: `${INTERVAL}ms`, animationPlayState: paused ? 'paused' : 'running' }}
        />
      </div>

      {/* Thumbnail strip */}
      <div className="top10-strip">
        {items.map((a, i) => (
          <button
            key={a.slug}
            onClick={() => goTo(i, i > active ? 'left' : 'right')}
            className={`top10-thumb${i === active ? ' active' : ''}`}
            aria-label={`Story ${i + 1}`}
          >
            <div className="top10-thumb-img-wrap">
              {a.imageUrl
                ? <img src={a.imageUrl} alt="" referrerPolicy="no-referrer" />
                : <div style={{ width: '100%', height: '100%', background: '#111' }} />
              }
              <div className="top10-thumb-overlay" />
              <span className="top10-thumb-rank">{i + 1}</span>
            </div>
            <div className="top10-thumb-title">{decodeEntities(a.title)}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
