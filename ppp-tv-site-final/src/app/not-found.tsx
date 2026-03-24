import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="font-bebas text-[120px] leading-none text-white/5 select-none" aria-hidden="true">404</p>
      <h1 className="font-bebas text-4xl text-white tracking-wide -mt-8 mb-3">Page Not Found</h1>
      <p className="text-gray-400 text-base mb-8 max-w-sm">
        This page doesn&apos;t exist or has been moved. Let&apos;s get you back to the news.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-brand-pink text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors"
      >
        Browse News
      </Link>
    </div>
  );
}
