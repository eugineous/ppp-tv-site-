import type { Article } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface IngestArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  sourceName: string;
  sourceUrl: string;
  articleUrl: string;
  publishedAt: string;
  imageUrl: string;
  imageUrlDirect: string;
  videoUrl: null | string;
  videoEmbedUrl?: null | string;
  isBreaking: boolean;
  tags: string[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const CATEGORY_MAP: Record<string, string> = {
  Entertainment: 'ENTERTAINMENT',
  Celebrity:     'CELEBRITY',
  Music:         'MUSIC',
  Sports:        'SPORTS',
  Movies:        'MOVIES',
  Lifestyle:     'LIFESTYLE',
  Technology:    'GENERAL',
  News:          'GENERAL',
  Events:        'EVENTS',
  Fashion:       'FASHION',
  Comedy:        'COMEDY',
};

export const VALID_CATEGORIES = new Set<string>([
  'ENTERTAINMENT',
  'CELEBRITY',
  'MUSIC',
  'SPORTS',
  'TV & FILM',
  'MOVIES',
  'FASHION',
  'COMEDY',
  'AWARDS',
  'EVENTS',
  'EAST AFRICA',
  'LIFESTYLE',
  'GENERAL',
]);

const INGEST_URL = 'https://auto-news-station.vercel.app/api/ingest';

function getIngestSecret(): string {
  return process.env.INGEST_SECRET ?? 'ppptvWorker2024';
}

function getSupabaseUrl(): string {
  return process.env.SUPABASE_URL ?? '';
}

function getSupabaseKey(): string {
  return process.env.SUPABASE_SERVICE_KEY ?? '';
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

// ---------------------------------------------------------------------------
// Task 3.1 — mapToIngestPayload
// ---------------------------------------------------------------------------

export function mapToIngestPayload(article: Article): IngestArticle {
  const category = CATEGORY_MAP[article.category] ?? 'ENTERTAINMENT';
  const plainContent = stripHtml(article.content ?? '');

  let excerpt = article.excerpt && article.excerpt.trim().length > 0
    ? article.excerpt
    : plainContent.slice(0, 300);

  excerpt = excerpt.slice(0, 300);

  const articleUrl = `https://ppp-tv-site.vercel.app/news/${article.slug}`;

  return {
    id:             article.slug,
    title:          article.title.toUpperCase(),
    excerpt,
    content:        plainContent,
    category,
    sourceName:     'PPP TV Kenya',
    sourceUrl:      articleUrl,
    articleUrl,
    publishedAt:    article.publishedAt,
    imageUrl:       article.imageUrl ?? '',
    imageUrlDirect: article.imageUrl ?? '',
    videoUrl:       null,
    isBreaking:     false,
    tags:           article.tags ?? [],
  };
}

// ---------------------------------------------------------------------------
// Task 3.3 — checkIngestHealth
// ---------------------------------------------------------------------------

export async function checkIngestHealth(): Promise<boolean> {
  try {
    const res = await fetch(INGEST_URL, {
      method: 'GET',
      headers: { Authorization: `Bearer ${getIngestSecret()}` },
    });
    if (!res.ok) return false;
    const body = await res.json() as { ok?: boolean };
    return body.ok === true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Task 3.4 — pushArticle
// ---------------------------------------------------------------------------

export async function pushArticle(
  article: Article,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const payload = mapToIngestPayload(article);
    const supabaseUrl = getSupabaseUrl();
    const supabaseKey = getSupabaseKey();

    // Upsert into ingest_queue (best-effort)
    if (supabaseUrl && supabaseKey) {
      try {
        const upsertRes = await fetch(`${supabaseUrl}/rest/v1/ingest_queue`, {
          method: 'POST',
          headers: {
            'Content-Type':  'application/json',
            'apikey':        supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer':        'resolution=merge-duplicates',
          },
          body: JSON.stringify({
            id:               payload.id,
            title:            payload.title,
            excerpt:          payload.excerpt,
            content:          payload.content,
            category:         payload.category,
            source_name:      payload.sourceName,
            source_url:       payload.sourceUrl,
            article_url:      payload.articleUrl,
            published_at:     payload.publishedAt,
            image_url:        payload.imageUrl,
            image_url_direct: payload.imageUrlDirect,
            video_url:        payload.videoUrl,
            is_breaking:      payload.isBreaking,
            tags:             payload.tags,
            posted:           false,
          }),
        });
        if (!upsertRes.ok) {
          console.error('[pusher] ingest_queue upsert failed:', upsertRes.status, upsertRes.statusText);
        }
      } catch (err) {
        console.error('[pusher] ingest_queue upsert error:', err);
      }
    }

    // POST to ingest endpoint with 10s timeout
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);

    let ingestRes: Response;
    try {
      ingestRes = await fetch(INGEST_URL, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${getIngestSecret()}`,
        },
        body:   JSON.stringify({ article: payload }),
        signal: controller.signal,
      });
    } catch (err: unknown) {
      clearTimeout(timer);
      const isAbort =
        err instanceof Error && (err.name === 'AbortError' || err.message.includes('abort'));
      return { ok: false, error: isAbort ? 'timeout' : String(err) };
    }
    clearTimeout(timer);

    if (ingestRes.ok) {
      // Mark posted=true
      if (supabaseUrl && supabaseKey) {
        try {
          await fetch(
            `${supabaseUrl}/rest/v1/ingest_queue?id=eq.${encodeURIComponent(payload.id)}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type':  'application/json',
                'apikey':        supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
              },
              body: JSON.stringify({ posted: true }),
            },
          );
        } catch (err) {
          console.error('[pusher] posted=true PATCH error:', err);
        }
      }
      return { ok: true };
    }

    return { ok: false, error: ingestRes.statusText };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ---------------------------------------------------------------------------
// Task 3.5 — pushBatch
// ---------------------------------------------------------------------------

export async function pushBatch(): Promise<{
  ok: boolean;
  pushed: number;
  error?: string;
}> {
  try {
    const healthy = await checkIngestHealth();
    if (!healthy) {
      return { ok: false, pushed: 0, error: 'Ingest endpoint unavailable' };
    }

    const supabaseUrl = getSupabaseUrl();
    const supabaseKey = getSupabaseKey();

    // Fetch 50 most recent articles
    const articlesRes = await fetch(
      `${supabaseUrl}/rest/v1/articles?order=published_at.desc&limit=50`,
      {
        headers: {
          'apikey':        supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      },
    );

    if (!articlesRes.ok) {
      return { ok: false, pushed: 0, error: articlesRes.statusText };
    }

    const articles = await articlesRes.json() as Article[];
    if (!articles.length) {
      return { ok: true, pushed: 0 };
    }

    const payloads = articles.map(mapToIngestPayload);

    // Batch POST with 30s timeout
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30_000);

    let batchRes: Response;
    try {
      batchRes = await fetch(INGEST_URL, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${getIngestSecret()}`,
        },
        body:   JSON.stringify({ articles: payloads }),
        signal: controller.signal,
      });
    } catch (err: unknown) {
      clearTimeout(timer);
      const isAbort =
        err instanceof Error && (err.name === 'AbortError' || err.message.includes('abort'));
      return { ok: false, pushed: 0, error: isAbort ? 'timeout' : String(err) };
    }
    clearTimeout(timer);

    if (!batchRes.ok) {
      return { ok: false, pushed: 0, error: batchRes.statusText };
    }

    // Upsert all as posted=true
    if (supabaseUrl && supabaseKey) {
      try {
        const rows = payloads.map((p) => ({
          id:               p.id,
          title:            p.title,
          excerpt:          p.excerpt,
          content:          p.content,
          category:         p.category,
          source_name:      p.sourceName,
          source_url:       p.sourceUrl,
          article_url:      p.articleUrl,
          published_at:     p.publishedAt,
          image_url:        p.imageUrl,
          image_url_direct: p.imageUrlDirect,
          video_url:        p.videoUrl,
          is_breaking:      p.isBreaking,
          tags:             p.tags,
          posted:           true,
        }));

        const upsertRes = await fetch(`${supabaseUrl}/rest/v1/ingest_queue`, {
          method: 'POST',
          headers: {
            'Content-Type':  'application/json',
            'apikey':        supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer':        'resolution=merge-duplicates',
          },
          body: JSON.stringify(rows),
        });

        if (!upsertRes.ok) {
          console.error('[pusher] batch upsert failed:', upsertRes.status, upsertRes.statusText);
        }
      } catch (err) {
        console.error('[pusher] batch upsert error:', err);
      }
    }

    return { ok: true, pushed: payloads.length };
  } catch (err) {
    return { ok: false, pushed: 0, error: String(err) };
  }
}
