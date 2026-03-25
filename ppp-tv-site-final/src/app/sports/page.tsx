import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Sports | PPP TV',
  description: 'Kenya and Africa sports news - football, athletics, rugby and more.',
};

export default async function SportsPage() {
  const [sports, ent] = await Promise.all([
    fetchArticles({ category: 'Sports', limit: 40 }),
    fetchArticles({ category: 'Entertainment', limit: 12 }),
  ]);

  const hero = sports.slice(0, 5);
  const football = sports.filter(a => {
    const t = (a.title + ' ' + a.excerpt).toLowerCase();
    return t.includes('football') || t.includes('premier league') || t.includes('fifa') || t.includes('soccer') || t.includes('salah') || t.includes('harambee');
  }).slice(0, 12);
  const athletics = sports.filter(a => {
    const t = (a.title + ' ' + a.excerpt).toLowerCase();
    return t.includes('athletics') || t.includes('marathon') || t.includes('kipchoge') || t.includes('rugby') || t.includes('cricket') || t.includes('basketball');
  }).slice(0, 12);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {hero.length > 0 && <HeroBanner articles={hero} />}
      <div style={{ maxWidth: '1440px', margin: '0 auto', paddingTop: '1rem' }}>
        {sports.length > 0 && <CategoryRow label="Latest Sports" articles={sports.slice(0, 12)} seeAllHref="/sports" accentColor="#00CFFF" />}
        {football.length > 0 && <CategoryRow label="Football" articles={football} seeAllHref="/sports" accentColor="#FF007A" />}
        {athletics.length > 0 && <CategoryRow label="Athletics & More" articles={athletics} seeAllHref="/sports" accentColor="#FFE600" />}
        {ent.length > 0 && <CategoryRow label="Entertainment" articles={ent.slice(0, 8)} seeAllHref="/entertainment" accentColor="#BF00FF" />}
        {sports.length > 12 && <CategoryRow label="More Sports" articles={sports.slice(12)} seeAllHref="/sports" accentColor="#333" />}
      </div>
    </div>
  );
}
