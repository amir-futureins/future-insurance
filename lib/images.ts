/**
 * Curated, verified travel imagery (Unsplash). IDs are validated to resolve;
 * served through next/image (see next.config.mjs remotePatterns) so they are
 * optimised to AVIF/WebP with responsive sizes.
 */

export function unsplash(id: string, w = 1200, q = 68): string {
  // Force JPEG at the source so heavy PNG originals don't bloat the optimizer
  // input; next/image re-encodes to AVIF/WebP for delivery.
  return `https://images.unsplash.com/photo-${id}?fm=jpg&fit=crop&w=${w}&q=${q}`;
}

export const IMG = {
  europe: '1502602898657-3e91760cbb34', // Paris skyline
  usa: '1496442226666-8d4d0e62e6e9', // NYC
  asia: '1540959733332-eab4deabeeaf', // Tokyo
  flight: '1436491865332-7a61a109cc05', // airplane wing over clouds
  beach: '1507525428034-b723cf961d3e', // tropical beach
  ski: '1551698618-1dfe5d97d256', // ski / winter
  mountains: '1454496522488-7a8e488e8606', // alpine hiking
  passport: '1488646953014-85cb44e25828', // map + passport
  family: '1502920917128-1aa500764cbd', // family travel
  airport: '1530521954074-e64f6810b32d', // airport terminal
  roadtrip: '1488085061387-422e29b40080', // road trip
  aurora: '1493246507139-91e8fad9978e', // aurora / nature
} as const;

export type ImageKey = keyof typeof IMG;
