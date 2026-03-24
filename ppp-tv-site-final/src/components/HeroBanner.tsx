import Link from 'next/link';
import Image from 'next/image';
import { timeAgo, truncate } from '@/lib/utils';
import type { Article } from '@/types';

interface HeroBannerProps {
  article: Article;
}

export default function HeroBanner({ article }: HeroBannerProps) {
  return (
    <div className="relative w-full aspect-[16/7] min-h-[280px] max-h-[520px] overflow-hidden bg-[#111]">
      {/* Background image */}
      {article.imageUrl && (
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8 max-w-4xl">
        {/* Category badge */}
        <span className="inline-block mb-3 px-3 py-1 bg-brand-pink text-white text-xs font-bold uppercase tracking-widest rounded w-fit">
          {article.category}
        </span>

        {/* Title */}
        <h1 className="font-bebas text-3xl sm:text-5xl text-white leading-tight tracking-wide mb-2">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-sm sm:text-base text-gray-300 mb-4 max-w-2xl line-clamp-2">
            {truncate(article.excerpt, 160)}
          </p>
        )}

        {/* CTAs */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href={`/news/${article.slug}`}
            className="px-5 py-2.5 bg-brand-pink text-white text-sm font-semibold rounded-lg hover:bg-pink-600 transition-colors"
          >
            Read Story
          </Link>
          <span className="text-xs text-gray-400">{timeAgo(article.publishedAt)} · {article.sourceName}</span>
        </div>
      </div>
    </div>
  );
}
