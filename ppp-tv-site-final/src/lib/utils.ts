import { formatDistanceToNow, format, parseISO } from 'date-fns';

/** Convert a string to a URL-safe slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Return a human-readable relative time string, e.g. "3 hours ago" */
export function timeAgo(dateString: string | null | undefined): string {
  if (!dateString) return 'recently';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'recently';
  }
}

/** Format a date string to a readable format, e.g. "24 Mar 2026" */
export function formatDate(dateString: string | null | undefined, pattern = 'd MMM yyyy'): string {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return format(date, pattern);
  } catch {
    return dateString ?? '';
  }
}

/** Truncate text to a max length, appending ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Decode HTML entities like &#038; &amp; &apos; &quot; etc. */
export function decodeEntities(html: string | null | undefined): string {
  if (!html) return '';
  return html
    .replace(/&#0*38;|&amp;/g, '&')
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&#0*34;|&quot;/g, '"')
    .replace(/&#0*60;|&lt;/g, '<')
    .replace(/&#0*62;|&gt;/g, '>')
    .replace(/&#8216;|&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8230;/g, '…')
    .replace(/&nbsp;/g, ' ');
}

/**
 * Format raw scraped HTML/text into clean, readable article HTML.
 * - Strips source attribution lines
 * - Wraps bare text blocks in <p> tags
 * - Detects and styles blockquotes
 * - Ensures paragraph spacing
 */
export function formatArticleContent(raw: string | null | undefined): string {
  if (!raw) return '';

  let html = raw;

  // Decode entities first
  html = decodeEntities(html);

  // Strip "Read more" / source attribution lines
  html = html.replace(/<a[^>]*>(Read more|Read More|Source|Via|Originally published)[^<]*<\/a>/gi, '');
  html = html.replace(/Read more(?: from| at| on)?[^<\n]*/gi, '');

  // If it's plain text (no block tags), convert newlines to paragraphs
  if (!/<(p|div|h[1-6]|blockquote|ul|ol|li)\b/i.test(html)) {
    const paras = html
      .split(/\n{2,}/)
      .map(s => s.trim())
      .filter(Boolean);
    html = paras.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('\n');
  }

  // Ensure <p> tags have spacing (add class)
  html = html.replace(/<p(\s[^>]*)?>/gi, '<p$1 class="article-p">');

  // Style blockquotes as pull-quotes
  html = html.replace(/<blockquote([^>]*)>/gi, '<blockquote$1 class="pull-quote">');

  // Detect lines that look like quotes: text starting with " or ' and ending with " or '
  html = html.replace(
    /<p[^>]*>\s*[""']([^<]{20,})[""']\s*<\/p>/g,
    '<blockquote class="pull-quote">$1</blockquote>'
  );

  // Style h2/h3 inside content
  html = html.replace(/<h2([^>]*)>/gi, '<h2$1 class="article-subhead">');
  html = html.replace(/<h3([^>]*)>/gi, '<h3$1 class="article-subhead" style="font-size:1.2rem">');

  // Remove empty paragraphs
  html = html.replace(/<p[^>]*>\s*(<br\s*\/?>)?\s*<\/p>/gi, '');

  return html;
}

/** Build a full URL for the Cloudflare Worker */
export function workerUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_WORKER_URL ?? '';
  return `${base}${path}`;
}
