import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import CategoryPageLayout from '@/components/CategoryPageLayout';

export const metadata: Metadata = {
  title: 'Entertainment | PPP TV Kenya',
  description: 'Kenya, East Africa & global entertainment — celebrity, music, movies, fashion.',
};

export const revalidate = 300;

export default async function EntertainmentPage() {
  const [all, celebrity, music, moviesTV, fashion, comedy, awards, latestAll] = await Promise.all([
    fetchArticles({ category: 'Entertainment', limit: 40 }),
    fetchArticles({ category: 'Entertainment', subcategory: 'celebrity',     limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Entertainment', subcategory: 'music',         limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Entertainment', subcategory: 'movies-tv',     limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Entertainment', subcategory: 'fashion',       limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Entertainment', subcategory: 'comedy',        limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Entertainment', subcategory: 'awards',        limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ sort: 'recent', limit: 10 }),
  ]);

  const rows = [
    { label: 'Celebrity',   articles: celebrity,  accentColor: '#FF007A' },
    { label: 'Music',       articles: music,      accentColor: '#FF6B00' },
    { label: 'Movies & TV', articles: moviesTV,   accentColor: '#E50914' },
    { label: 'Fashion',     articles: fashion,    accentColor: '#BF00FF' },
    { label: 'Comedy',      articles: comedy,     accentColor: '#FFE600' },
    { label: 'Awards',      articles: awards,     accentColor: '#FF007A' },
  ].filter(r => r.articles.length > 0);

  return (
    <CategoryPageLayout
      title="Entertainment"
      accentColor="#BF00FF"
      articles={all}
      rows={rows}
      latestAll={latestAll}
    />
  );
}
