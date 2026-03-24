import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchArticleBySlug, fetchArticles } from '@/lib/worker';
import { formatDate, truncate } from '@/lib/utils';
import ViewRecorder from './ViewRecorder';

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await fetchArticleBySlug(params.slug);
  if (!article) return { title: 'Article Not Found' };
  return {
    title: article.title,
    description: truncate(article.excerpt, 160),
    openGraph: {
      title: article.title,
      description: truncate(article.excerpt, 160),
      images: article.imageUrl ? [{ url: article.imageUrl }] : [],
      type: 'article',
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await fetchArticleBySlug(params.slug);
  if (!article) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/?cat=${article.category}`} className="hover:text-gray-300 transition-colors">{article.category}</Link>
        <span aria-hidden="true">/</span>
        <span className="text-gray-400 truncate max-w-[200px]">{article.title}</span>
      </nav>

      {/* Category badge */}
      <span className="inline-block mb-3 px-3 py-1 bg-brand-pink text-white text-xs font-bold uppercase tracking-widest rounded">
        {article.category}
      </span>

      {/* Title */}
      <h1 className="font-bebas text-3xl sm:text-5xl text-white leading-tight tracking-wide mb-4">
        {article.title}
      </h1>

      {/* Meta */}
      <div className="flex items-center gap-3 text-sm text-gray-400 mb-6 flex-wrap">
        <span>{formatDate(article.publishedAt)}</span>
        <span aria-hidden="true">·</span>
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand-pink transition-colors"
        >
          {article.sourceName}
        </a>
      </div>

      {/* Hero image */}
      {article.imageUrl && (
        <div className="relative aspect-video rounded-xl overflow-hidden mb-8 bg-white/5">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      {/* Excerpt */}
      {article.excerpt && (
        <p className="text-lg text-gray-300 leading-relaxed mb-6 border-l-4 border-brand-pink pl-4">
          {article.excerpt}
        </p>
      )}

      {/* Content */}
      {article.content ? (
        <div
          className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Read the full story on the original source.</p>
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-brand-pink text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors"
          >
            Read Full Article →
          </a>
        </div>
      )}

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10">
          {article.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-white/10 text-xs text-gray-300 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* View recorder (client component) */}
      <ViewRecorder slug={params.slug} article={article} />
    </article>
  );
}
