import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import HeroBanner from '@/components/HeroBanner';
import CategoryRow from '@/components/CategoryRow';

export const metadata: Metadata = {
  title: 'Entertainment | PPP TV Kenya',
  description: 'Kenya, East Africa & global entertainment — celebrity, music, movies, fashion.',
};

export const revalidate = 300;

export default async function EntertainmentPage() {
  const [latest, celebrity, music, moviesTV, fashion, sports] = await Promise.all([
    fetchArticles({ category: 'Entertainment', limit: 20 }),
    fetchArticles({ category: 'Entertainment', subcategory: 'celebrity',  limit: 20 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Entertainment', subcategory: 'music',      limit: 20 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Entertainment', subcategory: 'movies-tv',  limit: 20 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Entertainment', subcategory: 'fashion',    limit: 20 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Sports',        limit: 8 }),
  ]);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <HeroBanner articles={latest.slice(0, 5)} />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        <CategoryRow label="Latest Entertainment"  articles={latest}    accentColor="#BF00FF" seeAllHref="/entertainment" />
        {celebrity.length  > 0 && <CategoryRow label="Celebrity"        articles={celebrity}  accentColor="#FF007A"  seeAllHref="/entertainment" />}
        {music.length      > 0 && <CategoryRow label="Music"            articles={music}      accentColor="#FF6B00"  seeAllHref="/entertainment" />}
        {moviesTV.length   > 0 && <CategoryRow label="Movies & TV"      articles={moviesTV}   accentColor="#BF00FF"  seeAllHref="/movies" />}
        {fashion.length    > 0 && <CategoryRow label="Fashion"          articles={fashion}    accentColor="#FF007A"  seeAllHref="/entertainment" />}
        {sports.length     > 0 && <CategoryRow label="Sports Highlights" articles={sports}    accentColor="#00CFFF"  seeAllHref="/sports" />}
      </div>
    </div>
  );
}
