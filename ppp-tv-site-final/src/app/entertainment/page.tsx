import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Entertainment & Music | PPP TV',
  description: 'Kenya entertainment, celebrity, music, movies and lifestyle news.',
};

export default async function EntertainmentPage() {
  const [ent, music, movies, lifestyle, sports] = await Promise.all([
    fetchArticles({ category: 'Entertainment', limit: 60 }),
    fetchArticles({ category: 'Music', limit: 20 }),
    fetchArticles({ category: 'Movies', limit: 20 }),
    fetchArticles({ category: 'Lifestyle', limit: 20 }),
    fetchArticles({ category: 'Sports', limit: 10 }),
  ]);

  const hero = ent.slice(0, 5);
  const kenya = ent.filter(a => ['SDE Kenya','Ghafla Kenya','Mpasho','Pulse Live Kenya','Tuko Kenya'].some(s => a.sourceName?.includes(s.split(' ')[0]))).slice(0, 20);
  const celebrity = ent.filter(a => a.sourceName?.includes('BellaNaija') || a.sourceName?.includes('Ghafla') || a.sourceName?.includes('Mpasho') || a.sourceName?.includes('SDE')).slice(0, 20);
  const africa = ent.filter(a => a.sourceName?.includes('Pulse Nigeria') || a.sourceName?.includes('Pulse Ghana') || a.sourceName?.includes('This Is Africa')).slice(0, 20);
  const global = ent.filter(a => a.sourceName?.includes('Variety') || a.sourceName?.includes('Deadline') || a.sourceName?.includes('Hollywood Reporter') || a.sourceName?.includes('Entertainment Weekly')).slice(0, 20);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {hero.length > 0 && <HeroBanner articles={hero} />}
      <div style={{ maxWidth: '1440px', margin: '0 auto', paddingTop: '1rem' }}>
        {ent.length > 0 && <CategoryRow label="Latest Entertainment" articles={ent.slice(0, 20)} seeAllHref="/entertainment" accentColor="#BF00FF" />}
        {kenya.length > 0 && <CategoryRow label="Kenya Entertainment" articles={kenya} seeAllHref="/entertainment" accentColor="#FF007A" />}
        {celebrity.length > 0 && <CategoryRow label="Celebrity & Gossip" articles={celebrity} seeAllHref="/entertainment" accentColor="#FF4500" />}
        {music.length > 0 && <CategoryRow label="Music" articles={music} seeAllHref="/entertainment" accentColor="#FF6B00" />}
        {africa.length > 0 && <CategoryRow label="Africa Entertainment" articles={africa} seeAllHref="/entertainment" accentColor="#00CFFF" />}
        {movies.length > 0 && <CategoryRow label="Movies & Film" articles={movies} seeAllHref="/movies" accentColor="#E50914" />}
        {global.length > 0 && <CategoryRow label="Hollywood & Global" articles={global} seeAllHref="/entertainment" accentColor="#FFE600" />}
        {lifestyle.length > 0 && <CategoryRow label="Lifestyle" articles={lifestyle} seeAllHref="/lifestyle" accentColor="#00FF94" />}
        {sports.length > 0 && <CategoryRow label="Sports" articles={sports} seeAllHref="/sports" accentColor="#00CFFF" />}
        {ent.length > 20 && <CategoryRow label="More Entertainment" articles={ent.slice(20)} seeAllHref="/entertainment" accentColor="#333" />}
      </div>
    </div>
  );
}
