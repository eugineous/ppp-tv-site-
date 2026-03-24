import Link from 'next/link';
import type { Metadata } from 'next';
import { getShowsForDay } from '@/lib/schedule';

export const metadata: Metadata = {
  title: 'Schedule',
  description: 'PPP TV Kenya weekly broadcast schedule.',
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export default function SchedulePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-bebas text-4xl text-white tracking-wide mb-2">Broadcast Schedule</h1>
      <p className="text-gray-400 text-sm mb-8">All times are East Africa Time (EAT, UTC+3).</p>

      <div className="space-y-8">
        {DAYS.map((day) => {
          const slots = getShowsForDay(day);
          return (
            <section key={day} aria-label={`${day} schedule`}>
              <h2 className="font-bebas text-2xl text-white tracking-wide mb-3 flex items-center gap-3">
                <span className="w-1 h-6 rounded-full bg-brand-pink" aria-hidden="true" />
                {day === 'Mon' ? 'Monday' : day === 'Tue' ? 'Tuesday' : day === 'Wed' ? 'Wednesday' : day === 'Thu' ? 'Thursday' : day === 'Fri' ? 'Friday' : day === 'Sat' ? 'Saturday' : 'Sunday'}
              </h2>
              {slots.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {slots.map(({ show, slot }, i) => (
                    <Link
                      key={i}
                      href={`/shows/${show.slug}`}
                      className="group flex items-center gap-4 bg-[#111] rounded-xl px-4 py-3 hover:ring-1 hover:ring-brand-pink/50 transition-all"
                    >
                      <span className="text-xs font-mono text-gray-400 w-24 flex-shrink-0">
                        {slot.startTime} – {slot.endTime}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white group-hover:text-brand-pink transition-colors">
                          {show.name}
                        </p>
                        <p className="text-xs text-gray-500">{show.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 pl-4">No shows scheduled</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
