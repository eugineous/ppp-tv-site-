'use client';

import { useState, useEffect, useCallback } from 'react';
import ArticleCard from '@/components/ArticleCard';
import { searchArticles } from '@/lib/worker';
import type { Article } from '@/types';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    const data = await searchArticles(q);
    setResults(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    doSearch(debouncedQuery);
  }, [debouncedQuery, doSearch]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-bebas text-4xl text-white tracking-wide mb-6">Search</h1>

      {/* Search input */}
      <div className="relative max-w-2xl mb-8">
        <label htmlFor="search-input" className="sr-only">Search articles</label>
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Kenya & Africa news…"
          autoFocus
          className="w-full pl-12 pr-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition-colors text-base"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-brand-pink border-t-transparent rounded-full animate-spin" aria-label="Searching…" />
        )}
      </div>

      {/* Results */}
      {searched && !loading && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-2">No results for &ldquo;{query}&rdquo;</p>
          <p className="text-gray-600 text-sm">Try different keywords or browse by category.</p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <p className="text-sm text-gray-400 mb-4">{results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((article, i) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </>
      )}

      {!searched && (
        <div className="text-center py-16">
          <p className="text-gray-500">Start typing to search across all Kenya &amp; Africa news.</p>
        </div>
      )}
    </div>
  );
}
