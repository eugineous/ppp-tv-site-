import type { Article } from '@/types';

const BOOKMARKS_KEY = 'ppp_bookmarks';
const RECENTLY_VIEWED_KEY = 'ppp_recently_viewed';
const MAX_RECENTLY_VIEWED = 10;

// ─── Bookmarks ────────────────────────────────────────────────────────────────

export function getBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function isBookmarked(slug: string): boolean {
  return getBookmarks().includes(slug);
}

/** Toggle bookmark for a slug. Returns the new bookmarked state. */
export function toggleBookmark(slug: string): boolean {
  try {
    const bookmarks = getBookmarks();
    const idx = bookmarks.indexOf(slug);
    if (idx === -1) {
      bookmarks.push(slug);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      return true;
    } else {
      bookmarks.splice(idx, 1);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      return false;
    }
  } catch {
    return false;
  }
}

// ─── Recently Viewed ──────────────────────────────────────────────────────────

export interface RecentlyViewedItem {
  slug: string;
  title: string;
  imageUrl: string;
  category: string;
  viewedAt: string;
}

export function getRecentlyViewed(): RecentlyViewedItem[] {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return raw ? (JSON.parse(raw) as RecentlyViewedItem[]) : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(article: Pick<Article, 'slug' | 'title' | 'imageUrl' | 'category'>): void {
  try {
    const items = getRecentlyViewed().filter((i) => i.slug !== article.slug);
    items.unshift({
      slug: article.slug,
      title: article.title,
      imageUrl: article.imageUrl,
      category: article.category,
      viewedAt: new Date().toISOString(),
    });
    localStorage.setItem(
      RECENTLY_VIEWED_KEY,
      JSON.stringify(items.slice(0, MAX_RECENTLY_VIEWED))
    );
  } catch {
    // silently fail
  }
}

export function clearRecentlyViewed(): void {
  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  } catch {
    // silently fail
  }
}
