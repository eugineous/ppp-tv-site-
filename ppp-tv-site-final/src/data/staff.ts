import type { Staff } from '@/types';

export const staff: Staff[] = [
  {
    slug: 'eugine-micah-founder',
    name: 'Eugine Micah',
    role: 'Founder & CEO',
    bio: 'The visionary behind PPP TV Kenya. Eugine built the channel from the ground up with a mission to tell authentic African stories and amplify Kenyan voices on the continental stage.',
    initials: 'EM',
    department: 'on-air',
  },
  {
    slug: 'lucy-ogunde-anchor',
    name: 'Lucy Ogunde',
    role: 'Senior News Anchor',
    bio: 'Lucy brings warmth, authority and precision to every bulletin. With years of broadcast journalism experience, she is the trusted face of PPP TV\'s news coverage.',
    initials: 'LO',
    department: 'on-air',
  },
  {
    slug: 'bella-muziki-host',
    name: 'Bella Muziki',
    role: 'Youth & Lifestyle Presenter',
    bio: 'Bella connects with Kenya\'s youth through authentic storytelling and cultural commentary. She is the creative force behind Campus Xposure\'s digital strategy.',
    initials: 'BM',
    department: 'on-air',
  },
  {
    slug: 'vdj-jones-host',
    name: 'VDJ Jones',
    role: 'Drive Show Host & Music Director',
    bio: 'VDJ Jones curates the channel\'s music programming and hosts the flagship drive show. His industry connections ensure PPP TV always has the freshest sounds.',
    initials: 'VJ',
    department: 'on-air',
  },
  {
    slug: 'abiud-pararo-sports',
    name: 'Abiud Pararo',
    role: 'Head of Sports',
    bio: 'Abiud leads all sports coverage at PPP TV. His editorial vision has made Juu Ya Game the most-watched sports show on the channel.',
    initials: 'AP',
    department: 'on-air',
  },
  {
    slug: 'james-kariuki',
    name: 'James Kariuki',
    role: 'Head of Production',
    bio: 'James oversees all production operations at PPP TV Kenya. With a background in film and broadcast engineering, he ensures every show meets the highest technical standards.',
    initials: 'JK',
    department: 'behind-the-scenes',
  },
  {
    slug: 'amina-hassan',
    name: 'Amina Hassan',
    role: 'Digital Content Manager',
    bio: 'Amina manages PPP TV\'s digital presence across all platforms. She leads the team responsible for the website, social media and streaming strategy.',
    initials: 'AH',
    department: 'behind-the-scenes',
  },
  {
    slug: 'peter-njoroge',
    name: 'Peter Njoroge',
    role: 'Chief Cameraman',
    bio: 'Peter\'s eye for visual storytelling has defined the look of PPP TV Kenya. His work on location shoots and studio productions has won industry recognition.',
    initials: 'PN',
    department: 'behind-the-scenes',
  },
  {
    slug: 'grace-wanjiku',
    name: 'Grace Wanjiku',
    role: 'Graphics & Motion Designer',
    bio: 'Grace creates the visual identity of PPP TV Kenya. From on-screen graphics to social media assets, her design work keeps the brand fresh and modern.',
    initials: 'GW',
    department: 'behind-the-scenes',
  },
  {
    slug: 'david-omondi',
    name: 'David Omondi',
    role: 'Sound Engineer',
    bio: 'David ensures every broadcast sounds crystal clear. His expertise in live sound and post-production audio is the invisible backbone of PPP TV\'s quality output.',
    initials: 'DO',
    department: 'behind-the-scenes',
  },
];

export function getStaffByDepartment(department: Staff['department']): Staff[] {
  return staff.filter((s) => s.department === department);
}
