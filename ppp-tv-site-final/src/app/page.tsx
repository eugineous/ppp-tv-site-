import { fetchArticles, fetchTrending } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';
import Top10Row from '@/components/Top10Row';
import dynamic from 'next/dynamic';
import type { Article } from '@/types';

// Lazy-load the X trends widget — non-critical, client-only
const XTrends = dynamic(() => import('@/components/XTrends'), { ssr: false });

// Revalidate every 5 minutes
export const revalidate = 300;

const CATEGORIES = [
  { label: 'Kenya News',    cat: 'News',          href: '/?cat=News',          color: '#FF007A' },
  { label: 'Entertainment', cat: 'Entertainment',  href: '/?cat=Entertainment', color: '#BF00FF' },
  { label: 'Sports',        cat: 'Sports',         href: '/?cat=Sports',        color: '#00CFFF' },
  { label: 'Music',         cat: 'Music',          href: '/?cat=Music',         color: '#FF6B00' },
  { label: 'Lifestyle',     cat: 'Lifestyle',      href: '/?cat=Lifestyle',     color: '#00FF94' },
  { label: 'Technology',    cat: 'Technology',     href: '/?cat=Technology',    color: '#FFE600' },
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
  // Parallel fetch — both requests fire simultaneously
  const [allArticles, trendingRaw] = await Promise.all([
    fetchArticles({ sort: 'recent', limit: 120 }),
    fetchTrending(),
  ]);

  const heroArticles = allArticles.slice(0, 5);

  // Trending Now = newest 12 articles by publish date
  const trending = allArticles
    .slice()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 12);

  // Top 10 = highest views/score, no overlap with Trending
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
      {/* ── HERO BANNER ── */}
      {heroArticles.length > 0 && <HeroBanner articles={heroArticles} />}

      {/* ── MAIN CONTENT + SIDEBAR ── */}
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <div className="home-layout">

          {/* ── LEFT: content rows ── */}
          <div className="home-rows">
            <div className="rows-section" style={{ marginTop: '-80px' }}>
              {trending.length > 0 && (
                <CategoryRow
                  label="🔥 Trending Now"
                  articles={trending}
                  seeAllHref="/?sort=trending"
                  accentColor="#FF007A"
                />
              )}

              {top10.length >= 3 && (
                <Top10Row articles={top10} />
              )}

              {CATEGORIES.map(({ label, cat, href, color }) => {
                const articles = grouped[cat] ?? [];
                if (articles.length === 0) return null;
                return (
                  <CategoryRow
                    key={cat}
                    label={label}
                    articles={articles.slice(0, 12)}
                    seeAllHref={href}
                    accentColor={color}
                  />
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: sidebar (desktop only) ── */}
          <aside className="home-sidebar">
            {/* X / Twitter Trends */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: '3px', height: '18px', background: '#1d9bf0', borderRadius: '2px' }} />
                <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.1rem', color: '#fff', letterSpacing: '.04em', textTransform: 'uppercase' }}>What&apos;s Trending on X</span>
              </div>
              <XTrends />
            </div>

            {/* Quick category links */}
            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid #1a1a1a' }}>
                <span style={{ fontSize: '.7rem', fontWeight: 900, letterSpacing: '.1em', textTransform: 'uppercase', color: '#fff' }}>Browse Categories</span>
              </div>
              <div style={{ padding: '8px 0' }}>
                {CATEGORIES.map(({ label, cat, href, color }) => (
                  <a
                    key={cat}
                    href={href}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 14px', textDecoration: 'none', transition: 'background .15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <span style={{ fontSize: '.8rem', color: '#ccc', fontWeight: 600 }}>{label}</span>
                    <svg style={{ marginLeft: 'auto', color: '#444' }} width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Live now card */}
            <a
              href="/live"
              style={{ display: 'block', marginTop: '1.5rem', background: 'linear-gradient(135deg,#1a0000 0%,#0a0a0a 100%)', border: '1px solid rgba(255,0,0,0.2)', borderRadius: '6px', padding: '1.25rem', textDecoration: 'none', transition: 'border-color .2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,0,0,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,0,0,0.2)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 1.4s ease-in-out infinite' }} />
                <span style={{ fontSize: '.6rem', fontWeight: 900, letterSpacing: '.12em', textTransform: 'uppercase', color: '#ef4444' }}>Live Now</span>
              </div>
              <p style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.2rem', color: '#fff', letterSpacing: '.04em', marginBottom: '4px' }}>PPP TV Kenya</p>
              <p style={{ fontSize: '.72rem', color: '#666' }}>StarTimes Channel 430 · Watch live stream</p>
              <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: '#ef4444', borderRadius: '3px', fontSize: '.65rem', fontWeight: 900, letterSpacing: '.08em', textTransform: 'uppercase', color: '#fff' }}>
                <svg width="10" height="12" fill="currentColor" viewBox="0 0 10 12"><path d="M0 0l10 6-10 6z"/></svg>
                Watch Live
              </div>
            </a>
          </aside>
        </div>
      </div>
    </div>
  );
}
