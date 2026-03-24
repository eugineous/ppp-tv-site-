/// <reference path="./types.d.ts" />

export interface Env {
  PPP_TV_KV: KVNamespace;
  WORKER_SECRET: string;
  VERCEL_URL?: string;
}

// ─── CORS helpers ─────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function cors(res: Response): Response {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(CORS_HEADERS)) headers.set(k, v);
  return new Response(res.body, { status: res.status, headers });
}

function json(data: unknown, status = 200): Response {
  return cors(
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

function isAuthed(req: Request, env: Env): boolean {
  const auth = req.headers.get('Authorization');
  return auth === `Bearer ${env.WORKER_SECRET}`;
}

// ─── Article helpers ──────────────────────────────────────────────────────────

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  tags: string[];
  imageUrl: string;
  sourceUrl: string;
  sourceName: string;
  publishedAt: string;
  views?: number;
  trendingScore?: number;
}

async function getArticles(env: Env): Promise<Article[]> {
  const raw = await env.PPP_TV_KV.get('articles', 'json');
  return (raw as Article[] | null) ?? [];
}

async function saveArticles(env: Env, articles: Article[]): Promise<void> {
  await env.PPP_TV_KV.put('articles', JSON.stringify(articles));
}

/** Gravity decay trending score: score = views / (age_hours + 2)^1.5 */
function trendingScore(article: Article): number {
  const views = article.views ?? 0;
  const ageHours = (Date.now() - new Date(article.publishedAt).getTime()) / 3_600_000;
  return views / Math.pow(ageHours + 2, 1.5);
}

// ─── View count helpers ───────────────────────────────────────────────────────

async function getViews(env: Env, slug: string): Promise<number> {
  const raw = await env.PPP_TV_KV.get(`views:${slug}`);
  return raw ? parseInt(raw, 10) : 0;
}

async function incrementViews(env: Env, slug: string): Promise<number> {
  const current = await getViews(env, slug);
  const next = current + 1;
  await env.PPP_TV_KV.put(`views:${slug}`, String(next));
  return next;
}

// ─── Router ───────────────────────────────────────────────────────────────────

// ─── RSS Feed URLs (subset — Worker fetches these on cron) ───────────────────
const RSS_FEEDS: Array<{ url: string; name: string; category: string }> = [
  { url: 'https://www.nation.africa/kenya/rss.xml', name: 'Nation Africa', category: 'News' },
  { url: 'https://www.standardmedia.co.ke/rss/headlines.php', name: 'Standard Media', category: 'News' },
  { url: 'https://www.the-star.co.ke/rss/', name: 'The Star Kenya', category: 'News' },
  { url: 'https://www.citizen.digital/feed', name: 'Citizen Digital', category: 'News' },
  { url: 'https://www.capitalfm.co.ke/news/feed/', name: 'Capital FM Kenya', category: 'News' },
  { url: 'https://www.sde.co.ke/feed/', name: 'SDE Kenya', category: 'Entertainment' },
  { url: 'https://www.ghafla.com/ke/feed/', name: 'Ghafla Kenya', category: 'Entertainment' },
  { url: 'https://www.mpasho.co.ke/feed/', name: 'Mpasho', category: 'Entertainment' },
  { url: 'https://www.pulselive.co.ke/rss', name: 'Pulse Live Kenya', category: 'Entertainment' },
  { url: 'https://www.tuko.co.ke/rss/', name: 'Tuko Kenya', category: 'Entertainment' },
  { url: 'https://www.standardmedia.co.ke/rss/sports.php', name: 'Standard Sports', category: 'Sports' },
  { url: 'https://www.nation.africa/kenya/sports/rss.xml', name: 'Nation Sports', category: 'Sports' },
  { url: 'https://www.capitalfm.co.ke/music/feed/', name: 'Capital FM Music', category: 'Music' },
  { url: 'https://www.ghafla.com/ke/category/music/feed/', name: 'Ghafla Music', category: 'Music' },
  { url: 'https://www.standardmedia.co.ke/rss/lifestyle.php', name: 'Standard Lifestyle', category: 'Lifestyle' },
  { url: 'https://www.techweez.com/feed/', name: 'Techweez', category: 'Technology' },
  { url: 'https://www.theeastafrican.co.ke/tea/rss.xml', name: 'The East African', category: 'News' },
  { url: 'https://www.pulse.com.gh/rss', name: 'Pulse Ghana', category: 'Entertainment' },
  { url: 'https://www.pulse.ng/rss', name: 'Pulse Nigeria', category: 'Entertainment' },
  { url: 'https://www.bellanaija.com/feed/', name: 'BellaNaija', category: 'Entertainment' },
  { url: 'https://www.africanews.com/feed/rss2/', name: 'Africa News', category: 'News' },
  { url: 'https://www.aljazeera.com/xml/rss/all.xml', name: 'Al Jazeera Africa', category: 'News' },
  { url: 'https://www.bbc.co.uk/africa/rss.xml', name: 'BBC Africa', category: 'News' },
];

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

async function fetchRSSFeed(feed: { url: string; name: string; category: string }): Promise<Article[]> {
  try {
    const res = await fetch(feed.url, {
      headers: { 'User-Agent': 'PPP-TV-Kenya/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const text = await res.text();

    // Simple XML parsing for RSS items
    const items: Article[] = [];
    const itemMatches = Array.from(text.matchAll(/<item>([\s\S]*?)<\/item>/g));

    for (const match of itemMatches) {
      const item = match[1];
      const title = decodeXML(item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1] ?? '');
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() ?? '';
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? '';
      const description = decodeXML(item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1] ?? '');
      const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i);
      const imageUrl = imgMatch?.[1] ?? '';

      if (!title || !link) continue;

      const publishedAt = pubDate ? new Date(pubDate).toISOString() : new Date().toISOString();
      const slug = slugify(`${title}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`);
      const excerpt = description.replace(/<[^>]+>/g, '').slice(0, 200).trim();

      items.push({ slug, title, excerpt, category: feed.category, tags: [], imageUrl, sourceUrl: link, sourceName: feed.name, publishedAt });
      if (items.length >= 15) break;
    }
    return items;
  } catch {
    return [];
  }
}

function decodeXML(str: string): string {
  return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

export default {
  // ─── Cron handler — runs every 15 min via Cloudflare Cron Trigger ──────────
  async scheduled(_event: ScheduledEvent, env: Env): Promise<void> {
    const results = await Promise.allSettled(RSS_FEEDS.map(fetchRSSFeed));
    const incoming: Article[] = [];
    for (const r of results) {
      if (r.status === 'fulfilled') incoming.push(...r.value);
    }

    if (incoming.length === 0) return;

    const existing = await getArticles(env);
    const existingUrls = new Set(existing.map((a) => a.sourceUrl));
    const newArticles = incoming.filter((a) => !existingUrls.has(a.sourceUrl));

    if (newArticles.length === 0) return;

    const merged = [...newArticles, ...existing]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 2000);

    await saveArticles(env, merged);

    // Trigger Vercel ISR revalidation so homepage refreshes immediately
    if (env.VERCEL_URL) {
      try {
        await fetch(`${env.VERCEL_URL}/api/revalidate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${env.WORKER_SECRET}`,
          },
          body: JSON.stringify({ path: '/' }),
        });
      } catch {
        // non-critical — revalidation will happen on next ISR cycle anyway
      }
    }
  },

  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    // ── GET /articles ──────────────────────────────────────────────────────────
    if (path === '/articles' && method === 'GET') {
      const category = url.searchParams.get('category');
      const sort = url.searchParams.get('sort') ?? 'recent';
      const limit = parseInt(url.searchParams.get('limit') ?? '20', 10);
      const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);

      let articles = await getArticles(env);

      if (category) {
        articles = articles.filter((a) => a.category.toLowerCase() === category.toLowerCase());
      }

      if (sort === 'trending') {
        articles = articles
          .map((a) => ({ ...a, trendingScore: trendingScore(a) }))
          .sort((a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0));
      } else {
        articles = articles.sort(
          (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      }

      return json(articles.slice(offset, offset + limit));
    }

    // ── GET /articles/:slug ────────────────────────────────────────────────────
    const articleMatch = path.match(/^\/articles\/(.+)$/);
    if (articleMatch && method === 'GET') {
      const slug = articleMatch[1];
      const articles = await getArticles(env);
      const article = articles.find((a) => a.slug === slug);
      if (!article) return json({ error: 'Not found' }, 404);
      return json(article);
    }

    // ── POST /articles ─────────────────────────────────────────────────────────
    if (path === '/articles' && method === 'POST') {
      if (!isAuthed(req, env)) return json({ error: 'Unauthorized' }, 401);

      let incoming: Article[];
      try {
        incoming = await req.json() as Article[];
        if (!Array.isArray(incoming)) throw new Error('Expected array');
      } catch {
        return json({ error: 'Invalid body' }, 400);
      }

      const existing = await getArticles(env);
      const existingUrls = new Set(existing.map((a) => a.sourceUrl));

      let saved = 0;
      let skipped = 0;

      for (const article of incoming) {
        if (existingUrls.has(article.sourceUrl)) {
          skipped++;
        } else {
          existing.push(article);
          existingUrls.add(article.sourceUrl);
          saved++;
        }
      }

      // Keep only the latest 2000 articles
      const sorted = existing.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
      await saveArticles(env, sorted.slice(0, 2000));

      return json({ saved, skipped });
    }

    // ── POST /views ────────────────────────────────────────────────────────────
    if (path === '/views' && method === 'POST') {
      let body: { slug?: string };
      try {
        body = await req.json() as { slug?: string };
      } catch {
        return json({ error: 'Invalid body' }, 400);
      }

      const slug = body.slug;
      if (!slug) return json({ error: 'slug required' }, 400);

      // Rate limit: 1 view per slug per IP per hour
      const ip = req.headers.get('CF-Connecting-IP') ?? 'unknown';
      const rateLimitKey = `rl:${slug}:${ip}`;
      const alreadyViewed = await env.PPP_TV_KV.get(rateLimitKey);

      if (!alreadyViewed) {
        await env.PPP_TV_KV.put(rateLimitKey, '1', { expirationTtl: 3600 });
        const views = await incrementViews(env, slug);
        return json({ slug, views });
      }

      return json({ slug, views: await getViews(env, slug) });
    }

    // ── GET /views/:slug ───────────────────────────────────────────────────────
    const viewsMatch = path.match(/^\/views\/(.+)$/);
    if (viewsMatch && method === 'GET') {
      const slug = viewsMatch[1];
      const views = await getViews(env, slug);
      return json({ slug, views });
    }

    // ── GET /trending ──────────────────────────────────────────────────────────
    if (path === '/trending' && method === 'GET') {
      const sevenDaysAgo = Date.now() - 7 * 24 * 3_600_000;
      const articles = await getArticles(env);

      const scored = articles
        .filter((a) => new Date(a.publishedAt).getTime() > sevenDaysAgo)
        .map((a) => ({ ...a, trendingScore: trendingScore(a) }))
        .sort((a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0))
        .slice(0, 5);

      return json(scored);
    }

    // ── GET /search?q= ─────────────────────────────────────────────────────────
    if (path === '/search' && method === 'GET') {
      const q = url.searchParams.get('q')?.toLowerCase().trim();
      if (!q) return json([]);

      const articles = await getArticles(env);
      const results = articles
        .filter((a) => {
          const haystack = `${a.title} ${a.excerpt} ${a.category} ${a.tags.join(' ')}`.toLowerCase();
          return haystack.includes(q);
        })
        .slice(0, 20);

      return json(results);
    }

    // ── GET /image?url= ────────────────────────────────────────────────────────
    if (path === '/image' && method === 'GET') {
      const imageUrl = url.searchParams.get('url');
      if (!imageUrl) return json({ error: 'url required' }, 400);

      try {
        const res = await fetch(imageUrl);
        const headers = new Headers(res.headers);
        headers.set('Cache-Control', 'public, max-age=86400');
        for (const [k, v] of Object.entries(CORS_HEADERS)) headers.set(k, v);
        return new Response(res.body, { status: res.status, headers });
      } catch {
        return json({ error: 'Failed to proxy image' }, 502);
      }
    }

    // ── POST /subscribe ────────────────────────────────────────────────────────
    if (path === '/subscribe' && method === 'POST') {
      let body: { email?: string };
      try {
        body = await req.json() as { email?: string };
      } catch {
        return json({ error: 'Invalid body' }, 400);
      }

      const email = body.email?.trim().toLowerCase();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return json({ error: 'Invalid email' }, 400);
      }

      // Check for duplicate
      const existing = await env.PPP_TV_KV.get(`sub:${email}`);
      if (existing) {
        return json({ message: 'Already subscribed.' });
      }

      const ip = req.headers.get('CF-Connecting-IP') ?? 'unknown';
      const ipHash = await hashString(ip);

      await env.PPP_TV_KV.put(
        `sub:${email}`,
        JSON.stringify({ email, subscribedAt: new Date().toISOString(), ipHash })
      );

      // Increment subscriber count
      const countRaw = await env.PPP_TV_KV.get('subscriber_count');
      const count = countRaw ? parseInt(countRaw, 10) : 0;
      await env.PPP_TV_KV.put('subscriber_count', String(count + 1));

      return json({ message: 'Subscribed successfully.' });
    }

    // ── GET /subscribers ───────────────────────────────────────────────────────
    if (path === '/subscribers' && method === 'GET') {
      if (!isAuthed(req, env)) return json({ error: 'Unauthorized' }, 401);
      const countRaw = await env.PPP_TV_KV.get('subscriber_count');
      return json({ count: countRaw ? parseInt(countRaw, 10) : 0 });
    }

    // ── GET /analytics ─────────────────────────────────────────────────────────
    if (path === '/analytics' && method === 'GET') {
      if (!isAuthed(req, env)) return json({ error: 'Unauthorized' }, 401);

      const articles = await getArticles(env);
      const countRaw = await env.PPP_TV_KV.get('subscriber_count');
      const subscriberCount = countRaw ? parseInt(countRaw, 10) : 0;

      // Get view counts for top articles
      const withViews = await Promise.all(
        articles.slice(0, 50).map(async (a) => ({
          slug: a.slug,
          views: await getViews(env, a.slug),
          lastViewed: a.publishedAt,
        }))
      );

      const topArticles = withViews
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      const totalViews = withViews.reduce((sum, a) => sum + a.views, 0);

      return json({
        totalViews,
        topArticles,
        subscriberCount,
        recentHits: topArticles.slice(0, 5),
      });
    }

    return json({ error: 'Not found' }, 404);
  },
};

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}
