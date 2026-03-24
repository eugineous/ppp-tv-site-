import type { Host } from '@/types';

export const hosts: Host[] = [
  {
    slug: 'eugine-micah',
    name: 'Eugine Micah',
    title: 'Founder & Lead Anchor',
    bio: 'Eugine Micah is the visionary founder of PPP TV Kenya. A seasoned broadcaster with over a decade of experience, he brings sharp analysis and compelling storytelling to every broadcast. His passion for African stories drives the channel\'s editorial direction.',
    instagramUrl: 'https://www.instagram.com/euginemicah',
    twitterUrl: 'https://twitter.com/euginemicah',
    showSlugs: ['urban-news', 'tushinde-charity-show'],
    initials: 'EM',
    accentColor: 'pink-500',
  },
  {
    slug: 'lucy-ogunde',
    name: 'Lucy Ogunde',
    title: 'News Anchor & Gospel Host',
    bio: 'Lucy Ogunde is a versatile broadcaster who anchors the Urban News bulletin and hosts the beloved Gospel 10 countdown. Known for her warm delivery and deep faith, she connects with audiences across Kenya and the diaspora.',
    instagramUrl: 'https://www.instagram.com/lucyogunde',
    showSlugs: ['urban-news', 'gospel-10', 'tushinde-charity-show'],
    initials: 'LO',
    accentColor: 'purple-500',
  },
  {
    slug: 'bella-muziki',
    name: 'Bella Muziki',
    title: 'Youth & Lifestyle Host',
    bio: 'Bella Muziki is the face of Campus Xposure, Kenya\'s top youth lifestyle show. A content creator and cultural commentator, she keeps her finger on the pulse of Gen Z trends, fashion, and music.',
    instagramUrl: 'https://www.instagram.com/bellamuziki',
    showSlugs: ['campus-xposure'],
    initials: 'BM',
    accentColor: 'yellow-400',
  },
  {
    slug: 'padi-wubonn',
    name: 'Padi Wubonn',
    title: 'Entertainment Host & Quiz Master',
    bio: 'Padi Wubonn is the energetic co-host of Campus Xposure and the charismatic quiz master of Bongo Quiz. His quick wit and encyclopedic knowledge of African culture make every show an event.',
    instagramUrl: 'https://www.instagram.com/padiwubonn',
    showSlugs: ['campus-xposure', 'bongo-quiz'],
    initials: 'PW',
    accentColor: 'red-500',
  },
  {
    slug: 'abiud-pararo',
    name: 'Abiud Pararo',
    title: 'Sports Anchor',
    bio: 'Abiud Pararo is Kenya\'s go-to sports broadcaster. A former athlete himself, he brings insider knowledge and passionate commentary to Juu Ya Game, covering everything from the Premier League to local athletics.',
    instagramUrl: 'https://www.instagram.com/abiudpararo',
    showSlugs: ['juu-ya-game'],
    initials: 'AP',
    accentColor: 'green-500',
  },
  {
    slug: 'eric-ocham',
    name: 'Eric Ocham',
    title: 'Sports Analyst',
    bio: 'Eric Ocham is a respected sports analyst and co-host of Juu Ya Game. His tactical breakdowns and fearless predictions have made him a fan favourite among Kenyan sports enthusiasts.',
    instagramUrl: 'https://www.instagram.com/ericocham',
    showSlugs: ['juu-ya-game'],
    initials: 'EO',
    accentColor: 'green-400',
  },
  {
    slug: 'dj-xavi',
    name: 'DJ Xavi',
    title: 'Music Chart Host',
    bio: 'DJ Xavi is one of Kenya\'s most respected DJs and music curators. As co-host of the Top 15 Countdown, he brings unmatched knowledge of Afrobeats, Gengetone and Bongo Flava to the airwaves.',
    instagramUrl: 'https://www.instagram.com/djxavi',
    showSlugs: ['top-15-countdown'],
    initials: 'DX',
    accentColor: 'orange-500',
  },
  {
    slug: 'dj-darlington',
    name: 'DJ Darlington',
    title: 'Music Host & Producer',
    bio: 'DJ Darlington is a multi-talented music producer and broadcaster. His deep roots in East African music production give the Top 15 Countdown an authentic, industry-insider perspective.',
    instagramUrl: 'https://www.instagram.com/djdarlington',
    showSlugs: ['top-15-countdown'],
    initials: 'DD',
    accentColor: 'orange-400',
  },
  {
    slug: 'vdj-jones',
    name: 'VDJ Jones',
    title: 'Drive Show Host',
    bio: 'VDJ Jones is the king of Kenyan drive-time radio and TV. His infectious energy, celebrity connections and music taste make the Kenyan Drive Show the most-watched evening programme on PPP TV.',
    instagramUrl: 'https://www.instagram.com/vdjjones',
    twitterUrl: 'https://twitter.com/vdjjones',
    showSlugs: ['kenyan-drive-show'],
    initials: 'VJ',
    accentColor: 'cyan-500',
  },
  {
    slug: 'dj-kailey',
    name: 'DJ Kailey',
    title: 'Drive Show Co-Host',
    bio: 'DJ Kailey brings the feminine energy and sharp pop culture commentary to the Kenyan Drive Show. A rising star in Kenyan broadcasting, she connects with audiences through her relatable personality and love of music.',
    instagramUrl: 'https://www.instagram.com/djkailey',
    showSlugs: ['kenyan-drive-show'],
    initials: 'DK',
    accentColor: 'cyan-400',
  },
];

export function getHostBySlug(slug: string): Host | undefined {
  return hosts.find((h) => h.slug === slug);
}

export function getHostsForShow(showSlug: string): Host[] {
  return hosts.filter((h) => h.showSlugs.includes(showSlug));
}
