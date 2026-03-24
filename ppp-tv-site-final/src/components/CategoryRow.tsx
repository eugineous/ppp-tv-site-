import Link from 'next/link';
import ArticleCard from './ArticleCard';
import type { Article } from '@/types';

interface CategoryRowProps {
  label: string;
  articles: Article[];
  seeAllHref?: string;
  accentColor?: string;
}

export default function CategoryRow({ label, articles, seeAllHref }: CategoryRowProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mb-8" aria-label={`${label} articles`}>
      {/* Section header — Netflix style */}
      <div className="flex items-center justify-between px-[4%] mb-2">
        <div className="flex items-center gap-3 group">
          <h2 className="section-title">{label}</h2>
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="text-[#54b9c5] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
            >
              Explore All
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Horizontal scroll row */}
      <div className="netflix-row">
        {articles.map((article, i) => (
          <div key={article.slug} className="flex-shrink-0" style={{ width: 'clamp(160px, 16vw, 260px)' }}>
            <ArticleCard article={article} priority={i === 0} />
          </div>
        ))}
      </div>
    </section>
  );
}
