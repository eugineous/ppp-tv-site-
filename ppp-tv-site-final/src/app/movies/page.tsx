import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import CategoryPageLayout from '@/components/CategoryPageLayout';

export const metadata: Metadata = {
  title: 'Movies & TV | PPP TV Kenya',
  description: 'Latest movie reviews, trailers, box office and TV show news.',
};

export const revalidate = 300;

export default async function MoviesPage() {
  const [all, moviesTV, celebrity, music, latestAll] = await Promise.all([
    fetchArticles({ category: 'Entertainment', subcategory: 'movies-tv', limit: 40 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Entertainment', subcategory: 'movies-tv', limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Entertainment', subcategory: 'celebrity', limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Entertainment', subcategory: 'music',     limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ sort: 'recent', limit: 10 }),
  ]);

  const rows = [
    { label: 'Movies & TV',  articles: moviesTV,  accentColor: '#E50914' },
    { label: 'Celebrity',    articles: celebrity, accentColor: '#FF007A' },
    { label: 'Music',        articles: music,     accentColor: '#FF6B00' },
  ].filter(r => r.articles.length > 0);

  return (
    <CategoryPageLayout
      title="Movies & TV"
      accentColor="#E50914"
      articles={all}
      rows={rows}
      latestAll={latestAll}
    />
  );
}
