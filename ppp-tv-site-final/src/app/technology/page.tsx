import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';

export const metadata: Metadata = {
  title: 'Technology | PPP TV Kenya',
  description: 'African tech startups, AI innovation, gaming and global technology news.',
};

export const revalidate = 300;

export default async function TechnologyPage() {
  const [latest, techNews, ai, africanTech, gaming] = await Promise.all([
    fetchArticles({ category: 'Technology', limit: 20 }),
    fetchArticles({ category: 'Technology', subcategory: 'tech-news',      limit: 20 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Technology', subcategory: 'ai-innovation',  limit: 20 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Technology', subcategory: 'african-tech',   limit: 20 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Technology', subcategory: 'gaming',         limit: 20 } as Parameters<typeof fetchArticles>[0]),
  ]);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <HeroBanner articles={latest.slice(0, 5)} />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        <CategoryRow label="Latest Tech"      articles={latest}      accentColor="#FFE600" seeAllHref="/technology" />
        {techNews.length    > 0 && <CategoryRow label="Tech News"     articles={techNews}    accentColor="#FFE600" seeAllHref="/technology" />}
        {ai.length          > 0 && <CategoryRow label="AI & Innovation" articles={ai}        accentColor="#BF00FF" seeAllHref="/technology" />}
        {africanTech.length > 0 && <CategoryRow label="African Tech"  articles={africanTech} accentColor="#00FF94" seeAllHref="/technology" />}
        {gaming.length      > 0 && <CategoryRow label="Gaming"        articles={gaming}      accentColor="#FF6B00" seeAllHref="/technology" />}
      </div>
    </div>
  );
}
