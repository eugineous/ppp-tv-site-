'use client';
import { useEffect, useRef, useState } from 'react';
import type { Article } from '@/types';

interface NewsTickerProps {
  articles: Article[];
}

function decodeEntities(str: string): string {
  return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&apos;/g, "'");
}

export default function NewsTicker({ articles }: NewsTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const [activeIdx, setActiveIdx] = useState(0);

  // Duplicate for seamless loop
  const items = [...articles.slice(0, 10), ...articles.slice(0, 10)];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const SPEED = 0.6;

    function tick() {
      if (!pausedRef.current && track) {
        posRef.current += SPEED;
        const halfWidth = track.scrollWidth / 2;
        if (posRef.current >= halfWidth) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
        // Update active index based on position
        const cardWidth = track.scrollWidth / items.length;
        const idx = Math.floor(posRef.current / cardWidth) % articles.slice(0, 10).length;
        setActiveIdx(idx);
      }
      animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [articles, items.length]);

  if (!articles.length) return null;

  return (
    <div
      className="news-ticker-wrap"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* LIVE label */}
      <div className="news-ticker-label">
        <span className="news-ticker-dot" />
        <span>LIVE</span>
      </div>

      {/* Scrolling track */}
      <div className="news-ticker-outer">
        <div ref={trackRef} className="news-ticker-track">
          {items.map((article, i) => {
            const num = (i % articles.slice(0, 10).length) + 1;
            const isActive = i % articles.slice(0, 10).length === activeIdx;
            return (
              <a
                key={`${article.slug}-${i}`}
                href={`/news/${article.slug}`}
                className={`news-ticker-item${isActive ? ' news-ticker-item--active' : ''}`}
              >
                <span className="news-ticker-num">{String(num).padStart(2, '0')}</span>
                <span className="news-ticker-sep">▶</span>
                <span className="news-ticker-text">{decodeEntities(article.title)}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
