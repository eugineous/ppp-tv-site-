import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { shows, SHOW_LOGOS } from '@/data/shows';

export const metadata: Metadata = {
  title: 'Shows | PPP TV Kenya',
  description: 'All PPP TV Kenya shows — news, entertainment, sports, music and more.',
};

const R2 = 'https://pub-8244b5f99b024cda91b74e1131378a14.r2.dev';
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

const SHOW_BG: Record<string, string> = {
  'urban-news':    `${R2}/SHOWS/urban-news-bg.jpg`,
  'campus-xposure': `${R2}/SHOWS/campus-rave-bg.jpg`,
};

const SHOW_GRADIENT: Record<string, string> = {
  'urban-news':            'linear-gradient(160deg,#3d0020 0%,#1a0010 60%,#000 100%)',
  'juu-ya-game':           'linear-gradient(160deg,#003d5c 0%,#001a2e 60%,#000 100%)',
  'campus-xposure':        'linear-gradient(160deg,#3d3d00 0%,#1a1a00 60%,#000 100%)',
  'gospel-10':             'linear-gradient(160deg,#3d0070 0%,#1a0030 60%,#000 100%)',
  'top-15-countdown':      'linear-gradient(160deg,#3d1800 0%,#1a0a00 60%,#000 100%)',
  'kenyan-drive-show':     'linear-gradient(160deg,#003d3d 0%,#001a1a 60%,#000 100%)',
  'bongo-quiz':            'linear-gradient(160deg,#3d0000 0%,#1a0000 60%,#000 100%)',
  'tushinde-charity-show': 'linear-gradient(160deg,#003d20 0%,#001a10 60%,#000 100%)',
};

export default function ShowsPage() {
  const featured = shows.filter((s) => s.featured);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>

      {/* Hero */}
      <div className="relative w-full overflow-hidden" style={{ height: '320px' }}>
        <Image src={`${R2}/SHOWS/urban-news-bg2.jpg`} alt="PPP TV Shows" fill
          style={{ objectFit: 'cover', objectPosition: 'center top' }} priority />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right,rgba(0,0,0,0.9) 0%,rgba(0,0,0,0.4) 60%,transparent 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,#000 0%,transparent 50%)' }} />
        <div className="absolute bottom-0 left-0 px-6 pb-10 max-w-xl">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: '#FF007A' }}>PPP TV Kenya</p>
          <h1 className="font-bebas text-7xl text-white tracking-wide leading-none mb-2">Our Shows</h1>
          <p className="text-gray-300 text-sm">Kenya&apos;s best entertainment, news, sports and music.</p>
        </div>
      </div>

      {/* Featured poster grid */}
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1 h-7 flex-shrink-0" style={{ background: '#FF007A' }} />
          <h2 className="font-bebas text-3xl text-white tracking-wide">Featured Shows</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {featured.map((show) => {
            const accent = CAT_COLOR[show.category] ?? '#FF007A';
            const bg = SHOW_BG[show.slug];
            const gradient = SHOW_GRADIENT[show.slug] ?? 'linear-gradient(160deg,#222 0%,#000 100%)';
            const logo = SHOW_LOGOS[show.slug];
            return (
              <Link key={show.slug} href={`/shows/${show.slug}`}
                className="group block relative overflow-hidden rounded-sm transition-transform duration-300 hover:scale-[1.05] hover:z-10"
                style={{ aspectRatio: '2/3' }}>
                {bg
                  ? <Image src={bg} alt={show.name} fill style={{ objectFit: 'cover', objectPosition: 'center top' }} />
                  : <div className="absolute inset-0" style={{ background: gradient }} />
                }
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.95) 0%,rgba(0,0,0,0.25) 50%,rgba(0,0,0,0.1) 100%)' }} />
                <div className="absolute top-0 left-0 right-0 h-[3px] z-10" style={{ background: accent }} />
                <div className="absolute inset-0 flex items-center justify-center z-10 px-4" style={{ paddingBottom: '80px' }}>
                  {logo
                    ? <Image src={logo} alt={show.name} width={140} height={70}
                        style={{ objectFit: 'contain', maxHeight: '70px', width: 'auto', filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }} />
                    : <span className="font-bebas text-4xl text-white text-center leading-tight tracking-wide drop-shadow-lg">{show.name}</span>
                  }
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-10 p-3">
                  <span className="block text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>{show.category}</span>
                  <span className="block font-bebas text-xl text-white leading-tight">{show.name}</span>
                  <span className="block text-[10px] text-gray-400 mt-0.5 line-clamp-2">{show.tagline}</span>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center z-20 pb-4"
                  style={{ background: `linear-gradient(to top,${accent}55 0%,transparent 60%)` }}>
                  <span className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-black" style={{ background: accent }}>Watch Now →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* All shows list */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1 h-7 flex-shrink-0" style={{ background: '#BF00FF' }} />
          <h2 className="font-bebas text-3xl text-white tracking-wide">All Shows</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {shows.map((show) => {
            const accent = CAT_COLOR[show.category] ?? '#FF007A';
            const logo = SHOW_LOGOS[show.slug];
            const gradient = SHOW_GRADIENT[show.slug] ?? 'linear-gradient(135deg,#111 0%,#000 100%)';
            return (
              <Link key={show.slug} href={`/shows/${show.slug}`}
                className="group flex items-center gap-0 transition-all hover:scale-[1.02] rounded-sm overflow-hidden"
                style={{ background: '#0d0d0d', borderLeft: `3px solid ${accent}` }}>
                <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: '72px', height: '72px', background: gradient }}>
                  {logo
                    ? <Image src={logo} alt={show.name} width={50} height={50}
                        style={{ objectFit: 'contain', width: '50px', height: '50px', filter: 'brightness(0) invert(1)' }} />
                    : <span className="font-bebas text-2xl text-white">{show.name[0]}</span>
                  }
                </div>
                <div className="min-w-0 py-3 px-3 flex-1">
                  <span className="block text-[9px] font-black uppercase tracking-widest" style={{ color: accent }}>{show.category}</span>
                  <span className="block font-bebas text-xl text-white leading-tight group-hover:opacity-80 transition-opacity">{show.name}</span>
                  <span className="block text-[10px] text-gray-500 mt-0.5 line-clamp-1">{show.tagline}</span>
                </div>
                <span className="pr-4 text-xl opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" style={{ color: accent }}>›</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Weekly schedule */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1 h-7 flex-shrink-0" style={{ background: '#00CFFF' }} />
          <h2 className="font-bebas text-3xl text-white tracking-wide">Weekly Schedule</h2>
        </div>
        <div className="overflow-x-auto rounded-sm" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600 w-16">Time</th>
                {DAYS.map((day) => (
                  <th key={day} className="text-left px-3 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['07:00','09:00','11:00','14:00','16:00','17:00','18:00','19:00','20:00'].map((time, i) => (
                <tr key={time} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
                  className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-xs text-gray-700 font-mono whitespace-nowrap">{time}</td>
                  {DAYS.map((day) => {
                    const show = shows.find((s) => s.schedule.some((slot) => slot.day === day && slot.startTime === time));
                    const accent = show ? (CAT_COLOR[show.category] ?? '#FF007A') : null;
                    return (
                      <td key={day} className="px-3 py-3">
                        {show
                          ? <Link href={`/shows/${show.slug}`}
                              className="text-xs font-bold transition-opacity hover:opacity-70 whitespace-nowrap block"
                              style={{ color: accent ?? '#FF007A' }}>{show.name}</Link>
                          : <span className="text-gray-800 text-xs">—</span>
                        }
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
