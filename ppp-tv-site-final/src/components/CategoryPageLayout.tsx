import Link from 'next/link';
import ArticleCard from './ArticleCard';
import { timeAgo, decodeEntities } from '@/lib/utils';
import type { Article } from '@/types';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SubcategoryRow {
  label: string;
  articles: Article[];
  accentColor?: string;
}

interface CategoryPageLayoutProps {
  title: string;
  accentColor: string;
  /** All articles for this category (used as hero + first row) */
  articles: Article[];
  /** Subcategory rows — each gets its own 4-col grid */
  rows: SubcategoryRow[];
  /** Top 10 latest across ALL categories for sidebar */
  latestAll: Article[];
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function LatestSidebar({ articles }: { articles: Article[] }) {
  return (
    <aside className="cat-page-sidebar">
      <div className="cat-page-sidebar-header">
        <span className="cat-page-sidebar-dot" />
        <span className="cat-page-sidebar-title">Latest Stories</span>
      </div>
      <div className="cat-page-sidebar-list">
        {articles.slice(0, 10).map((a, i) => (
          <Link key={a.slug} href={`/news/${a.slug}`} className="cat-page-sidebar-item">
            <span className="cat-page-sidebar-rank">{String(i + 1).padStart(2, '0')}</span>
            <div className="cat-page-sidebar-item-body">
              {a.imageUrl && (
                <img
                  src={a.imageUrl}
                  alt={decodeEntities(a.title)}
                  className="cat-page-sidebar-thumb"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="cat-page-sidebar-item-text">
                <span className="cat-page-sidebar-item-title">{decodeEntities(a.title)}</span>
                <span className="cat-page-sidebar-item-meta">
                  {a.category} · {timeAgo(a.publishedAt)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}

// ─── Hero card ────────────────────────────────────────────────────────────────

function HeroCard({ article, accentColor }: { article: Article; accentColor: string }) {
  const title = decodeEntities(article.title);
  const excerpt = decodeEntities(article.excerpt);
  return (
    <Link href={`/news/${article.slug}`} className="cat-page-hero-card">
      <div className="cat-page-hero-img">
        {article.imageUrl && (
          <img src={article.imageUrl} alt={title} loading="eager" referrerPolicy="no-referrer" />
        )}
        <div className="cat-page-hero-gradient" />
        <div className="cat-page-hero-accent" style={{ background: accentColor }} />
      </div>
      <div className="cat-page-hero-body">
        <span className="cat-page-hero-cat" style={{ background: accentColor, color: '#000' }}>
          {article.category}
        </span>
        <h2 className="cat-page-hero-title">{title}</h2>
        {excerpt && <p className="cat-page-hero-excerpt">{excerpt}</p>}
        <div className="cat-page-hero-meta">
          <span>{article.sourceName}</span>
          <span>·</span>
          <span>{timeAgo(article.publishedAt)}</span>
          <span className="cat-page-hero-read">Read Full Story →</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Article row (label + 4-col grid) ────────────────────────────────────────

function ArticleRow({
  label,
  articles,
  accentColor,
  cardOffset = 0,
}: {
  label: string;
  articles: Article[];
  accentColor: string;
  cardOffset?: number;
}) {
  if (articles.length === 0) return null;

  // Always show exactly 4 per row — pad with nulls if fewer
  const slots: (Article | null)[] = [...articles.slice(0, 8)];
  // Fill to nearest multiple of 4
  while (slots.length % 4 !== 0) slots.push(null);

  return (
    <section className="cat-subrow">
      {/* Row header */}
      <div className="cat-subrow-header">
        <span className="cat-subrow-accent" style={{ background: accentColor }} />
        <h2 className="cat-subrow-title">{label}</h2>
        <span className="cat-subrow-count">{articles.length} stories</span>
      </div>

      {/* 4-column grid */}
      <div className="cat-subrow-grid">
        {slots.map((a, i) =>
          a ? (
            <ArticleCard
              key={a.slug}
              article={a}
              accentColor={accentColor}
              ctaIndex={cardOffset + i}
              priority={i < 4 && cardOffset === 0}
            />
          ) : (
            <div key={`empty-${i}`} className="cat-subrow-empty-slot" />
          )
        )}
      </div>
    </section>
  );
}

// ─── Main layout ─────────────────────────────────────────────────────────────

export default function CategoryPageLayout({
  title,
  accentColor,
  articles,
  rows,
  latestAll,
}: CategoryPageLayoutProps) {
  const hero = articles[0] ?? null;
  // "Latest" row = first 8 articles (excluding hero)
  const latestArticles = articles.slice(1, 9);

  let cardOffset = latestArticles.length;

  return (
    <div className="cat-page-root">
      {/* Page header */}
      <div className="cat-page-header">
        <div className="cat-page-header-accent" style={{ background: accentColor }} />
        <h1 className="cat-page-header-title" style={{ color: accentColor }}>{title}</h1>
      </div>

      <div className="cat-page-body">
        {/* ── Main column ── */}
        <div className="cat-page-main">

          {/* Hero */}
          {hero && <HeroCard article={hero} accentColor={accentColor} />}

          {/* Latest row */}
          {latestArticles.length > 0 && (
            <ArticleRow
              label={`Latest ${title}`}
              articles={latestArticles}
              accentColor={accentColor}
              cardOffset={0}
            />
          )}

          {/* Subcategory rows */}
          {rows.map((row) => {
            const el = (
              <ArticleRow
                key={row.label}
                label={row.label}
                articles={row.articles}
                accentColor={row.accentColor ?? accentColor}
                cardOffset={cardOffset}
              />
            );
            cardOffset += row.articles.length;
            return el;
          })}

          {articles.length === 0 && rows.every(r => r.articles.length === 0) && (
            <div className="cat-page-empty">
              <span>Stories loading — check back in a few minutes.</span>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <LatestSidebar articles={latestAll} />
      </div>
    </div>
  );
}
