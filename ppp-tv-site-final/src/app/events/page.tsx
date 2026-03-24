import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import ArticleCard from '@/components/ArticleCard';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Events | PPP TV Kenya',
  description: 'Kenya and Africa events — concerts, festivals, sports and more.',
};

export default async function EventsPage() {
  const articles = await fetchArticles({ category: 'Events', sort: 'recent', limit: 24 });

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>

      {/* ── HEADER — neon cyan accent ── */}
      <div style={{ position: 'relative', overflow: 'hidden', background: '#000', borderBottom: '1px solid #0a2a2a', padding: '3.5rem 2rem 2.5rem' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%,rgba(0,207,255,.08) 0%,transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
          <p style={{ fontSize: '.6rem', fontWeight: 900, letterSpacing: '.3em', textTransform: 'uppercase', color: '#00CFFF', marginBottom: '.4rem' }}>Events</p>
          <h1 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 'clamp(2.5rem,7vw,5rem)', color: '#fff', letterSpacing: '.02em', lineHeight: 1, marginBottom: '.5rem' }}>Kenya &amp; Africa Events</h1>
          <p style={{ color: '#555', fontSize: '.85rem' }}>Concerts, festivals, sports events and more — updated every 5 minutes.</p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>
        {articles.length > 0 ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div style={{ width: '4px', height: '22px', background: '#00CFFF', borderRadius: '2px' }} />
              <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.4rem', color: '#fff', letterSpacing: '.04em', textTransform: 'uppercase' }}>Latest Events</span>
            </div>
            <div className="cat-row-scroll">
              {articles.map(article => <ArticleCard key={article.slug} article={article} accentColor="#00CFFF" />)}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '.5rem' }}>No events right now.</p>
            <p style={{ color: '#333', fontSize: '.85rem' }}>Check back soon — events update every 5 minutes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
