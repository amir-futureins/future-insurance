import type { MetadataRoute } from 'next';
import { SITE, GUIDES } from '@/lib/content';

const BASE = SITE.url;
const TRAVEL_PROVIDERS = ['passportcard', 'harel', 'clal', 'migdal'];

/** Priority-tagged static routes (path, priority). */
const STATIC: Array<[string, number]> = [
  ['', 1.0],
  ['/travel-insurance', 0.9],
  ['/har-habituach', 0.9],
  ['/health', 0.8],
  ['/finance', 0.8],
  ['/mortgage', 0.8],
  ['/life', 0.8],
  ['/business-insurance', 0.8],
  ['/har-habituach/duplicate-check', 0.7],
  ['/har-habituach/car-claims', 0.7],
  ['/mortgage/structure', 0.7],
  ['/accessibility', 0.3],
  ['/terms', 0.3],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = STATIC.map(([path, priority]) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: priority >= 0.9 ? 'weekly' : 'monthly',
    priority,
  }));

  for (const slug of TRAVEL_PROVIDERS) {
    routes.push({
      url: `${BASE}/travel-insurance/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  for (const g of GUIDES) {
    routes.push({
      url: `${BASE}/guides/${g.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return routes;
}
