import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import CategoryPageLayout from '@/components/CategoryPageLayout';

export const metadata: Metadata = {
  title: 'Music | PPP TV Kenya',
  description: 'Kenyan music news, Afrobeats, Gengetone, Bongo Flava, new releases and artist updates.',
};

export const revalidate = 300;

export default async function MusicPage() {
  const [all, kenyan, afrobeats, gospel, hiphop, latestAll] = await Promise.all([
    fetchArticles({ category: 'Music', limit: 60 }),
    fetchArticles({ category: 'Music', limit: 15 }),
    fetchArticles({ category: 'Entertainment', limit: 15 }),
    fetchArticles({ category: 'Entertainment', limit: 10 }),
    fetchArticles({ category: 'Entertainment', limit: 10 }),
    fetchArticles({ sort: 'recent', limit: 10 }),
  ]);

  // Deduplicate by slug
  const seen = new Set<string>();
  const dedup = (arr: typeof all) => arr.filter(a => { if (seen.has(a.slug)) return false; seen.add(a.slug); return true; });

  const musicAll = dedup(all);
  const entAll = dedup(afrobeats);

  const rows = [
    { label: '🎵 Kenyan Music',   articles: musicAll.slice(0, 10),  accentColor: '#FF6B00' },
    { label: '🎤 Entertainment',  articles: entAll.slice(0, 10),    accentColor: '#BF00FF' },
    { label: '🙏 Gospel',         articles: musicAll.slice(10, 20), accentColor: '#FFE600' },
    { label: '🎧 Hip-Hop & Rap',  articles: entAll.slice(10, 20),   accentColor: '#FF007A' },
  ].filter(r => r.articles.length > 0);

  return (
    <CategoryPageLayout
      title="Music"
      accentColor="#FF6B00"
      articles={[...musicAll, ...entAll]}
      rows={rows}
      latestAll={latestAll}
    />
  );
}
