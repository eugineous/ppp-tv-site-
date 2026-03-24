import Link from 'next/link';
import Image from 'next/image';
import { truncate } from '@/lib/utils';
import type { Article } from '@/types';

interface HeroBannerProps {
  article: Article;
}

export default function HeroBanner({ article }: HeroBannerProps) {
  return (
    <div className="relative w-full" style={{ height: 'min(85vh, 700px)', minHeight: 400 }}>
      {/* Background image */}
      {article.imageUrl ? (
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
      )}

      {/* Netflix-style gradient overlays */}
      <div className="absolute inset-0 hero-gradient" aria-hidden="true" />

      {/* Bottom fade into page bg */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: 'linear-gradient(to top, #141414, transparent)' }}
        aria-hidden="true"
      />

      {/* Content — bottom left like Netflix */}
      <div className="absolute bottom-[15%] left-0 px-[4%] max-w-[600px] fade-up">
        {/* Category tag */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs font-bold uppercase tracking-[0.2em] px-2 py-1"
            style={{ background: '#E50914', color: '#fff' }}
          >
            {article.category}
          </span>
          <span className="maturity-badge">18+</span>
        </div>

        {/* Title */}
        <h1 className="display text-5xl sm:text-7xl text-white leading-none mb-4 drop-shadow-2xl">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-base sm:text-lg text-[#d2d2d2] mb-6 leading-relaxed max-w-lg line-clamp-3">
            {truncate(article.excerpt, 200)}
          </p>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link href={`/news/${article.slug}`} className="btn-netflix btn-netflix-primary">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            Read Now
          </Link>
          <Link href={`/news/${article.slug}`} className="btn-netflix btn-netflix-secondary">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            More Info
          </Link>
        </div>
      </div>

      {/* Source badge — top right */}
      <div className="absolute top-[30%] right-[4%] hidden sm:flex items-center gap-2 border-l-4 border-[#E50914] pl-3">
        <span className="text-sm text-[#d2d2d2] font-medium">{article.sourceName}</span>
      </div>
    </div>
  );
}
