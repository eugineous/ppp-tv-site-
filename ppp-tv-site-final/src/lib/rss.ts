import Parser from 'rss-parser';
import { slugify } from './utils';
import type { Article } from '@/types';
import { rssFeeds } from '@/data/rssFeeds';

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'PPP-TV-Kenya/1.0 (+https://ppptv.co.ke)' },
  customFields: {
    item: [
      ['media:content', 'media:content', { keepArray: false }],
      ['media:thumbnail', 'media:thumbnail', { keepArray: false }],
      ['media:group', 'media:group', { keepArray: false }],
      ['itunes:image', 'itunes:image', { keepArray: false }],
      ['image', 'image', { keepArray: false }],
    ],
  },
});

/** Parse a single RSS feed URL into Article objects */
export async function parseRSSFeed(
  url: string,
  sourceName: string,
  category: string
): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(url);
    return (feed.items ?? []).slice(0, 20).map((item) => {
      const title = item.title ?? 'Untitled';
      const publishedAt = item.isoDate ?? item.pubDate ?? new Date().toISOString();
      return {
        slug: slugify(`${title}-${Date.now()}`),
        title,
        excerpt: item.contentSnippet ?? item.summary ?? '',
        content: item.content ?? (item as unknown as Record<string, string>)['content:encoded'] ?? '',
        category,
        tags: [],
        imageUrl: extractImage(item as unknown as Parser.Item & Record<string, unknown>) ?? '',
        sourceUrl: item.link ?? url,
        sourceName,
        publishedAt,
      };
    });
  } catch {
    return [];
  }
}

/** Extract the best available image from an RSS item */
function extractImage(item: Parser.Item & Record<string, unknown>): string | null {
  // 1. media:content (most common in modern feeds)
  const media = item['media:content'] as { $?: { url?: string }; url?: string } | undefined;
  if (media?.$?.url) return media.$.url;
  if (media?.url) return media.url;

  // 2. media:thumbnail
  const thumb = item['media:thumbnail'] as { $?: { url?: string }; url?: string } | undefined;
  if (thumb?.$?.url) return thumb.$.url;
  if (thumb?.url) return thumb.url;

  // 3. enclosure (podcasts / some news feeds)
  const enc = item.enclosure as { url?: string; type?: string } | undefined;
  if (enc?.url && enc.type?.startsWith('image')) return enc.url;
  if (enc?.url) return enc.url;

  // 4. itunes:image
  const itunes = item['itunes:image'] as { href?: string; $?: { href?: string } } | undefined;
  if (itunes?.href) return itunes.href;
  if (itunes?.$?.href) return itunes.$.href;

  // 5. image field directly on item
  const imgField = item['image'] as string | { url?: string } | undefined;
  if (typeof imgField === 'string' && imgField.startsWith('http')) return imgField;
  if (typeof imgField === 'object' && imgField?.url) return imgField.url;

  // 6. Extract from content:encoded or content HTML
  const rawContent = (item['content:encoded'] ?? item.content ?? item.summary ?? '') as string;
  if (rawContent) {
    // Try src="..." or src='...'
    const srcMatch = rawContent.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (srcMatch?.[1] && srcMatch[1].startsWith('http')) return srcMatch[1];

    // Try srcset first image
    const srcsetMatch = rawContent.match(/srcset=["']([^\s"']+)/i);
    if (srcsetMatch?.[1] && srcsetMatch[1].startsWith('http')) return srcsetMatch[1];

    // Try og:image in content
    const ogMatch = rawContent.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      ?? rawContent.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (ogMatch?.[1] && ogMatch[1].startsWith('http')) return ogMatch[1];
  }

  // 7. description field HTML
  const desc = (item.summary ?? '') as string;
  if (desc) {
    const descMatch = desc.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (descMatch?.[1] && descMatch[1].startsWith('http')) return descMatch[1];
  }

  return null;
}

/** Fetch all configured RSS feeds in parallel, returning deduplicated articles */
export async function fetchAllFeeds(): Promise<Article[]> {
  const results = await Promise.allSettled(
    rssFeeds.map((feed) => parseRSSFeed(feed.url, feed.name, feed.category))
  );

  const all: Article[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    if (result.status === 'fulfilled') {
      for (const article of result.value) {
        const key = article.sourceUrl;
        if (!seen.has(key)) {
          seen.add(key);
          all.push(article);
        }
      }
    }
  }

  // Sort newest first
  return all.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
