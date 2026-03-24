import type { Metadata } from 'next';
import { getStaffByDepartment } from '@/data/staff';

export const metadata: Metadata = {
  title: 'Our Team | PPP TV Kenya',
  description: 'Meet the PPP TV Kenya team — on-air talent and behind-the-scenes crew.',
};

export default function StaffPage() {
  const onAir = getStaffByDepartment('on-air');
  const behind = getStaffByDepartment('behind-the-scenes');

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>

      {/* ── HEADER — Netflix "About" era dark masthead ── */}
      <div style={{ background: 'linear-gradient(135deg,#0a0a0a 0%,#000 100%)', borderBottom: '1px solid #111', padding: '3.5rem 2rem 2.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ fontSize: '.6rem', fontWeight: 900, letterSpacing: '.3em', textTransform: 'uppercase', color: '#00CFFF', marginBottom: '.4rem' }}>PPP TV Kenya</p>
          <h1 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 'clamp(2.5rem,7vw,5rem)', color: '#fff', letterSpacing: '.02em', lineHeight: 1, marginBottom: '.5rem' }}>Our Team</h1>
          <p style={{ color: '#555', fontSize: '.85rem' }}>The people who make PPP TV Kenya happen every day.</p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>

        {/* ── ON-AIR TALENT ── */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
            <div style={{ width: '4px', height: '22px', background: '#FF007A', borderRadius: '2px' }} />
            <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.4rem', color: '#fff', letterSpacing: '.04em', textTransform: 'uppercase' }}>On-Air Talent</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '10px' }}>
            {onAir.map(member => (
              <div key={member.slug} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: '#0d0d0d', borderLeft: '3px solid #FF007A', padding: '1.1rem 1.2rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,0,122,.15)', border: '1px solid rgba(255,0,122,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.1rem', color: '#fff' }}>{member.initials}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontWeight: 800, color: '#fff', fontSize: '.9rem', marginBottom: '2px' }}>{member.name}</span>
                  <span style={{ display: 'block', fontSize: '.6rem', fontWeight: 900, letterSpacing: '.1em', textTransform: 'uppercase', color: '#FF007A', marginBottom: '6px' }}>{member.role}</span>
                  <p style={{ fontSize: '.75rem', color: '#666', lineHeight: 1.6 }}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BEHIND THE SCENES ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
            <div style={{ width: '4px', height: '22px', background: '#00CFFF', borderRadius: '2px' }} />
            <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.4rem', color: '#fff', letterSpacing: '.04em', textTransform: 'uppercase' }}>Behind the Scenes</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '10px' }}>
            {behind.map(member => (
              <div key={member.slug} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: '#0d0d0d', borderLeft: '3px solid #00CFFF', padding: '1.1rem 1.2rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0,207,255,.12)', border: '1px solid rgba(0,207,255,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.1rem', color: '#fff' }}>{member.initials}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontWeight: 800, color: '#fff', fontSize: '.9rem', marginBottom: '2px' }}>{member.name}</span>
                  <span style={{ display: 'block', fontSize: '.6rem', fontWeight: 900, letterSpacing: '.1em', textTransform: 'uppercase', color: '#00CFFF', marginBottom: '6px' }}>{member.role}</span>
                  <p style={{ fontSize: '.75rem', color: '#666', lineHeight: 1.6 }}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
