import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="font-bebas text-[120px] leading-none select-none" style={{ color: 'rgba(255,255,255,0.04)' }} aria-hidden="true">404</p>
      <h1 className="font-bebas text-4xl text-white tracking-wide -mt-8 mb-3">Page Not Found</h1>
      <p className="text-gray-500 text-base mb-10 max-w-sm">
        This page doesn&apos;t exist or has been moved. Let&apos;s get you back to the news.
      </p>
      <Link
        href="/"
        className="inline-block px-8 py-3 text-white font-black text-sm uppercase tracking-widest transition-opacity hover:opacity-80"
        style={{ background: '#FF007A' }}
      >
        Browse News
      </Link>
    </div>
  );
}
