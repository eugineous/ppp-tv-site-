import type { Metadata } from 'next';
import { Bebas_Neue, DM_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';

const MobileBottomNav = dynamic(() => import('@/components/MobileBottomNav'), { ssr: false });
const NewsletterBar = dynamic(() => import('@/components/NewsletterBar'), { ssr: false });
const RecentlyViewed = dynamic(() => import('@/components/RecentlyViewed'), { ssr: false });
const BackToTop = dynamic(() => import('@/components/BackToTop'), { ssr: false });

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const dm = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'PPP TV Kenya — Africa\'s Entertainment Hub', template: '%s | PPP TV Kenya' },
  description: 'PPP TV Kenya — StarTimes Channel 430. Africa\'s entertainment news, shows, music, sports and culture. Kenya first, Africa always.',
  keywords: ['PPP TV Kenya', 'Kenya entertainment', 'Africa news', 'StarTimes 430', 'Kenyan TV'],
  metadataBase: new URL('https://ppp-tv-site-final.vercel.app'),
  openGraph: {
    siteName: 'PPP TV Kenya',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  verification: { google: 'No-Mx2X_fmIIU7WfLtVCqgIRUJZ7oLyf66Y50rlPbgg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE" className={`${bebas.variable} ${dm.variable}`}>
      <body className="min-h-screen flex flex-col bg-black" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <Header />
        <main className="flex-1 fade-in" id="main-content">
          {children}
        </main>
        <RecentlyViewed />
        <NewsletterBar />
        <Footer />
        <BackToTop />
        <MobileBottomNav />
      </body>
    </html>
  );
}
