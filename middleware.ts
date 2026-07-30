import { NextResponse, type NextRequest } from 'next/server';

/**
 * Edge middleware. Two unrelated jobs, dispatched by path:
 *
 * 1. Host-scoped landing page — a request for "/" on the fly host is rewritten
 *    to /fly, so fly.amirs.co.il shows the travel-insurance landing page while
 *    futureins.co.il keeps serving the main site's homepage untouched.
 * 2. HTTP Basic-Auth gate for the internal admin tools (/admin/*). Credentials
 *    come from env vars — set ADMIN_USER + ADMIN_PASSWORD in Vercel (and
 *    .env.local for local dev). If they are NOT configured the section is
 *    locked (fail-closed), never left open.
 *
 * Runs on the Edge runtime, so it uses the Web `atob` (Buffer isn't available).
 */
export const config = {
  // "/" is matched only for the host rewrite below. Any path that is not
  // /admin/* returns NextResponse.next() before reaching the auth gate, so the
  // public homepage can never be locked by this middleware.
  matcher: ['/', '/admin/:path*'],
};

/** Hostname that serves the /fly landing page at its root. Env-overridable. */
const FLY_HOST = (process.env.FLY_HOST ?? 'fly.amirs.co.il').toLowerCase();

/**
 * Public hostname of the request. x-forwarded-host is preferred because behind
 * Vercel's proxy `host` can be the internal deployment hostname, which would
 * never match the custom domain. Port and casing are stripped so a value like
 * "FLY.amirs.co.il:443" still matches.
 */
function requestHost(req: NextRequest): string {
  const raw = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '';
  return raw.split(',')[0].split(':')[0].trim().toLowerCase();
}

function unauthorized(): NextResponse {
  return new NextResponse('נדרשת הזדהות לאזור הניהול.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Future Insurance Admin", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  });
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* ---- 1. fly.amirs.co.il/ → /fly (rewrite: the URL stays on the fly host) ---- */
  if (pathname === '/' && requestHost(req) === FLY_HOST) {
    const url = req.nextUrl.clone();
    url.pathname = '/fly';
    return NextResponse.rewrite(url);
  }

  /* Public routes pass straight through; only /admin/* reaches the auth gate. */
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  /* ---- 2. Basic-Auth gate for /admin/* ---- */
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  // Fail-closed: with no credentials configured, admin stays locked for everyone.
  if (!user || !pass) return unauthorized();

  const header = req.headers.get('authorization') ?? '';
  const [scheme, encoded] = header.split(' ');
  if (scheme === 'Basic' && encoded) {
    try {
      const decoded = atob(encoded);
      const sep = decoded.indexOf(':');
      const u = decoded.slice(0, sep);
      const p = decoded.slice(sep + 1);
      if (u === user && p === pass) return NextResponse.next();
    } catch {
      /* malformed header → fall through to 401 */
    }
  }

  return unauthorized();
}
