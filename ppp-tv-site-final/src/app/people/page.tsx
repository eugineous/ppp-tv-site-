'use client';

import Link from 'next/link';
import { useState } from 'react';
import { hosts } from '@/data/hosts';
import { staff } from '@/data/staff';

const CAT_COLORS = ['#FF007A','#BF00FF','#00CFFF','#FF6B00','#00FF94','#FFE600','#FF4500','#E50914'];

function PersonCard({ name, role, bio, initials, imageUrl, slug, isHost, index }: {
  name: string; role: string; bio: string; initials: string;
  imageUrl?: string; slug: string; isHost: boolean; index: number;
}) {
  const color = CAT_COLORS[index % CAT_COLORS.length];
  const href = isHost ? `/hosts/${slug}` : '#';
  const [imgErr, setImgErr] = useState(false);

  return (
    <Link
      href={href}
      style={{
        display: 'block', textDecoration: 'none',
        background: '#0d0d0d', borderRadius: '16px',
        overflow: 'hidden', transition: 'transform .2s, box-shadow .2s',
        border: `1px solid ${color}22`,
      }}
      className="group hover:-translate-y-1 hover:shadow-2xl"
    >
      {/* Photo area — full width, 3:4 aspect */}
      <div style={{ position: 'relative', width: '100%', paddingBottom: '120%', background: `${color}10`, overflow: 'hidden' }}>
        {imageUrl && !imgErr ? (
          <img
            src={imageUrl}
            alt={name}
            onError={() => setImgErr(true)}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'top center',
              transition: 'transform .3s',
            }}
            className="group-hover:scale-105"
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(135deg, ${color}22 0%, #000 100%)`,
          }}>
            <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '4rem', color: '#fff', opacity: .6 }}>{initials}</span>
          </div>
        )}
        {/* Gradient overlay at bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
          background: 'linear-gradient(to top, rgba(0,0,0,.95) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />
        {/* Name + role over photo */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem' }}>
          <div style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.15rem', color: '#fff', letterSpacing: '.03em', lineHeight: 1.1 }}>{name}</div>
          <div style={{ fontSize: '.58rem', fontWeight: 900, letterSpacing: '.12em', textTransform: 'uppercase', color, marginTop: '3px' }}>{role}</div>
        </div>
        {/* Color accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color }} />
      </div>

      {/* Bio */}
      <div style={{ padding: '.85rem 1rem 1rem' }}>
        <p style={{
          fontSize: '.72rem', color: '#666', lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{bio}</p>
        {isHost && (
          <div style={{
            marginTop: '.75rem', fontSize: '.6rem', fontWeight: 900,
            letterSpacing: '.1em', textTransform: 'uppercase', color,
            opacity: 0, transition: 'opacity .2s',
          }} className="group-hover:opacity-100">
            View Profile →
          </div>
        )}
      </div>
    </Link>
  );
}

export default function PeoplePage() {
  const onAir = staff.filter(s => s.department === 'on-air');
  const bts   = staff.filter(s => s.department === 'behind-the-scenes');

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', background: '#050505', borderBottom: '1px solid #111', padding: '4rem 2rem 3rem' }}>
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,0,122,.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-40px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(191,0,255,.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
          <p style={{ fontSize: '.6rem', fontWeight: 900, letterSpacing: '.3em', textTransform: 'uppercase', color: '#FF007A', marginBottom: '.5rem' }}>PPP TV Kenya</p>
          <h1 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 'clamp(3rem,8vw,6rem)', color: '#fff', letterSpacing: '.02em', lineHeight: .95, marginBottom: '.75rem' }}>Our People</h1>
          <p style={{ color: '#555', fontSize: '.9rem', maxWidth: '520px' }}>
            The hosts, anchors, DJs and crew that make PPP TV Kenya — <em style={{ color: '#888' }}>Powerful, Precise and Pristine Television</em> — the #1 music and entertainment channel on StarTimes Channel 430.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

        {/* On-Air Hosts — from hosts.ts (have profile pages) */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
            <div style={{ width: '4px', height: '32px', background: '#FF007A', borderRadius: '2px' }} />
            <div>
              <div style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '2rem', color: '#fff', letterSpacing: '.04em', lineHeight: 1 }}>On-Air Talent</div>
              <div style={{ fontSize: '.65rem', fontWeight: 900, color: '#FF007A', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: '3px' }}>Presenters · DJs · Hosts</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '16px' }}>
            {hosts.map((h, i) => (
              <PersonCard key={h.slug} name={h.name} role={h.title} bio={h.bio} initials={h.initials} imageUrl={h.imageUrl} slug={h.slug} isHost={true} index={i} />
            ))}
          </div>
        </section>

        {/* On-Air from staff (same people, shown for completeness) */}
        {onAir.length > 0 && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
              <div style={{ width: '4px', height: '32px', background: '#BF00FF', borderRadius: '2px' }} />
              <div>
                <div style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '2rem', color: '#fff', letterSpacing: '.04em', lineHeight: 1 }}>Behind the Scenes</div>
                <div style={{ fontSize: '.65rem', fontWeight: 900, color: '#BF00FF', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: '3px' }}>The Crew That Makes It Happen</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '16px' }}>
              {bts.map((s, i) => (
                <PersonCard key={s.slug} name={s.name} role={s.role} bio={s.bio} initials={s.initials} imageUrl={s.imageUrl} slug={s.slug} isHost={false} index={i + hosts.length} />
              ))}
            </div>
          </section>
        )}

        {/* Owner info */}
        <div style={{ marginTop: '2rem', padding: '1.5rem 2rem', background: '#0a0a0a', borderRadius: '12px', border: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ width: '3px', height: '40px', background: '#FF007A', borderRadius: '2px', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '.6rem', fontWeight: 900, letterSpacing: '.2em', textTransform: 'uppercase', color: '#FF007A', marginBottom: '4px' }}>Owner</div>
            <div style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.3rem', color: '#fff', letterSpacing: '.04em' }}>Ngomma Value Added Services Limited</div>
            <div style={{ fontSize: '.75rem', color: '#555', marginTop: '3px' }}>Content aggregation · Digital distribution · Artist management · PPP TV Kenya</div>
          </div>
        </div>

      </div>
    </div>
  );
}
