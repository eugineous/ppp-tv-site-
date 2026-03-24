import type { Show } from '@/types';

export const shows: Show[] = [
  {
    slug: 'urban-news',
    name: 'Urban News',
    tagline: 'Kenya & Africa — straight, no chaser',
    description: 'The flagship daily news bulletin covering Kenya, East Africa and the continent. Hard-hitting journalism with a modern edge.',
    category: 'News',
    accentColor: 'pink-500',
    hostSlugs: ['eugine-micah', 'lucy-ogunde'],
    featured: true,
    schedule: [
      { day: 'Mon', startTime: '07:00', endTime: '08:00' },
      { day: 'Tue', startTime: '07:00', endTime: '08:00' },
      { day: 'Wed', startTime: '07:00', endTime: '08:00' },
      { day: 'Thu', startTime: '07:00', endTime: '08:00' },
      { day: 'Fri', startTime: '07:00', endTime: '08:00' },
    ],
  },
  {
    slug: 'juu-ya-game',
    name: 'Juu Ya Game',
    tagline: 'Sports talk, Kenyan style',
    description: 'The hottest sports show in Kenya. Football, athletics, rugby, boxing — all the action with expert analysis and fan debates.',
    category: 'Sports',
    accentColor: 'green-500',
    hostSlugs: ['abiud-pararo', 'eric-ocham'],
    featured: true,
    schedule: [
      { day: 'Mon', startTime: '18:00', endTime: '19:00' },
      { day: 'Wed', startTime: '18:00', endTime: '19:00' },
      { day: 'Fri', startTime: '18:00', endTime: '19:00' },
      { day: 'Sat', startTime: '14:00', endTime: '15:30' },
    ],
  },
  {
    slug: 'campus-xposure',
    name: 'Campus Xposure',
    tagline: 'Youth culture, unfiltered',
    description: 'The pulse of Kenyan campus life — trends, fashion, music, relationships, career tips and everything Gen Z.',
    category: 'Lifestyle',
    accentColor: 'yellow-400',
    hostSlugs: ['bella-muziki', 'padi-wubonn'],
    featured: true,
    schedule: [
      { day: 'Tue', startTime: '16:00', endTime: '17:00' },
      { day: 'Thu', startTime: '16:00', endTime: '17:00' },
      { day: 'Sat', startTime: '11:00', endTime: '12:00' },
    ],
  },
  {
    slug: 'gospel-10',
    name: 'Gospel 10',
    tagline: 'Top 10 gospel hits of the week',
    description: 'A weekly countdown of the biggest gospel songs in Kenya and Africa. Praise, worship and inspiration every Sunday.',
    category: 'Music',
    accentColor: 'purple-500',
    hostSlugs: ['lucy-ogunde'],
    schedule: [
      { day: 'Sun', startTime: '09:00', endTime: '10:00' },
    ],
  },
  {
    slug: 'top-15-countdown',
    name: 'Top 15 Countdown',
    tagline: 'The hottest 15 tracks in Africa',
    description: 'The definitive weekly music chart show. Afrobeats, Bongo, Gengetone, Amapiano — the biggest bangers ranked.',
    category: 'Music',
    accentColor: 'orange-500',
    hostSlugs: ['dj-xavi', 'dj-darlington'],
    featured: true,
    schedule: [
      { day: 'Sat', startTime: '20:00', endTime: '21:30' },
      { day: 'Sun', startTime: '20:00', endTime: '21:30' },
    ],
  },
  {
    slug: 'kenyan-drive-show',
    name: 'Kenyan Drive Show',
    tagline: 'Your evening commute sorted',
    description: 'The ultimate drive-time show. Music, traffic updates, celebrity interviews and the stories everyone is talking about.',
    category: 'Entertainment',
    accentColor: 'cyan-500',
    hostSlugs: ['vdj-jones', 'dj-kailey'],
    schedule: [
      { day: 'Mon', startTime: '17:00', endTime: '19:00' },
      { day: 'Tue', startTime: '17:00', endTime: '19:00' },
      { day: 'Wed', startTime: '17:00', endTime: '19:00' },
      { day: 'Thu', startTime: '17:00', endTime: '19:00' },
      { day: 'Fri', startTime: '17:00', endTime: '19:00' },
    ],
  },
  {
    slug: 'bongo-quiz',
    name: 'Bongo Quiz',
    tagline: 'Test your African knowledge',
    description: 'The interactive quiz show that tests your knowledge of African history, culture, music and current affairs. Win prizes!',
    category: 'Entertainment',
    accentColor: 'red-500',
    hostSlugs: ['padi-wubonn'],
    schedule: [
      { day: 'Wed', startTime: '20:00', endTime: '21:00' },
      { day: 'Sat', startTime: '19:00', endTime: '20:00' },
    ],
  },
  {
    slug: 'tushinde-charity-show',
    name: 'Tushinde Charity Show',
    tagline: 'Giving back to Kenya',
    description: 'Monthly charity showcase spotlighting community heroes, NGOs and social impact stories from across Kenya.',
    category: 'Community',
    accentColor: 'teal-500',
    hostSlugs: ['eugine-micah', 'lucy-ogunde'],
    schedule: [
      { day: 'Sun', startTime: '14:00', endTime: '15:00' },
    ],
  },
];

export function getShowBySlug(slug: string): Show | undefined {
  return shows.find((s) => s.slug === slug);
}

export function getFeaturedShows(): Show[] {
  return shows.filter((s) => s.featured);
}
