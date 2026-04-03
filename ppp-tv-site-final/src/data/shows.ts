import type { Show } from '@/types';

const R2 = 'https://pub-8244b5f99b024cda91b74e1131378a14.r2.dev';

export const SHOW_LOGOS: Record<string, string> = {
  'urban-news':              `${R2}/LOGOS/Urban News show Logo.png`,
  'campus-xposure':          `${R2}/LOGOS/CAMPUS RAVE LOGO png.png`,
  'tushinde-charity-show':   `${R2}/LOGOS/Tushinde bet logo.png`,
};

export const shows: Show[] = [
  {
    slug: 'urban-news',
    name: 'Urban News',
    tagline: 'Nairobi pop culture, celebrity news & street fashion',
    description: 'PPP TV\'s flagship and most-watched show, covering Nairobi pop culture, celebrity news, street fashion and entertainment trends. Airs Monday to Friday at 2:00 PM and Monday, Wednesday, Friday at 7:30 PM.',
    category: 'News',
    accentColor: 'pink-500',
    hostSlugs: ['eugine-micah', 'lucy-ogunde'],
    featured: true,
    schedule: [
      { day: 'Mon', startTime: '14:00', endTime: '15:00' },
      { day: 'Tue', startTime: '14:00', endTime: '15:00' },
      { day: 'Wed', startTime: '14:00', endTime: '15:00' },
      { day: 'Thu', startTime: '14:00', endTime: '15:00' },
      { day: 'Fri', startTime: '14:00', endTime: '15:00' },
      { day: 'Mon', startTime: '19:30', endTime: '20:30' },
      { day: 'Wed', startTime: '19:30', endTime: '20:30' },
      { day: 'Fri', startTime: '19:30', endTime: '20:30' },
    ],
  },
  {
    slug: 'campus-xposure',
    name: 'Campus Xposure',
    tagline: 'University & college culture across Kenya',
    description: 'Youth-focused series spotlighting university and college culture across Kenya — campus life, student innovation, events and educational storytelling. Airs Saturday and Sunday at 6:00 PM.',
    category: 'Lifestyle',
    accentColor: 'yellow-400',
    hostSlugs: ['eugine-micah', 'lucy-ogunde'],
    featured: true,
    schedule: [
      { day: 'Sat', startTime: '18:00', endTime: '19:00' },
      { day: 'Sun', startTime: '18:00', endTime: '19:00' },
    ],
  },
  {
    slug: 'kenyan-drive-show',
    name: 'The Kenyan Drive Show',
    tagline: 'Kenyan pop charts, trending hits & music news',
    description: 'Hosted by VDJ Jones, The Kenyan Drive Show brings you the hottest Kenyan pop charts, trending hits and music news every Saturday at 7:00 PM.',
    category: 'Music',
    accentColor: 'cyan-500',
    hostSlugs: ['vdj-jones'],
    featured: true,
    schedule: [
      { day: 'Sat', startTime: '19:00', endTime: '20:00' },
    ],
  },
  {
    slug: 'top-10-countdown',
    name: 'Top 10 Countdown',
    tagline: 'Weekly charts, trending hits & artist features',
    description: 'The weekly music chart show hosted by Bella Muziki and DJ Xavi. Featuring the top 10 trending hits, artist features and the latest in Kenyan and African music. Airs Thursday at 4:00 PM.',
    category: 'Music',
    accentColor: 'orange-500',
    hostSlugs: ['bella-muziki', 'dj-xavi'],
    featured: true,
    schedule: [
      { day: 'Thu', startTime: '16:00', endTime: '17:00' },
    ],
  },
  {
    slug: 'tushinde-charity-show',
    name: 'Tushinde Charity Show',
    tagline: 'Charity initiatives & community engagement',
    description: 'Hosted by Padi Wubonn and Bella Muziki, the Tushinde Charity Show spotlights community heroes, charity initiatives and social impact stories from across Kenya. Airs Saturday at 10:00 PM.',
    category: 'Community',
    accentColor: 'teal-500',
    hostSlugs: ['padi-wubonn', 'bella-muziki'],
    schedule: [
      { day: 'Sat', startTime: '22:00', endTime: '23:00' },
    ],
  },
  {
    slug: 'gospel-10',
    name: 'Gospel 10',
    tagline: 'Gospel music countdown, interviews & inspiration',
    description: 'Hosted by One Jerian, Gospel 10 is the weekly gospel music countdown featuring the top gospel songs, artist interviews and inspirational content. Airs Sunday 4:00 PM to 6:00 PM.',
    category: 'Music',
    accentColor: 'purple-500',
    hostSlugs: ['one-jerian'],
    schedule: [
      { day: 'Sun', startTime: '16:00', endTime: '18:00' },
    ],
  },
  {
    slug: 'triple-genge-show',
    name: 'Triple Genge Show',
    tagline: 'Gengetone, street culture & emerging urban artists',
    description: 'Hosted by Alphamatone Qwachezz and Frank Boss, the Triple Genge Show is dedicated to Gengetone music, street culture and the emerging urban artists shaping Kenyan music.',
    category: 'Music',
    accentColor: 'green-500',
    hostSlugs: ['alphamatone-qwachezz', 'frank-boss'],
    schedule: [],
  },
  {
    slug: 'abudu',
    name: 'Abudu',
    tagline: 'Swahili music, lifestyle & culture',
    description: 'Hosted by DJ Lebbz, Abudu celebrates Swahili music, lifestyle and culture — a love letter to the coastal and Swahili-speaking communities of Kenya and East Africa.',
    category: 'Music',
    accentColor: 'blue-400',
    hostSlugs: ['dj-lebbz'],
    schedule: [],
  },
  {
    slug: 'club-ppp',
    name: 'Club PPP',
    tagline: 'Live DJ mixes, club & party music',
    description: 'Hosted by DJ Xavi, Club PPP brings the energy of Kenya\'s best clubs straight to your screen — live DJ mixes, the hottest club anthems and non-stop party music.',
    category: 'Music',
    accentColor: 'red-500',
    hostSlugs: ['dj-xavi'],
    schedule: [],
  },
  {
    slug: 'sunday-gospel',
    name: 'Sunday Gospel',
    tagline: 'Gospel music, pastor interviews & inspiration',
    description: 'Hosted by DJ Lebbz, Sunday Gospel starts at 8:00 AM with gospel music, pastor interviews and inspirational messages to set the tone for your Sunday.',
    category: 'Music',
    accentColor: 'purple-300',
    hostSlugs: ['dj-lebbz'],
    schedule: [
      { day: 'Sun', startTime: '08:00', endTime: '10:00' },
    ],
  },
];

export function getShowBySlug(slug: string): Show | undefined {
  return shows.find((s) => s.slug === slug);
}

export function getFeaturedShows(): Show[] {
  return shows.filter((s) => s.featured);
}
