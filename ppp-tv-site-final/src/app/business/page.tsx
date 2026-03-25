import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';
import Top10Row from '@/components/Top10Row';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Business & Economy | PPP TV',
  description: 'Kenya and Africa business news - markets, finance, trade and economy.',
};

export default async function BusinessPage() {
  const [business, tech, news, politics] = await Promise.all([
    fetchArticles({ category: 'Business', limit: 60 }),
    fetchArticles({ category: 'Technology', limit: 12 }),
    fetchArticles({ category: 'News', limit: 12 }),
    fetchArticles({ category: 'Politics', limit: 8 }),
  ]);

  const hero = business.length > 0 ? business.slice(0, 5) : news.slice(0, 5);
  const kenya = business.filter(a => a.sourceName?.includes('Business Daily') || a.sourceName?.includes('Standard Business') || a.sourceName?.includes('Nation Business') || a.sourceName?.includes('Capital FM Business')).slice(0, 12);
  const africa = business.filter(a => a.sourceName?.includes('EA Business') || a.sourceName?.includes('Financial Times')).slice(0, 12);
  const global = business.filter(a => a.sourceName?.includes('Bloomberg') || a.sourceName?.includes('Wall Street') || a.sourceName?.includes('CNBC')).slice(0, 12);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {hero.length > 0 && <HeroBanner articles={hero} />}
      <div style={{ maxWidth: '1440px', margin: '0 auto', paddingTop: '1rem' }}>
        {business.length > 0 && <CategoryRow label="Business & Economy" articles={business.slice(0, 12)} seeAllHref="/business" accentColor="#FFE600" />}
        {business.length >= 5 && <Top10Row articles={business.slice(0, 10)} />}
        {kenya.length > 0 && <CategoryRow label="Kenya Business" articles={kenya} seeAllHref="/business" accentColor="#FF007A" />}
        {africa.length > 0 && <CategoryRow label="Africa & East Africa" articles={africa} seeAllHref="/business" accentColor="#FF4500" />}
        {global.length > 0 && <CategoryRow label="Global Markets" articles={global} seeAllHref="/business" accentColor="#BF00FF" />}
        {tech.length > 0 && <CategoryRow label="Technology" articles={tech} seeAllHref="/technology" accentColor="#00CFFF" />}
        {politics.length > 0 && <CategoryRow label="Politics & Policy" articles={politics} seeAllHref="/politics" accentColor="#FF6B00" />}
        {news.length > 0 && <CategoryRow label="Top News" articles={news} seeAllHref="/news" accentColor="#555" />}
        {business.length > 12 && <CategoryRow label="More Business" articles={business.slice(12)} seeAllHref="/business" accentColor="#333" />}
      </div>
    </div>
  );
}
