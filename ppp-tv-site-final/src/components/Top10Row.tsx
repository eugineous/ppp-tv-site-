'use client';
import { useState } from 'react';
import { timeAgo } from '@/lib/utils';
import type { Article } from '@/types';

interface Props { articles: Article[]; }

export default function Top10Row({ articles }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const items = articles.slice(0, 10);

  return (
    <section className="cat-row" aria-label="Top 10 Today">
      <div className="cat-row-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="cat-row-accent" style={{ background: '#FF007A' }} />
          <span className="cat-row-title">Top 10 in Kenya Today</span>
        </div>
      </div>

      <div className="cat-row-scroll" style={{ paddingLeft: '14px' }}>
        {items.map((article, i) => (
          <div
            key={article.slug}
            className="top10-wrap"
            style={{ flexShrink: 0, width: 'calc((100vw - 2rem) / 2.8)', scrollSnapAlign: 'start', position: 'relative' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Big number */}
            <span className="top10-num">{i + 1}</span>

            {/* Card */}
            <a
              href={`/news/${article.slug}`}
              style={{
                display: 'block',
                marginLeft: '28px',
                position: 'relative',
                borderRadius: '4px',
                overflow: 'hidden',
                aspectRatio: '2/3',
                background: '#111',
                transform: hovered === i ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform .3s ease',
                zIndex: hovered === i ? 20 : 1,
              }}
            >
              {article.imageUrl
                ? <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                : <div style={{ width: '100%', height: '100%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '3rem', color: 'rgba(255,255,255,.1)' }}>{article.category[0]}</span>
                  </div>
              }
              {/* Top accent bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#FF007A' }} />
              {/* Gradient overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)', opacity: hovered === i ? 1 : 0, transition: 'opacity .3s' }} />
              {/* Play button on hover */}
              {hovered === i && (
                <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', width: '36px', height: '36px', background: 'rgba(255,255,255,0.95)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="14" fill="#000" viewBox="0 0 10 12"><path d="M0 0l10 6-10 6z"/></svg>
                </div>
              )}
            </a>

            {/* Hover preview */}
            {hovered === i && (
              <div className="card-preview" style={{ zIndex: 200 }}>
                {article.imageUrl && (
                  <div className="card-preview-img">
                    <img src={article.imageUrl} alt={article.title} />
                    <div className="card-preview-img-gradient" />
                    <div className="card-preview-top-bar" style={{ background: '#FF007A' }} />
                  </div>
                )}
                <div className="card-preview-body">
                  <div style={{ fontSize: '.6rem', fontWeight: 900, color: '#FF007A', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '4px' }}>#{i + 1} Today</div>
                  <div className="card-preview-title">{article.title}</div>
                  {article.excerpt && <div className="card-preview-excerpt">{article.excerpt}</div>}
                  <div className="card-preview-meta">{timeAgo(article.publishedAt)}{article.sourceName ? ` · ${article.sourceName}` : ''}</div>
                  <a href={`/news/${article.slug}`} className="card-preview-btn" style={{ background: '#FF007A' }}>Read Now</a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
