import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';

export const metadata: Metadata = {
  title: 'Sports | PPP TV Kenya',
  description: 'Football, basketball, athletics, rugby and more — Kenya, Africa & global sports.',
};

export const revalidate = 300;

export default async function SportsPage() {
  const [latest, football, basketball, athletics, rugby, boxing, kenyan] = await Promise.all([
    fetchArticles({ category: 'Sports', limit: 20 }),
    fetchArticles({ category: 'Sports', subcategory: 'football',     limit: 20 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Sports', subcategory: 'basketball',   limit: 20 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Sports', subcategory: 'athletics',    limit: 20 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Sports', subcategory: 'rugby',        limit: 20 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Sports', subcategory: 'boxing-mma',   limit: 20 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Sports', subcategory: 'kenyan-sports', limit: 20 } as Parameters<typeof fetchArticles>[0]),
  ]);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <HeroBanner articles={latest.slice(0, 5)} />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        <CategoryRow label="Latest Sports"    articles={latest}     accentColor="#00CFFF" seeAllHref="/sports" />
        {football.length   > 0 && <CategoryRow label="Football"     articles={football}   accentColor="#00CFFF" seeAllHref="/sports" />}
        {basketball.length > 0 && <CategoryRow label="Basketball"   articles={basketball} accentColor="#FF6B00" seeAllHref="/sports" />}
        {athletics.length  > 0 && <CategoryRow label="Athletics"    articles={athletics}  accentColor="#00FF94" seeAllHref="/sports" />}
        {rugby.length      > 0 && <CategoryRow label="Rugby"        articles={rugby}      accentColor="#00CFFF" seeAllHref="/sports" />}
        {boxing.length     > 0 && <CategoryRow label="Boxing & MMA" articles={boxing}     accentColor="#FF007A" seeAllHref="/sports" />}
        {kenyan.length     > 0 && <CategoryRow label="Kenyan Sports" articles={kenyan}    accentColor="#FFE600" seeAllHref="/sports" />}
      </div>
    </div>
  );
}
