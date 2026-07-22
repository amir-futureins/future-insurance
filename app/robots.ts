import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/content';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // API + affiliate redirect handlers should never be crawled/indexed.
      disallow: ['/api/'],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
