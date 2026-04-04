import type { Article, FetchArticlesOptions } from '@/types';

const WORKER_BASE = process.env.NEXT_PUBLIC_WORKER_URL ?? '';
const WORKER_SECRET = process.env.WORKER_SECRET ?? '';

function authHeaders(): HeadersInit {
  return WORKER_SECRET ? { Authorization: `Bearer ${WORKER_SECRET}` } : {};
}

/** Fetch articles from the Cloudflare Worker with optional filters */
export async function fetchArticles(options: FetchArticlesOptions = {}): Promise<Article[]> {
  if (!WORKER_BASE) return [];
  const params = new URLSearchParams();
  if (options.category) params.set('category', options.category);
  if (options.sort)     params.set('sort', options.sort);
  if (options.limit)    params.set('limit', String(options.limit));
  if (options.offset)   params.set('offset', String(options.offset));
  if ((options as { subcategory?: string }).subcategory) params.set('subcategory', (options as { subcategory?: string }).subcategory!);

  const url = `${WORKER_BASE}/articles${params.toString() ? `?${params}` : ''}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: authHeaders(),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const raw: Article[] = Array.isArray(data) ? data : data.articles ?? [];
    // Normalise each article — worker returns snake_case from Supabase
    return raw.map(a => ({
      ...a,
      title:      (a as any).rewritten_title || (a as any).rewrittenTitle || a.title || '',
      excerpt:    (a as any).rewritten_excerpt || (a as any).rewrittenExcerpt || a.excerpt || '',
      content:    (a as any).rewritten_body || (a as any).rewrittenBody || a.content || '',
      imageUrl:   (a as any).image_url || a.imageUrl || '',
      sourceUrl:  (a as any).source_url || a.sourceUrl || '',
      sourceName: (a as any).source_name || a.sourceName || 'PPP TV Kenya',
      tags:       Array.isArray(a.tags) ? a.tags : [],
    }));
  } catch {
    return [];
  }
}

/** Fetch a single article by slug — cache for 5 min */
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  if (!slug || !WORKER_BASE) return null;
  try {
    const res = await fetch(`${WORKER_BASE}/articles/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
      headers: authHeaders(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || typeof data !== 'object' || data.error) return null;
    // Normalise — worker may return rewrittenTitle or title
    return {
      ...data,
      title: data.rewrittenTitle || data.title || data.original_title || '',
      excerpt: data.excerpt || data.rewrittenExcerpt || '',
      content: data.content || data.rewrittenBody || '',
      imageUrl: data.imageUrl || data.image_url || '',
      sourceUrl: data.sourceUrl || data.source_url || '',
      sourceName: data.sourceName || data.source_name || 'PPP TV Kenya',
      tags: Array.isArray(data.tags) ? data.tags : [],
    } as Article;
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
