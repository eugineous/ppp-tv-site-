import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';
import Top10Row from '@/components/Top10Row';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Kenya News | PPP TV',
  description: 'Latest Kenya and Africa news - breaking stories, politics, business and more.',
};

export default async function NewsPage() {
  const [news, politics, world] = await Promise.all([
    fetchArticles({ category: 'News', limit: 40 }),
    fetchArticles({ category: 'Politics', limit: 12 }),
    fetchArticles({ sort: 'recent', limit: 60 }),
  ]);

  const hero = news.slice(0, 5);
  const breaking = news.slice(0, 12);
  const kenya = news.filter(a => a.sourceName?.includes('Nation') || a.sourceName?.includes('Standard') || a.sourceName?.includes('Star') || a.sourceName?.includes('Capital') || a.sourceName?.includes('Citizen')).slice(0, 12);
  const africa = world.filter(a => a.sourceName?.includes('Africa') || a.sourceName?.includes('East African') || a.sourceName?.includes('Al Jazeera') || a.sourceName?.includes('BBC')).slice(0, 12);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {hero.length > 0 && <HeroBanner articles={hero} />}
      <div style={{ maxWidth: '1440px', margin: '0 auto', paddingTop: '1rem' }}>
        {breaking.length > 0 && <CategoryRow label="Breaking News" articles={breaking} seeAllHref="/news" accentColor="#FF007A" />}
        {news.length >= 5 && <Top10Row articles={news.slice(0, 10)} />}
        {kenya.length > 0 && <CategoryRow label="Kenya & Nairobi" articles={kenya} seeAllHref="/news" accentColor="#FF4500" />}
        {politics.length > 0 && <CategoryRow label="Politics" articles={politics} seeAllHref="/politics" accentColor="#FF6B00" />}
        {africa.length > 0 && <CategoryRow label="Africa & World" articles={africa} seeAllHref="/news" accentColor="#BF00FF" />}
        {news.length > 12 && <CategoryRow label="More News" articles={news.slice(12)} seeAllHref="/news" accentColor="#555" />}
      </div>
    </div>
  );
}
