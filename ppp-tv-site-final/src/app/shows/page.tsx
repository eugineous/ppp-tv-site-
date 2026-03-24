import Link from 'next/link';
import type { Metadata } from 'next';
import { shows, getFeaturedShows } from '@/data/shows';
import SectionLabel from '@/components/SectionLabel';

export const metadata: Metadata = {
  title: 'Shows',
  description: 'All PPP TV Kenya shows — news, entertainment, sports, music and more.',
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export default function ShowsPage() {
  const featured = getFeaturedShows();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-bebas text-4xl text-white tracking-wide mb-2">Our Shows</h1>
      <p className="text-gray-400 text-sm mb-8">Kenya&apos;s best entertainment, news, sports and music — all on PPP TV.</p>

      {/* Featured shows */}
      {featured.length > 0 && (
        <section className="mb-10" aria-label="Featured shows">
          <SectionLabel label="Featured" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((show) => (
              <Link
                key={show.slug}
                href={`/shows/${show.slug}`}
                className="group relative bg-[#111] rounded-xl p-6 hover:ring-1 hover:ring-brand-pink/50 transition-all overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-1 h-full bg-${show.accentColor}`} aria-hidden="true" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{show.category}</span>
                <h2 className="font-bebas text-2xl text-white mt-1 mb-2 group-hover:text-brand-pink transition-colors">
                  {show.name}
                </h2>
                <p className="text-sm text-gray-400 line-clamp-2">{show.description}</p>
                <p className="text-xs text-brand-pink mt-3 font-medium">{show.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All shows */}
      <section className="mb-10" aria-label="All shows">
        <SectionLabel label="All Shows" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {shows.map((show) => (
            <Link
              key={show.slug}
              href={`/shows/${show.slug}`}
              className="group bg-[#111] rounded-xl p-4 hover:ring-1 hover:ring-brand-pink/50 transition-all"
            >
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{show.category}</span>
              <h3 className="font-bebas text-xl text-white mt-1 mb-1 group-hover:text-brand-pink transition-colors">
                {show.name}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2">{show.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Broadcast schedule table */}
      <section aria-label="Broadcast schedule">
        <SectionLabel label="Weekly Schedule" />
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest w-24">Time</th>
                {DAYS.map((day) => (
                  <th key={day} className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['07:00', '09:00', '11:00', '14:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map((time) => (
                <tr key={time} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono">{time}</td>
                  {DAYS.map((day) => {
                    const show = shows.find((s) =>
                      s.schedule.some((slot) => slot.day === day && slot.startTime === time)
                    );
                    return (
                      <td key={day} className="px-3 py-3">
                        {show ? (
                          <Link
                            href={`/shows/${show.slug}`}
                            className="text-xs text-brand-pink hover:text-pink-300 font-medium transition-colors"
                          >
                            {show.name}
                          </Link>
                        ) : (
                          <span className="text-gray-700 text-xs">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
