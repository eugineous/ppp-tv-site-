import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Health | PPP TV',
  description: 'Health and wellness news - medical breakthroughs, fitness, nutrition and wellbeing.',
};

export default async function HealthPage() {
  const [health, science, lifestyle, news] = await Promise.all([
    fetchArticles({ category: 'Health', limit: 60 }),
    fetchArticles({ category: 'Science', limit: 20 }),
    fetchArticles({ category: 'Lifestyle', limit: 20 }),
    fetchArticles({ category: 'News', limit: 10 }),
  ]);

  const hero = health.length > 0 ? health.slice(0, 5) : news.slice(0, 5);
  const kenya = health.filter(a => a.sourceName?.includes('Nation') || a.sourceName?.includes('Standard')).slice(0, 20);
  const global = health.filter(a => a.sourceName?.includes('WHO') || a.sourceName?.includes('Medical News') || a.sourceName?.includes('Healthline') || a.sourceName?.includes('WebMD') || a.sourceName?.includes('Science Daily')).slice(0, 20);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {hero.length > 0 && <HeroBanner articles={hero} />}
      <div style={{ maxWidth: '1440px', margin: '0 auto', paddingTop: '1rem' }}>
        {health.length > 0 && <CategoryRow label="Health & Wellness" articles={health.slice(0, 20)} seeAllHref="/health" accentColor="#00FF94" />}
        {kenya.length > 0 && <CategoryRow label="Kenya Health" articles={kenya} seeAllHref="/health" accentColor="#FF007A" />}
        {global.length > 0 && <CategoryRow label="Global Health" articles={global} seeAllHref="/health" accentColor="#00CFFF" />}
        {science.length > 0 && <CategoryRow label="Science & Research" articles={science} seeAllHref="/science" accentColor="#BF00FF" />}
        {lifestyle.length > 0 && <CategoryRow label="Lifestyle & Fitness" articles={lifestyle} seeAllHref="/lifestyle" accentColor="#FFE600" />}
        {news.length > 0 && <CategoryRow label="Top News" articles={news} seeAllHref="/news" accentColor="#FF007A" />}
        {health.length > 20 && <CategoryRow label="More Health" articles={health.slice(20)} seeAllHref="/health" accentColor="#333" />}
      </div>
    </div>
  );
}
