'use client';
import { useState } from 'react';
import { timeAgo } from '@/lib/utils';
import type { Article } from '@/types';

const CAT_COLORS: Record<string, string> = {
  News: '#FF007A', Entertainment: '#a855f7', Sports: '#3b82f6',
  Music: '#f59e0b', Lifestyle: '#14b8a6', Technology: '#06b6d4',
  Events: '#10b981', Celebrity: '#FF007A',
};

interface ArticleCardProps {
  article: Article;
  accentColor?: string;
}

export default function ArticleCard({ article, accentColor }: ArticleCardProps) {
  const [hovered, setHovered] = useState(false);
  const color = accentColor || CAT_COLORS[article.category] || '#FF007A';

  return (
    <div className="row-card-wrap" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <a href={`/news/${article.slug}`} className="row-card">
        <div className="row-card-img">
          {article.imageUrl
            ? <img src={article.imageUrl} alt={article.title} loading="lazy" />
            : <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="display" style={{ fontSize: '2rem', color: 'rgba(255,255,255,.15)' }}>{article.category[0]}</span>
              </div>
          }
          <div className="row-card-overlay" />
          <div className="row-card-top-accent" style={{ background: color }} />
          <span className="row-card-cat-badge" style={{ background: color }}>{article.category}</span>
          <div className="row-card-play">
            <svg width="10" height="12" fill="#000" viewBox="0 0 10 12"><path d="M0 0l10 6-10 6z"/></svg>
          </div>
        </div>
        <div className="row-card-info">
          <span className="row-card-cat" style={{ color }}>{article.category}</span>
          <div className="row-card-title">{article.title}</div>
          <div className="row-card-meta">{timeAgo(article.publishedAt)}</div>
        </div>
      </a>

      {/* Hover preview */}
      {hovered && (
        <div className="card-preview">
          {article.imageUrl && (
            <div className="card-preview-img">
              <img src={article.imageUrl} alt={article.title} />
              <div className="card-preview-img-gradient" />
              <div className="card-preview-top-bar" style={{ background: color }} />
            </div>
          )}
          <div className="card-preview-body">
            <div className="card-preview-title">{article.title}</div>
            {article.excerpt && <div className="card-preview-excerpt">{article.excerpt}</div>}
            <div className="card-preview-meta">{timeAgo(article.publishedAt)}{article.sourceName ? ` · ${article.sourceName}` : ''}</div>
            <a href={`/news/${article.slug}`} className="card-preview-btn" style={{ background: color }}>Read Now</a>
          </div>
        </div>
      )}
    </div>
  );
}
