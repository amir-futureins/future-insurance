import { NextResponse, type NextRequest } from 'next/server';

/**
 * Native Next.js affiliate redirect handler — no external PHP/WordPress.
 * Keeps outbound links off the page source (so they're easy to rotate) and
 * gives a single place to track clicks (see components/AffiliateClickTracker).
 *
 * The real partner deep-links are baked in as env-overridable defaults, so the
 * funnel works in production with zero env config; set AFFILIATE_* in Vercel to
 * rotate any link WITHOUT a code change.
 */
const AFFILIATE_LINKS: Record<string, string | undefined> = {
  passportcard:
    process.env.AFFILIATE_PASSPORTCARD ||
    'https://buy.passportcard.co.il/?AffiliateId=2DkWayfgtrbuvOT4pvIytA%3D%3D',
  harel:
    process.env.AFFILIATE_HAREL ||
    'https://digital.harel-group.co.il/travel-policy/?guid=bee1d408-c6a7-410e-b4ee-ac690224bdd3&an=82377',
  migdal: process.env.AFFILIATE_MIGDAL,
  clal:
    process.env.AFFILIATE_CLAL ||
    'https://www.clalbit.co.il/travelingisurance/claltravel/?txtCompID=1&txtItemID=8f385a90-e66a-486a-9051-b0927f303fb8#/travelinsurance/agentStep',
};

/** Verified public portals — fallback only when no affiliate deep-link exists. */
const DEFAULT_PORTALS: Record<string, string> = {
  passportcard: 'https://www.passportcard.co.il/',
  harel: 'https://www.harel-group.co.il/',
  migdal: 'https://www.migdal.co.il/',
  clal: 'https://www.clalbit.co.il/',
};

const FALLBACK = 'https://futureins.co.il/';

export function GET(_req: NextRequest, { params }: { params: { provider: string } }) {
  const key = params.provider?.toLowerCase() ?? '';
  const affiliate = AFFILIATE_LINKS[key];

  // Affiliate deep-links carry their own tracking params (encoded values like
  // %3D%3D, and SPA #fragments). Redirect to the EXACT string — no URL parsing/
  // re-serialization and no UTM appended — so nothing in the partner URL breaks.
  if (affiliate) {
    return NextResponse.redirect(affiliate, 302);
  }

  // Default public portal — safe to append our first-party UTM tags.
  let url: URL;
  try {
    url = new URL(DEFAULT_PORTALS[key] || FALLBACK);
  } catch {
    url = new URL(FALLBACK);
  }
  url.searchParams.set('utm_source', 'futureins');
  url.searchParams.set('utm_medium', 'affiliate');
  url.searchParams.set('utm_campaign', 'travel-hub');
  return NextResponse.redirect(url, 302);
}
