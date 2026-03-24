import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | PPP TV Kenya',
  description: 'Get in touch with PPP TV Kenya.',
};

const CARDS = [
  { title: 'General Enquiries', detail: 'info@ppptv.co.ke',  href: 'mailto:info@ppptv.co.ke',  color: '#FF007A', icon: '✉' },
  { title: 'Advertising',       detail: 'ads@ppptv.co.ke',   href: 'mailto:ads@ppptv.co.ke',   color: '#BF00FF', icon: '📢' },
  { title: 'News Tips',         detail: 'news@ppptv.co.ke',  href: 'mailto:news@ppptv.co.ke',  color: '#00CFFF', icon: '📰' },
  { title: 'Nairobi Studio',    detail: 'Nairobi, Kenya',    href: 'https://maps.google.com/?q=Nairobi,Kenya', color: '#FF6B00', icon: '📍' },
];

const SOCIALS = [
  { label: 'YouTube',     href: 'https://www.youtube.com/@PPPTVKENYA',   color: '#FF0000' },
  { label: 'Instagram',   href: 'https://www.instagram.com/ppptv_kenya', color: '#FF007A' },
  { label: 'Twitter / X', href: 'https://twitter.com/ppptv_kenya',       color: '#00CFFF' },
  { label: 'Facebook',    href: 'https://www.facebook.com/ppptv.kenya',  color: '#1877F2' },
  { label: 'TikTok',      href: 'https://www.tiktok.com/@ppptv_kenya',   color: '#fff'    },
];

export default function ContactPage() {
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>

      {/* ── HEADER — warm pink accent ── */}
      <div style={{ position: 'relative', overflow: 'hidden', background: '#000', borderBottom: '1px solid #1a0010', padding: '3.5rem 2rem 2.5rem' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 50%,rgba(255,0,122,.07) 0%,transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
          <p style={{ fontSize: '.6rem', fontWeight: 900, letterSpacing: '.3em', textTransform: 'uppercase', color: '#FF007A', marginBottom: '.4rem' }}>PPP TV Kenya</p>
          <h1 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 'clamp(2.5rem,7vw,5rem)', color: '#fff', letterSpacing: '.02em', lineHeight: 1, marginBottom: '.5rem' }}>Contact Us</h1>
          <p style={{ color: '#555', fontSize: '.85rem' }}>We&apos;d love to hear from you.</p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>

          {/* Contact cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '10px' }}>
            {CARDS.map(card => (
              <a key={card.title} href={card.href}
                target={card.href.startsWith('http') ? '_blank' : undefined}
                rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                style={{ display: 'block', background: '#0d0d0d', borderTop: `3px solid ${card.color}`, padding: '1.5rem 1.25rem', textDecoration: 'none', transition: 'background .15s' }}
                className="hover:bg-white/5">
                <span style={{ display: 'block', fontSize: '1.8rem', marginBottom: '.75rem' }}>{card.icon}</span>
                <span style={{ display: 'block', fontWeight: 800, color: '#fff', fontSize: '.9rem', marginBottom: '4px' }}>{card.title}</span>
                <span style={{ display: 'block', fontSize: '.8rem', color: '#666' }}>{card.detail}</span>
              </a>
            ))}
          </div>

          {/* Socials */}
          <div style={{ background: '#0d0d0d', borderTop: '3px solid #FF007A', padding: '1.5rem 1.5rem' }}>
            <span style={{ display: 'block', fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '1.3rem', color: '#fff', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Follow Us</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-block', padding: '.5rem 1.1rem', border: `1px solid ${s.color}33`, color: s.color, fontSize: '.72rem', fontWeight: 900, letterSpacing: '.06em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background .15s' }}
                  className="hover:bg-white/5">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
