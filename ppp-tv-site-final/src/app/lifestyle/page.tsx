import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Lifestyle | PPP TV',
  description: 'Lifestyle, health, fashion, food and culture from Kenya and Africa.',
};

export default async function LifestylePage() {
  const [lifestyle, ent, tech] = await Promise.all([
    fetchArticles({ category: 'Lifestyle', limit: 40 }),
    fetchArticles({ category: 'Entertainment', limit: 20 }),
    fetchArticles({ category: 'Technology', limit: 12 }),
  ]);

  const hero = lifestyle.length > 0 ? lifestyle.slice(0, 5) : ent.slice(0, 5);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {hero.length > 0 && <HeroBanner articles={hero} />}
      <div style={{ maxWidth: '1440px', margin: '0 auto', paddingTop: '1rem' }}>
        {lifestyle.length > 0 && <CategoryRow label="Lifestyle" articles={lifestyle.slice(0, 12)} seeAllHref="/lifestyle" accentColor="#00FF94" />}
        {ent.length > 0 && <CategoryRow label="Entertainment" articles={ent.slice(0, 12)} seeAllHref="/entertainment" accentColor="#BF00FF" />}
        {tech.length > 0 && <CategoryRow label="Technology" articles={tech} seeAllHref="/technology" accentColor="#FFE600" />}
        {lifestyle.length > 12 && <CategoryRow label="More Lifestyle" articles={lifestyle.slice(12)} seeAllHref="/lifestyle" accentColor="#333" />}
      </div>
    </div>
  );
}
