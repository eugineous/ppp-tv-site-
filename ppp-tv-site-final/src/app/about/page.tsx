import Link from 'next/link';
import type { Metadata } from 'next';
import { shows, getFeaturedShows } from '@/data/shows';
import { hosts } from '@/data/hosts';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'About PPP TV Kenya — Africa\'s entertainment hub on StarTimes Channel 430.',
};

const STATS = [
  { label: 'Shows', value: shows.length.toString() },
  { label: 'Hosts', value: hosts.length.toString() },
  { label: 'StarTimes Channel', value: '430' },
  { label: 'Countries Reached', value: '10+' },
];

export default function AboutPage() {
  const featured = getFeaturedShows();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <p className="font-bebas text-6xl text-white tracking-widest mb-2">
          PPP<span className="text-brand-pink">TV</span>
        </p>
        <p className="text-gray-400 text-lg">Kenya First. Africa Always.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-[#111] rounded-xl p-5 text-center">
            <p className="font-bebas text-4xl text-brand-pink">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Mission */}
      <section className="mb-10" aria-label="Our mission">
        <h2 className="font-bebas text-3xl text-white tracking-wide mb-4">Our Mission</h2>
        <div className="bg-[#111] rounded-xl p-6 border-l-4 border-brand-pink">
          <p className="text-gray-300 leading-relaxed text-base">
            PPP TV Kenya is Africa&apos;s entertainment hub — a digital-first television channel dedicated to telling authentic African stories. We cover Kenya and the continent with passion, bringing you news, entertainment, sports, music and culture that matters to you.
          </p>
          <p className="text-gray-300 leading-relaxed text-base mt-4">
            Broadcasting on StarTimes Channel 430, we reach millions of viewers across East Africa and beyond. Our mission is simple: Kenya First, Africa Always.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mb-10" aria-label="Our values">
        <h2 className="font-bebas text-3xl text-white tracking-wide mb-4">What We Stand For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Authenticity', desc: 'Real stories from real Kenyans. No fluff, no filter.' },
            { title: 'Community', desc: 'We amplify voices that mainstream media ignores.' },
            { title: 'Excellence', desc: 'World-class production, African heart.' },
          ].map((v) => (
            <div key={v.title} className="bg-[#111] rounded-xl p-5">
              <p className="font-bebas text-xl text-brand-pink mb-2">{v.title}</p>
              <p className="text-sm text-gray-400">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Shows preview */}
      <section className="mb-10" aria-label="Our shows">
        <h2 className="font-bebas text-3xl text-white tracking-wide mb-4">Our Shows</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {featured.map((show) => (
            <Link
              key={show.slug}
              href={`/shows/${show.slug}`}
              className="group flex items-center gap-3 bg-[#111] rounded-xl p-4 hover:ring-1 hover:ring-brand-pink/50 transition-all"
            >
              <div className={`w-2 h-10 rounded-full bg-${show.accentColor} flex-shrink-0`} aria-hidden="true" />
              <div>
                <p className="font-semibold text-white group-hover:text-brand-pink transition-colors">{show.name}</p>
                <p className="text-xs text-gray-500">{show.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/shows" className="text-sm text-brand-pink hover:text-pink-300 transition-colors">
          View all shows →
        </Link>
      </section>

      {/* Team preview */}
      <section aria-label="Our team">
        <h2 className="font-bebas text-3xl text-white tracking-wide mb-4">Our Team</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          {hosts.slice(0, 6).map((host) => (
            <Link
              key={host.slug}
              href={`/hosts/${host.slug}`}
              className="flex items-center gap-2 bg-[#111] rounded-full px-4 py-2 hover:ring-1 hover:ring-brand-pink/50 transition-all group"
            >
              <div className="w-7 h-7 rounded-full bg-brand-pink/20 flex items-center justify-center">
                <span className="font-bebas text-xs text-white">{host.initials}</span>
              </div>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{host.name}</span>
            </Link>
          ))}
        </div>
        <Link href="/staff" className="text-sm text-brand-pink hover:text-pink-300 transition-colors">
          Meet the full team →
        </Link>
      </section>
    </div>
  );
}
