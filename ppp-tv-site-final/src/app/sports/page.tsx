import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import CategoryPageLayout from '@/components/CategoryPageLayout';

export const metadata: Metadata = {
  title: 'Sports | PPP TV Kenya',
  description: 'Football, basketball, athletics, rugby and more — Kenya, Africa & global sports.',
};

export const revalidate = 300;

export default async function SportsPage() {
  const [all, football, basketball, athletics, rugby, boxing, kenyan, latestAll] = await Promise.all([
    fetchArticles({ category: 'Sports', limit: 60 }),
    fetchArticles({ category: 'Sports', subcategory: 'football',      limit: 10 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Sports', subcategory: 'basketball',    limit: 10 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Sports', subcategory: 'athletics',     limit: 10 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Sports', subcategory: 'rugby',         limit: 10 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Sports', subcategory: 'boxing-mma',    limit: 10 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Sports', subcategory: 'kenyan-sports', limit: 10 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ sort: 'recent', limit: 10 }),
  ]);

  const rows = [
    { label: 'Football',      articles: football,    accentColor: '#00CFFF' },
    { label: 'Basketball',    articles: basketball,  accentColor: '#FF6B00' },
    { label: 'Athletics',     articles: athletics,   accentColor: '#00FF94' },
    { label: 'Rugby',         articles: rugby,       accentColor: '#00CFFF' },
    { label: 'Boxing & MMA',  articles: boxing,      accentColor: '#FF007A' },
    { label: 'Kenyan Sports', articles: kenyan,      accentColor: '#FFE600' },
  ].filter(r => r.articles.length > 0);

  return (
    <CategoryPageLayout
      title="Sports"
      accentColor="#00CFFF"
      articles={all}
      rows={rows}
      latestAll={latestAll}
    />
  );
}
