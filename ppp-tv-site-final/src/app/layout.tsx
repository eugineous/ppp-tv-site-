import type { Metadata } from 'next';
import { Bebas_Neue, DM_Sans } from 'next/font/google';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Header from '@/components/Header';
import MobileBottomNav from '@/components/MobileBottomNav';
import './globals.css';

const BackToTop      = dynamic(() => import('@/components/BackToTop'),      { ssr: false });
const NewsletterBar  = dynamic(() => import('@/components/NewsletterBar'),  { ssr: false });
const RecentlyViewed = dynamic(() => import('@/components/RecentlyViewed'), { ssr: false });

const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas', display: 'swap' });
const dmSans    = DM_Sans({                   subsets: ['latin'], variable: '--font-dm',    display: 'swap' });

const BASE_URL = 'https://ppp-tv-site-final.vercel.app';
const OG_IMAGE  = `${BASE_URL}/icon.png`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: 'PPP TV Kenya — Entertainment, Music & Celebrity News', template: '%s | PPP TV Kenya' },
  description: "PPP TV is Kenya's leading entertainment channel on StarTimes Channel 430. Breaking celebrity news, music, TV & film, fashion, events and more.",
  keywords: ['PPP TV Kenya', 'Kenya entertainment news', 'StarTimes 430', 'Kenyan music', 'Urban News', 'Nairobi celebrity news'],
  authors: [{ name: 'PPP TV Kenya', url: BASE_URL }],
  creator: 'PPP TV Kenya',
  publisher: 'PPP TV Kenya',
  category: 'Entertainment',
  openGraph: { siteName: 'PPP TV Kenya', locale: 'en_KE', type: 'website', url: BASE_URL, images: [{ url: OG_IMAGE, width: 512, height: 512, alt: 'PPP TV Kenya' }] },
  twitter: { card: 'summary_large_image', site: '@PPPTV_ke', creator: '@PPPTV_ke', images: [OG_IMAGE] },
  icons: { icon: [{ url: '/icon.png', type: 'image/png' }], apple: '/icon.png' },
  verification: { google: 'No-Mx2X_fmIIU7WfLtVCqgIRUJZ7oLyf66Y50rlPbgg' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
};

const SOCIALS = [
  { href: 'https://www.instagram.com/ppptvke',   label: 'Instagram', d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { href: 'https://twitter.com/PPPTV_ke',        label: 'X',         d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { href: 'https://www.youtube.com/@PPPTVKENYA', label: 'YouTube',   d: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  { href: 'https://www.facebook.com/PPPTVKENYA', label: 'Facebook',  d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  { href: 'https://www.tiktok.com/@ppptvkenya',  label: 'TikTok',    d: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z' },
];

const FOOTER_COLS = [
  {
    heading: 'Shows',
    links: [['All Shows','/shows'],['Urban News','/shows/urban-news'],['Juu ya Game','/shows/juu-ya-game'],['Campus Xposure','/shows/campus-xposure'],['Top 15 Countdown','/shows/top-15-countdown'],['Gospel 10','/shows/gospel-10'],['Schedule','/schedule'],['Video','/video']] as [string,string][],
  },
  {
    heading: 'PPP TV',
    links: [['About Us','/about'],['Hosts & On-Air','/hosts'],['The Team','/staff'],['Contact & Ads','/contact'],['Saved Articles','/saved'],['Search','/search'],['Privacy Policy','/privacy'],['Terms of Use','/terms'],['StarTimes Ch. 430','https://www.startimes.com']] as [string,string][],
  },
];

const LOGO_URL = 'https://pub-8244b5f99b024cda91b74e1131378a14.r2.dev/LOGOS/PPPtv Logo-2.png';
const STARTIMES_LOGO = 'https://pub-8244b5f99b024cda91b74e1131378a14.r2.dev/LOGOS/Startimes logo.png';

function SiteFooter() {
  return (
    <footer style={{ background: '#080808', borderTop: '1px solid #141414' }}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 pt-14 pb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <a href="/" className="flex items-center gap-3 mb-2">
            <Image src={LOGO_URL} alt="PPP TV Kenya" width={100} height={40} style={{ objectFit: 'contain', height: '40px', width: 'auto' }} />
          </a>
          <p style={{ fontSize: '11px', color: '#555', fontWeight: 600, letterSpacing: '.04em' }}>
            StarTimes Channel 430 &nbsp;·&nbsp; Kenya&apos;s #1 Entertainment Channel
          </p>
          <div className="mt-3">
            <Image src={STARTIMES_LOGO} alt="StarTimes" width={80} height={28} style={{ objectFit: 'contain', height: '28px', width: 'auto', opacity: 0.6 }} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {SOCIALS.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="footer-social">
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d={s.d} /></svg>
            </a>
          ))}
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        <div style={{ height: '1px', background: 'linear-gradient(to right, #FF007A, #1a1a1a 60%)' }} />
      </div>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
        {FOOTER_COLS.map(col => (
          <div key={col.heading}>
            <p style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '.2em', textTransform: 'uppercase', color: '#FF007A', marginBottom: '16px' }}>
              {col.heading}
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {col.links.map(([label, href]) => (
                <li key={href}>
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="footer-link">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid #111' }}>
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ fontSize: '10px', color: '#333', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>
            &copy; {new Date().getFullYear()} PPP TV Kenya. All rights reserved.
          </p>
          <p style={{ fontSize: '10px', color: '#2a2a2a', fontWeight: 600 }}>
            Content independently produced by PPP TV Kenya editorial team.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#FF007A" />
        <link rel="preconnect" href="https://ppp-tv-worker.ppp-tv-site.workers.dev" />
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
      </head>
      <body className={`min-h-screen flex flex-col bg-black ${bebasNeue.variable} ${dmSans.variable}`}>
        <Header />
        <main className="flex-grow pt-[68px] pb-14 sm:pb-0">{children}</main>
        <RecentlyViewed />
        <NewsletterBar />
        <SiteFooter />
        <BackToTop />
        <MobileBottomNav />
      </body>
    </html>
  );
}
