'use client';
import { useRef, useState, useEffect } from 'react';
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

  // Show 4 per page, paginate through all articles
  const PAGE = 4;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(articles.length / PAGE);
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;
  const visible = articles.slice(page * PAGE, page * PAGE + PAGE);

  // Pad to exactly 4 so grid never collapses
  const padded = [...visible];
  while (padded.length < PAGE) padded.push(null as unknown as Article);

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

        {/* Right side: page indicator + nav arrows */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {totalPages > 1 && (
            <span style={{ fontSize: '.6rem', color: '#444', fontWeight: 700, letterSpacing: '.06em' }}>
              {page + 1} / {totalPages}
            </span>
          )}
          {seeAllHref && (
            <a href={seeAllHref} className="cat-row-see-all-btn" style={{ borderColor: color, color }}>
              View All →
            </a>
          )}
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={!canPrev}
                className="row-nav-arrow"
                aria-label="Previous"
                style={{ borderColor: canPrev ? color : '#222', color: canPrev ? color : '#333' }}
              >
                ‹
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={!canNext}
                className="row-nav-arrow"
                aria-label="Next"
                style={{ borderColor: canNext ? color : '#222', color: canNext ? color : '#333' }}
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress dots */}
      {totalPages > 1 && (
        <div className="cat-row-dots">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className="cat-row-dot"
              aria-label={`Page ${i + 1}`}
              style={{ background: i === page ? color : '#222', width: i === page ? '20px' : '6px' }}
            />
          ))}
        </div>
      )}

      {/* 5-column grid — always exactly 5 slots */}
      <div className="cat-row-grid">
        {padded.map((article, i) =>
          article ? (
            <ArticleCard key={article.slug} article={article} accentColor={color} ctaIndex={i} priority={page === 0 && i < 4} />
          ) : (
            <div key={`empty-${i}`} className="cat-row-empty-slot" />
          )
        )}
      </div>
    </section>
  );
}
