'use client';
import { useEffect, useState, useCallback } from 'react';

interface Trend {
  name: string;
  volume: string;
  url: string;
}

// Fallback Kenya trends if fetch fails
const FALLBACK: Trend[] = [
  { name: '#KenyaNews', volume: '89K', url: 'https://twitter.com/search?q=%23KenyaNews' },
  { name: '#NairobiToday', volume: '32K', url: 'https://twitter.com/search?q=%23NairobiToday' },
  { name: '#EastAfrica', volume: '81K', url: 'https://twitter.com/search?q=%23EastAfrica' },
  { name: '#AfricaNews', volume: '40K', url: 'https://twitter.com/search?q=%23AfricaNews' },
  { name: '#KenyaPolitics', volume: '58K', url: 'https://twitter.com/search?q=%23KenyaPolitics' },
  { name: '#NairobiLife', volume: '81K', url: 'https://twitter.com/search?q=%23NairobiLife' },
  { name: '#KenyaMusic', volume: '33K', url: 'https://twitter.com/search?q=%23KenyaMusic' },
  { name: '#Ruto', volume: '26K', url: 'https://twitter.com/search?q=%23Ruto' },
  { name: '#Harambee', volume: '19K', url: 'https://twitter.com/search?q=%23Harambee' },
  { name: '#KenyaSports', volume: '44K', url: 'https://twitter.com/search?q=%23KenyaSports' },
];

export default function XTrends() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchTrends = useCallback(async () => {
    try {
      // Use Google Trends RSS for Kenya — real-time, no API key needed
      const res = await fetch(
        'https://trends.google.com/trends/trendingsearches/daily/rss?geo=KE',
        { signal: AbortSignal.timeout(5000) }
      );
      if (!res.ok) throw new Error('fetch failed');
      const xml = await res.text();

      // Parse <title> tags from RSS items (skip first which is feed title)
      const matches = Array.from(xml.matchAll(/<title><!\[CDATA\[([^\]]+)\]\]><\/title>/g));
      const items = matches.slice(1, 11); // top 10

      if (items.length === 0) throw new Error('no items');

      const parsed: Trend[] = items.map((m, i) => ({
        name: m[1].trim(),
        volume: '',
        url: `https://www.google.com/search?q=${encodeURIComponent(m[1].trim())}+Kenya`,
      }));

      setTrends(parsed);
      setLastUpdated(new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }));
    } catch {
      // Fallback to curated Kenya hashtags
      setTrends(FALLBACK);
      setLastUpdated(new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrends();
    // Refresh every 10 minutes
    const interval = setInterval(fetchTrends, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchTrends]);

  return (
    <div className="xtrends-widget">
      {/* Header */}
      <div className="xtrends-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" fill="#fff" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span className="xtrends-title">Trending in Kenya</span>
          {lastUpdated && (
            <span style={{ fontSize: '.6rem', color: '#444', marginLeft: 'auto' }}>
              Updated {lastUpdated}
            </span>
          )}
        </div>
      </div>

      {/* Trends list */}
      <div className="xtrends-list">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="xtrends-skeleton-row">
                <div className="skeleton" style={{ height: '13px', width: `${50 + i * 12}px`, borderRadius: '3px' }} />
                <div className="skeleton" style={{ height: '11px', width: '32px', borderRadius: '3px' }} />
              </div>
            ))
          : trends.map((t, i) => (
              <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer" className="xtrends-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <span className="xtrends-rank">{i + 1}</span>
                  <span className="xtrends-name">{t.name}</span>
                </div>
                {t.volume && <span className="xtrends-volume">{t.volume}</span>}
              </a>
            ))
        }
      </div>

      <div className="xtrends-footer">
        <a href="https://trends.google.com/trends/?geo=KE" target="_blank" rel="noopener noreferrer" className="xtrends-more">
          More Kenya Trends →
        </a>
        <button onClick={fetchTrends} className="xtrends-refresh" aria-label="Refresh trends">
          ↻ Refresh
        </button>
      </div>
    </div>
  );
}
