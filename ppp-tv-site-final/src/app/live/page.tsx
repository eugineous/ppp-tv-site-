import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { shows } from '@/data/shows';

const OnAirStrip = dynamic(() => import('@/components/OnAirStrip'), { ssr: false });

export const metadata: Metadata = {
  title: 'Watch Live',
  description: 'Watch PPP TV Kenya live on YouTube — StarTimes Channel 430.',
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

export default function LivePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <OnAirStrip />

      <div className="mt-6 lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
        {/* Live embed */}
        <div>
          <h1 className="font-bebas text-5xl text-white tracking-wide mb-4">Watch Live</h1>
          <div className="relative aspect-video overflow-hidden bg-black">
            <iframe
              src="https://www.youtube.com/embed/live_stream?channel=PPPTVKENYA"
              title="PPP TV Kenya Live Stream"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-sm text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
              Live on YouTube
            </span>
            <a
              href="https://www.youtube.com/@PPPTVKENYA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Open in YouTube →
            </a>
          </div>
        </div>

        {/* Sidebar: today's schedule */}
        <aside className="mt-8 lg:mt-0" aria-label="Upcoming shows">
          <h2 className="font-bebas text-2xl text-white tracking-wide mb-4">Today&apos;s Schedule</h2>
          <div className="space-y-1">
            {shows.flatMap((show) =>
              show.schedule
                .filter((slot) => {
                  const today = DAYS[new Date().getDay()];
                  return slot.day === today;
                })
                .map((slot, i) => {
                  const accent = CAT_COLOR[show.category] ?? '#FF007A';
                  return (
                    <div key={`${show.slug}-${i}`} className="flex items-center gap-3 px-4 py-3" style={{ background: '#111', borderLeft: `3px solid ${accent}` }}>
                      <span className="text-xs font-mono text-gray-500 w-20 flex-shrink-0">
                        {slot.startTime} – {slot.endTime}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">{show.name}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>{show.category}</p>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
          <a
            href="/schedule"
            className="block mt-4 text-center text-sm text-gray-500 hover:text-white transition-colors"
          >
            Full Weekly Schedule →
          </a>
        </aside>
      </div>
    </div>
  );
}
