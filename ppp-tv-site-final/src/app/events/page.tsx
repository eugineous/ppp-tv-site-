import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import ArticleCard from '@/components/ArticleCard';
import SectionLabel from '@/components/SectionLabel';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Events',
  description: 'Kenya and Africa events — concerts, festivals, sports and more.',
};

export default async function EventsPage() {
  const articles = await fetchArticles({ category: 'Events', sort: 'recent', limit: 24 });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10">
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#00CFFF' }}>Events</span>
        <h1 className="font-bebas text-5xl text-white tracking-wide mt-1">Kenya &amp; Africa Events</h1>
        <p className="text-gray-500 text-sm mt-1">Concerts, festivals, sports events and more.</p>
      </div>

      {articles.length > 0 ? (
        <>
          <SectionLabel label="Latest Events" color="#00CFFF" />
          <div className="cat-row-scroll">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} accentColor="#00CFFF" />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-2">No events found right now.</p>
          <p className="text-gray-600 text-sm">Check back soon — events are updated every 15 minutes.</p>
        </div>
      )}
    </div>
  );
}
