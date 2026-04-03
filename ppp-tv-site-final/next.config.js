/** @type {import('next').NextConfig} */

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://*.workers.dev https://*.supabase.co https://generativelanguage.googleapis.com https://integrate.api.nvidia.com",
      "frame-src https://www.youtube.com https://youtube.com",
      "media-src 'self' https:",
    ].join('; '),
  },
];

const nextConfig = {
  async redirects() {
    return [
      { source: '/politics', destination: '/', permanent: true },
      { source: '/news',     destination: '/', permanent: true },
      { source: '/health',   destination: '/', permanent: true },
      { source: '/science',  destination: '/', permanent: true },
      { source: '/business', destination: '/', permanent: true },
    ];
  },
  compress: true,
  poweredByHeader: false,

  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http',  hostname: '**' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 604800,   // 7 days — images rarely change
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [64, 128, 256, 384],
    dangerouslyAllowSVG: false,
    unoptimized: false,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
      {
        // Cache all page HTML for 5 min with stale-while-revalidate
        source: '/((?!api|_next).*)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=600' },
        ],
      },
    ];
  },

  experimental: {
    optimizePackageImports: ['date-fns', 'react', 'react-dom'],
    // Partial prerendering — serve shell instantly, stream content
    ppr: false, // keep off until stable
  },
};

module.exports = nextConfig;
