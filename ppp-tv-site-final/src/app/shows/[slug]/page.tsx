import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getShowBySlug, shows, SHOW_LOGOS } from '@/data/shows';
import { getHostsForShow } from '@/data/hosts';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return shows.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const show = getShowBySlug(params.slug);
  if (!show) return { title: 'Show Not Found' };
  return { title: show.name, description: show.description };
}

export default function ShowPage({ params }: Props) {
  const show = getShowBySlug(params.slug);
  if (!show) notFound();

  const hosts = getHostsForShow(show.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/shows" className="hover:text-gray-300 transition-colors">Shows</Link>
        <span aria-hidden="true">/</span>
        <span className="text-gray-400">{show.name}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">
        {/* Main */}
        <div>
          {/* Hero */}
          <div className={`relative bg-[#111] rounded-2xl p-8 mb-8 border-l-4 border-${show.accentColor} overflow-hidden`}>
            <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-white to-transparent" aria-hidden="true" />
            {SHOW_LOGOS[show.slug] && (
              <div className="mb-4">
                <Image
                  src={SHOW_LOGOS[show.slug]}
                  alt={show.name}
                  width={200}
                  height={80}
                  style={{ objectFit: 'contain', height: '80px', width: 'auto' }}
                />
              </div>
            )}
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{show.category}</span>
            <h1 className="font-bebas text-5xl text-white tracking-wide mt-1 mb-2">{show.name}</h1>
            <p className="text-brand-pink font-medium mb-4">{show.tagline}</p>
            <p className="text-gray-300 leading-relaxed max-w-2xl">{show.description}</p>
          </div>

          {/* Hosts */}
          {hosts.length > 0 && (
            <section className="mb-8" aria-label="Show hosts">
              <h2 className="font-bebas text-2xl text-white tracking-wide mb-4">Hosted By</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hosts.map((host) => (
                  <Link
                    key={host.slug}
                    href={`/hosts/${host.slug}`}
                    className="flex items-center gap-4 bg-[#111] rounded-xl p-4 hover:ring-1 hover:ring-brand-pink/50 transition-all group"
                  >
                    <div className={`w-12 h-12 rounded-full bg-${host.accentColor ?? 'brand-pink'}/20 flex items-center justify-center flex-shrink-0`}>
                      <span className="font-bebas text-lg text-white">{host.initials}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white group-hover:text-brand-pink transition-colors">{host.name}</p>
                      <p className="text-xs text-gray-400">{host.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar: schedule */}
        <aside aria-label="Show schedule">
          <div className="bg-[#111] rounded-xl p-5 sticky top-20">
            <h2 className="font-bebas text-xl text-white tracking-wide mb-4">Broadcast Schedule</h2>
            {show.schedule.length > 0 ? (
              <ul className="space-y-3">
                {show.schedule.map((slot, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-300">{slot.day}</span>
                    <span className="text-gray-400 font-mono text-xs">
                      {slot.startTime} – {slot.endTime}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Schedule TBA</p>
            )}

            <div className="mt-6 pt-4 border-t border-white/10">
              <Link
                href="/live"
                className="block w-full text-center px-4 py-2.5 bg-brand-pink text-white text-sm font-semibold rounded-lg hover:bg-pink-600 transition-colors"
              >
                Watch Live
              </Link>
              <Link
                href="/schedule"
                className="block w-full text-center px-4 py-2.5 text-gray-400 text-sm hover:text-white transition-colors mt-2"
              >
                Full Schedule →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
