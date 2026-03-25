import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Movies & Film | PPP TV',
  description: 'Movie reviews, trailers, box office and film news from Hollywood and Africa.',
};

export default async function MoviesPage() {
  const [movies, ent, music] = await Promise.all([
    fetchArticles({ category: 'Movies', limit: 60 }),
    fetchArticles({ category: 'Entertainment', limit: 12 }),
    fetchArticles({ category: 'Music', limit: 12 }),
  ]);

  const hero = movies.length > 0 ? movies.slice(0, 5) : ent.slice(0, 5);
  const reviews = movies.filter(a => a.sourceName?.includes('Empire') || a.sourceName?.includes('RogerEbert') || a.sourceName?.includes('IndieWire')).slice(0, 12);
  const news = movies.filter(a => a.sourceName?.includes('Collider') || a.sourceName?.includes('Screen Rant') || a.sourceName?.includes('SlashFilm') || a.sourceName?.includes('CinemaBlend')).slice(0, 12);
  const global = movies.filter(a => a.sourceName?.includes('IGN')).slice(0, 12);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {hero.length > 0 && <HeroBanner articles={hero} />}
      <div style={{ maxWidth: '1440px', margin: '0 auto', paddingTop: '1rem' }}>
        {movies.length > 0 && <CategoryRow label="Movies & Film" articles={movies.slice(0, 12)} seeAllHref="/movies" accentColor="#E50914" />}
        {reviews.length > 0 && <CategoryRow label="Reviews & Critics" articles={reviews} seeAllHref="/movies" accentColor="#FF007A" />}
        {news.length > 0 && <CategoryRow label="Movie News" articles={news} seeAllHref="/movies" accentColor="#FF6B00" />}
        {global.length > 0 && <CategoryRow label="Gaming & More" articles={global} seeAllHref="/movies" accentColor="#BF00FF" />}
        {ent.length > 0 && <CategoryRow label="Entertainment" articles={ent} seeAllHref="/entertainment" accentColor="#BF00FF" />}
        {music.length > 0 && <CategoryRow label="Music" articles={music} seeAllHref="/entertainment" accentColor="#FF6B00" />}
        {movies.length > 12 && <CategoryRow label="More Movies" articles={movies.slice(12)} seeAllHref="/movies" accentColor="#333" />}
      </div>
    </div>
  );
}
