import { NextResponse, type NextRequest } from 'next/server';

/**
 * Native Next.js affiliate redirect handler — no external PHP/WordPress.
 * Keeps outbound links off the page source (so they are easy to rotate) and
 * gives a single place to append affiliate / UTM parameters and log clicks.
 *
 * Affiliate deep-links are read from env vars so the real partner URLs can be
 * dropped in WITHOUT a code change (set them in .env.local — see .env.example):
 *   AFFILIATE_PASSPORTCARD, AFFILIATE_HAREL, AFFILIATE_MIGDAL, AFFILIATE_CLAL
 * If a var is unset we fall back to the provider's verified public portal, so
 * the funnel always works even before affiliate contracts are wired.
 */
/** Verified public portals — used when no affiliate deep-link is configured. */
const DEFAULT_PORTALS: Record<string, string> = {
  passportcard: 'https://www.passportcard.co.il/',
  harel: 'https://www.harel-group.co.il/',
  migdal: 'https://www.migdal.co.il/',
  clal: 'https://www.clalbit.co.il/',
};

/** Real partner deep-links, when set (they carry their own tracking params). */
const AFFILIATE_LINKS: Record<string, string | undefined> = {
  passportcard: process.env.AFFILIATE_PASSPORTCARD,
  harel: process.env.AFFILIATE_HAREL,
  migdal: process.env.AFFILIATE_MIGDAL,
  clal: process.env.AFFILIATE_CLAL,
};

const FALLBACK = 'https://futureins.co.il/';

export function GET(
  _req: NextRequest,
  { params }: { params: { provider: string } },
) {
  const key = params.provider?.toLowerCase() ?? '';
  const affiliate = AFFILIATE_LINKS[key];
  const target = affiliate || DEFAULT_PORTALS[key] || FALLBACK;

  let url: URL;
  try {
    url = new URL(target);
  } catch {
    url = new URL(FALLBACK);
  }

  // Add our first-party UTM tags ONLY to default portals — never to a real
  // affiliate deep-link, so we can't clobber the partner's own tracking params.
  if (!affiliate) {
    url.searchParams.set('utm_source', 'futureins');
    url.searchParams.set('utm_medium', 'affiliate');
    url.searchParams.set('utm_campaign', 'travel-hub');
  }

  // 302 so the affiliate mapping can change without cache poisoning.
  return NextResponse.redirect(url, 302);
}
