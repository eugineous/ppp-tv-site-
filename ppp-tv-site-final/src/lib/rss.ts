import Parser from 'rss-parser';
import { slugify } from './utils';
import type { Article } from '@/types';
import { rssFeeds } from '@/data/rssFeeds';

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'PPP-TV-Kenya/1.0 (+https://ppptv.co.ke)' },
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
        content: item.content ?? item['content:encoded'] ?? '',
        category,
        tags: [],
        imageUrl: extractImage(item) ?? '',
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
  // Try media:content
  const media = item['media:content'] as { $?: { url?: string } } | undefined;
  if (media?.$?.url) return media.$.url;

  // Try enclosure
  const enc = item.enclosure as { url?: string } | undefined;
  if (enc?.url) return enc.url;

  // Try to extract from content HTML
  const content = (item.content ?? item['content:encoded'] ?? '') as string;
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match?.[1]) return match[1];

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
