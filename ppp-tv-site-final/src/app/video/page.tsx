import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Video | PPP TV Kenya',
  description: 'Watch PPP TV Kenya shows, highlights and exclusive video content.',
};

const YOUTUBE_CHANNEL = 'UCCtBJ9MP1PE_A1Qz4AUi46Q';

const FEATURED_VIDEOS = [
  { id: 'dQw4w9WgXcQ', title: 'Urban News — Latest Episode', category: 'News' },
  { id: 'dQw4w9WgXcQ', title: 'Campus Xposure — This Week', category: 'Lifestyle' },
  { id: 'dQw4w9WgXcQ', title: 'Top 10 Countdown', category: 'Music' },
  { id: 'dQw4w9WgXcQ', title: 'Kenyan Drive Show', category: 'Entertainment' },
  { id: 'dQw4w9WgXcQ', title: 'Gospel 10 — Sunday Edition', category: 'Gospel' },
  { id: 'dQw4w9WgXcQ', title: 'Tushinde Charity Show', category: 'Community' },
];

const CAT_COLORS: Record<string, string> = {
  News: '#FF007A', Lifestyle: '#00FF94', Music: '#FF6B00',
  Entertainment: '#BF00FF', Gospel: '#FFE600', Community: '#00CFFF',
};

export default function VideoPage() {
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#0a0a0a 0%,#000 100%)', borderBottom: '1px solid #111', padding: '3rem 1.5rem 2.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ fontSize: '.6rem', fontWeight: 900, letterSpacing: '.3em', textTransform: 'uppercase', color: '#FF007A', marginBottom: '.5rem' }}>PPP TV Kenya</p>
          <h1 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 'clamp(2.5rem,6vw,5rem)', color: '#fff', letterSpacing: '.02em', lineHeight: .95, marginBottom: '.75rem' }}>Watch</h1>
          <p style={{ color: '#555', fontSize: '.9rem', maxWidth: '480px', marginBottom: '1.5rem' }}>
            PPP TV Kenya shows, highlights and exclusive content — StarTimes Channel 430
          </p>
          <a
            href={`https://www.youtube.com/@PPPTVKenya`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#FF0000', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '.78rem', fontWeight: 900, letterSpacing: '.06em', textTransform: 'uppercase' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            Subscribe on YouTube
          </a>
        </div>
      </div>

      {/* Live TV embed */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
            <div style={{ width: '4px', height: '28px', background: '#FF007A', borderRadius: '2px' }} />
            <div>
              <div style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.8rem', color: '#fff', letterSpacing: '.04em' }}>🔴 Live Stream</div>
              <div style={{ fontSize: '.65rem', fontWeight: 900, color: '#FF007A', letterSpacing: '.1em', textTransform: 'uppercase' }}>StarTimes Channel 430</div>
            </div>
          </div>
          <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#0a0a0a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1a1a1a' }}>
            <iframe
              src={`https://www.youtube.com/embed?listType=user_uploads&list=PPPTVKenya&autoplay=0`}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="PPP TV Kenya Live"
            />
          </div>
        </div>

        {/* Shows grid */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
            <div style={{ width: '4px', height: '28px', background: '#BF00FF', borderRadius: '2px' }} />
            <div style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.8rem', color: '#fff', letterSpacing: '.04em' }}>Our Shows</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '16px' }}>
            {FEATURED_VIDEOS.map((v, i) => {
              const color = CAT_COLORS[v.category] || '#FF007A';
              return (
                <div key={i} style={{ background: '#0a0a0a', borderRadius: '10px', overflow: 'hidden', border: '1px solid #1a1a1a' }}>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#111' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${v.id}`}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      title={v.title}
                    />
                  </div>
                  <div style={{ padding: '12px' }}>
                    <span style={{ fontSize: '.6rem', fontWeight: 900, color, letterSpacing: '.1em', textTransform: 'uppercase' }}>{v.category}</span>
                    <div style={{ fontSize: '.9rem', fontWeight: 700, color: '#fff', marginTop: '4px', lineHeight: 1.3 }}>{v.title}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '2rem', background: '#0a0a0a', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
          <p style={{ color: '#555', fontSize: '.85rem', marginBottom: '1rem' }}>Watch all PPP TV Kenya content on YouTube</p>
          <a href="https://www.youtube.com/@PPPTVKenya" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: '#FF007A', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '.8rem', fontWeight: 900, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Watch on YouTube →
          </a>
        </div>
      </div>
    </div>
  );
}
