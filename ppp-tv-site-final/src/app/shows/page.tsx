import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { shows, getFeaturedShows, SHOW_LOGOS } from '@/data/shows';

export const metadata: Metadata = {
  title: 'Shows',
  description: 'All PPP TV Kenya shows — news, entertainment, sports, music and more.',
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const CAT_COLOR: Record<string, string> = {
  News:          '#FF007A',
  Entertainment: '#BF00FF',
  Sports:        '#00CFFF',
  Music:         '#FF6B00',
  Lifestyle:     '#00FF94',
  Technology:    '#FFE600',
  Community:     '#FF007A',
};

// Gradient backgrounds per show for the poster cards
const SHOW_GRADIENT: Record<string, string> = {
  'urban-news':             'linear-gradient(135deg, #1a0010 0%, #3d0020 50%, #000 100%)',
  'juu-ya-game':            'linear-gradient(135deg, #001a2e 0%, #003d5c 50%, #000 100%)',
  'campus-xposure':         'linear-gradient(135deg, #1a1a00 0%, #3d3d00 50%, #000 100%)',
  'gospel-10':              'linear-gradient(135deg, #1a0030 0%, #3d0070 50%, #000 100%)',
  'top-15-countdown':       'linear-gradient(135deg, #1a0a00 0%, #3d1800 50%, #000 100%)',
  'kenyan-drive-show':      'linear-gradient(135deg, #001a1a 0%, #003d3d 50%, #000 100%)',
  'bongo-quiz':             'linear-gradient(135deg, #1a0000 0%, #3d0000 50%, #000 100%)',
  'tushinde-charity-show':  'linear-gradient(135deg, #001a10 0%, #003d20 50%, #000 100%)',
};

export default function ShowsPage() {
  const featured = getFeaturedShows();
  const rest = shows.filter((s) => !s.featured);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>

      {/* ── Page header ── */}
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-6">
        <h1 className="font-bebas text-6xl text-white tracking-wide mb-1">Shows</h1>
        <p className="text-gray-500 text-sm">Kenya&apos;s best entertainment, news, sports and music — all on PPP TV.</p>
      </div>

      {/* ── Featured shows — big poster grid ── */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1 h-7 flex-shrink-0" style={{ background: '#FF007A' }} />
          <h2 className="font-bebas text-2xl text-white tracking-wide">Featured Shows</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {featured.map((show) => {
            const accent = CAT_COLOR[show.category] ?? '#FF007A';
            const gradient = SHOW_GRADIENT[show.slug] ?? 'linear-gradient(135deg, #111 0%, #000 100%)';
            const logo = SHOW_LOGOS[show.slug];

            return (
              <Link
                key={show.slug}
                href={`/shows/${show.slug}`}
                className="group block relative overflow-hidden transition-transform duration-300 hover:scale-[1.04] hover:z-10"
                style={{ aspectRatio: '2/3', background: gradient }}
              >
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 z-10" style={{ background: accent }} />

                {/* Logo or show name */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
                  {logo ? (
                    <Image
                      src={logo}
                      alt={show.name}
                      width={160}
                      height={80}
                      style={{ objectFit: 'contain', maxHeight: '80px', width: 'auto', filter: 'brightness(0) invert(1)' }}
                    />
                  ) : (
                    <span className="font-bebas text-3xl text-white text-center leading-tight tracking-wide px-2">
                      {show.name}
                    </span>
                  )}
                </div>

                {/* Bottom gradient + info */}
                <div className="absolute bottom-0 left-0 right-0 z-10" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)', padding: '2rem 0.75rem 0.75rem' }}>
                  <span className="block text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>{show.category}</span>
                  <span className="block font-bebas text-lg text-white leading-tight tracking-wide">{show.name}</span>
                  <span className="block text-[10px] text-gray-400 mt-0.5 line-clamp-1">{show.tagline}</span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20"
                  style={{ background: `${accent}22` }}>
                  <span className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black" style={{ background: accent }}>
                    View Show →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── All shows ── */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1 h-7 flex-shrink-0" style={{ background: '#BF00FF' }} />
          <h2 className="font-bebas text-2xl text-white tracking-wide">All Shows</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {shows.map((show) => {
            const accent = CAT_COLOR[show.category] ?? '#FF007A';
            const gradient = SHOW_GRADIENT[show.slug] ?? 'linear-gradient(135deg, #111 0%, #000 100%)';
            const logo = SHOW_LOGOS[show.slug];

            return (
              <Link
                key={show.slug}
                href={`/shows/${show.slug}`}
                className="group flex items-center gap-3 transition-all hover:scale-[1.02]"
                style={{ background: '#111', borderLeft: `3px solid ${accent}`, padding: '1rem' }}
              >
                {logo ? (
                  <Image
                    src={logo}
                    alt={show.name}
                    width={48}
                    height={48}
                    style={{ objectFit: 'contain', width: '48px', height: '48px', filter: 'brightness(0) invert(1)', flexShrink: 0 }}
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0" style={{ background: `${accent}22` }}>
                    <span className="font-bebas text-lg text-white">{show.name[0]}</span>
                  </div>
                )}
                <div className="min-w-0">
                  <span className="block text-[9px] font-black uppercase tracking-widest" style={{ color: accent }}>{show.category}</span>
                  <span className="block font-bebas text-lg text-white leading-tight group-hover:opacity-80 transition-opacity">{show.name}</span>
                  <span className="block text-[10px] text-gray-500 mt-0.5 line-clamp-1">{show.tagline}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Weekly schedule ── */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1 h-7 flex-shrink-0" style={{ background: '#00CFFF' }} />
          <h2 className="font-bebas text-2xl text-white tracking-wide">Weekly Schedule</h2>
        </div>

        <div className="overflow-x-auto" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 w-20">Time</th>
                {DAYS.map((day) => (
                  <th key={day} className="text-left px-3 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['07:00','09:00','11:00','14:00','16:00','17:00','18:00','19:00','20:00'].map((time) => (
                <tr key={time} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-xs text-gray-600 font-mono">{time}</td>
                  {DAYS.map((day) => {
                    const show = shows.find((s) => s.schedule.some((slot) => slot.day === day && slot.startTime === time));
                    const accent = show ? (CAT_COLOR[show.category] ?? '#FF007A') : null;
                    return (
                      <td key={day} className="px-3 py-3">
                        {show ? (
                          <Link href={`/shows/${show.slug}`} className="text-xs font-bold transition-opacity hover:opacity-70 whitespace-nowrap" style={{ color: accent ?? '#FF007A' }}>
                            {show.name}
                          </Link>
                        ) : (
                          <span className="text-gray-800 text-xs">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
