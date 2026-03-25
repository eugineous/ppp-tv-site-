import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Science | PPP TV',
  description: 'Science news - space, medicine, environment, climate and discoveries.',
};

export default async function SciencePage() {
  const [science, health, tech, news] = await Promise.all([
    fetchArticles({ category: 'Science', limit: 60 }),
    fetchArticles({ category: 'Health', limit: 12 }),
    fetchArticles({ category: 'Technology', limit: 12 }),
    fetchArticles({ category: 'News', limit: 8 }),
  ]);

  const hero = science.length > 0 ? science.slice(0, 5) : news.slice(0, 5);
  const space = science.filter(a => a.sourceName?.includes('NASA') || (a.title + ' ' + a.excerpt).toLowerCase().includes('space') || (a.title + ' ' + a.excerpt).toLowerCase().includes('nasa') || (a.title + ' ' + a.excerpt).toLowerCase().includes('planet')).slice(0, 12);
  const environment = science.filter(a => {
    const t = (a.title + ' ' + a.excerpt).toLowerCase();
    return t.includes('climate') || t.includes('environment') || t.includes('nature') || t.includes('wildlife') || t.includes('ocean');
  }).slice(0, 12);
  const research = science.filter(a => a.sourceName?.includes('Nature') || a.sourceName?.includes('Scientific American') || a.sourceName?.includes('New Scientist')).slice(0, 12);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {hero.length > 0 && <HeroBanner articles={hero} />}
      <div style={{ maxWidth: '1440px', margin: '0 auto', paddingTop: '1rem' }}>
        {science.length > 0 && <CategoryRow label="Science & Discovery" articles={science.slice(0, 12)} seeAllHref="/science" accentColor="#00CFFF" />}
        {space.length > 0 && <CategoryRow label="Space & Astronomy" articles={space} seeAllHref="/science" accentColor="#BF00FF" />}
        {environment.length > 0 && <CategoryRow label="Environment & Climate" articles={environment} seeAllHref="/science" accentColor="#00FF94" />}
        {research.length > 0 && <CategoryRow label="Research & Journals" articles={research} seeAllHref="/science" accentColor="#FFE600" />}
        {health.length > 0 && <CategoryRow label="Health & Medicine" articles={health} seeAllHref="/health" accentColor="#FF007A" />}
        {tech.length > 0 && <CategoryRow label="Technology" articles={tech} seeAllHref="/technology" accentColor="#FFE600" />}
        {news.length > 0 && <CategoryRow label="Top News" articles={news} seeAllHref="/news" accentColor="#FF007A" />}
        {science.length > 12 && <CategoryRow label="More Science" articles={science.slice(12)} seeAllHref="/science" accentColor="#333" />}
      </div>
    </div>
  );
}
