import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import { fetchArticleBySlug, fetchArticles } from '@/lib/worker';
import { formatDate, truncate, formatArticleContent, decodeEntities } from '@/lib/utils';
import ViewRecorder from './ViewRecorder';

const CommentSection = dynamic(() => import('@/components/CommentSection'), { ssr: false });

export const revalidate = 300;

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
  const [article, related] = await Promise.all([
    fetchArticleBySlug(params.slug),
    fetchArticles({ sort: 'recent', limit: 6 }),
  ]);
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
          <Link href={`/${article.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`} style={{ color: accent, textDecoration: 'none' }}>{article.category}</Link>
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
        {formattedContent && formattedContent.length > 200 ? (
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        ) : (
          <div style={{ padding: '2rem 0' }}>
            {cleanExcerpt && (
              <p style={{ color: '#ccc', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>{cleanExcerpt}</p>
            )}
            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: '#666', fontSize: '.85rem', marginBottom: '1rem' }}>Full story available at the original source</p>
              {article.sourceUrl && (
                <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: accent, color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '.8rem', fontWeight: 900, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                  Read Full Story →
                </a>
              )}
            </div>
          </div>
        )}

        {/* PPP TV Verdict */}
        {(article as { pptvVerdict?: string }).pptvVerdict && (
          <div style={{ margin: '2.5rem 0', padding: '1.25rem 1.5rem', background: `linear-gradient(135deg,${accent}18 0%,rgba(0,0,0,0) 100%)`, border: `1px solid ${accent}40`, borderRadius: '4px' }}>
            <p style={{ fontSize: '.65rem', fontWeight: 900, letterSpacing: '.15em', textTransform: 'uppercase', color: accent, marginBottom: '.5rem' }}>🔥 PPP TV Verdict</p>
            <p style={{ fontSize: '1rem', color: '#e0e0e0', lineHeight: 1.7, fontStyle: 'italic' }}>
              {(article as { pptvVerdict?: string }).pptvVerdict}
            </p>
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #1a1a1a' }}>
            {article.tags.map((tag) => (
              <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`}
                style={{ padding: '4px 12px', fontSize: '.7rem', color: accent, background: `${accent}15`, borderRadius: '999px', textDecoration: 'none', border: `1px solid ${accent}30`, transition: 'background .15s' }}>
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Rewritten timestamp */}
        {(article as { rewrittenAt?: string }).rewrittenAt && (
          <p style={{ fontSize: '.65rem', color: '#333', marginTop: '1.5rem' }}>
            AI-rewritten by PPP TV · {formatDate((article as { rewrittenAt?: string }).rewrittenAt!)}
          </p>
        )}

        {/* View recorder */}
        <ViewRecorder slug={params.slug} article={article} />

        {/* Share buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #1a1a1a', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '.7rem', fontWeight: 900, color: '#555', letterSpacing: '.08em', textTransform: 'uppercase', marginRight: '4px' }}>Share:</span>
          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${cleanTitle} — ${`https://ppp-tv-site-final.vercel.app/news/${params.slug}`}`)}`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#25D366', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '.72rem', fontWeight: 900, letterSpacing: '.04em' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
          {/* X/Twitter */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(cleanTitle)}&url=${encodeURIComponent(`https://ppp-tv-site-final.vercel.app/news/${params.slug}`)}&via=PPPTV_ke`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '.72rem', fontWeight: 900, letterSpacing: '.04em' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Post
          </a>
          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://ppp-tv-site-final.vercel.app/news/${params.slug}`)}`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#1877F2', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '.72rem', fontWeight: 900, letterSpacing: '.04em' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Share
          </a>
          {/* Copy link */}
          <button
            onClick={() => { navigator.clipboard?.writeText(`https://ppp-tv-site-final.vercel.app/news/${params.slug}`); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'transparent', border: '1px solid #333', color: '#888', borderRadius: '6px', cursor: 'pointer', fontSize: '.72rem', fontWeight: 900, letterSpacing: '.04em' }}
          >
            🔗 Copy Link
          </button>
        </div>

        {/* Comments */}
        <CommentSection articleSlug={params.slug} />
      </div>

      {/* Related Articles */}
      {related.filter(r => r.slug !== params.slug).length > 0 && (
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 1.25rem 4rem' }}>
          <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '2.5rem' }}>
            <h2 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.8rem', color: '#fff', letterSpacing: '.04em', marginBottom: '1.25rem' }}>
              More Stories
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '14px' }}>
              {related.filter(r => r.slug !== params.slug).slice(0, 5).map(r => {
                const rColor = CAT_COLORS[r.category] ?? '#FF007A';
                return (
                  <Link key={r.slug} href={`/news/${r.slug}`} style={{ display: 'block', textDecoration: 'none', background: '#0a0a0a', borderRadius: '10px', overflow: 'hidden', border: '1px solid #1a1a1a', transition: 'border-color .15s' }}>
                    {r.imageUrl && (
                      <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#111' }}>
                        <img src={r.imageUrl} alt={decodeEntities(r.title)} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: rColor }} />
                      </div>
                    )}
                    <div style={{ padding: '10px 12px 12px' }}>
                      <span style={{ fontSize: '.58rem', fontWeight: 900, color: rColor, letterSpacing: '.1em', textTransform: 'uppercase' }}>{r.category}</span>
                      <div style={{ fontSize: '.82rem', fontWeight: 700, color: '#ddd', lineHeight: 1.35, marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {decodeEntities(r.title)}
                      </div>
                      <div style={{ fontSize: '.65rem', color: '#555', marginTop: '6px' }}>{formatDate(r.publishedAt)}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
