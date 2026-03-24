'use client';
import { useState } from 'react';
import { timeAgo, decodeEntities } from '@/lib/utils';
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

      <div className="cat-row-scroll" style={{ paddingLeft: '1rem' }}>
        {items.map((article, i) => {
          const title = decodeEntities(article.title);
          return (
            <div
              key={article.slug}
              className="row-card-wrap top10-wrap"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Netflix-style big outlined rank number — sits left, behind card */}
              <span className="top10-num">{i + 1}</span>

              {/* 16:9 landscape card */}
              <a href={`/news/${article.slug}`} className="row-card">
                <div className="row-card-img">
                  {article.imageUrl
                    ? <img src={article.imageUrl} alt={title} loading="lazy" />
                    : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#1a1a1a 0%,#0a0a0a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '2.5rem', color: 'rgba(255,255,255,0.08)', letterSpacing: '.02em' }}>{article.category[0]}</span>
                      </div>
                    )
                  }

                  {/* Always-on gradient */}
                  <div className="row-card-overlay" />

                  {/* Top accent */}
                  <div className="row-card-top-accent" style={{ background: '#FFE600' }} />

                  {/* Rank badge */}
                  <span className="row-card-cat-badge" style={{ background: '#FFE600', color: '#000', fontWeight: 900 }}>#{i + 1}</span>

                  {/* Play icon on hover */}
                  <div className="row-card-play">
                    <svg width="10" height="12" fill="#000" viewBox="0 0 10 12"><path d="M0 0l10 6-10 6z"/></svg>
                  </div>

                  {/* Persistent title overlay */}
                  <div className="row-card-title-overlay">
                    <div className="row-card-title-text">{title}</div>
                  </div>
                </div>
              </a>

              {/* Hover preview */}
              {hovered === i && (
                <div className="card-preview" style={{ zIndex: 200 }}>
                  {article.imageUrl && (
                    <div className="card-preview-img">
                      <img src={article.imageUrl} alt={title} />
                      <div className="card-preview-img-gradient" />
                      <div className="card-preview-top-bar" style={{ background: '#FFE600' }} />
                    </div>
                  )}
                  <div className="card-preview-body">
                    <div style={{ fontSize: '.6rem', fontWeight: 900, color: '#FFE600', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '4px' }}>#{i + 1} Most Viewed</div>
                    <div className="card-preview-title">{title}</div>
                    {article.excerpt && <div className="card-preview-excerpt">{decodeEntities(article.excerpt)}</div>}
                    <div className="card-preview-meta">{timeAgo(article.publishedAt)}</div>
                    <a href={`/news/${article.slug}`} className="card-preview-btn" style={{ background: '#FFE600', color: '#000' }}>Read Now</a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
