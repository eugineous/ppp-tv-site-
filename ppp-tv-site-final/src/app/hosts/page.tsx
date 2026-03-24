import Link from 'next/link';
import type { Metadata } from 'next';
import { hosts } from '@/data/hosts';

export const metadata: Metadata = {
  title: 'Hosts | PPP TV Kenya',
  description: 'Meet the PPP TV Kenya on-air talent — anchors, DJs and presenters.',
};

const ACCENT = ['#FF007A','#BF00FF','#00CFFF','#FF6B00','#00FF94','#FFE600'];

export default function HostsPage() {
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>

      {/* ── HEADER — Netflix "Profiles" era ── */}
      <div style={{ position: 'relative', overflow: 'hidden', background: '#0a0a0a', borderBottom: '1px solid #111', padding: '3.5rem 2rem 2.5rem' }}>
        {/* Decorative gradient blobs */}
        <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,0,122,.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', right: '-40px', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(191,0,255,.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
          <p style={{ fontSize: '.6rem', fontWeight: 900, letterSpacing: '.3em', textTransform: 'uppercase', color: '#FF007A', marginBottom: '.4rem' }}>On-Air Talent</p>
          <h1 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 'clamp(2.5rem,7vw,5rem)', color: '#fff', letterSpacing: '.02em', lineHeight: 1, marginBottom: '.5rem' }}>Our Hosts</h1>
          <p style={{ color: '#555', fontSize: '.85rem' }}>The faces and voices of PPP TV Kenya.</p>
        </div>
      </div>

      {/* ── HOST CARDS — avatar-centric grid ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '12px' }}>
          {hosts.map((host, i) => {
            const accent = ACCENT[i % ACCENT.length];
            return (
              <Link key={host.slug} href={`/hosts/${host.slug}`}
                style={{ display: 'block', background: '#0d0d0d', textDecoration: 'none', position: 'relative', overflow: 'hidden', transition: 'transform .2s' }}
                className="group hover:scale-[1.03]">
                {/* Top accent bar */}
                <div style={{ height: '3px', background: accent }} />
                {/* Avatar */}
                <div style={{ padding: '1.5rem 1rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: `${accent}22`, border: `2px solid ${accent}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.6rem', color: '#fff' }}>{host.initials}</span>
                  </div>
                  <span style={{ display: 'block', fontWeight: 800, color: '#fff', fontSize: '.9rem', lineHeight: 1.3, marginBottom: '4px' }}>{host.name}</span>
                  <span style={{ display: 'block', fontSize: '.6rem', fontWeight: 900, letterSpacing: '.1em', textTransform: 'uppercase', color: accent }}>{host.title}</span>
                  {/* Bio preview */}
                  <p style={{ fontSize: '.7rem', color: '#555', lineHeight: 1.5, marginTop: '.75rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{host.bio}</p>
                </div>
                {/* Hover CTA */}
                <div style={{ padding: '0 1rem 1rem', textAlign: 'center' }}>
                  <span style={{ display: 'inline-block', fontSize: '.6rem', fontWeight: 900, letterSpacing: '.1em', textTransform: 'uppercase', color: accent, opacity: 0, transition: 'opacity .2s' }} className="group-hover:opacity-100">View Profile →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
