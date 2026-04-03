import type { Article, FetchArticlesOptions } from '@/types';

const WORKER_BASE = process.env.NEXT_PUBLIC_WORKER_URL ?? '';
const WORKER_SECRET = process.env.WORKER_SECRET ?? '';

function authHeaders(): HeadersInit {
  return WORKER_SECRET ? { Authorization: `Bearer ${WORKER_SECRET}` } : {};
}

/** Fetch articles from the Cloudflare Worker with optional filters */
export async function fetchArticles(options: FetchArticlesOptions = {}): Promise<Article[]> {
  const params = new URLSearchParams();
  if (options.category) params.set('category', options.category);
  if (options.sort)     params.set('sort', options.sort);
  if (options.limit)    params.set('limit', String(options.limit));
  if (options.offset)   params.set('offset', String(options.offset));
  if ((options as { subcategory?: string }).subcategory) params.set('subcategory', (options as { subcategory?: string }).subcategory!);

  const url = `${WORKER_BASE}/articles${params.toString() ? `?${params}` : ''}`;

  try {
    const res = await fetch(url, {
      // ISR: serve cached version instantly, revalidate in background every 5 min
      next: { revalidate: 60 },
      headers: authHeaders(),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.articles ?? [];
  } catch {
    return [];
  }
}

/** Fetch a single article by slug — cache for 5 min */
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${WORKER_BASE}/articles/${slug}`, {
      next: { revalidate: 300 },
      headers: authHeaders(),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Fetch top trending articles — cache 1 min */
export async function fetchTrending(): Promise<Article[]> {
  try {
    const res = await fetch(`${WORKER_BASE}/trending`, {
      next: { revalidate: 60 },
      headers: authHeaders(),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.articles ?? [];
  } catch {
    return [];
  }
}

/** Record a page view — fire and forget, no await needed */
export function recordView(slug: string): void {
  if (typeof window === 'undefined') return;
  // Use sendBeacon for non-blocking, guaranteed delivery
  const url = `${WORKER_BASE}/views`;
  const data = JSON.stringify({ slug });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([data], { type: 'application/json' }));
  } else {
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data, keepalive: true }).catch(() => {});
  }
}

/** Search articles — no cache (always fresh) */
export async function searchArticles(query: string): Promise<Article[]> {
  if (!query.trim()) return [];
  try {
    const res = await fetch(
      `${WORKER_BASE}/search?q=${encodeURIComponent(query.trim())}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.articles ?? [];
  } catch {
    return [];
  }
}
