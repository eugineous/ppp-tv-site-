'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { timeAgo } from '@/lib/utils';
import { isBookmarked, toggleBookmark } from '@/lib/localStorage';
import type { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
  priority?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  News: 'bg-blue-600',
  Entertainment: 'bg-purple-600',
  Sports: 'bg-green-600',
  Music: 'bg-orange-500',
  Lifestyle: 'bg-yellow-500',
  Technology: 'bg-cyan-600',
  Business: 'bg-teal-600',
  Culture: 'bg-rose-600',
  Community: 'bg-emerald-600',
  Events: 'bg-indigo-600',
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? 'bg-brand-pink';
}

export default function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(article.slug));
  }, [article.slug]);

  function handleBookmark(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleBookmark(article.slug);
    setBookmarked(next);
  }

  return (
    <article className="group relative bg-[#111] rounded-xl overflow-hidden hover:ring-1 hover:ring-brand-pink/50 transition-all">
      <Link href={`/news/${article.slug}`} className="block">
        {/* Thumbnail — 16:9 */}
        <div className="relative aspect-video overflow-hidden bg-white/5">
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-white/5">
              <span className="text-3xl font-bebas text-white/20">{article.category[0]}</span>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" aria-hidden="true" />
          {/* Category badge */}
          <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold text-white rounded uppercase tracking-wide ${getCategoryColor(article.category)}`}>
            {article.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug group-hover:text-brand-pink transition-colors mb-1.5">
            {article.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-500">{timeAgo(article.publishedAt)}</span>
            <span className="text-[11px] text-gray-600 truncate max-w-[100px]">{article.sourceName}</span>
          </div>
        </div>
      </Link>

      {/* Bookmark button */}
      <button
        onClick={handleBookmark}
        className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
          bookmarked ? 'bg-brand-pink text-white' : 'bg-black/60 text-gray-300 hover:text-white hover:bg-black/80'
        }`}
        aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
        aria-pressed={bookmarked}
      >
        <svg className="w-3.5 h-3.5" fill={bookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    </article>
  );
}
