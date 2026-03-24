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

const SUGGESTIONS = ['Kenya news','Nairobi','Music','Sports','Entertainment','Politics','Business','Technology'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true); setSearched(true);
    const data = await searchArticles(q);
    setResults(data); setLoading(false);
  }, []);

  useEffect(() => { doSearch(debouncedQuery); }, [debouncedQuery, doSearch]);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>

      {/* ── SEARCH HERO — full-width dark panel ── */}
      <div style={{ background: 'linear-gradient(180deg,#141414 0%,#000 100%)', padding: '4rem 1.5rem 3rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 'clamp(2.5rem,7vw,5rem)', color: '#fff', letterSpacing: '.02em', marginBottom: '1.5rem' }}>Search</h1>

        {/* Big search bar */}
        <div style={{ position: 'relative', maxWidth: '640px', margin: '0 auto' }}>
          <svg style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#555' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Kenya & Africa news…"
            autoFocus
            aria-label="Search articles"
            style={{ width: '100%', paddingLeft: '3.2rem', paddingRight: '1.2rem', paddingTop: '1rem', paddingBottom: '1rem', background: '#1a1a1a', border: '1px solid rgba(255,255,255,.1)', color: '#fff', fontSize: '1rem', outline: 'none', borderRadius: 0, fontFamily: 'inherit' }}
            onFocus={e => (e.currentTarget.style.borderColor = '#FF007A')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)')}
          />
          {loading && (
            <div style={{ position: 'absolute', right: '1.2rem', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', border: '2px solid #FF007A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
          )}
        </div>

        {/* Suggestion pills */}
        {!searched && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '1.5rem' }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => setQuery(s)}
                style={{ padding: '5px 14px', background: 'transparent', border: '1px solid #2a2a2a', color: '#888', fontSize: '.72rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '999px', fontFamily: 'inherit', transition: 'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF007A'; e.currentTarget.style.color = '#FF007A'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888'; }}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── RESULTS ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        {searched && !loading && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '.5rem' }}>No results for &ldquo;{query}&rdquo;</p>
            <p style={{ color: '#333', fontSize: '.85rem' }}>Try different keywords or browse by category.</p>
          </div>
        )}
        {results.length > 0 && (
          <>
            <p style={{ fontSize: '.75rem', color: '#555', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </p>
            <div className="cat-row-scroll">
              {results.map(article => <ArticleCard key={article.slug} article={article} />)}
            </div>
          </>
        )}
        {!searched && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <p style={{ color: '#333', fontSize: '.9rem' }}>Start typing to search across all Kenya &amp; Africa news.</p>
          </div>
        )}
      </div>
    </div>
  );
}
