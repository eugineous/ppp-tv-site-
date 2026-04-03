import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import CategoryPageLayout from '@/components/CategoryPageLayout';

export const metadata: Metadata = {
  title: 'Movies & TV | PPP TV Kenya',
  description: 'Latest movie reviews, trailers, box office and TV show news.',
};

export const revalidate = 300;

export default async function MoviesPage() {
  const [all, entertainment, music, latestAll] = await Promise.all([
    fetchArticles({ category: 'Movies', limit: 60 }),
    fetchArticles({ category: 'Entertainment', limit: 20 }),
    fetchArticles({ category: 'Music', limit: 10 }),
    fetchArticles({ sort: 'recent', limit: 10 }),
  ]);

  // Combine Movies + Entertainment for a full page
  const combined = [...all, ...entertainment.filter(a => !all.find(m => m.slug === a.slug))];

  const rows = [
    { label: 'Movies',        articles: all,           accentColor: '#E50914' },
    { label: 'Entertainment', articles: entertainment,  accentColor: '#BF00FF' },
    { label: 'Music',         articles: music,          accentColor: '#FF6B00' },
  ].filter(r => r.articles.length > 0);

  return (
    <CategoryPageLayout
      title="Movies & TV"
      accentColor="#E50914"
      articles={combined}
      rows={rows}
      latestAll={latestAll}
    />
  );
}
