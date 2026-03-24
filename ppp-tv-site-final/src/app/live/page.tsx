import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { shows } from '@/data/shows';

const OnAirStrip = dynamic(() => import('@/components/OnAirStrip'), { ssr: false });

export const metadata: Metadata = {
  title: 'Watch Live | PPP TV Kenya',
  description: 'Watch PPP TV Kenya live on YouTube — StarTimes Channel 430.',
};

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] as const;
const CAT_COLOR: Record<string,string> = {
  News:'#FF007A', Entertainment:'#BF00FF', Sports:'#00CFFF',
  Music:'#FF6B00', Lifestyle:'#00FF94', Technology:'#FFE600',
};

export default function LivePage() {
  const todayIdx = new Date().getDay(); // 0=Sun
  const dayMap: Record<number, typeof DAYS[number]> = { 1:'Mon',2:'Tue',3:'Wed',4:'Thu',5:'Fri',6:'Sat',0:'Sun' };
  const today = dayMap[todayIdx] ?? 'Mon';
  const todaySlots = shows.flatMap(show =>
    show.schedule.filter(sl => sl.day === today).map(sl => ({ show, slot: sl }))
  ).sort((a,b) => a.slot.startTime.localeCompare(b.slot.startTime));

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>

      {/* ── CINEMATIC HEADER ── */}
      <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden', background: 'linear-gradient(135deg,#1a0010 0%,#000 60%)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%,rgba(255,0,122,.18) 0%,transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2rem 2.5rem' }}>
          <OnAirStrip />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '1rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 1.4s ease-in-out infinite' }} />
            <h1 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 'clamp(2.5rem,6vw,4.5rem)', color: '#fff', letterSpacing: '.02em', lineHeight: 1 }}>Live Now</h1>
          </div>
          <p style={{ color: '#888', fontSize: '.85rem', marginTop: '.4rem' }}>PPP TV Kenya · StarTimes Channel 430 · YouTube</p>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 4rem', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>

        {/* Player */}
        <div>
          <div style={{ position: 'relative', aspectRatio: '16/9', background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
            <iframe
              src="https://www.youtube.com/embed/live_stream?channel=PPPTVKENYA"
              title="PPP TV Kenya Live Stream"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '.8rem', color: '#ef4444', fontWeight: 700 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
              LIVE
            </span>
            <a href="https://www.youtube.com/@PPPTVKENYA" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: '.8rem', color: '#555', textDecoration: 'none', fontWeight: 600 }}>
              Open in YouTube →
            </a>
            <a href="https://www.youtube.com/@PPPTVKENYA" target="_blank" rel="noopener noreferrer"
              style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '.5rem 1.2rem', background: '#FF0000', color: '#fff', fontSize: '.72rem', fontWeight: 900, letterSpacing: '.06em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Subscribe
            </a>
          </div>
        </div>

        {/* Today's schedule — card grid */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ width: '4px', height: '20px', background: '#FF007A', borderRadius: '2px' }} />
            <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.3rem', color: '#fff', letterSpacing: '.04em', textTransform: 'uppercase' }}>Today&apos;s Schedule</span>
          </div>
          {todaySlots.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '8px' }}>
              {todaySlots.map(({ show, slot }, i) => {
                const accent = CAT_COLOR[show.category] ?? '#FF007A';
                return (
                  <div key={i} style={{ background: '#0d0d0d', borderLeft: `3px solid ${accent}`, padding: '.85rem 1rem' }}>
                    <span style={{ display: 'block', fontFamily: 'monospace', fontSize: '.7rem', color: '#555', marginBottom: '4px' }}>{slot.startTime} – {slot.endTime}</span>
                    <span style={{ display: 'block', fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.1rem', color: '#fff', lineHeight: 1.2 }}>{show.name}</span>
                    <span style={{ display: 'block', fontSize: '.6rem', fontWeight: 900, letterSpacing: '.1em', textTransform: 'uppercase', color: accent, marginTop: '3px' }}>{show.category}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: '#444', fontSize: '.85rem' }}>No shows scheduled today.</p>
          )}
          <a href="/schedule" style={{ display: 'inline-block', marginTop: '1rem', fontSize: '.75rem', color: '#555', textDecoration: 'none', fontWeight: 600 }}>Full Weekly Schedule →</a>
        </div>
      </div>
    </div>
  );
}
