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

export default function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(article.slug));
  }, [article.slug]);

  function handleBookmark(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked(toggleBookmark(article.slug));
  }

  return (
    <article
      className="netflix-card group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/news/${article.slug}`} className="block">
        {/* Thumbnail — 16:9 */}
        <div className="relative aspect-video overflow-hidden rounded-sm bg-[#1a1a1a]">
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
              <span className="display text-4xl text-white/20">{article.category[0]}</span>
            </div>
          )}

          {/* Dark overlay on hover */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ background: 'rgba(0,0,0,0.4)', opacity: hovered ? 1 : 0 }}
            aria-hidden="true"
          />

          {/* Play button on hover */}
          {hovered && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}

          {/* Category badge */}
          <span
            className="absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 uppercase tracking-wide"
            style={{ background: '#E50914' }}
          >
            {article.category}
          </span>

          {/* Bookmark */}
          <button
            onClick={handleBookmark}
            className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              bookmarked
                ? 'bg-[#E50914] text-white'
                : 'bg-black/60 text-gray-300 hover:bg-black/80 hover:text-white opacity-0 group-hover:opacity-100'
            }`}
            aria-label={bookmarked ? 'Remove from list' : 'Add to list'}
            aria-pressed={bookmarked}
          >
            {bookmarked ? (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        </div>

        {/* Info panel — shows on hover */}
        <div
          className="overflow-hidden transition-all duration-300 bg-[#1a1a1a] rounded-b-sm"
          style={{ maxHeight: hovered ? '120px' : '0px', opacity: hovered ? 1 : 0 }}
        >
          <div className="p-3">
            <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug mb-1">
              {article.title}
            </h3>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-green-400 font-semibold">New</span>
              <span className="text-gray-400">{timeAgo(article.publishedAt)}</span>
              <span className="maturity-badge text-[10px]">18+</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
