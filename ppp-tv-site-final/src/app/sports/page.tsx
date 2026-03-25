import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Sports | PPP TV',
  description: 'Kenya and Africa sports - football, athletics, rugby, cricket and more.',
};

export default async function SportsPage() {
  const [sports, news, ent] = await Promise.all([
    fetchArticles({ category: 'Sports', limit: 80 }),
    fetchArticles({ category: 'News', limit: 10 }),
    fetchArticles({ category: 'Entertainment', limit: 10 }),
  ]);

  const hero = sports.slice(0, 5);
  const latest = sports.slice(0, 20);
  const football = sports.filter(a => {
    const t = (a.title + ' ' + a.excerpt).toLowerCase();
    return t.includes('football') || t.includes('premier league') || t.includes('fifa') || t.includes('soccer') || t.includes('harambee') || t.includes('afcon') || t.includes('champions league') || t.includes('bundesliga') || t.includes('la liga') || t.includes('serie a');
  }).slice(0, 20);
  const athletics = sports.filter(a => {
    const t = (a.title + ' ' + a.excerpt).toLowerCase();
    return t.includes('athletics') || t.includes('marathon') || t.includes('kipchoge') || t.includes('track') || t.includes('field') || t.includes('world record');
  }).slice(0, 20);
  const rugby = sports.filter(a => {
    const t = (a.title + ' ' + a.excerpt).toLowerCase();
    return t.includes('rugby') || t.includes('cricket') || t.includes('basketball') || t.includes('volleyball') || t.includes('netball');
  }).slice(0, 20);
  const africa = sports.filter(a => a.sourceName?.includes('SuperSport') || a.sourceName?.includes('CAF')).slice(0, 20);
  const global = sports.filter(a => a.sourceName?.includes('BBC Sport') || a.sourceName?.includes('Sky Sports') || a.sourceName?.includes('ESPN') || a.sourceName?.includes('Goal') || a.sourceName?.includes('FourFourTwo')).slice(0, 20);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {hero.length > 0 && <HeroBanner articles={hero} />}
      <div style={{ maxWidth: '1440px', margin: '0 auto', paddingTop: '1rem' }}>
        {latest.length > 0 && <CategoryRow label="Latest Sports" articles={latest} seeAllHref="/sports" accentColor="#00CFFF" />}
        {football.length > 0 && <CategoryRow label="Football" articles={football} seeAllHref="/sports" accentColor="#FF007A" />}
        {athletics.length > 0 && <CategoryRow label="Athletics & Running" articles={athletics} seeAllHref="/sports" accentColor="#FFE600" />}
        {rugby.length > 0 && <CategoryRow label="Rugby, Cricket & More" articles={rugby} seeAllHref="/sports" accentColor="#00FF94" />}
        {africa.length > 0 && <CategoryRow label="Africa Sports" articles={africa} seeAllHref="/sports" accentColor="#FF4500" />}
        {global.length > 0 && <CategoryRow label="Global Sports" articles={global} seeAllHref="/sports" accentColor="#BF00FF" />}
        {news.length > 0 && <CategoryRow label="Top News" articles={news} seeAllHref="/news" accentColor="#FF007A" />}
        {ent.length > 0 && <CategoryRow label="Entertainment" articles={ent} seeAllHref="/entertainment" accentColor="#BF00FF" />}
        {sports.length > 20 && <CategoryRow label="More Sports" articles={sports.slice(20)} seeAllHref="/sports" accentColor="#333" />}
      </div>
    </div>
  );
}
