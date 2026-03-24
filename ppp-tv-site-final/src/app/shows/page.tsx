import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { shows, getFeaturedShows, SHOW_LOGOS } from '@/data/shows';
import SectionLabel from '@/components/SectionLabel';

export const metadata: Metadata = {
  title: 'Shows',
  description: 'All PPP TV Kenya shows — news, entertainment, sports, music and more.',
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const CAT_COLOR: Record<string, string> = {
  News: '#FF007A',
  Entertainment: '#BF00FF',
  Sports: '#00CFFF',
  Music: '#FF6B00',
  Lifestyle: '#00FF94',
  Technology: '#FFE600',
};

export default function ShowsPage() {
  const featured = getFeaturedShows();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-bebas text-5xl text-white tracking-wide mb-1">Our Shows</h1>
      <p className="text-gray-500 text-sm mb-10">Kenya&apos;s best entertainment, news, sports and music — all on PPP TV.</p>

      {/* Featured shows */}
      {featured.length > 0 && (
        <section className="mb-12" aria-label="Featured shows">
          <SectionLabel label="Featured" color="#FF007A" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((show) => {
              const accent = CAT_COLOR[show.category] ?? '#FF007A';
              return (
                <Link
                  key={show.slug}
                  href={`/shows/${show.slug}`}
                  className="group relative overflow-hidden transition-transform hover:scale-[1.02]"
                  style={{ background: '#111' }}
                >
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ background: accent }} aria-hidden="true" />
                  <div className="p-6 pl-7">
                    {SHOW_LOGOS[show.slug] && (
                      <div className="mb-3">
                        <Image src={SHOW_LOGOS[show.slug]} alt={show.name} width={120} height={48} style={{ objectFit: 'contain', height: '48px', width: 'auto' }} />
                      </div>
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: accent }}>{show.category}</span>
                    <h2 className="font-bebas text-2xl text-white mt-1 mb-2 group-hover:opacity-80 transition-opacity">
                      {show.name}
                    </h2>
                    <p className="text-sm text-gray-400 line-clamp-2">{show.description}</p>
                    <p className="text-xs mt-3 font-medium" style={{ color: accent }}>{show.tagline}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* All shows */}
      <section className="mb-12" aria-label="All shows">
        <SectionLabel label="All Shows" color="#BF00FF" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {shows.map((show) => {
            const accent = CAT_COLOR[show.category] ?? '#FF007A';
            return (
              <Link
                key={show.slug}
                href={`/shows/${show.slug}`}
                className="group transition-transform hover:scale-[1.02]"
                style={{ background: '#111' }}
              >
                <div className="h-1 w-full" style={{ background: accent }} />
                <div className="p-4">
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: accent }}>{show.category}</span>
                  <h3 className="font-bebas text-xl text-white mt-1 mb-1 group-hover:opacity-80 transition-opacity">
                    {show.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{show.tagline}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Broadcast schedule table */}
      <section aria-label="Broadcast schedule">
        <SectionLabel label="Weekly Schedule" color="#00CFFF" />
        <div className="overflow-x-auto border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 w-24">Time</th>
                {DAYS.map((day) => (
                  <th key={day} className="text-left px-3 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['07:00', '09:00', '11:00', '14:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map((time) => (
                <tr key={time} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-xs text-gray-600 font-mono">{time}</td>
                  {DAYS.map((day) => {
                    const show = shows.find((s) =>
                      s.schedule.some((slot) => slot.day === day && slot.startTime === time)
                    );
                    const accent = show ? (CAT_COLOR[show.category] ?? '#FF007A') : null;
                    return (
                      <td key={day} className="px-3 py-3">
                        {show ? (
                          <Link href={`/shows/${show.slug}`} className="text-xs font-medium transition-opacity hover:opacity-70" style={{ color: accent ?? '#FF007A' }}>
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
