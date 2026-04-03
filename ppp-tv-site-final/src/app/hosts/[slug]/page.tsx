import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getHostBySlug, hosts } from '@/data/hosts';
import { getShowBySlug } from '@/data/shows';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return hosts.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const host = getHostBySlug(params.slug);
  if (!host) return { title: 'Host Not Found' };
  return { title: host.name, description: host.bio.slice(0, 160) };
}

export default function HostPage({ params }: Props) {
  const host = getHostBySlug(params.slug);
  if (!host) notFound();

  const hostShows = host.showSlugs.map(getShowBySlug).filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/hosts" className="hover:text-gray-300 transition-colors">Hosts</Link>
        <span aria-hidden="true">/</span>
        <span className="text-gray-400">{host.name}</span>
      </nav>

      {/* Profile card */}
      <div className="bg-[#111] rounded-2xl p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className={`w-24 h-24 rounded-full overflow-hidden bg-${host.accentColor ?? 'brand-pink'}/20 flex items-center justify-center flex-shrink-0`}>
          {host.imageUrl ? (
            <img src={host.imageUrl} alt={host.name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-bebas text-4xl text-white">{host.initials}</span>
          )}
        </div>
        <div>
          <h1 className="font-bebas text-4xl text-white tracking-wide">{host.name}</h1>
          <p className="text-brand-pink font-medium mb-4">{host.title}</p>
          <p className="text-gray-300 leading-relaxed">{host.bio}</p>

          {/* Social links */}
          <div className="flex items-center gap-3 mt-4">
            {host.instagramUrl && (
              <a
                href={host.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-brand-pink transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Instagram
              </a>
            )}
            {host.twitterUrl && (
              <a
                href={host.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-brand-pink transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Shows */}
      {hostShows.length > 0 && (
        <section aria-label="Shows hosted">
          <h2 className="font-bebas text-2xl text-white tracking-wide mb-4">Shows</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hostShows.map((show) => show && (
              <Link
                key={show.slug}
                href={`/shows/${show.slug}`}
                className="group bg-[#111] rounded-xl p-4 hover:ring-1 hover:ring-brand-pink/50 transition-all"
              >
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{show.category}</span>
                <p className="font-bebas text-xl text-white mt-1 group-hover:text-brand-pink transition-colors">{show.name}</p>
                <p className="text-xs text-gray-500 mt-1">{show.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
