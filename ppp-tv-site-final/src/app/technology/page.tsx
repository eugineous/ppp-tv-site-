import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import CategoryPageLayout from '@/components/CategoryPageLayout';

export const metadata: Metadata = {
  title: 'Technology | PPP TV Kenya',
  description: 'Tech news, AI, African startups, gadgets and innovation.',
};

export const revalidate = 300;

export default async function TechnologyPage() {
  const [all, techNews, ai, africanTech, gaming, smartphones, startups, latestAll] = await Promise.all([
    fetchArticles({ category: 'Technology', limit: 40 }),
    fetchArticles({ category: 'Technology', subcategory: 'tech-news',     limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Technology', subcategory: 'ai-innovation', limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Technology', subcategory: 'african-tech',  limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Technology', subcategory: 'gaming',        limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Technology', subcategory: 'smartphones',   limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Technology', subcategory: 'startups',      limit: 8 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ sort: 'recent', limit: 10 }),
  ]);

  const rows = [
    { label: 'Tech News',     articles: techNews,     accentColor: '#FFE600' },
    { label: 'AI & Innovation', articles: ai,         accentColor: '#00CFFF' },
    { label: 'African Tech',  articles: africanTech,  accentColor: '#00FF94' },
    { label: 'Gaming',        articles: gaming,       accentColor: '#BF00FF' },
    { label: 'Smartphones',   articles: smartphones,  accentColor: '#FFE600' },
    { label: 'Startups',      articles: startups,     accentColor: '#FF6B00' },
  ].filter(r => r.articles.length > 0);

  return (
    <CategoryPageLayout
      title="Technology"
      accentColor="#FFE600"
      articles={all}
      rows={rows}
      latestAll={latestAll}
    />
  );
}
