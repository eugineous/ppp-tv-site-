import dynamic from 'next/dynamic';
import { fetchArticles, fetchTrending } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';
import type { Article } from '@/types';

export const revalidate = 300;

const CATEGORIES = [
  { label: 'Kenya News', cat: 'News', href: '/?cat=News' },
  { label: 'Entertainment', cat: 'Entertainment', href: '/?cat=Entertainment' },
  { label: 'Sports', cat: 'Sports', href: '/?cat=Sports' },
  { label: 'Music', cat: 'Music', href: '/?cat=Music' },
  { label: 'Lifestyle', cat: 'Lifestyle', href: '/?cat=Lifestyle' },
  { label: 'Technology', cat: 'Technology', href: '/?cat=Technology' },
];

function groupByCategory(articles: Article[]): Record<string, Article[]> {
  const groups: Record<string, Article[]> = {};
  for (const article of articles) {
    if (!groups[article.category]) groups[article.category] = [];
    groups[article.category].push(article);
  }
  return groups;
}

export default async function HomePage() {
  const [allArticles, trending] = await Promise.all([
    fetchArticles({ sort: 'recent', limit: 100 }),
    fetchTrending(),
  ]);

  const hero = allArticles[0] ?? null;
  const grouped = groupByCategory(allArticles.slice(1));

  return (
    <div style={{ background: '#141414', minHeight: '100vh' }}>
      {/* Hero — full bleed, no top padding (header is transparent overlay) */}
      {hero && <HeroBanner article={hero} />}

      {/* Category rows */}
      <div className="relative z-10 -mt-16 pb-16">
        {/* Trending sidebar row */}
        {trending.length > 0 && (
          <CategoryRow
            label="🔥 Trending Now"
            articles={trending}
            seeAllHref="/?sort=trending"
          />
        )}

        {CATEGORIES.map(({ label, cat, href }) => {
          const articles = grouped[cat] ?? [];
          if (articles.length === 0) return null;
          return (
            <CategoryRow
              key={cat}
              label={label}
              articles={articles.slice(0, 10)}
              seeAllHref={href}
            />
          );
        })}
      </div>
    </div>
  );
}
