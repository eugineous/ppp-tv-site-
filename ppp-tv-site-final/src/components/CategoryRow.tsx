import ArticleCard from './ArticleCard';
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

interface CategoryRowProps {
  label: string;
  articles: Article[];
  seeAllHref?: string;
  accentColor?: string;
}

export default function CategoryRow({ label, articles, seeAllHref, accentColor }: CategoryRowProps) {
  if (articles.length === 0) return null;
  const color = accentColor || CAT_COLORS[articles[0]?.category] || '#FF007A';

  // RULE: always show exactly 6 cards per row
  // If fewer than 6, pad with nulls; if more, slice to 6
  const SIX = 6;
  const sliced = articles.slice(0, SIX);

  return (
    <section className="cat-row" aria-label={`${label} articles`}>
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

      {/* 6-column grid — enforced, no horizontal scroll */}
      <div className="cat-row-grid">
        {sliced.map((article, i) => (
          <ArticleCard key={article.slug} article={article} accentColor={color} ctaIndex={i} />
        ))}
      </div>
    </section>
  );
}
