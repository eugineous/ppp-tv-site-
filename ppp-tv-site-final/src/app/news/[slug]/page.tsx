import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import { fetchArticleBySlug } from '@/lib/worker';
import { formatDate, truncate, formatArticleContent, decodeEntities } from '@/lib/utils';
import ViewRecorder from './ViewRecorder';

const CommentSection = dynamic(() => import('@/components/CommentSection'), { ssr: false });

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

const CAT_COLORS: Record<string, string> = {
  News: '#FF007A',
  Entertainment: '#BF00FF',
  Sports: '#00CFFF',
  Music: '#FF6B00',
  Lifestyle: '#00FF94',
  Technology: '#FFE600',
  Events: '#00CFFF',
  Celebrity: '#FF007A',
};

// Gradient fallback per category when no image is available
const CAT_GRADIENTS: Record<string, string> = {
  News:          'linear-gradient(135deg,#3d0020 0%,#0a0a0a 100%)',
  Entertainment: 'linear-gradient(135deg,#1a0030 0%,#0a0a0a 100%)',
  Sports:        'linear-gradient(135deg,#00203d 0%,#0a0a0a 100%)',
  Music:         'linear-gradient(135deg,#3d1800 0%,#0a0a0a 100%)',
  Lifestyle:     'linear-gradient(135deg,#003d20 0%,#0a0a0a 100%)',
  Technology:    'linear-gradient(135deg,#3d3d00 0%,#0a0a0a 100%)',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await fetchArticleBySlug(params.slug);
  if (!article) return { title: 'Article Not Found' };
  const title = decodeEntities(article.title);
  const desc = truncate(decodeEntities(article.excerpt), 160);
  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: article.imageUrl ? [{ url: article.imageUrl }] : [],
      type: 'article',
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await fetchArticleBySlug(params.slug);
  if (!article) notFound();

  const accent = CAT_COLORS[article.category] ?? '#FF007A';
  const fallbackGradient = CAT_GRADIENTS[article.category] ?? 'linear-gradient(135deg,#111 0%,#000 100%)';
  const cleanTitle = decodeEntities(article.title);
  const cleanExcerpt = decodeEntities(article.excerpt);
  const formattedContent = formatArticleContent(article.content ?? '');

  return (
    <article style={{ background: '#000', minHeight: '100vh' }}>
      {/* ── HERO IMAGE ── */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', maxHeight: '520px', overflow: 'hidden', background: fallbackGradient }}>
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={cleanTitle}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        ) : (
          /* Stylised no-image fallback */
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 'clamp(4rem,12vw,9rem)', color: 'rgba(255,255,255,0.06)', letterSpacing: '.02em', textTransform: 'uppercase', textAlign: 'center', padding: '0 1rem', lineHeight: 1 }}>
              {article.category}
            </span>
          </div>
        )}
        {/* Bottom gradient so content below reads cleanly */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.6) 40%, transparent 100%)', pointerEvents: 'none' }} />
        {/* Top accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: accent }} />
      </div>

      {/* ── CONTENT WRAPPER ── */}
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '.72rem', color: '#555', marginBottom: '1.5rem', flexWrap: 'wrap' }} aria-label="Breadcrumb">
          <Link href="/" style={{ color: '#555', textDecoration: 'none', transition: 'color .15s' }}>Home</Link>
          <span style={{ color: '#333' }}>/</span>
          <Link href={`/?cat=${article.category}`} style={{ color: accent, textDecoration: 'none' }}>{article.category}</Link>
          <span style={{ color: '#333' }}>/</span>
          <span style={{ color: '#444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{cleanTitle}</span>
        </nav>

        {/* Category badge */}
        <span style={{ display: 'inline-block', marginBottom: '1rem', padding: '3px 12px', background: accent, color: article.category === 'Technology' || article.category === 'Lifestyle' ? '#000' : '#fff', fontSize: '.6rem', fontWeight: 900, letterSpacing: '.12em', textTransform: 'uppercase', borderRadius: '2px' }}>
          {article.category}
        </span>

        {/* Title */}
        <h1 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#fff', lineHeight: 1.05, letterSpacing: '.02em', textTransform: 'uppercase', marginBottom: '1rem', overflowWrap: 'break-word' }}>
          {cleanTitle}
        </h1>

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '.75rem', color: '#555', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
          <span>{formatDate(article.publishedAt)}</span>
          <span style={{ color: '#2a2a2a' }}>·</span>
          <span style={{ color: '#444' }}>PPP TV Kenya</span>
        </div>

        {/* Excerpt / lead paragraph */}
        {cleanExcerpt && (
          <p style={{ fontSize: '1.1rem', color: '#ddd', lineHeight: 1.8, marginBottom: '2rem', paddingLeft: '1.2rem', borderLeft: `4px solid ${accent}`, fontWeight: 500 }}>
            {cleanExcerpt}
          </p>
        )}

        {/* Article body */}
        {formattedContent ? (
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        ) : (
          <p style={{ color: '#555', fontSize: '.9rem', padding: '2rem 0' }}>
            Full story is being loaded. Check back shortly.
          </p>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #1a1a1a' }}>
            {article.tags.map((tag) => (
              <span key={tag} style={{ padding: '4px 12px', fontSize: '.7rem', color: '#666', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* View recorder */}
        <ViewRecorder slug={params.slug} article={article} />

        {/* Comments */}
        <CommentSection articleSlug={params.slug} />
      </div>
    </article>
  );
}
