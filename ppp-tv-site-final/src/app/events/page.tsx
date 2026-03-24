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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-cyan-500/30">
        <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest rounded mb-3">
          Events
        </span>
        <h1 className="font-bebas text-4xl text-white tracking-wide">Kenya &amp; Africa Events</h1>
        <p className="text-gray-400 text-sm mt-1">Concerts, festivals, sports events and more.</p>
      </div>

      {articles.length > 0 ? (
        <>
          <SectionLabel label="Latest Events" accentColor="bg-cyan-500" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {articles.map((article, i) => (
              <ArticleCard key={article.slug} article={article} priority={i < 4} />
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
