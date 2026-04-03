'use client';
import { useRef, useEffect, useCallback } from 'react';
import ArticleCard from './ArticleCard';
import type { Article } from '@/types';

const CAT_COLORS: Record<string, string> = {
  News: '#FF007A', Entertainment: '#BF00FF', Sports: '#00CFFF',
  Music: '#FF6B00', Lifestyle: '#00FF94', Technology: '#FFE600',
  Politics: '#FF4500', Business: '#FFE600', Health: '#00FF94',
  Movies: '#E50914', Science: '#00CFFF', Events: '#FF007A', Celebrity: '#FF007A',
};

interface CategoryRowProps {
  label: string;
  articles: Article[];
  seeAllHref?: string;
  accentColor?: string;
}

export default function CategoryRow({ label, articles, seeAllHref, accentColor }: CategoryRowProps) {
  if (articles.length === 0) return null;
  const color = accentColor || CAT_COLORS[articles[0]?.category] || '#FF007A';

  // Duplicate articles for seamless infinite scroll (need at least 12 visible)
  const items = articles.length < 6 ? [...articles, ...articles, ...articles] : [...articles, ...articles];
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef  = useRef<number>(0);
  const posRef   = useRef(0);
  const pausedRef = useRef(false);
  // Speed: px per frame at 60fps — slow drift
  const SPEED = 0.4;

  const tick = useCallback(() => {
    const track = trackRef.current;
    if (!track || pausedRef.current) {
      animRef.current = requestAnimationFrame(tick);
      return;
    }
    posRef.current += SPEED;
    // Reset when we've scrolled one full set of original articles
    const halfWidth = track.scrollWidth / 2;
    if (posRef.current >= halfWidth) posRef.current = 0;
    track.style.transform = `translateX(-${posRef.current}px)`;
    animRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [tick]);

  return (
    <section className="cat-row" aria-label={`${label} articles`}>
      {/* Row header */}
      <div className="cat-row-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="cat-row-accent" style={{ background: color }} />
          <span className="cat-row-title">{label}</span>
          {seeAllHref && (
            <a href={seeAllHref} className="cat-row-link" style={{ color }}>
              See All
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
        {seeAllHref && (
          <a href={seeAllHref} className="cat-row-see-all-btn" style={{ borderColor: color, color }}>
            View All →
          </a>
        )}
      </div>

      {/* Auto-scrolling strip — overflow hidden, track translates */}
      <div
        className="cat-row-autoscroll-wrap"
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
        onTouchStart={() => { pausedRef.current = true; }}
        onTouchEnd={() => { pausedRef.current = false; }}
      >
        <div ref={trackRef} className="cat-row-autoscroll-track">
          {items.map((article, i) => (
            <div key={`${article.slug}-${i}`} className="cat-row-autoscroll-card">
              <ArticleCard
                article={article}
                accentColor={color}
                ctaIndex={i}
                priority={i < 5}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
