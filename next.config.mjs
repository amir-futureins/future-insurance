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
  async redirects() {
    return [
      // /privacy is published as a statutory footer link but has no page of its
      // own — the privacy policy is section 5 of /terms, whose title is
      // "תקנון ותנאי שימוש ומדיניות פרטיות". Without this the compliance
      // footer would ship a 404. Temporary (307) on purpose: if a dedicated
      // privacy page is ever written, a permanent redirect would already be
      // cached in visitors' browsers and would be painful to undo.
      { source: '/privacy', destination: '/terms', permanent: false },

      // Travel insurance moved to il-ins.co.il. Explicit 301s (not Next's
      // default 308 for `permanent`) so search engines and ad crawlers treat
      // them as classic permanent moves. Specific carriers first.
      { source: '/travel-insurance/harel', destination: 'https://il-ins.co.il/harel/', statusCode: 301 },
      { source: '/travel-insurance/clal', destination: 'https://il-ins.co.il/clal/', statusCode: 301 },
      { source: '/travel-insurance/passportcard', destination: 'https://il-ins.co.il/passportcard/', statusCode: 301 },
      { source: '/travel-insurance/:path*', destination: 'https://il-ins.co.il/', statusCode: 301 },
      // The travel guides were all travel-insurance articles.
      { source: '/guides/:path*', destination: 'https://il-ins.co.il/', statusCode: 301 },
    ];
  },
};

export default nextConfig;
