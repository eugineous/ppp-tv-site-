import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Entertainment & Music | PPP TV',
  description: 'Kenya entertainment, celebrity, music and lifestyle news.',
};

export default async function EntertainmentPage() {
  const [ent, music, lifestyle] = await Promise.all([
    fetchArticles({ category: 'Entertainment', limit: 50 }),
    fetchArticles({ category: 'Music', limit: 12 }),
    fetchArticles({ category: 'Lifestyle', limit: 12 }),
  ]);

  const hero = ent.slice(0, 5);
  const celebrity = ent.filter(a => a.sourceName?.includes('BellaNaija') || a.sourceName?.includes('Ghafla') || a.sourceName?.includes('Mpasho') || a.sourceName?.includes('SDE')).slice(0, 12);
  const pulse = ent.filter(a => a.sourceName?.includes('Pulse') || a.sourceName?.includes('Tuko')).slice(0, 12);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {hero.length > 0 && <HeroBanner articles={hero} />}
      <div style={{ maxWidth: '1440px', margin: '0 auto', paddingTop: '1rem' }}>
        {ent.length > 0 && <CategoryRow label="Latest Entertainment" articles={ent.slice(0, 12)} seeAllHref="/entertainment" accentColor="#BF00FF" />}
        {celebrity.length > 0 && <CategoryRow label="Celebrity & Gossip" articles={celebrity} seeAllHref="/entertainment" accentColor="#FF007A" />}
        {music.length > 0 && <CategoryRow label="Music" articles={music} seeAllHref="/entertainment" accentColor="#FF6B00" />}
        {pulse.length > 0 && <CategoryRow label="Trending Stories" articles={pulse} seeAllHref="/entertainment" accentColor="#00CFFF" />}
        {lifestyle.length > 0 && <CategoryRow label="Lifestyle" articles={lifestyle} seeAllHref="/lifestyle" accentColor="#00FF94" />}
        {ent.length > 12 && <CategoryRow label="More Entertainment" articles={ent.slice(12)} seeAllHref="/entertainment" accentColor="#333" />}
      </div>
    </div>
  );
}
