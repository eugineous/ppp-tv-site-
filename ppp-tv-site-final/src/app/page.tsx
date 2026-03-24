import { fetchArticles, fetchTrending } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';
import Top10Row from '@/components/Top10Row';
import type { Article } from '@/types';

export const revalidate = 300;

const CATEGORIES = [
  { label: 'Kenya News',    cat: 'News',          href: '/?cat=News',          color: '#FF007A' }, // hot pink
  { label: 'Entertainment', cat: 'Entertainment',  href: '/?cat=Entertainment', color: '#BF00FF' }, // electric violet
  { label: 'Sports',        cat: 'Sports',         href: '/?cat=Sports',        color: '#00CFFF' }, // electric cyan
  { label: 'Music',         cat: 'Music',          href: '/?cat=Music',         color: '#FF6B00' }, // hot orange
  { label: 'Lifestyle',     cat: 'Lifestyle',      href: '/?cat=Lifestyle',     color: '#00FF94' }, // neon green
  { label: 'Technology',    cat: 'Technology',     href: '/?cat=Technology',    color: '#FFE600' }, // electric yellow
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
  const [allArticles, trendingRaw] = await Promise.all([
    fetchArticles({ sort: 'recent', limit: 120 }),
    fetchTrending(),
  ]);

  const heroArticles = allArticles.slice(0, 5);

  // ── Trending Now = most recently published (last 12, sorted by date desc)
  const trending = allArticles
    .slice()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 12);

  // ── Top 10 in Kenya = highest view/engagement score, excluding articles already in Trending
  const trendingSlugSet = new Set(trending.map(a => a.slug));
  const byViews = (trendingRaw.length >= 5 ? trendingRaw : allArticles)
    .slice()
    .sort((a, b) => ((b.views ?? 0) + (b.trendingScore ?? 0)) - ((a.views ?? 0) + (a.trendingScore ?? 0)));
  // Remove overlap — if top10 candidates are all in trending, fall back to oldest articles (different content)
  const top10Candidates = byViews.filter(a => !trendingSlugSet.has(a.slug));
  const top10 = top10Candidates.length >= 5
    ? top10Candidates.slice(0, 10)
    : allArticles.filter(a => !trendingSlugSet.has(a.slug)).slice(-10).reverse(); // oldest 10 not in trending

  const grouped = groupByCategory(allArticles.slice(5));

  return (
    <div className="netflix-home">
      {heroArticles.length > 0 && <HeroBanner articles={heroArticles} />}

      <div className="rows-section">
        {trending.length > 0 && (
          <CategoryRow label="🔥 Trending Now" articles={trending} seeAllHref="/?sort=trending" accentColor="#FF007A" />
        )}

        {top10.length >= 3 && (
          <Top10Row articles={top10} />
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
