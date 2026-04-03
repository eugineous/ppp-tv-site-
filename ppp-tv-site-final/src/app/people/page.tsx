import Link from 'next/link';
import type { Metadata } from 'next';
import { hosts } from '@/data/hosts';
import { staff } from '@/data/staff';

export const metadata: Metadata = {
  title: 'People | PPP TV Kenya',
  description: 'Meet the PPP TV Kenya team — on-air hosts, anchors, DJs and the crew behind the scenes.',
};

const CAT_COLORS = ['#FF007A','#BF00FF','#00CFFF','#FF6B00','#00FF94','#FFE600','#FF4500','#E50914'];

function PersonCard({ name, role, bio, initials, imageUrl, slug, isHost, index }: {
  name: string; role: string; bio: string; initials: string;
  imageUrl?: string; slug: string; isHost: boolean; index: number;
}) {
  const color = CAT_COLORS[index % CAT_COLORS.length];
  const href = isHost ? `/hosts/${slug}` : '#';
  return (
    <Link href={href} style={{ display: 'block', textDecoration: 'none', background: '#0d0d0d', borderRadius: '12px', overflow: 'hidden', transition: 'transform .2s, box-shadow .2s' }}
      className="group hover:-translate-y-1 hover:shadow-2xl">
      <div style={{ height: '4px', background: color }} />
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {/* Avatar circle */}
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `${color}18`, border: `2.5px solid ${color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', flexShrink: 0, overflow: 'hidden' }}>
          {imageUrl ? (
            <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.8rem', color: '#fff', letterSpacing: '.02em' }}>{initials}</span>
          )}
        </div>
        <span style={{ display: 'block', fontWeight: 800, color: '#fff', fontSize: '1rem', lineHeight: 1.3, marginBottom: '4px' }}>{name}</span>
        <span style={{ display: 'block', fontSize: '.62rem', fontWeight: 900, letterSpacing: '.1em', textTransform: 'uppercase', color, marginBottom: '.75rem' }}>{role}</span>
        <p style={{ fontSize: '.75rem', color: '#666', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{bio}</p>
        {isHost && (
          <span style={{ marginTop: '1rem', display: 'inline-block', fontSize: '.62rem', fontWeight: 900, letterSpacing: '.08em', textTransform: 'uppercase', color, opacity: 0, transition: 'opacity .2s' }} className="group-hover:opacity-100">
            View Profile →
          </span>
        )}
      </div>
    </Link>
  );
}

export default function PeoplePage() {
  const onAir = staff.filter(s => s.department === 'on-air');
  const bts = staff.filter(s => s.department === 'behind-the-scenes');

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', background: '#050505', borderBottom: '1px solid #111', padding: '4rem 2rem 3rem' }}>
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,0,122,.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-40px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(191,0,255,.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
          <p style={{ fontSize: '.6rem', fontWeight: 900, letterSpacing: '.3em', textTransform: 'uppercase', color: '#FF007A', marginBottom: '.5rem' }}>PPP TV Kenya</p>
          <h1 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 'clamp(3rem,8vw,6rem)', color: '#fff', letterSpacing: '.02em', lineHeight: .95, marginBottom: '.75rem' }}>Our People</h1>
          <p style={{ color: '#555', fontSize: '.9rem', maxWidth: '480px' }}>The hosts, anchors, DJs and crew that make PPP TV Kenya the #1 entertainment channel on StarTimes Channel 430.</p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

        {/* On-Air Hosts */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <div style={{ width: '4px', height: '28px', background: '#FF007A', borderRadius: '2px' }} />
            <div>
              <div style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.8rem', color: '#fff', letterSpacing: '.04em', textTransform: 'uppercase', lineHeight: 1 }}>On-Air Hosts</div>
              <div style={{ fontSize: '.65rem', fontWeight: 900, color: '#FF007A', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: '2px' }}>The Faces of PPP TV</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '14px' }}>
            {hosts.map((h, i) => (
              <PersonCard key={h.slug} name={h.name} role={h.title} bio={h.bio} initials={h.initials} imageUrl={h.imageUrl} slug={h.slug} isHost={true} index={i} />
            ))}
          </div>
        </div>

        {/* Behind the Scenes */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <div style={{ width: '4px', height: '28px', background: '#BF00FF', borderRadius: '2px' }} />
            <div>
              <div style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.8rem', color: '#fff', letterSpacing: '.04em', textTransform: 'uppercase', lineHeight: 1 }}>Behind the Scenes</div>
              <div style={{ fontSize: '.65rem', fontWeight: 900, color: '#BF00FF', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: '2px' }}>The Crew That Makes It Happen</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '14px' }}>
            {bts.map((s, i) => (
              <PersonCard key={s.slug} name={s.name} role={s.role} bio={s.bio} initials={s.initials} imageUrl={s.imageUrl} slug={s.slug} isHost={false} index={i + hosts.length} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
