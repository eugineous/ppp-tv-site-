import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import Link from 'next/link';
import { timeAgo, decodeEntities } from '@/lib/utils';
import type { Article } from '@/types';

export const metadata: Metadata = {
  title: 'Archive | PPP TV Kenya',
  description: 'Browse all stories by time — today, yesterday, and older.',
};

export const revalidate = 300;

function groupByAge(articles: Article[]): Record<string, Article[]> {
  const now = Date.now();
  const groups: Record<string, Article[]> = {
    'Just Now (< 1 hour)': [],
    '1–3 Hours Ago': [],
    '3–6 Hours Ago': [],
    '6–12 Hours Ago': [],
    '12–24 Hours Ago': [],
    'Yesterday': [],
    '2 Days Ago': [],
    '3+ Days Ago': [],
  };

  for (const a of articles) {
    const ageMs = now - new Date(a.publishedAt).getTime();
    const ageH = ageMs / 3600000;
    const ageD = ageMs / 86400000;

    if (ageH < 1) groups['Just Now (< 1 hour)'].push(a);
    else if (ageH < 3) groups['1–3 Hours Ago'].push(a);
    else if (ageH < 6) groups['3–6 Hours Ago'].push(a);
    else if (ageH < 12) groups['6–12 Hours Ago'].push(a);
    else if (ageH < 24) groups['12–24 Hours Ago'].push(a);
    else if (ageD < 2) groups['Yesterday'].push(a);
    else if (ageD < 3) groups['2 Days Ago'].push(a);
    else groups['3+ Days Ago'].push(a);
  }
  return groups;
}

const GROUP_COLORS: Record<string, string> = {
  'Just Now (< 1 hour)': '#FF007A',
  '1–3 Hours Ago': '#FF6B00',
  '3–6 Hours Ago': '#FFE600',
  '6–12 Hours Ago': '#00FF94',
  '12–24 Hours Ago': '#00CFFF',
  'Yesterday': '#BF00FF',
  '2 Days Ago': '#888',
  '3+ Days Ago': '#555',
};

export default async function ArchivePage() {
  const articles = await fetchArticles({ sort: 'recent', limit: 200 });
  const groups = groupByAge(articles);

  return (
    <div style={{ background: '#000', minHeight: '100vh', maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '.6rem', fontWeight: 900, letterSpacing: '.3em', textTransform: 'uppercase', color: '#FF007A', marginBottom: '.5rem' }}>PPP TV Kenya</p>
        <h1 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 'clamp(2.5rem,6vw,5rem)', color: '#fff', letterSpacing: '.02em', lineHeight: 0.95 }}>Story Archive</h1>
        <p style={{ color: '#555', fontSize: '.85rem', marginTop: '.5rem' }}>All stories grouped by how recent they are</p>
      </div>

      {Object.entries(groups).map(([label, arts]) => {
        if (arts.length === 0) return null;
        const color = GROUP_COLORS[label] || '#FF007A';
        return (
          <section key={label} style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', paddingBottom: '8px', borderBottom: `2px solid ${color}30` }}>
              <div style={{ width: '4px', height: '24px', background: color, borderRadius: '2px' }} />
              <h2 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.6rem', color, letterSpacing: '.04em' }}>{label}</h2>
              <span style={{ fontSize: '.65rem', color: '#444', fontWeight: 700 }}>{arts.length} stories</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {arts.map(a => (
                <Link key={a.slug} href={`/news/${a.slug}`} style={{ display: 'flex', gap: '12px', background: '#0a0a0a', borderRadius: '8px', padding: '12px', textDecoration: 'none', border: '1px solid #1a1a1a', transition: 'border-color .15s' }}>
                  {a.imageUrl && (
                    <img src={a.imageUrl} alt="" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} loading="lazy" />
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '.6rem', fontWeight: 900, color, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '4px' }}>{a.category}</div>
                    <div style={{ fontSize: '.82rem', fontWeight: 700, color: '#ddd', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{decodeEntities(a.title)}</div>
                    <div style={{ fontSize: '.68rem', color: '#555', marginTop: '4px' }}>{timeAgo(a.publishedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
