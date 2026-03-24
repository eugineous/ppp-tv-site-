export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  tags: string[];
  imageUrl: string;
  sourceUrl: string;
  sourceName: string;
  publishedAt: string; // ISO string
  views?: number;
  trendingScore?: number;
}

export interface ScheduleSlot {
  day: string; // 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
  startTime: string; // '08:00'
  endTime: string;   // '09:00'
}

export interface Show {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  accentColor: string; // Tailwind color class e.g. 'pink-500'
  hostSlugs: string[];
  schedule: ScheduleSlot[];
  imageUrl?: string;
  featured?: boolean;
}

export interface Host {
  slug: string;
  name: string;
  title: string;
  bio: string;
  instagramUrl?: string;
  twitterUrl?: string;
  showSlugs: string[];
  initials: string;
  accentColor?: string;
}

export interface Artist {
  slug: string;
  name: string;
  genre: string;
  bio: string;
  initials: string;
  featured?: boolean;
  instagramUrl?: string;
  youtubeUrl?: string;
}

export interface Staff {
  slug: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  department: 'on-air' | 'behind-the-scenes';
}

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
  ipHash?: string;
}

export interface AnalyticsHit {
  slug: string;
  views: number;
  lastViewed: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  topArticles: AnalyticsHit[];
  subscriberCount: number;
  recentHits: AnalyticsHit[];
}

export type SortOrder = 'recent' | 'trending';

export interface FetchArticlesOptions {
  category?: string;
  sort?: SortOrder;
  limit?: number;
  offset?: number;
}
