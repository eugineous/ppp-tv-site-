import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';
import Top10Row from '@/components/Top10Row';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Kenya News | PPP TV',
  description: 'Latest Kenya and Africa news - breaking stories, politics, business, health and more.',
};

export default async function NewsPage() {
  const [news, politics, business, health, world] = await Promise.all([
    fetchArticles({ category: 'News', limit: 60 }),
    fetchArticles({ category: 'Politics', limit: 20 }),
    fetchArticles({ category: 'Business', limit: 20 }),
    fetchArticles({ category: 'Health', limit: 20 }),
    fetchArticles({ category: 'News', limit: 80 }),
  ]);

  const hero = news.slice(0, 5);
  const breaking = news.slice(0, 20);
  const kenya = news.filter(a => ['Nation Africa','Standard Media','The Star Kenya','Capital FM Kenya','Citizen Digital','KBC Kenya','People Daily Kenya'].some(s => a.sourceName?.includes(s.split(' ')[0]))).slice(0, 20);
  const eastAfrica = news.filter(a => a.sourceName?.includes('East African') || a.sourceName?.includes('Monitor') || a.sourceName?.includes('Citizen Tanzania') || a.sourceName?.includes('New Vision')).slice(0, 20);
  const africa = news.filter(a => a.sourceName?.includes('Africa News') || a.sourceName?.includes('Al Jazeera') || a.sourceName?.includes('BBC') || a.sourceName?.includes('Vanguard') || a.sourceName?.includes('Premium Times') || a.sourceName?.includes('Joy Online') || a.sourceName?.includes('Times Live') || a.sourceName?.includes('News24')).slice(0, 20);
  const global = news.filter(a => a.sourceName?.includes('Reuters')).slice(0, 20);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {hero.length > 0 && <HeroBanner articles={hero} />}
      <div style={{ maxWidth: '1440px', margin: '0 auto', paddingTop: '1rem' }}>
        {breaking.length > 0 && <CategoryRow label="Breaking News" articles={breaking.slice(0, 20)} seeAllHref="/news" accentColor="#FF007A" />}
        {news.length >= 5 && <Top10Row articles={news.slice(0, 10)} />}
        {kenya.length > 0 && <CategoryRow label="Kenya & Nairobi" articles={kenya} seeAllHref="/news" accentColor="#FF4500" />}
        {politics.length > 0 && <CategoryRow label="Politics" articles={politics} seeAllHref="/politics" accentColor="#FF6B00" />}
        {eastAfrica.length > 0 && <CategoryRow label="East Africa" articles={eastAfrica} seeAllHref="/news" accentColor="#00CFFF" />}
        {africa.length > 0 && <CategoryRow label="Africa" articles={africa} seeAllHref="/news" accentColor="#BF00FF" />}
        {business.length > 0 && <CategoryRow label="Business & Economy" articles={business} seeAllHref="/business" accentColor="#FFE600" />}
        {health.length > 0 && <CategoryRow label="Health" articles={health} seeAllHref="/health" accentColor="#00FF94" />}
        {global.length > 0 && <CategoryRow label="World News" articles={global} seeAllHref="/news" accentColor="#555" />}
        {news.length > 20 && <CategoryRow label="More News" articles={news.slice(20)} seeAllHref="/news" accentColor="#333" />}
      </div>
    </div>
  );
}
