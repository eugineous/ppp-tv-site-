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
  if (options.sort) params.set('sort', options.sort);
  if (options.limit) params.set('limit', String(options.limit));
  if (options.offset) params.set('offset', String(options.offset));

  const url = `${WORKER_BASE}/articles${params.toString() ? `?${params}` : ''}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
      headers: authHeaders(),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.articles ?? [];
  } catch {
    return [];
  }
}

/** Fetch a single article by slug */
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${WORKER_BASE}/articles/${slug}`, {
      next: { revalidate: 3600 },
      headers: authHeaders(),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Fetch top trending articles (top 5 by gravity-decay score) */
export async function fetchTrending(): Promise<Article[]> {
  try {
    const res = await fetch(`${WORKER_BASE}/trending`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.articles ?? [];
  } catch {
    return [];
  }
}

/** Record a page view for an article (fire-and-forget) */
export async function recordView(slug: string): Promise<void> {
  try {
    await fetch(`${WORKER_BASE}/views`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
  } catch {
    // silently fail — view tracking is non-critical
  }
}

/** Search articles by keyword */
export async function searchArticles(query: string): Promise<Article[]> {
  if (!query.trim()) return [];
  try {
    const res = await fetch(
      `${WORKER_BASE}/search?q=${encodeURIComponent(query.trim())}`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.articles ?? [];
  } catch {
    return [];
  }
}
