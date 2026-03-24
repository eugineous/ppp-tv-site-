'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBookmarks } from '@/lib/localStorage';
import { fetchArticleBySlug } from '@/lib/worker';
import ArticleCard from '@/components/ArticleCard';
import type { Article } from '@/types';

export default function SavedPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const slugs = getBookmarks();
      if (slugs.length === 0) { setLoading(false); return; }
      const results = await Promise.allSettled(slugs.map(fetchArticleBySlug));
      const loaded = results
        .filter((r): r is PromiseFulfilledResult<Article | null> => r.status === 'fulfilled')
        .map((r) => r.value)
        .filter((a): a is Article => a !== null);
      setArticles(loaded);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-bebas text-5xl text-white tracking-wide mb-1">Saved Articles</h1>
      <p className="text-gray-500 text-sm mb-10">Your bookmarked stories, stored locally on this device.</p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#FF007A', borderTopColor: 'transparent' }} aria-label="Loading…" />
        </div>
      ) : articles.length > 0 ? (
        <div className="cat-row-scroll">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#333' }} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="text-gray-400 text-lg mb-2">No saved articles yet</p>
          <p className="text-gray-600 text-sm mb-8">Tap the bookmark icon on any article to save it here.</p>
          <Link
            href="/"
            className="inline-block px-8 py-3 text-white font-bold text-sm uppercase tracking-widest transition-opacity hover:opacity-80"
            style={{ background: '#FF007A' }}
          >
            Browse News
          </Link>
        </div>
      )}
    </div>
  );
}
