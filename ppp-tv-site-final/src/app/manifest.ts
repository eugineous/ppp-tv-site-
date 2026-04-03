import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PPP TV Kenya',
    short_name: 'PPP TV',
    description: "Kenya's #1 Entertainment Channel — StarTimes 430",
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#FF007A',
    icons: [
      { src: '/icon.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
