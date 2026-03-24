'use client';
import { useEffect, useState } from 'react';

// Curated Kenya/Africa trending topics — updated client-side
// Since Twitter/X API requires paid access, we show curated trending topics
// that reflect what's typically trending in Kenya
const KENYA_TRENDS = [
  '#KenyaNews', '#NairobiToday', '#Ruto', '#KenyaTwitter',
  '#Harambee', '#KenyaEntertainment', '#AfricaNews', '#KenyaSports',
  '#NairobiLife', '#KenyaMusic', '#EastAfrica', '#KenyaPolitics',
];

interface Trend {
  name: string;
  tweetVolume?: string;
}

export default function XTrends() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching — in production wire to your own proxy endpoint
    // that calls Twitter/X API v2 with bearer token
    const timer = setTimeout(() => {
      const shuffled = [...KENYA_TRENDS].sort(() => Math.random() - 0.5).slice(0, 8);
      setTrends(shuffled.map((name, i) => ({
        name,
        tweetVolume: `${Math.floor(Math.random() * 90 + 10)}K`,
      })));
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '6px', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* X logo */}
        <svg width="14" height="14" fill="#fff" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        <span style={{ fontSize: '.7rem', fontWeight: 900, letterSpacing: '.1em', textTransform: 'uppercase', color: '#fff' }}>Trending in Kenya</span>
      </div>

      {/* Trends list */}
      <div style={{ padding: '6px 0' }}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="skeleton" style={{ height: '12px', width: `${60 + i * 8}px`, borderRadius: '3px' }} />
              <div className="skeleton" style={{ height: '10px', width: '30px', borderRadius: '3px' }} />
            </div>
          ))
        ) : (
          trends.map((t, i) => (
            <a
              key={t.name}
              href={`https://twitter.com/search?q=${encodeURIComponent(t.name)}&src=trend_click`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', textDecoration: 'none', transition: 'background .15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '.6rem', color: '#444', fontWeight: 700, minWidth: '14px' }}>{i + 1}</span>
                <span style={{ fontSize: '.78rem', color: '#1d9bf0', fontWeight: 700 }}>{t.name}</span>
              </div>
              {t.tweetVolume && (
                <span style={{ fontSize: '.6rem', color: '#555', fontWeight: 600 }}>{t.tweetVolume}</span>
              )}
            </a>
          ))
        )}
      </div>

      <div style={{ padding: '8px 14px', borderTop: '1px solid #1a1a1a' }}>
        <a
          href="https://twitter.com/explore/tabs/trending"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '.68rem', color: '#1d9bf0', textDecoration: 'none', fontWeight: 700 }}
        >
          Show more on X →
        </a>
      </div>
    </div>
  );
}
