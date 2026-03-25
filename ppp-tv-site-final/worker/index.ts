/// <reference path="./types.d.ts" />

export interface Env {
  PPP_TV_KV: KVNamespace;
  WORKER_SECRET: string;
  VERCEL_URL?: string;
}

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
  return cors(new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } }));
}

function isAuthed(req: Request, env: Env): boolean {
  return req.headers.get('Authorization') === `Bearer ${env.WORKER_SECRET}`;
}

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
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

function trendingScore(article: Article): number {
  const views = article.views ?? 0;
  const ageHours = (Date.now() - new Date(article.publishedAt).getTime()) / 3_600_000;
  return views / Math.pow(ageHours + 2, 1.5);
}

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

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

function decodeXML(str: string): string {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&#8216;|&#8217;|&#x2019;/g, "'")
    .replace(/&#8220;|&#8221;|&#x201C;|&#x201D;/g, '"')
    .replace(/&#8211;|&#x2013;/g, '–').replace(/&#8212;|&#x2014;/g, '—')
    .replace(/&#8230;|&#x2026;/g, '…').replace(/&#038;/g, '&')
    .replace(/&#\d+;/g, (m) => { try { return String.fromCharCode(parseInt(m.slice(2,-1),10)); } catch { return m; } })
    .replace(/\(tm\)/g, '™').replace(/\(r\)/g, '®').trim();
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Extract og:image, og:description, and article body from a page */
async function scrapeArticlePage(url: string): Promise<{ image: string; content: string; excerpt: string }> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PPPTVBot/1.0)',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return { image: '', content: '', excerpt: '' };
    const html = await res.text();

    // og:image — most reliable
    const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1]
      ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1]
      ?? html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)?.[1]
      ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i)?.[1]
      ?? '';

    // og:description
    const ogDesc = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1]
      ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i)?.[1]
      ?? '';

    // Article body — try common selectors via regex
    let articleHtml = '';
    const bodyPatterns = [
      /<article[^>]*>([\s\S]*?)<\/article>/i,
      /<div[^>]+class=["'][^"']*(?:article-body|post-content|entry-content|story-body|article-content|content-body)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]+class=["'][^"']*(?:article|post|story|content)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
    ];
    for (const pat of bodyPatterns) {
      const m = html.match(pat);
      if (m?.[1] && m[1].length > 200) { articleHtml = m[1]; break; }
    }

    // Clean the article HTML — remove scripts, styles, nav, ads
    const cleanHtml = articleHtml
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<aside[\s\S]*?<\/aside>/gi, '')
      .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '') // remove embedded figures/captions
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<a[^>]+href=["'][^"']*["'][^>]*>([\s\S]*?)<\/a>/gi, '$1') // strip links
      .replace(/<[^>]+(class|id|style|data-[^=]*)=["'][^"']*["'][^>]*/gi, (m) => m.replace(/(class|id|style|data-[^=]*)=["'][^"']*["']/gi, ''))
      .trim();

    // Extract paragraphs - skip junk lines
    const JUNK = [
      /^(subscribe|sign up|newsletter|follow us|share this|click here|read more|advertisement|sponsored|related:|tags:|filed under|also read|see also|more from|you may also|don't miss|trending now|most read|popular now|breaking news alert)/i,
      /^(photo:|image:|caption:|credit:|source:|via:|originally published|copyright|all rights reserved|\(c\)|©)/i,
      /whatsapp|facebook|twitter|instagram|tiktok|youtube|telegram/i,
      /cookie|privacy policy|terms of use|gdpr/i,
    ];
    const paragraphs: string[] = [];
    const pMatches = Array.from(cleanHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi));
    for (const m of pMatches) {
      const text = stripHtml(m[1]).trim();
      if (text.length < 40) continue;
      if (JUNK.some(r => r.test(text))) continue;
      paragraphs.push(text);
      if (paragraphs.length >= 12) break;
    }

    // Fallback: grab text from div blocks if no paragraphs found
    if (paragraphs.length === 0) {
      const divMatches = Array.from(cleanHtml.matchAll(/<div[^>]*>([\s\S]*?)<\/div>/gi));
      for (const m of divMatches) {
        const text = stripHtml(m[1]).trim();
        if (text.length > 80 && !JUNK.some(r => r.test(text))) {
          paragraphs.push(text);
          if (paragraphs.length >= 6) break;
        }
      }
    }

    const content = paragraphs.map((p) => `<p>${p}</p>`).join('\n');
    const excerpt = decodeXML(ogDesc) || paragraphs[0]?.slice(0, 250) || '';

    return {
      image: ogImage.startsWith('//') ? `https:${ogImage}` : ogImage,
      content,
      excerpt,
    };
  } catch {
    return { image: '', content: '', excerpt: '' };
  }
}

const RSS_FEEDS: Array<{ url: string; name: string; category: string }> = [
  // News - Kenya
  { url: 'https://www.nation.africa/kenya/rss.xml',           name: 'Nation Africa',      category: 'News' },
  { url: 'https://www.standardmedia.co.ke/rss/headlines.php', name: 'Standard Media',     category: 'News' },
  { url: 'https://www.the-star.co.ke/rss/',                   name: 'The Star Kenya',     category: 'News' },
  { url: 'https://www.citizen.digital/feed',                  name: 'Citizen Digital',    category: 'News' },
  { url: 'https://www.capitalfm.co.ke/news/feed/',            name: 'Capital FM Kenya',   category: 'News' },
  // News - Africa & World
  { url: 'https://www.theeastafrican.co.ke/tea/rss.xml',      name: 'The East African',   category: 'News' },
  { url: 'https://www.africanews.com/feed/rss2/',             name: 'Africa News',        category: 'News' },
  { url: 'https://www.aljazeera.com/xml/rss/all.xml',         name: 'Al Jazeera Africa',  category: 'News' },
  { url: 'https://www.bbc.co.uk/africa/rss.xml',              name: 'BBC Africa',         category: 'News' },
  // Politics
  { url: 'https://www.nation.africa/kenya/politics/rss.xml',  name: 'Nation Politics',    category: 'Politics' },
  { url: 'https://www.standardmedia.co.ke/rss/politics.php',  name: 'Standard Politics',  category: 'Politics' },
  { url: 'https://www.the-star.co.ke/news/politics/rss/',     name: 'The Star Politics',  category: 'Politics' },
  { url: 'https://www.capitalfm.co.ke/politics/feed/',        name: 'Capital FM Politics',category: 'Politics' },
  // Entertainment
  { url: 'https://www.sde.co.ke/feed/',                       name: 'SDE Kenya',          category: 'Entertainment' },
  { url: 'https://www.ghafla.com/ke/feed/',                   name: 'Ghafla Kenya',       category: 'Entertainment' },
  { url: 'https://www.mpasho.co.ke/feed/',                    name: 'Mpasho',             category: 'Entertainment' },
  { url: 'https://www.pulselive.co.ke/rss',                   name: 'Pulse Live Kenya',   category: 'Entertainment' },
  { url: 'https://www.tuko.co.ke/rss/',                       name: 'Tuko Kenya',         category: 'Entertainment' },
  { url: 'https://www.bellanaija.com/feed/',                   name: 'BellaNaija',         category: 'Entertainment' },
  // Sports
  { url: 'https://www.standardmedia.co.ke/rss/sports.php',    name: 'Standard Sports',    category: 'Sports' },
  { url: 'https://www.nation.africa/kenya/sports/rss.xml',    name: 'Nation Sports',      category: 'Sports' },
  // Lifestyle
  { url: 'https://www.standardmedia.co.ke/rss/lifestyle.php', name: 'Standard Lifestyle', category: 'Lifestyle' },
  // Technology
  { url: 'https://www.techweez.com/feed/',                    name: 'Techweez',           category: 'Technology' },
  { url: 'https://techcabal.com/feed/',                       name: 'TechCabal',          category: 'Technology' },
];

async function fetchRSSFeed(feed: { url: string; name: string; category: string }): Promise<Article[]> {
  try {
    const res = await fetch(feed.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PPPTVBot/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const text = await res.text();

    const items: Array<{ title: string; link: string; pubDate: string; description: string; mediaUrl: string; contentEncoded: string }> = [];
    const itemMatches = Array.from(text.matchAll(/<item>([\s\S]*?)<\/item>/g));

    for (const match of itemMatches) {
      const item = match[1];
      const title = decodeXML(item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1] ?? '');
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim()
        ?? item.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1]?.trim() ?? '';
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? '';
      const description = item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1] ?? '';
      const contentEncoded = item.match(/<content:encoded>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/)?.[1] ?? '';

      // Try to get image from RSS item directly
      const mediaUrl =
        item.match(/<media:content[^>]+url=["']([^"']+)["']/i)?.[1] ??
        item.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i)?.[1] ??
        item.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image/i)?.[1] ??
        contentEncoded.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ??
        description.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ?? '';

      if (!title || !link) continue;
      items.push({ title, link, pubDate, description, mediaUrl, contentEncoded });
      if (items.length >= 10) break; // limit per feed to keep cron fast
    }

    // Scrape each article page for og:image + content (in parallel, max 10)
    const articles = await Promise.all(
      items.map(async (item): Promise<Article> => {
        const scraped = await scrapeArticlePage(item.link);
        const imageUrl = scraped.image || item.mediaUrl || '';
        const excerpt = scraped.excerpt || decodeXML(stripHtml(item.description)).slice(0, 250);
        // Use content:encoded body if available, else scraped content
        const rawBody = item.contentEncoded || scraped.content || '';
        const content = rawBody ? rawBody : `<p>${excerpt}</p>`;
        const publishedAt = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
        const slug = slugify(`${item.title}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`);

        return {
          slug,
          title: decodeXML(item.title),
          excerpt,
          content,
          category: feed.category,
          tags: [],
          imageUrl,
          sourceUrl: item.link,
          sourceName: feed.name,
          publishedAt,
        };
      })
    );

    return articles.filter((a) => a.imageUrl); // only keep articles with images
  } catch {
    return [];
  }
}

export default {
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

    if (env.VERCEL_URL) {
      try {
        await fetch(`${env.VERCEL_URL}/api/revalidate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.WORKER_SECRET}` },
          body: JSON.stringify({ path: '/' }),
        });
      } catch { /* non-critical */ }
    }
  },

  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS });

    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    if (path === '/articles' && method === 'GET') {
      const category = url.searchParams.get('category');
      const sort = url.searchParams.get('sort') ?? 'recent';
      const limit = parseInt(url.searchParams.get('limit') ?? '20', 10);
      const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);
      let articles = await getArticles(env);
      if (category) articles = articles.filter((a) => a.category.toLowerCase() === category.toLowerCase());
      if (sort === 'trending') {
        articles = articles.map((a) => ({ ...a, trendingScore: trendingScore(a) })).sort((a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0));
      } else {
        articles = articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      }
      return json(articles.slice(offset, offset + limit));
    }

    const articleMatch = path.match(/^\/articles\/(.+)$/);
    if (articleMatch && method === 'GET') {
      const slug = articleMatch[1];
      const articles = await getArticles(env);
      const article = articles.find((a) => a.slug === slug);
      if (!article) return json({ error: 'Not found' }, 404);
      return json(article);
    }

    if (path === '/articles' && method === 'POST') {
      if (!isAuthed(req, env)) return json({ error: 'Unauthorized' }, 401);
      let incoming: Article[];
      try {
        incoming = await req.json() as Article[];
        if (!Array.isArray(incoming)) throw new Error('Expected array');
      } catch { return json({ error: 'Invalid body' }, 400); }

      const existing = await getArticles(env);
      const existingUrls = new Set(existing.map((a) => a.sourceUrl));
      let saved = 0, skipped = 0;
      for (const article of incoming) {
        if (existingUrls.has(article.sourceUrl)) { skipped++; }
        else { existing.push(article); existingUrls.add(article.sourceUrl); saved++; }
      }
      const sorted = existing.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      await saveArticles(env, sorted.slice(0, 2000));
      return json({ saved, skipped });
    }

    // ── POST /refresh — manually trigger RSS fetch ─────────────────────────
    if (path === '/refresh' && method === 'POST') {
      if (!isAuthed(req, env)) return json({ error: 'Unauthorized' }, 401);
      const results = await Promise.allSettled(RSS_FEEDS.map(fetchRSSFeed));
      const incoming: Article[] = [];
      for (const r of results) {
        if (r.status === 'fulfilled') incoming.push(...r.value);
      }
      const existing = await getArticles(env);
      const existingUrlMap = new Map(existing.map((a) => [a.sourceUrl, a]));

      // New articles not yet in KV
      const newArticles = incoming.filter((a) => !existingUrlMap.has(a.sourceUrl));

      // Patch existing articles that are missing images
      let patched = 0;
      for (const inc of incoming) {
        const ex = existingUrlMap.get(inc.sourceUrl);
        if (ex && !ex.imageUrl && inc.imageUrl) {
          ex.imageUrl = inc.imageUrl;
          if (!ex.content && inc.content) ex.content = inc.content;
          if (!ex.excerpt && inc.excerpt) ex.excerpt = inc.excerpt;
          patched++;
        }
      }

      const merged = [...newArticles, ...existing]
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 2000);
      await saveArticles(env, merged);
      return json({ fetched: incoming.length, saved: newArticles.length, patched, total: merged.length });
    }

    // ── POST /purge-no-image — remove articles without images ──────────────
    if (path === '/purge-no-image' && method === 'POST') {
      if (!isAuthed(req, env)) return json({ error: 'Unauthorized' }, 401);
      const existing = await getArticles(env);
      const before = existing.length;
      const clean = existing.filter((a) => a.imageUrl && a.imageUrl.length > 5);
      await saveArticles(env, clean);
      return json({ before, after: clean.length, removed: before - clean.length });
    }

    if (path === '/views' && method === 'POST') {
      let body: { slug?: string };
      try { body = await req.json() as { slug?: string }; } catch { return json({ error: 'Invalid body' }, 400); }
      const slug = body.slug;
      if (!slug) return json({ error: 'slug required' }, 400);
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

    const viewsMatch = path.match(/^\/views\/(.+)$/);
    if (viewsMatch && method === 'GET') {
      const slug = viewsMatch[1];
      return json({ slug, views: await getViews(env, slug) });
    }

    if (path === '/trending' && method === 'GET') {
      const sevenDaysAgo = Date.now() - 7 * 24 * 3_600_000;
      const articles = await getArticles(env);
      const scored = articles
        .filter((a) => new Date(a.publishedAt).getTime() > sevenDaysAgo && a.imageUrl)
        .map((a) => ({ ...a, trendingScore: trendingScore(a) }))
        .sort((a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0))
        .slice(0, 10);
      return json(scored);
    }

    if (path === '/search' && method === 'GET') {
      const q = url.searchParams.get('q')?.toLowerCase().trim();
      if (!q) return json([]);
      const articles = await getArticles(env);
      const results = articles
        .filter((a) => `${a.title} ${a.excerpt} ${a.category} ${a.tags.join(' ')}`.toLowerCase().includes(q))
        .slice(0, 20);
      return json(results);
    }

    if (path === '/subscribe' && method === 'POST') {
      let body: { email?: string };
      try { body = await req.json() as { email?: string }; } catch { return json({ error: 'Invalid body' }, 400); }
      const email = body.email?.trim().toLowerCase();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Invalid email' }, 400);
      const existing = await env.PPP_TV_KV.get(`sub:${email}`);
      if (existing) return json({ message: 'Already subscribed.' });
      await env.PPP_TV_KV.put(`sub:${email}`, JSON.stringify({ email, subscribedAt: new Date().toISOString() }));
      const countRaw = await env.PPP_TV_KV.get('subscriber_count');
      await env.PPP_TV_KV.put('subscriber_count', String((countRaw ? parseInt(countRaw, 10) : 0) + 1));
      return json({ message: 'Subscribed successfully.' });
    }

    if (path === '/analytics' && method === 'GET') {
      if (!isAuthed(req, env)) return json({ error: 'Unauthorized' }, 401);
      const articles = await getArticles(env);
      const countRaw = await env.PPP_TV_KV.get('subscriber_count');
      const withViews = await Promise.all(articles.slice(0, 50).map(async (a) => ({ slug: a.slug, views: await getViews(env, a.slug), lastViewed: a.publishedAt })));
      const topArticles = withViews.sort((a, b) => b.views - a.views).slice(0, 10);
      return json({ totalViews: withViews.reduce((s, a) => s + a.views, 0), topArticles, subscriberCount: countRaw ? parseInt(countRaw, 10) : 0 });
    }

    // ── GET /img?url=... — image proxy to bypass hotlink protection ───────
    if (path === '/img' && method === 'GET') {
      const imgUrl = url.searchParams.get('url');
      if (!imgUrl) return new Response('Missing url', { status: 400 });
      try {
        const res = await fetch(imgUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PPPTVBot/1.0)', 'Accept': 'image/*' },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return new Response('Image fetch failed', { status: 502 });
        const ct = res.headers.get('content-type') ?? 'image/jpeg';
        return new Response(res.body, {
          headers: {
            'Content-Type': ct,
            'Cache-Control': 'public, max-age=86400',
            ...CORS_HEADERS,
          },
        });
      } catch {
        return new Response('Image proxy error', { status: 502 });
      }
    }

    return json({ error: 'Not found' }, 404);
  },
};
