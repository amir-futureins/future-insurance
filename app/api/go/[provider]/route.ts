import { NextResponse, type NextRequest } from 'next/server';

/**
 * Affiliate redirect for the fly.amirs.co.il landing page (/fly) only.
 * On futureins.co.il middleware 301s every /api/go/* request to il-ins.co.il
 * before it reaches this handler, so no carrier redirect is reachable there.
 *
 * Set AFFILIATE_PASSPORTCARD in Vercel to rotate the link without a code change.
 */
const AFFILIATE_LINKS: Record<string, string> = {
  passportcard:
    process.env.AFFILIATE_PASSPORTCARD ||
    'https://buy.passportcard.co.il/?AffiliateId=2DkWayfgtrbuvOT4pvIytA%3D%3D',
};

const FALLBACK = 'https://il-ins.co.il/';

export function GET(_req: NextRequest, { params }: { params: { provider: string } }) {
  const key = params.provider?.toLowerCase() ?? '';
  // Redirect to the EXACT partner string — no re-serialization, so encoded
  // tracking params and #fragments survive untouched.
  return NextResponse.redirect(AFFILIATE_LINKS[key] ?? FALLBACK, 302);
}
