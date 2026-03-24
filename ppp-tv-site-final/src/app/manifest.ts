import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PPP TV Kenya',
    short_name: 'PPP TV',
    description: "Africa's Entertainment Hub — StarTimes Channel 430",
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#FF007A',
    orientation: 'portrait',
    lang: 'en-KE',
    categories: ['news', 'entertainment'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
