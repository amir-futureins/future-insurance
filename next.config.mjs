/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // Keep the client bundle lean for PageSpeed 100 — tree-shake Lucide icons.
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
      preventFullImport: true,
    },
  },

  /**
   * Baseline security headers on every route.
   *
   * SAMEORIGIN rather than DENY: the site must stay embeddable by our own
   * origins (preview frames, the agent landing host) — DENY would also block
   * that. It does not affect US embedding third parties, so the YouTube embed in
   * VideoBlock is unaffected.
   *
   * No Content-Security-Policy here on purpose: GTM injects inline scripts at
   * runtime, so a CSP would need a nonce pipeline through the GTM snippet. Added
   * blind it would silently kill analytics — worth doing, but as its own change
   * with a Report-Only rollout first.
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
          },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
