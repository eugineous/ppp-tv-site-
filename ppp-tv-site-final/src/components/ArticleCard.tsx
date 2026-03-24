'use client';
import { useState } from 'react';
import { timeAgo, decodeEntities } from '@/lib/utils';
import type { Article } from '@/types';

const CAT_COLORS: Record<string, string> = {
  News: '#FF007A',
  Entertainment: '#BF00FF',
  Sports: '#00CFFF',
  Music: '#FF6B00',
  Lifestyle: '#00FF94',
  Technology: '#FFE600',
  Movies: '#E50914',
  Events: '#FF007A',
  Celebrity: '#FF007A',
};

interface ArticleCardProps {
  article: Article;
  accentColor?: string;
  rank?: number;
}

export default function ArticleCard({ article, accentColor, rank }: ArticleCardProps) {
  const [hovered, setHovered] = useState(false);
  const color = accentColor || CAT_COLORS[article.category] || '#FF007A';
  const title = decodeEntities(article.title);
  const excerpt = decodeEntities(article.excerpt);

  return (
    <div
      className={`row-card-wrap${rank ? ' top10-wrap' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {rank && <span className="top10-num">{rank}</span>}

      <a href={`/news/${article.slug}`} className="row-card">
        {/* 16:9 landscape image container */}
        <div className="row-card-img">
          {article.imageUrl ? (
            <img src={article.imageUrl} alt={title} loading="lazy" />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#1a1a1a 0%,#0a0a0a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="display" style={{ fontSize: '2rem', color: 'rgba(255,255,255,.08)' }}>{article.category[0]}</span>
            </div>
          )}

          {/* Always-on gradient overlay for title readability */}
          <div className="row-card-overlay" />
          <div className="row-card-top-accent" style={{ background: color }} />
          <span className="row-card-cat-badge" style={{ background: color }}>{article.category}</span>

          {/* Play icon on hover */}
          <div className="row-card-play">
            <svg width="10" height="12" fill="#000" viewBox="0 0 10 12"><path d="M0 0l10 6-10 6z"/></svg>
          </div>

          {/* Persistent title overlay — always visible at bottom */}
          <div className="row-card-title-overlay">
            <div className="row-card-title-text">{title}</div>
          </div>
        </div>
      </a>

      {/* Hover preview card */}
      {hovered && (
        <div className="card-preview">
          {article.imageUrl && (
            <div className="card-preview-img">
              <img src={article.imageUrl} alt={title} />
              <div className="card-preview-img-gradient" />
              <div className="card-preview-top-bar" style={{ background: color }} />
            </div>
          )}
          <div className="card-preview-body">
            <div className="card-preview-title">{title}</div>
            {excerpt && <div className="card-preview-excerpt">{excerpt}</div>}
            <div className="card-preview-meta">{timeAgo(article.publishedAt)}</div>
            <a href={`/news/${article.slug}`} className="card-preview-btn" style={{ background: color }}>Read Now</a>
          </div>
        </div>
      )}
    </div>
  );
}
