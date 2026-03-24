import type { Artist } from '@/types';

export const artists: Artist[] = [
  {
    slug: 'sauti-sol',
    name: 'Sauti Sol',
    genre: 'Afro-pop / R&B',
    bio: 'Kenya\'s most celebrated music group, Sauti Sol have dominated African music for over a decade. Their blend of Afro-pop, R&B and traditional Kenyan sounds has earned them multiple continental awards.',
    initials: 'SS',
    featured: true,
    instagramUrl: 'https://www.instagram.com/sautisol',
    youtubeUrl: 'https://www.youtube.com/@SautiSol',
  },
  {
    slug: 'khaligraph-jones',
    name: 'Khaligraph Jones',
    genre: 'Hip-Hop / Rap',
    bio: 'The OG, Khaligraph Jones is Kenya\'s most decorated rapper and one of Africa\'s finest. His hard-hitting bars and relentless work ethic have made him a legend in African hip-hop.',
    initials: 'KJ',
    featured: true,
    instagramUrl: 'https://www.instagram.com/khaligraphjones',
    youtubeUrl: 'https://www.youtube.com/@KhaligraphJones',
  },
  {
    slug: 'bien',
    name: 'Bien',
    genre: 'Afro-pop / Soul',
    bio: 'Bien Aime Baraza, known simply as Bien, is a solo artist and member of Sauti Sol. His soulful voice and introspective songwriting have made him one of Kenya\'s most respected solo acts.',
    initials: 'BI',
    featured: true,
    instagramUrl: 'https://www.instagram.com/bienaimee',
  },
  {
    slug: 'nviiri-the-storyteller',
    name: 'Nviiri the Storyteller',
    genre: 'Afro-soul / R&B',
    bio: 'Nviiri the Storyteller is a gifted singer-songwriter whose music weaves personal narratives with rich African soundscapes. His debut album established him as a major voice in Kenyan music.',
    initials: 'NT',
    featured: true,
    instagramUrl: 'https://www.instagram.com/nviirithestoryteller',
  },
  {
    slug: 'jovial',
    name: 'Jovial',
    genre: 'Afro-pop / Dance',
    bio: 'Jovial is one of Kenya\'s brightest female artists, known for her infectious energy and danceable Afro-pop anthems. Her collaborations with top African producers have given her continental reach.',
    initials: 'JV',
    featured: true,
    instagramUrl: 'https://www.instagram.com/jovialkenya',
  },
  {
    slug: 'femi-one',
    name: 'Femi One',
    genre: 'Hip-Hop / Gengetone',
    bio: 'Femi One is Kenya\'s queen of rap. A pioneer in the Gengetone movement, she has consistently broken barriers for women in Kenyan hip-hop with her fierce lyricism and bold artistry.',
    initials: 'FO',
    instagramUrl: 'https://www.instagram.com/femione254',
  },
  {
    slug: 'otile-brown',
    name: 'Otile Brown',
    genre: 'Bongo Flava / R&B',
    bio: 'Otile Brown is a Mombasa-born singer who has mastered the art of romantic Bongo Flava. His smooth vocals and heartfelt lyrics have made him one of East Africa\'s most beloved artists.',
    initials: 'OB',
    instagramUrl: 'https://www.instagram.com/otilebrown',
    youtubeUrl: 'https://www.youtube.com/@OtileBrown',
  },
  {
    slug: 'willy-paul',
    name: 'Willy Paul',
    genre: 'Gospel / Afro-pop',
    bio: 'Willy Paul Msafi is a multi-award-winning gospel and Afro-pop artist from Nairobi. His crossover appeal and prolific output have made him one of Kenya\'s most streamed artists.',
    initials: 'WP',
    instagramUrl: 'https://www.instagram.com/willypaulmsafi',
  },
  {
    slug: 'tanasha-donna',
    name: 'Tanasha Donna',
    genre: 'Afro-pop / R&B',
    bio: 'Tanasha Donna is a singer, model and media personality who has carved out a unique space in Kenyan music. Her Afro-pop sound and international collaborations have given her a global following.',
    initials: 'TD',
    instagramUrl: 'https://www.instagram.com/tanashadonna',
  },
  {
    slug: 'rekles',
    name: 'Rekles',
    genre: 'Hip-Hop / Trap',
    bio: 'Rekles is one half of the legendary Ethic Entertainment crew and a solo force in Kenyan trap music. His raw storytelling and street-level authenticity resonate deeply with Kenyan youth.',
    initials: 'RK',
    instagramUrl: 'https://www.instagram.com/rekles254',
  },
  {
    slug: 'bensoul',
    name: 'Bensoul',
    genre: 'Afro-soul / Neo-soul',
    bio: 'Bensoul is a gifted multi-instrumentalist and singer-songwriter from Nairobi. His neo-soul sound, influenced by both African and Western music, has earned him critical acclaim across the continent.',
    initials: 'BS',
    instagramUrl: 'https://www.instagram.com/bensoulmusic',
  },
  {
    slug: 'nikita-kering',
    name: 'Nikita Kering',
    genre: 'Afro-pop / Pop',
    bio: 'Nikita Kering is a teenage prodigy who burst onto the Kenyan music scene with her powerful voice and mature songwriting. She is one of Africa\'s most exciting young talents.',
    initials: 'NK',
    featured: true,
    instagramUrl: 'https://www.instagram.com/nikitakering',
  },
];

export function getArtistBySlug(slug: string): Artist | undefined {
  return artists.find((a) => a.slug === slug);
}

export function getFeaturedArtists(): Artist[] {
  return artists.filter((a) => a.featured);
}
