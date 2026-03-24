import Link from 'next/link';
import type { Metadata } from 'next';
import { getShowsForDay } from '@/lib/schedule';

export const metadata: Metadata = {
  title: 'Schedule | PPP TV Kenya',
  description: 'PPP TV Kenya weekly broadcast schedule — all times East Africa Time.',
};

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] as const;
const DAY_FULL: Record<string,string> = { Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday',Sat:'Saturday',Sun:'Sunday' };
const CAT_COLOR: Record<string,string> = {
  News:'#FF007A', Entertainment:'#BF00FF', Sports:'#00CFFF',
  Music:'#FF6B00', Lifestyle:'#00FF94', Technology:'#FFE600', Community:'#FF007A',
};
const DAY_ACCENT = ['#FF007A','#BF00FF','#00CFFF','#FF6B00','#00FF94','#FFE600','#FF007A'];

export default function SchedulePage() {
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>

      {/* ── HEADER — EPG / TV Guide era ── */}
      <div style={{ background: 'linear-gradient(180deg,#0a0a0a 0%,#000 100%)', borderBottom: '1px solid #111', padding: '3rem 2rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ fontSize: '.6rem', fontWeight: 900, letterSpacing: '.3em', textTransform: 'uppercase', color: '#00CFFF', marginBottom: '.4rem' }}>East Africa Time · UTC+3</p>
          <h1 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 'clamp(2.5rem,7vw,5rem)', color: '#fff', letterSpacing: '.02em', lineHeight: 1, marginBottom: '.5rem' }}>Broadcast Schedule</h1>
          <p style={{ color: '#555', fontSize: '.85rem' }}>Full weekly programming guide for PPP TV Kenya.</p>
        </div>
      </div>

      {/* ── DAY COLUMNS ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 2rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.5rem' }}>
          {DAYS.map((day, di) => {
            const slots = getShowsForDay(day);
            const accent = DAY_ACCENT[di];
            return (
              <section key={day} aria-label={`${DAY_FULL[day]} schedule`}>
                {/* Day header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', paddingBottom: '10px', borderBottom: `2px solid ${accent}` }}>
                  <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.5rem', color: '#fff', letterSpacing: '.04em' }}>{DAY_FULL[day]}</span>
                </div>
                {slots.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {slots.map(({ show, slot }, i) => {
                      const ca = CAT_COLOR[show.category] ?? '#FF007A';
                      return (
                        <Link key={i} href={`/shows/${show.slug}`}
                          style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#0d0d0d', borderLeft: `3px solid ${ca}`, padding: '.65rem .85rem', textDecoration: 'none', transition: 'background .15s' }}
                          className="hover:bg-white/5">
                          <span style={{ fontFamily: 'monospace', fontSize: '.68rem', color: '#444', flexShrink: 0, width: '80px' }}>{slot.startTime}–{slot.endTime}</span>
                          <div style={{ minWidth: 0 }}>
                            <span style={{ display: 'block', fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1rem', color: '#fff', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{show.name}</span>
                            <span style={{ display: 'block', fontSize: '.55rem', fontWeight: 900, letterSpacing: '.1em', textTransform: 'uppercase', color: ca, marginTop: '2px' }}>{show.category}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ color: '#333', fontSize: '.8rem', padding: '.5rem 0' }}>No shows scheduled</p>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
