import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import CategoryPageLayout from '@/components/CategoryPageLayout';

export const metadata: Metadata = {
  title: 'Lifestyle | PPP TV Kenya',
  description: 'Fashion, beauty, health, food, travel and wellness for young Kenyans.',
};

export const revalidate = 300;

export default async function LifestylePage() {
  const [all, fashion, beauty, health, food, travel, fitness, latestAll] = await Promise.all([
    fetchArticles({ category: 'Lifestyle', limit: 40 }),
    fetchArticles({ category: 'Lifestyle', subcategory: 'fashion',       limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Lifestyle', subcategory: 'beauty',        limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Lifestyle', subcategory: 'health',        limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Lifestyle', subcategory: 'food',          limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Lifestyle', subcategory: 'travel',        limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Lifestyle', subcategory: 'fitness',       limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ sort: 'recent', limit: 10 }),
  ]);

  const rows = [
    { label: 'Fashion',   articles: fashion,  accentColor: '#FF007A' },
    { label: 'Beauty',    articles: beauty,   accentColor: '#BF00FF' },
    { label: 'Health',    articles: health,   accentColor: '#00FF94' },
    { label: 'Food',      articles: food,     accentColor: '#FF6B00' },
    { label: 'Travel',    articles: travel,   accentColor: '#00CFFF' },
    { label: 'Fitness',   articles: fitness,  accentColor: '#00FF94' },
  ].filter(r => r.articles.length > 0);

  return (
    <CategoryPageLayout
      title="Lifestyle"
      accentColor="#00FF94"
      articles={all}
      rows={rows}
      latestAll={latestAll}
    />
  );
}
