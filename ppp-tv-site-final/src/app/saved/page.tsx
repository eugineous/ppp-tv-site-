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
      if (!slugs.length) { setLoading(false); return; }
      const results = await Promise.allSettled(slugs.map(fetchArticleBySlug));
      setArticles(results.filter((r): r is PromiseFulfilledResult<Article> => r.status === 'fulfilled' && r.value !== null).map(r => r.value));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>

      {/* ── MY LIST HEADER — Netflix "My List" era ── */}
      <div style={{ background: 'linear-gradient(180deg,#141414 0%,#000 100%)', padding: '3rem 2rem 2rem', borderBottom: '1px solid #111' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ fontSize: '.6rem', fontWeight: 900, letterSpacing: '.3em', textTransform: 'uppercase', color: '#FF007A', marginBottom: '.4rem' }}>Your Collection</p>
          <h1 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 'clamp(2.5rem,7vw,5rem)', color: '#fff', letterSpacing: '.02em', lineHeight: 1, marginBottom: '.5rem' }}>My List</h1>
          <p style={{ color: '#555', fontSize: '.85rem' }}>Bookmarked stories, saved on this device.</p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
            <div style={{ width: '28px', height: '28px', border: '2px solid #FF007A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
          </div>
        ) : articles.length > 0 ? (
          <>
            <p style={{ fontSize: '.72rem', color: '#555', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>{articles.length} saved article{articles.length !== 1 ? 's' : ''}</p>
            <div className="cat-row-scroll">
              {articles.map(article => <ArticleCard key={article.slug} article={article} />)}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            {/* Bookmark icon */}
            <svg style={{ width: '48px', height: '48px', margin: '0 auto 1.5rem', color: '#222' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '.5rem' }}>Your list is empty</p>
            <p style={{ color: '#333', fontSize: '.85rem', marginBottom: '2rem' }}>Tap the bookmark icon on any article to save it here.</p>
            <Link href="/" style={{ display: 'inline-block', padding: '.7rem 2rem', background: '#FF007A', color: '#fff', fontSize: '.75rem', fontWeight: 900, letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Browse News
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
