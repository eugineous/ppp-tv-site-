'use client';

import { useState, useEffect } from 'react';
import type { AnalyticsSummary } from '@/types';

const PASSWORD = process.env.NEXT_PUBLIC_ANALYTICS_PASSWORD ?? 'ppptv2026';

export default function AnalyticsPage() {
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (input === PASSWORD) {
      setAuthed(true);
      setError('');
    } else {
      setError('Incorrect password.');
    }
  }

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    fetch('/api/analytics', {
      headers: { Authorization: `Bearer ${PASSWORD}` },
    })
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [authed]);

  if (!authed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-[#111] rounded-2xl p-8">
          <h1 className="font-bebas text-3xl text-white tracking-wide mb-6 text-center">Analytics</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="analytics-password" className="block text-xs text-gray-400 mb-1.5">Password</label>
              <input
                id="analytics-password"
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition-colors"
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-2.5 bg-brand-pink text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-bebas text-4xl text-white tracking-wide mb-8">Analytics Dashboard</h1>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-brand-pink border-t-transparent rounded-full animate-spin" aria-label="Loading…" />
        </div>
      ) : data ? (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#111] rounded-xl p-5 text-center">
              <p className="font-bebas text-4xl text-brand-pink">{data.totalViews.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Total Views</p>
            </div>
            <div className="bg-[#111] rounded-xl p-5 text-center">
              <p className="font-bebas text-4xl text-brand-pink">{data.subscriberCount.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Subscribers</p>
            </div>
            <div className="bg-[#111] rounded-xl p-5 text-center">
              <p className="font-bebas text-4xl text-brand-pink">{data.topArticles.length}</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Top Articles</p>
            </div>
          </div>

          {/* Top articles */}
          {data.topArticles.length > 0 && (
            <section className="mb-8" aria-label="Top articles">
              <h2 className="font-bebas text-2xl text-white tracking-wide mb-4">Top Articles</h2>
              <div className="space-y-2">
                {data.topArticles.map((hit, i) => (
                  <div key={hit.slug} className="flex items-center gap-4 bg-[#111] rounded-lg px-4 py-3">
                    <span className="font-bebas text-2xl text-white/20 w-6 text-center">{i + 1}</span>
                    <a href={`/news/${hit.slug}`} className="flex-1 text-sm text-gray-300 hover:text-brand-pink transition-colors truncate">
                      {hit.slug}
                    </a>
                    <span className="text-sm font-mono text-gray-400">{hit.views.toLocaleString()} views</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <p className="text-gray-400">Could not load analytics data. Check Worker connection.</p>
      )}
    </div>
  );
}
