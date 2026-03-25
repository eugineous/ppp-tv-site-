import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Technology | PPP TV',
  description: 'Africa tech news - startups, mobile money, AI, innovation and digital trends.',
};

export default async function TechnologyPage() {
  const [tech, science, business, news, lifestyle] = await Promise.all([
    fetchArticles({ category: 'Technology', limit: 60 }),
    fetchArticles({ category: 'Science', limit: 12 }),
    fetchArticles({ category: 'Business', limit: 12 }),
    fetchArticles({ category: 'News', limit: 8 }),
    fetchArticles({ category: 'Lifestyle', limit: 8 }),
  ]);

  const hero = tech.length > 0 ? tech.slice(0, 5) : news.slice(0, 5);
  const africa = tech.filter(a => a.sourceName?.includes('Techweez') || a.sourceName?.includes('TechCabal') || a.sourceName?.includes('HumanIPO') || a.sourceName?.includes('Disrupt Africa')).slice(0, 12);
  const global = tech.filter(a => a.sourceName?.includes('TechCrunch') || a.sourceName?.includes('Verge') || a.sourceName?.includes('Ars Technica') || a.sourceName?.includes('Wired') || a.sourceName?.includes('Engadget')).slice(0, 12);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {hero.length > 0 && <HeroBanner articles={hero} />}
      <div style={{ maxWidth: '1440px', margin: '0 auto', paddingTop: '1rem' }}>
        {tech.length > 0 && <CategoryRow label="Technology" articles={tech.slice(0, 12)} seeAllHref="/technology" accentColor="#FFE600" />}
        {africa.length > 0 && <CategoryRow label="Africa Tech & Startups" articles={africa} seeAllHref="/technology" accentColor="#00CFFF" />}
        {global.length > 0 && <CategoryRow label="Global Tech" articles={global} seeAllHref="/technology" accentColor="#BF00FF" />}
        {science.length > 0 && <CategoryRow label="Science & Innovation" articles={science} seeAllHref="/science" accentColor="#00FF94" />}
        {business.length > 0 && <CategoryRow label="Business & Finance" articles={business} seeAllHref="/business" accentColor="#FF6B00" />}
        {news.length > 0 && <CategoryRow label="Top News" articles={news} seeAllHref="/news" accentColor="#FF007A" />}
        {lifestyle.length > 0 && <CategoryRow label="Lifestyle" articles={lifestyle} seeAllHref="/lifestyle" accentColor="#00FF94" />}
        {tech.length > 12 && <CategoryRow label="More Technology" articles={tech.slice(12)} seeAllHref="/technology" accentColor="#333" />}
      </div>
    </div>
  );
}
