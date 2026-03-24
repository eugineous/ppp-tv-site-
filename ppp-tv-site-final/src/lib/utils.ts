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
export function timeAgo(dateString: string): string {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'recently';
  }
}

/** Format a date string to a readable format, e.g. "24 Mar 2026" */
export function formatDate(dateString: string, pattern = 'd MMM yyyy'): string {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return format(date, pattern);
  } catch {
    return dateString;
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

/** Build a full URL for the Cloudflare Worker */
export function workerUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_WORKER_URL ?? '';
  return `${base}${path}`;
}
