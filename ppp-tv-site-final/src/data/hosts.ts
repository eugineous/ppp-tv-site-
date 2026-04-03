import type { Host } from '@/types';

const STAFF_BASE = '/staff';

export const hosts: Host[] = [
  {
    slug: 'eugine-micah',
    name: 'Eugine Micah',
    title: 'Head of Digital & Lead Presenter',
    bio: 'Eugine Micah is the Head of Digital and Lead Presenter at PPP TV Kenya. He drives the channel\'s digital strategy and leads production on Urban News and Campus Xposure, two of the station\'s most-watched programmes.',
    imageUrl: `${STAFF_BASE}/eugine.png`,
    showSlugs: ['urban-news', 'campus-xposure'],
    initials: 'EM',
    accentColor: 'pink-500',
  },
  {
    slug: 'lucy-ogunde',
    name: 'Lucy Ogunde',
    title: 'Co-Host & Editor',
    bio: 'Lucy Ogunde is the Co-Host and Editor at PPP TV Kenya. She handles editorial oversight, production and field reporting on Urban News and Campus Xposure.',
    imageUrl: `${STAFF_BASE}/lucy.png`,
    showSlugs: ['urban-news', 'campus-xposure'],
    initials: 'LO',
    accentColor: 'purple-500',
  },
  {
    slug: 'bella-muziki',
    name: 'Bella Muziki',
    title: 'Presenter',
    bio: 'Bella Muziki is a presenter at PPP TV Kenya, hosting the Top 10 Countdown and the Tushinde Charity Show. She brings energy and style to every broadcast.',
    imageUrl: `${STAFF_BASE}/bella.png`,
    showSlugs: ['top-10-countdown', 'tushinde-charity-show'],
    initials: 'BM',
    accentColor: 'yellow-400',
  },
  {
    slug: 'padi-wubonn',
    name: 'Padi Wubonn',
    title: 'TV Host',
    bio: 'Padi Wubonn is a TV host at PPP TV Kenya, co-hosting the Tushinde Charity Show. Known for his humour and community spirit, he connects with audiences across Kenya.',
    imageUrl: `${STAFF_BASE}/padi.png`,
    showSlugs: ['tushinde-charity-show'],
    initials: 'PW',
    accentColor: 'red-500',
  },
  {
    slug: 'vdj-jones',
    name: 'VDJ Jones',
    title: 'Video DJ & Producer',
    bio: 'VDJ Jones is a Video DJ and Producer at PPP TV Kenya, hosting The Kenyan Drive Show. CEO of Superstar Entertainment Kenya, he has been a professional Video DJ since 2014.',
    showSlugs: ['kenyan-drive-show'],
    initials: 'VJ',
    accentColor: 'cyan-500',
  },
  {
    slug: 'dj-xavi',
    name: 'DJ Xavi',
    title: 'Resident DJ',
    bio: 'DJ Xavi is a resident DJ at PPP TV Kenya, hosting Club PPP and co-hosting the Top 10 Countdown. His deep knowledge of Kenyan and African music keeps the charts fresh every week.',
    imageUrl: `${STAFF_BASE}/xavi.png`,
    showSlugs: ['top-10-countdown', 'club-ppp'],
    initials: 'DX',
    accentColor: 'orange-500',
  },
  {
    slug: 'one-jerian',
    name: 'One Jerian',
    title: 'Gospel Host',
    bio: 'One Jerian is the host of Gospel 10 on PPP TV Kenya, presenting the weekly gospel music countdown every Sunday. His passion for gospel music and inspirational content resonates with audiences across Kenya.',
    showSlugs: ['gospel-10'],
    initials: 'OJ',
    accentColor: 'purple-400',
  },
  {
    slug: 'dj-lebbz',
    name: 'DJ Lebbz',
    title: 'Resident DJ & Host',
    bio: 'DJ Lebbz hosts Abudu and Sunday Gospel Programming on PPP TV Kenya. His mastery of Swahili music, lifestyle content and gospel mixes makes him a versatile voice on the channel.',
    showSlugs: ['abudu', 'sunday-gospel'],
    initials: 'DL',
    accentColor: 'green-400',
  },
  {
    slug: 'alphamatone-qwachezz',
    name: 'Alphamatone Qwachezz',
    title: 'Host — Triple Genge Show',
    bio: 'Alphamatone Qwachezz co-hosts the Triple Genge Show on PPP TV Kenya, championing Gengetone music, street culture and emerging urban artists from across Kenya.',
    showSlugs: ['triple-genge-show'],
    initials: 'AQ',
    accentColor: 'green-500',
  },
  {
    slug: 'frank-boss',
    name: 'Frank Boss',
    title: 'Co-Host — Triple Genge Show',
    bio: 'Frank Boss is the co-host of the Triple Genge Show on PPP TV Kenya, bringing authentic street culture commentary and a deep connection to the Gengetone movement.',
    showSlugs: ['triple-genge-show'],
    initials: 'FB',
    accentColor: 'yellow-500',
  },
  {
    slug: 'dj-darlington',
    name: 'DJ Darlington',
    title: 'Resident DJ — Hip-Hop & Street Music',
    bio: 'DJ Darlington is a resident DJ at PPP TV Kenya specialising in hip-hop and street music. His sets are a staple of the channel\'s urban programming.',
    showSlugs: [],
    initials: 'DD',
    accentColor: 'orange-400',
  },
];

export function getHostBySlug(slug: string): Host | undefined {
  return hosts.find((h) => h.slug === slug);
}

export function getHostsForShow(showSlug: string): Host[] {
  return hosts.filter((h) => h.showSlugs.includes(showSlug));
}
