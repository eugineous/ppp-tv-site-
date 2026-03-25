import type { Metadata } from 'next';
import { fetchArticles, fetchTrending } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';
import Top10Row from '@/components/Top10Row';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Trending | PPP TV',
  description: 'What Kenya is reading right now - trending and most popular stories.',
};

export default async function TrendingPage() {
  const [trending, recent, ent, sports, tech] = await Promise.all([
    fetchTrending(),
    fetchArticles({ sort: 'recent', limit: 60 }),
    fetchArticles({ category: 'Entertainment', limit: 12 }),
    fetchArticles({ category: 'Sports', limit: 12 }),
    fetchArticles({ category: 'Technology', limit: 12 }),
  ]);

  const hero = trending.length >= 3 ? trending.slice(0, 5) : recent.slice(0, 5);
  const top10 = trending.length >= 5 ? trending : recent.slice(0, 10);
  const news = recent.filter(a => a.category === 'News').slice(0, 12);
  const politics = recent.filter(a => a.category === 'Politics').slice(0, 12);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {hero.length > 0 && <HeroBanner articles={hero} />}
      <div style={{ maxWidth: '1440px', margin: '0 auto', paddingTop: '1rem' }}>
        {top10.length >= 3 && <Top10Row articles={top10} />}
        {recent.length > 0 && <CategoryRow label="🔥 Latest Stories" articles={recent.slice(0, 12)} seeAllHref="/trending" accentColor="#FF007A" />}
        {news.length > 0 && <CategoryRow label="Top News" articles={news} seeAllHref="/news" accentColor="#FF4500" />}
        {politics.length > 0 && <CategoryRow label="Politics" articles={politics} seeAllHref="/politics" accentColor="#FF6B00" />}
        {ent.length > 0 && <CategoryRow label="Entertainment" articles={ent} seeAllHref="/entertainment" accentColor="#BF00FF" />}
        {sports.length > 0 && <CategoryRow label="Sports" articles={sports} seeAllHref="/sports" accentColor="#00CFFF" />}
        {tech.length > 0 && <CategoryRow label="Technology" articles={tech} seeAllHref="/technology" accentColor="#FFE600" />}
        {recent.length > 12 && <CategoryRow label="More Stories" articles={recent.slice(12)} seeAllHref="/trending" accentColor="#555" />}
      </div>
    </div>
  );
}
