import { shows } from '@/data/shows';
import type { Show } from '@/types';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Returns the show currently on air, or null if nothing is scheduled right now.
 * Uses the local time of the viewer's browser (or server time during SSR).
 */
export function getCurrentShow(now: Date = new Date()): Show | null {
  const dayName = DAY_NAMES[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const show of shows) {
    for (const slot of show.schedule) {
      if (slot.day !== dayName) continue;
      const start = timeToMinutes(slot.startTime);
      const end = timeToMinutes(slot.endTime);
      if (currentMinutes >= start && currentMinutes < end) {
        return show;
      }
    }
  }

  return null;
}

/**
 * Returns the next show coming up within the next 3 hours, or null.
 */
export function getNextShow(now: Date = new Date()): Show | null {
  const dayName = DAY_NAMES[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const windowEnd = currentMinutes + 180; // 3 hours ahead

  let earliest: { show: Show; start: number } | null = null;

  for (const show of shows) {
    for (const slot of show.schedule) {
      if (slot.day !== dayName) continue;
      const start = timeToMinutes(slot.startTime);
      if (start > currentMinutes && start <= windowEnd) {
        if (!earliest || start < earliest.start) {
          earliest = { show, start };
        }
      }
    }
  }

  return earliest?.show ?? null;
}

/** Get all shows scheduled for a given day */
export function getShowsForDay(day: (typeof DAY_NAMES)[number]): Array<{ show: Show; slot: Show['schedule'][number] }> {
  const result: Array<{ show: Show; slot: Show['schedule'][number] }> = [];
  for (const show of shows) {
    for (const slot of show.schedule) {
      if (slot.day === day) {
        result.push({ show, slot });
      }
    }
  }
  return result.sort((a, b) => timeToMinutes(a.slot.startTime) - timeToMinutes(b.slot.startTime));
}
