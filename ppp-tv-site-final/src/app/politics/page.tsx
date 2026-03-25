import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Politics | PPP TV',
  description: 'Kenya politics news - government, parliament, elections and policy.',
};

export default async function PoliticsPage() {
  const [politics, news] = await Promise.all([
    fetchArticles({ category: 'Politics', limit: 40 }),
    fetchArticles({ category: 'News', limit: 20 }),
  ]);

  const hero = politics.slice(0, 5);
  const kenya = politics.filter(a => a.sourceName?.includes('Nation') || a.sourceName?.includes('Standard') || a.sourceName?.includes('Star') || a.sourceName?.includes('Capital')).slice(0, 12);
  const all = politics.slice(0, 12);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {hero.length > 0 && <HeroBanner articles={hero} />}
      <div style={{ maxWidth: '1440px', margin: '0 auto', paddingTop: '1rem' }}>
        {all.length > 0 && <CategoryRow label="Kenya Politics" articles={all} seeAllHref="/politics" accentColor="#FF4500" />}
        {kenya.length > 0 && <CategoryRow label="Government & Parliament" articles={kenya} seeAllHref="/politics" accentColor="#FF007A" />}
        {news.length > 0 && <CategoryRow label="Latest News" articles={news} seeAllHref="/news" accentColor="#555" />}
        {politics.length > 12 && <CategoryRow label="More Politics" articles={politics.slice(12)} seeAllHref="/politics" accentColor="#333" />}
      </div>
    </div>
  );
}
