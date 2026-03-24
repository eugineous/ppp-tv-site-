'use client';
import { useState } from 'react';
import { timeAgo } from '@/lib/utils';
import type { Article } from '@/types';

interface Props { articles: Article[]; }

export default function Top10Row({ articles }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const items = articles.slice(0, 10);

  return (
    <section className="cat-row" aria-label="Top 10 in Kenya Today">
      <div className="cat-row-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="cat-row-accent" style={{ background: '#FFE600' }} />
          <div>
            <span className="cat-row-title" style={{ color: '#fff' }}>Top 10 in Kenya</span>
            <span style={{ display: 'block', fontSize: '.6rem', fontWeight: 700, color: '#FFE600', letterSpacing: '.08em', textTransform: 'uppercase', marginTop: '1px' }}>Most Viewed Today</span>
          </div>
        </div>
      </div>

      <div className="cat-row-scroll">
        {items.map((article, i) => (
          <div
            key={article.slug}
            className="row-card-wrap top10-wrap"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Big rank number */}
            <span className="top10-num">{i + 1}</span>

            {/* 16:9 landscape card */}
            <a
              href={`/news/${article.slug}`}
              className="row-card"
              style={{ marginLeft: '18px' }}
            >
              <div className="row-card-img">
                {article.imageUrl
                  ? <img src={article.imageUrl} alt={article.title} loading="lazy" />
                  : <div style={{ width: '100%', height: '100%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '2rem', color: 'rgba(255,255,255,.1)' }}>{article.category[0]}</span>
                    </div>
                }

                {/* Always-on gradient */}
                <div className="row-card-overlay" />

                {/* Top accent */}
                <div className="row-card-top-accent" style={{ background: '#FFE600' }} />

                {/* Rank badge */}
                <span className="row-card-cat-badge" style={{ background: '#FFE600', color: '#000' }}>#{i + 1}</span>

                {/* Play icon on hover */}
                <div className="row-card-play">
                  <svg width="10" height="12" fill="#000" viewBox="0 0 10 12"><path d="M0 0l10 6-10 6z"/></svg>
                </div>

                {/* Persistent title overlay */}
                <div className="row-card-title-overlay">
                  <div className="row-card-title-text">{article.title}</div>
                </div>
              </div>
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
                  <div style={{ fontSize: '.6rem', fontWeight: 900, color: '#FFE600', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '4px' }}>#{i + 1} Most Viewed</div>
                  <div className="card-preview-title">{article.title}</div>
                  {article.excerpt && <div className="card-preview-excerpt">{article.excerpt}</div>}
                  <div className="card-preview-meta">{timeAgo(article.publishedAt)}</div>
                  <a href={`/news/${article.slug}`} className="card-preview-btn" style={{ background: '#FFE600', color: '#000' }}>Read Now</a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
