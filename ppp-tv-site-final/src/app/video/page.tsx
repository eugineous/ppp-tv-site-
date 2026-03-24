import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video | PPP TV Kenya',
  description: 'Watch PPP TV Kenya videos — shows, highlights and exclusive content.',
};

const VIDEOS = [
  { id: 'dQw4w9WgXcQ', title: 'PPP TV Kenya — Channel Highlights', category: 'Highlights' },
  { id: 'dQw4w9WgXcQ', title: 'Urban News — Latest Bulletin', category: 'News' },
  { id: 'dQw4w9WgXcQ', title: 'Top 15 Countdown — This Week', category: 'Music' },
  { id: 'dQw4w9WgXcQ', title: 'Juu Ya Game — Sports Highlights', category: 'Sports' },
  { id: 'dQw4w9WgXcQ', title: 'Campus Xposure — Youth Edition', category: 'Lifestyle' },
  { id: 'dQw4w9WgXcQ', title: 'Kenyan Drive Show — Best Moments', category: 'Entertainment' },
];

const CAT_COLOR: Record<string,string> = {
  Highlights:'#FF007A', News:'#FF007A', Music:'#FF6B00',
  Sports:'#00CFFF', Lifestyle:'#00FF94', Entertainment:'#BF00FF',
};

export default function VideoPage() {
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>

      {/* ── HEADER — YouTube/video era dark red ── */}
      <div style={{ background: 'linear-gradient(135deg,#1a0000 0%,#000 60%)', borderBottom: '1px solid #1a0000', padding: '3.5rem 2rem 2.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '.6rem', fontWeight: 900, letterSpacing: '.3em', textTransform: 'uppercase', color: '#FF0000', marginBottom: '.4rem' }}>Watch</p>
            <h1 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 'clamp(2.5rem,7vw,5rem)', color: '#fff', letterSpacing: '.02em', lineHeight: 1, marginBottom: '.5rem' }}>Video</h1>
            <p style={{ color: '#555', fontSize: '.85rem' }}>PPP TV Kenya on YouTube — shows, highlights and exclusive content.</p>
          </div>
          <a href="https://www.youtube.com/@PPPTVKENYA" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '.65rem 1.5rem', background: '#FF0000', color: '#fff', fontSize: '.72rem', fontWeight: 900, letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
            <svg style={{ width: '16px', height: '16px' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Subscribe
          </a>
        </div>
      </div>

      {/* ── VIDEO GRID ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '12px' }}>
          {VIDEOS.map((video, i) => {
            const accent = CAT_COLOR[video.category] ?? '#FF007A';
            return (
              <div key={i} style={{ background: '#0d0d0d', overflow: 'hidden' }}>
                <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                  />
                </div>
                <div style={{ padding: '.85rem 1rem', borderTop: `2px solid ${accent}` }}>
                  <span style={{ display: 'block', fontSize: '.55rem', fontWeight: 900, letterSpacing: '.1em', textTransform: 'uppercase', color: accent, marginBottom: '4px' }}>{video.category}</span>
                  <span style={{ display: 'block', fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.1rem', color: '#fff', lineHeight: 1.2 }}>{video.title}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <a href="https://www.youtube.com/@PPPTVKENYA" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', padding: '.7rem 2rem', background: '#FF0000', color: '#fff', fontSize: '.75rem', fontWeight: 900, letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
            View All Videos on YouTube →
          </a>
        </div>
      </div>
    </div>
  );
}
