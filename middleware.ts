import { NextResponse, type NextRequest } from 'next/server';

/**
 * Edge middleware. Two unrelated jobs, dispatched by hostname then path:
 *
 * 1. Host-scoped landing page — fly.amirs.co.il serves the standalone agent
 *    landing page (/fly) and nothing else, while futureins.co.il keeps serving
 *    the main site untouched.
 * 2. HTTP Basic-Auth gate for the internal admin tools (/admin/*). Credentials
 *    come from env vars — set ADMIN_USER + ADMIN_PASSWORD in Vercel (and
 *    .env.local for local dev). If they are NOT configured the section is
 *    locked (fail-closed), never left open.
 *
 * NOTE — this file deliberately exports no route-matcher config object.
 * An earlier revision declared one holding a negative-lookahead pattern, so the
 * middleware would run on every path except the framework internals. It
 * compiled locally but failed the Vercel build with
 * `Error: Unhandled type: "ColonToken"` while that pattern was being parsed.
 * With no matcher declared the middleware runs on every request instead, and the
 * same filtering happens below in plain JavaScript — startsWith and includes,
 * with no regular expressions and no path tokens left to mis-parse. isInternal()
 * is checked first, so an asset request costs only a few string comparisons.
 *
 * Runs on the Edge runtime, so it uses the Web `atob` (Buffer isn't available).
 */

/** Hostname that serves the /fly landing page at its root. Env-overridable. */
const FLY_HOST = (process.env.FLY_HOST || 'fly.amirs.co.il').toLowerCase();

/** First entry of a possibly comma-joined proxy header, trimmed. */
function headerValue(req: NextRequest, name: string): string {
  const raw = req.headers.get(name);
  if (!raw) return '';
  return raw.split(',')[0].trim();
}

/**
 * Public hostname of the request. x-forwarded-host is preferred because behind
 * Vercel's proxy `host` is the internal deployment hostname, which would never
 * match the custom domain. Port and casing are stripped so a value like
 * "FLY.amirs.co.il:443" still matches.
 */
function requestHost(req: NextRequest): string {
  const host = headerValue(req, 'x-forwarded-host') || headerValue(req, 'host');
  return host.split(':')[0].toLowerCase();
}

/**
 * Requests this middleware must never touch: framework internals and any file
 * with an extension (robots.txt, sitemap.xml, images, fonts...). Replaces the
 * negative-lookahead matcher that broke the Vercel build.
 */
function isInternal(pathname: string): boolean {
  if (pathname.startsWith('/_next/')) return true;
  if (pathname.startsWith('/_vercel/')) return true;
  const lastSegment = pathname.slice(pathname.lastIndexOf('/') + 1);
  return lastSegment.includes('.');
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
  const pathname = req.nextUrl.pathname;

  /* Framework internals and static files pass through untouched. */
  if (isInternal(pathname)) return NextResponse.next();

  /* ---- 1. The fly host serves the landing page and nothing else ---- */
  if (requestHost(req) === FLY_HOST) {
    // "/" renders /fly internally, so the address bar keeps the clean root URL.
    if (pathname === '/') {
      const url = req.nextUrl.clone();
      url.pathname = '/fly';
      return NextResponse.rewrite(url);
    }

    // Route handlers must keep working: /api/go/passportcard is the target of
    // every purchase CTA on the page, and /api/leads backs the contact forms.
    if (pathname.startsWith('/api/')) return NextResponse.next();

    // Anything else on this host — /health, /admin, a stray /fly typed by hand —
    // goes back to the single canonical landing URL. Redirecting /fly cannot
    // loop: it lands on "/", which is then rewritten internally, so the browser
    // never requests /fly again.
    //
    // Built as a plain string rather than by mutating a cloned NextURL, whose
    // host/port setters keep the original port and emitted a Location like
    // https://fly.amirs.co.il:3000/ from behind a proxy. x-forwarded-* keeps the
    // visitor on the public host and scheme; without them (local dev) the
    // request's own host, including its port, is reused.
    const host = headerValue(req, 'x-forwarded-host') || req.nextUrl.host;
    const forwardedProto = headerValue(req, 'x-forwarded-proto');
    const proto = forwardedProto || req.nextUrl.protocol.replace(':', '');
    return NextResponse.redirect(proto + '://' + host + '/', 308);
  }

  /* Public routes pass straight through; only /admin/* reaches the auth gate. */
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  /* ---- 2. Basic-Auth gate for /admin/* ---- */
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  // Fail-closed: with no credentials configured, admin stays locked for everyone.
  if (!user || !pass) return unauthorized();

  const header = req.headers.get('authorization') || '';
  const parts = header.split(' ');
  const scheme = parts[0];
  const encoded = parts[1];
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
