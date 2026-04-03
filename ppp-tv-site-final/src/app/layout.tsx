import type { Metadata } from 'next';
import { Bebas_Neue, DM_Sans } from 'next/font/google';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import LiveUpdater from '@/components/LiveUpdater';
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#FF007A" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PPP TV Kenya" />
        {/* Preconnect to all external origins we load from */}
        <link rel="preconnect" href="https://ppp-tv-worker.euginemicah.workers.dev" />
        <link rel="preconnect" href="https://pub-8244b5f99b024cda91b74e1131378a14.r2.dev" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for common image CDNs */}
        <link rel="dns-prefetch" href="https://www.aljazeera.com" />
        <link rel="dns-prefetch" href="https://www.nation.africa" />
        <link rel="dns-prefetch" href="https://www.standardmedia.co.ke" />
        <link rel="dns-prefetch" href="https://www.bellanaija.com" />
        <link rel="dns-prefetch" href="https://www.capitalfm.co.ke" />
        <link rel="dns-prefetch" href="https://techcrunch.com" />
        <link rel="dns-prefetch" href="https://www.bbc.co.uk" />
        {/* Prefetch top pages for instant navigation */}
        <link rel="prefetch" href="/news" as="document" />
        <link rel="prefetch" href="/entertainment" as="document" />
        <link rel="prefetch" href="/sports" as="document" />
      </head>
      <body className={`min-h-screen flex flex-col bg-black ${bebasNeue.variable} ${dmSans.variable}`}>
        <Header />
        <main className="flex-grow pt-[92px] pb-14 sm:pb-0">{children}</main>
        <LiveUpdater />
        <RecentlyViewed />
        <NewsletterBar />
        <Footer />
        <BackToTop />
        <MobileBottomNav />
      </body>
    </html>
  );
}
