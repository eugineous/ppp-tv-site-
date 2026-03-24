'use client';
import { useEffect, useState } from 'react';

interface Article { slug: string; title: string; image?: string | null; category?: string; }

const KEY = 'ppptv_recent';
const MAX = 8;

const JUNK_RE = /^(hello world|a wordpress commenter|sample page|test post|untitled|lorem ipsum|draft|coming soon|just another wordpress|protected:|private:|page not found|404|403)/i;
const JUNK_PATTERNS = /\b(state house|joins state house|families in worship|worship service|church service|sunday service|dpp strengthens|anti.?money laundering|ruto joins|president joins)\b/i;

function isJunk(title: string): boolean {
  return !title || title.length < 15 || JUNK_RE.test(title) || JUNK_PATTERNS.test(title);
}

export function recordView(article: Article) {
  if (typeof window === 'undefined') return;
  if (isJunk(article.title)) return;
  try {
    const existing: Article[] = JSON.parse(localStorage.getItem(KEY) || '[]');
    const filtered = existing.filter(a => a.slug !== article.slug).filter(a => !isJunk(a.title));
    localStorage.setItem(KEY, JSON.stringify([article, ...filtered].slice(0, MAX)));
  } catch { /* ignore */ }
}

const CAT_COLORS: Record<string, string> = {
  Celebrity: '#FF007A', Music: '#a855f7', 'TV & Film': '#f59e0b',
  Fashion: '#ec4899', Lifestyle: '#14b8a6', Events: '#10b981',
  'East Africa': '#06b6d4', Comedy: '#eab308', Influencers: '#f97316',
};

export default function RecentlyViewed() {
  const [items, setItems] = useState<Article[]>([]);

  useEffect(() => {
    try {
      const raw: Article[] = JSON.parse(localStorage.getItem(KEY) || '[]');
      const clean = raw.filter(a => !isJunk(a.title));
      if (clean.length !== raw.length) localStorage.setItem(KEY, JSON.stringify(clean));
      setItems(clean);
    } catch { /* ignore */ }
  }, []);

  if (items.length < 2) return null;

  return (
    <div className="py-6 px-4 sm:px-6" style={{ borderTop: '1px solid #111' }}>
      <div className="max-w-[1280px] mx-auto">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-3">Recently Viewed</p>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {items.map(a => (
            <a key={a.slug} href={`/news/${a.slug}`} className="shrink-0 w-36 group" style={{ textDecoration: 'none' }}>
              <div className="w-full aspect-video bg-[#111] rounded overflow-hidden mb-1.5 relative">
                {a.image && <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />}
                {a.category && (
                  <div className="absolute top-1 left-1">
                    <span className="text-[8px] font-black px-1.5 py-0.5 text-white" style={{ background: CAT_COLORS[a.category] || '#FF007A' }}>
                      {a.category}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[11px] font-semibold text-gray-400 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                {a.title}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
