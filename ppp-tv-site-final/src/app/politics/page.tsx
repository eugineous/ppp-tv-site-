import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Politics | PPP TV',
  description: 'Kenya politics - government, parliament, elections, policy and Africa politics.',
};

export default async function PoliticsPage() {
  const [politics, news, business, eastAfrica] = await Promise.all([
    fetchArticles({ category: 'Politics', limit: 60 }),
    fetchArticles({ category: 'News', limit: 20 }),
    fetchArticles({ category: 'Business', limit: 20 }),
    fetchArticles({ category: 'News', limit: 40 }),
  ]);

  const hero = politics.length > 0 ? politics.slice(0, 5) : news.slice(0, 5);
  const kenya = politics.filter(a => a.sourceName?.includes('Nation') || a.sourceName?.includes('Standard') || a.sourceName?.includes('Star') || a.sourceName?.includes('Capital') || a.sourceName?.includes('Citizen') || a.sourceName?.includes('KBC')).slice(0, 20);
  const parliament = politics.filter(a => {
    const t = (a.title + ' ' + a.excerpt).toLowerCase();
    return t.includes('parliament') || t.includes('mp ') || t.includes('senator') || t.includes('cabinet') || t.includes('ruto') || t.includes('raila') || t.includes('uhuru') || t.includes('government');
  }).slice(0, 20);
  const africa = eastAfrica.filter(a => a.sourceName?.includes('Monitor') || a.sourceName?.includes('Citizen Tanzania') || a.sourceName?.includes('Vanguard') || a.sourceName?.includes('Premium Times') || a.sourceName?.includes('Joy Online')).slice(0, 20);
  const breaking = news.filter(a => a.sourceName?.includes('Nation') || a.sourceName?.includes('Standard') || a.sourceName?.includes('Star')).slice(0, 20);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {hero.length > 0 && <HeroBanner articles={hero} />}
      <div style={{ maxWidth: '1440px', margin: '0 auto', paddingTop: '1rem' }}>
        {politics.length > 0 && <CategoryRow label="Kenya Politics" articles={politics.slice(0, 20)} seeAllHref="/politics" accentColor="#FF4500" />}
        {kenya.length > 0 && <CategoryRow label="Government & Policy" articles={kenya} seeAllHref="/politics" accentColor="#FF007A" />}
        {parliament.length > 0 && <CategoryRow label="Parliament & Leaders" articles={parliament} seeAllHref="/politics" accentColor="#FF6B00" />}
        {africa.length > 0 && <CategoryRow label="Africa Politics" articles={africa} seeAllHref="/politics" accentColor="#BF00FF" />}
        {business.length > 0 && <CategoryRow label="Business & Economy" articles={business} seeAllHref="/business" accentColor="#FFE600" />}
        {breaking.length > 0 && <CategoryRow label="Breaking News" articles={breaking} seeAllHref="/news" accentColor="#00CFFF" />}
        {news.length > 0 && <CategoryRow label="Latest News" articles={news} seeAllHref="/news" accentColor="#555" />}
        {politics.length > 20 && <CategoryRow label="More Politics" articles={politics.slice(20)} seeAllHref="/politics" accentColor="#333" />}
      </div>
    </div>
  );
}
