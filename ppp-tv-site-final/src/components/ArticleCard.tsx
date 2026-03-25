'use client';
import { useState } from 'react';
import { timeAgo, decodeEntities, truncate } from '@/lib/utils';
import type { Article } from '@/types';

const CAT_COLORS: Record<string, string> = {
  News: '#FF007A',
  Entertainment: '#BF00FF',
  Sports: '#00CFFF',
  Music: '#FF6B00',
  Lifestyle: '#00FF94',
  Technology: '#FFE600',
  Politics: '#FF4500',
  Business: '#FFE600',
  Health: '#00FF94',
  Movies: '#E50914',
  Science: '#00CFFF',
  Events: '#FF007A',
  Celebrity: '#FF007A',
};

// Gen Z read CTAs — rotated per card for variety
const READ_CTAS = ['Read Now →', 'Tap In →', 'Get Into It →', 'Read More →', 'Full Story →', 'Check It →'];

interface ArticleCardProps {
  article: Article;
  accentColor?: string;
  rank?: number;
  ctaIndex?: number;
}

export default function ArticleCard({ article, accentColor, rank, ctaIndex = 0 }: ArticleCardProps) {
  const [hovered, setHovered] = useState(false);
  const color = accentColor || CAT_COLORS[article.category] || '#FF007A';
  const title = decodeEntities(article.title);
  const excerpt = decodeEntities(article.excerpt);
  const cta = READ_CTAS[ctaIndex % READ_CTAS.length];

  return (
    <div
      className={`row-card-wrap${rank ? ' top10-wrap' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {rank && <span className="top10-num">{rank}</span>}

      <a href={`/news/${article.slug}`} className="row-card">
        {/* Thumbnail */}
        <div className="row-card-img">
          {article.imageUrl ? (
            <img src={article.imageUrl} alt={title} loading="lazy" referrerPolicy="no-referrer" />
          ) : (
            <div className="row-card-img-fallback">
              <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '2.5rem', color: 'rgba(255,255,255,.07)', letterSpacing: '.04em' }}>
                {article.category.toUpperCase()}
              </span>
            </div>
          )}
          {/* Accent bar top */}
          <div className="row-card-top-accent" style={{ background: color }} />
          {/* Category chip */}
          <span className="row-card-cat-chip" style={{ background: color, color: ['Technology','Lifestyle','Health','Business','Science'].includes(article.category) ? '#000' : '#fff' }}>
            {article.category}
          </span>
        </div>

        {/* Info block below thumbnail */}
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
            <span className="row-card-read-cta" style={{ color }}>
              {cta}
            </span>
          </div>
        </div>
      </a>

      {/* Hover preview */}
      {hovered && (
        <div className="card-preview">
          {article.imageUrl && (
            <div className="card-preview-img">
              <img src={article.imageUrl} alt={title} referrerPolicy="no-referrer" />
              <div className="card-preview-img-gradient" />
              <div className="card-preview-top-bar" style={{ background: color }} />
            </div>
          )}
          <div className="card-preview-body">
            <span className="card-preview-cat" style={{ background: color, color: ['Technology','Lifestyle','Health','Business','Science'].includes(article.category) ? '#000' : '#fff' }}>
              {article.category}
            </span>
            <div className="card-preview-title">{title}</div>
            {excerpt && <div className="card-preview-excerpt">{excerpt}</div>}
            <div className="card-preview-meta">
              <span>{article.sourceName}</span>
              <span style={{ margin: '0 4px', color: '#333' }}>·</span>
              <span>{timeAgo(article.publishedAt)}</span>
            </div>
            <a href={`/news/${article.slug}`} className="card-preview-btn" style={{ background: color, color: ['Technology','Lifestyle','Health','Business','Science'].includes(article.category) ? '#000' : '#fff' }}>
              {cta}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
