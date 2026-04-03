import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import CategoryPageLayout from '@/components/CategoryPageLayout';

export const metadata: Metadata = {
  title: 'Celebrity | PPP TV Kenya',
  description: 'Kenya celebrity news, gossip, relationships, drama and lifestyle.',
};

export const revalidate = 300;

export default async function CelebrityPage() {
  const [all, entertainment, lifestyle, latestAll] = await Promise.all([
    fetchArticles({ category: 'Entertainment', limit: 60 }),
    fetchArticles({ category: 'Entertainment', limit: 20 }),
    fetchArticles({ category: 'Lifestyle', limit: 20 }),
    fetchArticles({ sort: 'recent', limit: 10 }),
  ]);

  const seen = new Set<string>();
  const dedup = (arr: typeof all) => arr.filter(a => { if (seen.has(a.slug)) return false; seen.add(a.slug); return true; });

  const entDedup = dedup(all);
  const lifeDedup = dedup(lifestyle);

  const rows = [
    { label: '⭐ Celebrity News',    articles: entDedup.slice(0, 10),  accentColor: '#FF007A' },
    { label: '💅 Style & Fashion',   articles: lifeDedup.slice(0, 10), accentColor: '#BF00FF' },
    { label: '💔 Relationships',     articles: entDedup.slice(10, 20), accentColor: '#FF6B00' },
    { label: '🎬 On Screen & Off',   articles: entDedup.slice(20, 30), accentColor: '#E50914' },
  ].filter(r => r.articles.length > 0);

  return (
    <CategoryPageLayout
      title="Celebrity"
      accentColor="#FF007A"
      articles={[...entDedup, ...lifeDedup]}
      rows={rows}
      latestAll={latestAll}
    />
  );
}
