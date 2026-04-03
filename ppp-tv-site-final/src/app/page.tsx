import { fetchArticles, fetchTrending } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';
import Top10Row from '@/components/Top10Row';
import dynamic from 'next/dynamic';
import type { Article } from '@/types';

export const revalidate = 300;

const CATEGORIES = [
  { label: 'Entertainment', cat: 'Entertainment',  href: '/entertainment', color: '#BF00FF' },
  { label: 'Sports',        cat: 'Sports',         href: '/sports',        color: '#00CFFF' },
  { label: 'Movies',        cat: 'Movies',         href: '/movies',        color: '#E50914' },
  { label: 'Lifestyle',     cat: 'Lifestyle',      href: '/lifestyle',     color: '#00FF94' },
  { label: 'Technology',    cat: 'Technology',     href: '/technology',    color: '#FFE600' },
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
    fetchArticles({ sort: 'recent', limit: 200 }),
    fetchTrending(),
  ]);

  const heroArticles = allArticles.slice(0, 5);

  const trending = allArticles
    .slice()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 24);

  const trendingSlugSet = new Set(trending.map(a => a.slug));
  const byViews = (trendingRaw.length >= 5 ? trendingRaw : allArticles)
    .slice()
    .sort((a, b) => ((b.views ?? 0) + (b.trendingScore ?? 0)) - ((a.views ?? 0) + (a.trendingScore ?? 0)));
  const top10Candidates = byViews.filter(a => !trendingSlugSet.has(a.slug));
  const top10 = top10Candidates.length >= 5
    ? top10Candidates.slice(0, 10)
    : allArticles.filter(a => !trendingSlugSet.has(a.slug)).slice(-10).reverse();

  const grouped = groupByCategory(allArticles.slice(5));

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {heroArticles.length > 0 && <HeroBanner articles={heroArticles} />}

      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <div className="rows-section" style={{ marginTop: '-80px' }}>

          {/* Trending Now row */}
          {trending.length > 0 && (
            <CategoryRow label="🔥 Trending Now" articles={trending} seeAllHref="/trending" accentColor="#FF007A" />
          )}

          {/* Top 10 — large auto-scroll carousel */}
          {top10.length >= 3 && <Top10Row articles={top10} />}

          {/* Category rows — each gets 60 articles for 5 rows of 12 */}
          {CATEGORIES.map(({ label, cat, href, color }) => {
            const articles = grouped[cat] ?? [];
            if (articles.length === 0) return null;
            return (
              <CategoryRow
                key={cat}
                label={label}
                articles={articles.slice(0, 60)}
                seeAllHref={href}
                accentColor={color}
              />
            );
          })}

          {/* Category quick links at bottom */}
          <div className="home-cat-links">
            {CATEGORIES.map(({ label, href, color }) => (
              <a key={href} href={href} className="home-cat-pill" style={{ borderColor: color, color }}>
                {label}
              </a>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
