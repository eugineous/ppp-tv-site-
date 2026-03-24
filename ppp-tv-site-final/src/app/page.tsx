import dynamic from 'next/dynamic';
import { fetchArticles, fetchTrending } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';
import TrendingSection from '@/components/TrendingSection';
import type { Article } from '@/types';

const OnAirStrip = dynamic(() => import('@/components/OnAirStrip'), { ssr: false });

export const revalidate = 300; // ISR: refresh every 5 minutes

const CATEGORIES = [
  { label: 'Kenya News', cat: 'News', color: 'bg-blue-600', href: '/?cat=News' },
  { label: 'Entertainment', cat: 'Entertainment', color: 'bg-purple-600', href: '/?cat=Entertainment' },
  { label: 'Sports', cat: 'Sports', color: 'bg-green-600', href: '/?cat=Sports' },
  { label: 'Music', cat: 'Music', color: 'bg-orange-500', href: '/?cat=Music' },
  { label: 'Lifestyle', cat: 'Lifestyle', color: 'bg-yellow-500', href: '/?cat=Lifestyle' },
  { label: 'Technology', cat: 'Technology', color: 'bg-cyan-600', href: '/?cat=Technology' },
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
    <>
      {/* On-air strip */}
      <OnAirStrip />

      {/* Hero */}
      {hero && <HeroBanner article={hero} />}

      {/* Main content grid */}
      <div className="max-w-7xl mx-auto">
        {/* Category rows + trending sidebar */}
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-0">
          {/* Left: category rows */}
          <div className="min-w-0">
            {CATEGORIES.map(({ label, cat, color, href }) => {
              const articles = grouped[cat] ?? [];
              if (articles.length === 0) return null;
              return (
                <CategoryRow
                  key={cat}
                  label={label}
                  articles={articles.slice(0, 8)}
                  seeAllHref={href}
                  accentColor={color}
                />
              );
            })}
          </div>

          {/* Right: trending sidebar (desktop) */}
          {trending.length > 0 && (
            <aside className="hidden lg:block border-l border-white/5 py-6 pl-6 pr-4 sticky top-14 self-start max-h-[calc(100vh-56px)] overflow-y-auto scrollbar-hide">
              <TrendingSection articles={trending} />
            </aside>
          )}
        </div>

        {/* Trending (mobile — below all rows) */}
        {trending.length > 0 && (
          <div className="lg:hidden border-t border-white/5">
            <TrendingSection articles={trending} />
          </div>
        )}
      </div>
    </>
  );
}
