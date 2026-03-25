import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Technology | PPP TV',
  description: 'Africa tech news - startups, mobile money, innovation and digital trends.',
};

export default async function TechnologyPage() {
  const [tech, news, lifestyle] = await Promise.all([
    fetchArticles({ category: 'Technology', limit: 40 }),
    fetchArticles({ category: 'News', limit: 12 }),
    fetchArticles({ category: 'Lifestyle', limit: 12 }),
  ]);

  const hero = tech.length > 0 ? tech.slice(0, 5) : news.slice(0, 5);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {hero.length > 0 && <HeroBanner articles={hero} />}
      <div style={{ maxWidth: '1440px', margin: '0 auto', paddingTop: '1rem' }}>
        {tech.length > 0 && <CategoryRow label="Technology" articles={tech.slice(0, 12)} seeAllHref="/technology" accentColor="#FFE600" />}
        {news.length > 0 && <CategoryRow label="News" articles={news} seeAllHref="/news" accentColor="#FF007A" />}
        {lifestyle.length > 0 && <CategoryRow label="Lifestyle" articles={lifestyle} seeAllHref="/lifestyle" accentColor="#00FF94" />}
        {tech.length > 12 && <CategoryRow label="More Technology" articles={tech.slice(12)} seeAllHref="/technology" accentColor="#333" />}
      </div>
    </div>
  );
}
