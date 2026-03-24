import { fetchArticles, fetchTrending } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';
import type { Article } from '@/types';

export const revalidate = 300;

const CATEGORIES = [
  { label: 'Kenya News',    cat: 'News',          href: '/?cat=News',          color: '#FF007A' },
  { label: 'Entertainment', cat: 'Entertainment',  href: '/?cat=Entertainment', color: '#a855f7' },
  { label: 'Sports',        cat: 'Sports',         href: '/?cat=Sports',        color: '#3b82f6' },
  { label: 'Music',         cat: 'Music',          href: '/?cat=Music',         color: '#f59e0b' },
  { label: 'Lifestyle',     cat: 'Lifestyle',      href: '/?cat=Lifestyle',     color: '#14b8a6' },
  { label: 'Technology',    cat: 'Technology',     href: '/?cat=Technology',    color: '#06b6d4' },
];

function groupByCategory(articles: Article[]): Record<string, Article[]> {
  const groups: Record<string, Article[]> = {};
  for (const a of articles) {
    if (!groups[a.category]) groups[a.category] = [];
    groups[a.category].push(a);
  }
  return groups;
}

export default async function HomePage() {
  const [allArticles, trending] = await Promise.all([
    fetchArticles({ sort: 'recent', limit: 100 }),
    fetchTrending(),
  ]);

  const heroArticles = allArticles.slice(0, 5);
  const grouped = groupByCategory(allArticles.slice(5));

  return (
    <div className="netflix-home">
      {heroArticles.length > 0 && <HeroBanner articles={heroArticles} />}

      <div className="rows-section">
        {trending.length > 0 && (
          <CategoryRow label="🔥 Trending Now" articles={trending} seeAllHref="/?sort=trending" accentColor="#FF007A" />
        )}
        {CATEGORIES.map(({ label, cat, href, color }) => {
          const articles = grouped[cat] ?? [];
          if (articles.length === 0) return null;
          return (
            <CategoryRow key={cat} label={label} articles={articles.slice(0, 12)} seeAllHref={href} accentColor={color} />
          );
        })}
      </div>
    </div>
  );
}
