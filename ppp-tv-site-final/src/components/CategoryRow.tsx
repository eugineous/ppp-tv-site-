import ArticleCard from './ArticleCard';
import SectionLabel from './SectionLabel';
import type { Article } from '@/types';

interface CategoryRowProps {
  label: string;
  articles: Article[];
  seeAllHref?: string;
  accentColor?: string;
}

export default function CategoryRow({ label, articles, seeAllHref, accentColor }: CategoryRowProps) {
  if (articles.length === 0) return null;

  return (
    <section className="py-6" aria-label={`${label} articles`}>
      <div className="max-w-7xl mx-auto px-4">
        <SectionLabel label={label} href={seeAllHref} accentColor={accentColor} />
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
          {articles.map((article, i) => (
            <div key={article.slug} className="flex-shrink-0 w-[260px] sm:w-[300px]">
              <ArticleCard article={article} priority={i === 0} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
