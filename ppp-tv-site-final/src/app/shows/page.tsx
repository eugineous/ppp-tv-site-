import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { shows, SHOW_LOGOS } from '@/data/shows';

export const metadata: Metadata = {
  title: 'Shows | PPP TV Kenya',
  description: 'All PPP TV Kenya shows — news, entertainment, sports, music and more.',
};

const CAT_COLOR: Record<string, string> = {
  News: '#FF007A', Entertainment: '#BF00FF', Sports: '#00CFFF',
  Music: '#FF6B00', Lifestyle: '#00FF94', Technology: '#FFE600', Community: '#FF007A',
};

const SHOW_GRADIENT: Record<string, string> = {
  'urban-news':            'linear-gradient(135deg,#3d0020 0%,#000 100%)',
  'juu-ya-game':           'linear-gradient(135deg,#003d5c 0%,#000 100%)',
  'campus-xposure':        'linear-gradient(135deg,#3d3d00 0%,#000 100%)',
  'gospel-10':             'linear-gradient(135deg,#3d0070 0%,#000 100%)',
  'top-15-countdown':      'linear-gradient(135deg,#3d1800 0%,#000 100%)',
  'kenyan-drive-show':     'linear-gradient(135deg,#003d3d 0%,#000 100%)',
  'bongo-quiz':            'linear-gradient(135deg,#3d0000 0%,#000 100%)',
  'tushinde-charity-show': 'linear-gradient(135deg,#003d20 0%,#000 100%)',
};

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] as const;

export default function ShowsPage() {
  const featured = shows.filter(s => s.featured);
  const all = shows;

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>

      {/* ── BILLBOARD HEADER — Netflix "Browse" era ── */}
      <div style={{ background: 'linear-gradient(180deg,#141414 0%,#000 100%)', borderBottom: '1px solid #1a1a1a', padding: '3rem 2rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ fontSize: '.65rem', fontWeight: 900, letterSpacing: '.3em', textTransform: 'uppercase', color: '#FF007A', marginBottom: '.5rem' }}>PPP TV Kenya</p>
          <h1 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 'clamp(3rem,8vw,6rem)', color: '#fff', letterSpacing: '.02em', lineHeight: 1, marginBottom: '.75rem' }}>Shows</h1>
          <p style={{ color: '#888', fontSize: '.9rem', maxWidth: '480px' }}>Kenya&apos;s best entertainment, news, sports and music — all in one place.</p>
        </div>
      </div>

      {/* ── FEATURED — wide 16:9 banner cards ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 2rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
          <div style={{ width: '4px', height: '22px', background: '#FF007A', borderRadius: '2px' }} />
          <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.4rem', color: '#fff', letterSpacing: '.04em', textTransform: 'uppercase' }}>Featured Shows</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '12px' }}>
          {featured.map(show => {
            const accent = CAT_COLOR[show.category] ?? '#FF007A';
            const gradient = SHOW_GRADIENT[show.slug] ?? 'linear-gradient(135deg,#222 0%,#000 100%)';
            const logo = SHOW_LOGOS[show.slug];
            return (
              <Link key={show.slug} href={'/shows/' + show.slug}
                style={{ display: 'block', position: 'relative', aspectRatio: '16/9', borderRadius: '4px', overflow: 'hidden', textDecoration: 'none' }}
                className="group">
                <div style={{ position: 'absolute', inset: 0, background: gradient }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,.9) 0%,rgba(0,0,0,.2) 60%,transparent 100%)' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: accent }} />
                {logo && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem 2.5rem' }}>
                    <Image src={logo} alt={show.name} width={160} height={80} style={{ objectFit: 'contain', maxHeight: '70px', width: 'auto', filter: 'brightness(0) invert(1) drop-shadow(0 2px 12px rgba(0,0,0,.9))' }} />
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '.75rem 1rem' }}>
                  <span style={{ display: 'block', fontSize: '.55rem', fontWeight: 900, letterSpacing: '.12em', textTransform: 'uppercase', color: accent, marginBottom: '2px' }}>{show.category}</span>
                  <span style={{ display: 'block', fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.3rem', color: '#fff', lineHeight: 1.1 }}>{show.name}</span>
                  <span style={{ fontSize: '.68rem', color: '#aaa', marginTop: '3px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{show.tagline}</span>
                </div>
                {/* Hover glow */}
                <div style={{ position: 'absolute', inset: 0, border: `2px solid ${accent}`, opacity: 0, transition: 'opacity .2s', borderRadius: '4px' }} className="group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── ALL SHOWS — horizontal list rows ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 2rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
          <div style={{ width: '4px', height: '22px', background: '#BF00FF', borderRadius: '2px' }} />
          <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.4rem', color: '#fff', letterSpacing: '.04em', textTransform: 'uppercase' }}>All Shows</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '8px' }}>
          {all.map(show => {
            const accent = CAT_COLOR[show.category] ?? '#FF007A';
            const logo = SHOW_LOGOS[show.slug];
            const gradient = SHOW_GRADIENT[show.slug] ?? 'linear-gradient(135deg,#111 0%,#000 100%)';
            return (
              <Link key={show.slug} href={'/shows/' + show.slug}
                style={{ display: 'flex', alignItems: 'center', gap: 0, background: '#0d0d0d', borderLeft: `3px solid ${accent}`, textDecoration: 'none', transition: 'background .15s' }}
                className="group hover:bg-white/5">
                <div style={{ flexShrink: 0, width: '64px', height: '64px', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {logo
                    ? <Image src={logo} alt={show.name} width={44} height={44} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                    : <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.5rem', color: '#fff' }}>{show.name[0]}</span>
                  }
                </div>
                <div style={{ padding: '.75rem 1rem', flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: '.55rem', fontWeight: 900, letterSpacing: '.1em', textTransform: 'uppercase', color: accent }}>{show.category}</span>
                  <span style={{ display: 'block', fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.1rem', color: '#fff', lineHeight: 1.2 }}>{show.name}</span>
                  <span style={{ display: 'block', fontSize: '.65rem', color: '#555', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{show.tagline}</span>
                </div>
                <span style={{ paddingRight: '1rem', color: accent, fontSize: '1.2rem', opacity: 0, transition: 'opacity .15s' }} className="group-hover:opacity-100">›</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── SCHEDULE TABLE ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
          <div style={{ width: '4px', height: '22px', background: '#00CFFF', borderRadius: '2px' }} />
          <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.4rem', color: '#fff', letterSpacing: '.04em', textTransform: 'uppercase' }}>Weekly Schedule</span>
        </div>
        <div style={{ overflowX: 'auto', border: '1px solid rgba(255,255,255,.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px', fontSize: '.8rem' }}>
            <thead>
              <tr style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: '.6rem', fontWeight: 900, letterSpacing: '.12em', textTransform: 'uppercase', color: '#444', width: '60px' }}>Time</th>
                {DAYS.map(d => <th key={d} style={{ textAlign: 'left', padding: '10px 12px', fontSize: '.6rem', fontWeight: 900, letterSpacing: '.12em', textTransform: 'uppercase', color: '#444' }}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {['07:00','09:00','11:00','14:00','16:00','17:00','18:00','19:00','20:00'].map((time, i) => (
                <tr key={time} style={{ borderBottom: '1px solid rgba(255,255,255,.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.01)' }}>
                  <td style={{ padding: '10px 16px', color: '#555', fontFamily: 'monospace', whiteSpace: 'nowrap', fontSize: '.72rem' }}>{time}</td>
                  {DAYS.map(day => {
                    const show = shows.find(s => s.schedule.some(sl => sl.day === day && sl.startTime === time));
                    const accent = show ? (CAT_COLOR[show.category] ?? '#FF007A') : null;
                    return (
                      <td key={day} style={{ padding: '10px 12px' }}>
                        {show
                          ? <Link href={'/shows/' + show.slug} style={{ color: accent ?? '#FF007A', fontWeight: 700, fontSize: '.72rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>{show.name}</Link>
                          : <span style={{ color: '#222', fontSize: '.72rem' }}>—</span>
                        }
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
