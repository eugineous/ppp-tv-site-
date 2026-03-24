import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { shows } from '@/data/shows';

const OnAirStrip = dynamic(() => import('@/components/OnAirStrip'), { ssr: false });

export const metadata: Metadata = {
  title: 'Watch Live',
  description: 'Watch PPP TV Kenya live on YouTube — StarTimes Channel 430.',
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export default function LivePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <OnAirStrip />

      <div className="mt-6 lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
        {/* Live embed */}
        <div>
          <h1 className="font-bebas text-4xl text-white tracking-wide mb-4">Watch Live</h1>
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
            <iframe
              src="https://www.youtube.com/embed/live_stream?channel=PPPTVKENYA"
              title="PPP TV Kenya Live Stream"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
              Live on YouTube
            </span>
            <a
              href="https://www.youtube.com/@PPPTVKENYA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-brand-pink transition-colors"
            >
              Open in YouTube →
            </a>
          </div>
        </div>

        {/* Sidebar: upcoming schedule */}
        <aside className="mt-8 lg:mt-0" aria-label="Upcoming shows">
          <h2 className="font-bebas text-2xl text-white tracking-wide mb-4">Today&apos;s Schedule</h2>
          <div className="space-y-2">
            {shows.flatMap((show) =>
              show.schedule
                .filter((slot) => {
                  const today = DAYS[new Date().getDay()];
                  return slot.day === today;
                })
                .map((slot, i) => (
                  <div key={`${show.slug}-${i}`} className="flex items-center gap-3 bg-[#111] rounded-lg px-4 py-3">
                    <span className="text-xs font-mono text-gray-400 w-20 flex-shrink-0">
                      {slot.startTime} – {slot.endTime}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">{show.name}</p>
                      <p className="text-xs text-gray-500">{show.category}</p>
                    </div>
                  </div>
                ))
            )}
          </div>
          <a
            href="/schedule"
            className="block mt-4 text-center text-sm text-gray-400 hover:text-brand-pink transition-colors"
          >
            Full Weekly Schedule →
          </a>
        </aside>
      </div>
    </div>
  );
}
