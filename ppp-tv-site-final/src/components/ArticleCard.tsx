'use client';
import { useState } from 'react';
import { timeAgo, decodeEntities, truncate } from '@/lib/utils';
import type { Article } from '@/types';

const CAT_COLORS: Record<string, string> = {
  News: '#FF007A', Entertainment: '#BF00FF', Sports: '#00CFFF',
  Music: '#FF6B00', Lifestyle: '#00FF94', Technology: '#FFE600',
  Politics: '#FF4500', Business: '#FFE600', Health: '#00FF94',
  Movies: '#E50914', Science: '#00CFFF', Events: '#FF007A', Celebrity: '#FF007A',
};

const DARK_TEXT = new Set(['Technology','Lifestyle','Health','Business','Science']);
const READ_CTAS = ['Read Now →', 'Tap In →', 'Get Into It →', 'Read More →', 'Full Story →', 'Check It →'];

interface ArticleCardProps {
  article: Article;
  accentColor?: string;
  rank?: number;
  ctaIndex?: number;
  priority?: boolean;
}

export default function ArticleCard({ article, accentColor, rank, ctaIndex = 0, priority = false }: ArticleCardProps) {
  const [hovered, setHovered] = useState(false);
  const color = accentColor || CAT_COLORS[article.category] || '#FF007A';
  const title = decodeEntities(article.title);
  const excerpt = decodeEntities(article.excerpt);
  const cta = READ_CTAS[ctaIndex % READ_CTAS.length];
  const darkText = DARK_TEXT.has(article.category);

  return (
    <div
      className={`row-card-wrap${rank ? ' top10-wrap' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ zIndex: hovered ? 50 : 'auto' }}
    >
      {rank && <span className="top10-num">{rank}</span>}

      {/* The whole card scales up on hover — Netflix style */}
      <div className={`row-card-inner${hovered ? ' row-card-inner--hovered' : ''}`}>
        <a href={`/news/${article.slug}`} className="row-card" tabIndex={-1}>
          {/* Thumbnail */}
          <div className="row-card-img">
            {article.imageUrl ? (
              <img
                src={article.imageUrl}
                alt={title}
                loading={priority ? 'eager' : 'lazy'}
                decoding={priority ? 'sync' : 'async'}
                fetchPriority={priority ? 'high' : 'low'}
                referrerPolicy="no-referrer"
                width={400}
                height={225}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div className="row-card-img-fallback">
                <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '2rem', color: 'rgba(255,255,255,.06)' }}>
                  {article.category[0]}
                </span>
              </div>
            )}
            <div className="row-card-top-accent" style={{ background: color }} />
            <span className="row-card-cat-chip" style={{ background: color, color: darkText ? '#000' : '#fff' }}>
              {article.category}
            </span>
          </div>

          {/* Info block — always visible below thumbnail */}
          <div className="row-card-info-block">
            <div className="row-card-info-title">{title}</div>
            {excerpt && (
              <div className="row-card-info-excerpt">{truncate(excerpt, 75)}</div>
            )}
            <div className="row-card-info-footer">
              <div className="row-card-info-meta">
                <span className="row-card-info-source">{article.sourceName}</span>
                <span className="row-card-info-dot">·</span>
                <span className="row-card-info-time">{timeAgo(article.publishedAt)}</span>
              </div>
              <span className="row-card-read-cta" style={{ color }}>{cta}</span>
            </div>
          </div>
        </a>

        {/* Hover expansion panel — slides in below the card, part of the scaled card */}
        {hovered && (
          <div className="row-card-hover-panel">
            <div className="row-card-hover-panel-bar" style={{ background: color }} />
            <div className="row-card-hover-panel-body">
              <div className="row-card-hover-panel-title">{title}</div>
              {excerpt && (
                <div className="row-card-hover-panel-excerpt">{truncate(excerpt, 120)}</div>
              )}
              <div className="row-card-hover-panel-footer">
                <div className="row-card-hover-panel-meta">
                  <span style={{ color: '#888', fontWeight: 700 }}>{article.sourceName}</span>
                  <span style={{ color: '#333' }}>·</span>
                  <span style={{ color: '#666' }}>{timeAgo(article.publishedAt)}</span>
                </div>
                <a
                  href={`/news/${article.slug}`}
                  className="row-card-hover-panel-btn"
                  style={{ background: color, color: darkText ? '#000' : '#fff' }}
                >
                  {cta}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
