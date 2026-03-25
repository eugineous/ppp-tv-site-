import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Lifestyle | PPP TV',
  description: 'Lifestyle, health, fashion, food, travel and culture from Kenya and Africa.',
};

export default async function LifestylePage() {
  const [lifestyle, health, ent, music, tech, news] = await Promise.all([
    fetchArticles({ category: 'Lifestyle', limit: 50 }),
    fetchArticles({ category: 'Health', limit: 12 }),
    fetchArticles({ category: 'Entertainment', limit: 12 }),
    fetchArticles({ category: 'Music', limit: 12 }),
    fetchArticles({ category: 'Technology', limit: 8 }),
    fetchArticles({ category: 'News', limit: 8 }),
  ]);

  const hero = lifestyle.length > 0 ? lifestyle.slice(0, 5) : ent.slice(0, 5);
  const kenya = lifestyle.filter(a => a.sourceName?.includes('Standard') || a.sourceName?.includes('Nation') || a.sourceName?.includes('Pulse') || a.sourceName?.includes('Tuko')).slice(0, 12);
  const africa = lifestyle.filter(a => a.sourceName?.includes('BellaNaija')).slice(0, 12);
  const global = lifestyle.filter(a => a.sourceName?.includes('Vogue') || a.sourceName?.includes('Elle')).slice(0, 12);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {hero.length > 0 && <HeroBanner articles={hero} />}
      <div style={{ maxWidth: '1440px', margin: '0 auto', paddingTop: '1rem' }}>
        {lifestyle.length > 0 && <CategoryRow label="Lifestyle" articles={lifestyle.slice(0, 12)} seeAllHref="/lifestyle" accentColor="#00FF94" />}
        {kenya.length > 0 && <CategoryRow label="Kenya Lifestyle" articles={kenya} seeAllHref="/lifestyle" accentColor="#FF007A" />}
        {health.length > 0 && <CategoryRow label="Health & Wellness" articles={health} seeAllHref="/health" accentColor="#00CFFF" />}
        {africa.length > 0 && <CategoryRow label="Africa Lifestyle" articles={africa} seeAllHref="/lifestyle" accentColor="#BF00FF" />}
        {global.length > 0 && <CategoryRow label="Fashion & Global" articles={global} seeAllHref="/lifestyle" accentColor="#FF6B00" />}
        {ent.length > 0 && <CategoryRow label="Entertainment" articles={ent} seeAllHref="/entertainment" accentColor="#BF00FF" />}
        {music.length > 0 && <CategoryRow label="Music" articles={music} seeAllHref="/entertainment" accentColor="#FF6B00" />}
        {tech.length > 0 && <CategoryRow label="Technology" articles={tech} seeAllHref="/technology" accentColor="#FFE600" />}
        {news.length > 0 && <CategoryRow label="Top News" articles={news} seeAllHref="/news" accentColor="#FF007A" />}
        {lifestyle.length > 12 && <CategoryRow label="More Lifestyle" articles={lifestyle.slice(12)} seeAllHref="/lifestyle" accentColor="#333" />}
      </div>
    </div>
  );
}
