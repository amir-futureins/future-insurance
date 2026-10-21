import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/content';

const BASE = SITE.url;

/** Priority-tagged static routes (path, priority). */
const STATIC: Array<[string, number]> = [
  ['', 1.0],
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

  return STATIC.map(([path, priority]) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: priority >= 0.9 ? 'weekly' : 'monthly',
    priority,
  }));
}
