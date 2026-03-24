import ArticleCard from './ArticleCard';
import type { Article } from '@/types';

const CAT_COLORS: Record<string, string> = {
  News: '#FF007A',
  Entertainment: '#BF00FF',
  Sports: '#00CFFF',
  Music: '#FF6B00',
  Lifestyle: '#00FF94',
  Technology: '#FFE600',
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

  return (
    <section className="cat-row" aria-label={`${label} articles`}>
      <div className="cat-row-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="cat-row-accent" style={{ background: color }} />
          <span className="cat-row-title">{label}</span>
          {seeAllHref && (
            <a href={seeAllHref} className="cat-row-link" style={{ color }}>
              Explore All
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      </div>

      <div className="cat-row-scroll">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} accentColor={color} />
        ))}
      </div>
    </section>
  );
}
