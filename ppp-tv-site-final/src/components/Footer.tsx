import Link from 'next/link';
import Image from 'next/image';

const LOGO_URL = 'https://pub-8244b5f99b024cda91b74e1131378a14.r2.dev/LOGOS/PPPtv Logo-2.png';

const SOCIALS = [
  {
    label: 'YouTube', href: 'https://www.youtube.com/@PPPTVKENYA',
    d: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    label: 'Instagram', href: 'https://www.instagram.com/ppptv_kenya',
    d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  {
    label: 'X / Twitter', href: 'https://twitter.com/ppptv_kenya',
    d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    label: 'Facebook', href: 'https://www.facebook.com/ppptv.kenya',
    d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    label: 'TikTok', href: 'https://www.tiktok.com/@ppptv_kenya',
    d: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z',
  },
];

const COLS = [
  {
    heading: 'Shows',
    links: [
      ['All Shows', '/shows'],
      ['Urban News', '/shows/urban-news'],
      ['Juu ya Game', '/shows/juu-ya-game'],
      ['Campus Xposure', '/shows/campus-xposure'],
      ['Top 15 Countdown', '/shows/top-15-countdown'],
      ['Gospel 10', '/shows/gospel-10'],
    ] as [string, string][],
  },
  {
    heading: 'Browse',
    links: [
      ['Kenya News', '/?cat=News'],
      ['Entertainment', '/?cat=Entertainment'],
      ['Sports', '/?cat=Sports'],
      ['Music', '/?cat=Music'],
      ['Schedule', '/schedule'],
      ['Video', '/video'],
    ] as [string, string][],
  },
  {
    heading: 'PPP TV',
    links: [
      ['About Us', '/about'],
      ['Hosts & On-Air', '/hosts'],
      ['The Team', '/staff'],
      ['Contact & Ads', '/contact'],
      ['Live', '/live'],
      ['Search', '/search'],
    ] as [string, string][],
  },
  {
    heading: 'Account',
    links: [
      ['My List', '/saved'],
      ['Privacy Policy', '/privacy'],
      ['Terms of Use', '/terms'],
    ] as [string, string][],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: '#141414', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 2rem 0' }}>

        {/* Top: logo + socials */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            <Link href="/">
              <Image src={LOGO_URL} alt="PPP TV Kenya" width={110} height={44} style={{ objectFit: 'contain', height: '40px', width: 'auto' }} />
            </Link>
            <p style={{ fontSize: '11px', color: '#555', marginTop: '8px', fontWeight: 600, letterSpacing: '.04em' }}>
              StarTimes Channel 430 &nbsp;·&nbsp; Kenya&apos;s #1 Entertainment Channel
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {SOCIALS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', color: '#666', transition: 'color .15s, background .15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,0,122,0.15)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#666'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
              >
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d={s.d} /></svg>
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '2.5rem' }} />

        {/* Link columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem 1.5rem' }}>
          {COLS.map(col => (
            <div key={col.heading}>
              <p style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '.2em', textTransform: 'uppercase', color: '#FF007A', marginBottom: '14px' }}>
                {col.heading}
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.links.map(([label, href]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      style={{ fontSize: '13px', color: '#666', textDecoration: 'none', transition: 'color .15s', fontWeight: 500 }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#ccc')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#666')}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '2.5rem', padding: '1.25rem 0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <p style={{ fontSize: '11px', color: '#444', fontWeight: 600 }}>
            &copy; {new Date().getFullYear()} PPP TV Kenya. All rights reserved.
          </p>
          <p style={{ fontSize: '11px', color: '#333' }}>
            Content independently produced by PPP TV Kenya editorial team.
          </p>
        </div>
      </div>
    </footer>
  );
}
