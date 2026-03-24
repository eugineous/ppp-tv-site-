import Link from 'next/link';
import Image from 'next/image';
import SectionLabel from './SectionLabel';
import { timeAgo } from '@/lib/utils';
import type { Article } from '@/types';

interface TrendingSectionProps {
  articles: Article[];
}

export default function TrendingSection({ articles }: TrendingSectionProps) {
  if (articles.length === 0) return null;
  const top5 = articles.slice(0, 5);

  return (
    <section className="py-6" aria-label="Trending articles">
      <div className="max-w-7xl mx-auto px-4">
        <SectionLabel label="Trending Now" accentColor="bg-red-500" />
        <ol className="space-y-3">
          {top5.map((article, i) => (
            <li key={article.slug}>
              <Link
                href={`/news/${article.slug}`}
                className="flex items-center gap-3 group p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {/* Rank number */}
                <span className="font-bebas text-3xl text-white/20 w-8 text-center flex-shrink-0 group-hover:text-brand-pink transition-colors">
                  {i + 1}
                </span>

                {/* Thumbnail */}
                <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0 bg-white/5">
                  {article.imageUrl ? (
                    <Image
                      src={article.imageUrl}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-gray-600">{article.category[0]}</span>
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 group-hover:text-white line-clamp-2 leading-snug transition-colors">
                    {article.title}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{timeAgo(article.publishedAt)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
