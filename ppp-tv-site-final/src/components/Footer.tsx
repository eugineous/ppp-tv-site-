import Link from 'next/link';
import Image from 'next/image';

const LOGO_URL = 'https://pub-8244b5f99b024cda91b74e1131378a14.r2.dev/LOGOS/PPPtv Logo-2.png';

const SOCIALS = [
  { label: 'YouTube',    href: 'https://www.youtube.com/@PPPTVKENYA',  d: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  { label: 'Instagram',  href: 'https://www.instagram.com/ppptv_kenya', d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { label: 'X / Twitter', href: 'https://twitter.com/ppptv_kenya',     d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { label: 'Facebook',   href: 'https://www.facebook.com/ppptv.kenya', d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  { label: 'TikTok',     href: 'https://www.tiktok.com/@ppptv_kenya',  d: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z' },
];

const COLS = [
  {
    heading: 'Shows',
    links: [['All Shows','/shows'],['Urban News','/shows/urban-news'],['Juu ya Game','/shows/juu-ya-game'],['Campus Xposure','/shows/campus-xposure'],['Top 15 Countdown','/shows/top-15-countdown'],['Gospel 10','/shows/gospel-10']] as [string,string][],
  },
  {
    heading: 'Browse',
    links: [['Kenya News','/news'],['Politics','/politics'],['Business','/business'],['Entertainment','/entertainment'],['Sports','/sports'],['Movies','/movies'],['Lifestyle','/lifestyle'],['Health','/health'],['Technology','/technology'],['Science','/science'],['Schedule','/schedule'],['Video','/video']] as [string,string][],
  },
  {
    heading: 'PPP TV',
    links: [['About Us','/about'],['Hosts & On-Air','/hosts'],['The Team','/staff'],['Contact & Ads','/contact'],['Live','/live'],['Search','/search']] as [string,string][],
  },
  {
    heading: 'Account',
    links: [['My List','/saved'],['Privacy Policy','/privacy'],['Terms of Use','/terms']] as [string,string][],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Top: logo + socials */}
        <div className="footer-top">
          <div>
            <Link href="/">
              <Image src={LOGO_URL} alt="PPP TV Kenya" width={110} height={44} style={{ objectFit: 'contain', height: '40px', width: 'auto' }} />
            </Link>
            <p className="footer-tagline">StarTimes Channel 430 &nbsp;·&nbsp; Kenya&apos;s #1 Entertainment Channel</p>
          </div>
          <div className="footer-socials">
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="footer-social-icon">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d={s.d} /></svg>
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Link columns */}
        <div className="footer-cols">
          {COLS.map(col => (
            <div key={col.heading}>
              <p className="footer-col-heading">{col.heading}</p>
              <ul className="footer-col-links">
                {col.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="footer-link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} PPP TV Kenya. All rights reserved.</p>
          <p>Content independently produced by PPP TV Kenya editorial team.</p>
        </div>
      </div>
    </footer>
  );
}
