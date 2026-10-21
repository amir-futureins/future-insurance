import { NextResponse, type NextRequest } from 'next/server';

/**
 * Edge middleware, dispatched by hostname then path:
 *
 * 1. fly.amirs.co.il is retired — every request 301s to il-ins.co.il.
 * 2. On futureins.co.il, the old /fly and /api/go/* URLs 301 to il-ins.co.il.
 * 3. HTTP Basic-Auth gate for the internal admin tools (/admin/*) and for any
 *    non-POST request to /api/leads. Credentials come from ADMIN_USER +
 *    ADMIN_PASSWORD; if they are NOT configured the section is locked
 *    (fail-closed), never left open.
 *
 * NOTE — this file deliberately exports no route-matcher config object.
 * An earlier revision declared one holding a negative-lookahead pattern; it
 * compiled locally but failed the Vercel build with
 * `Error: Unhandled type: "ColonToken"`. With no matcher the middleware runs
 * on every request, and isInternal() filters framework internals and static
 * files in plain JavaScript first.
 *
 * Runs on the Edge runtime, so it uses the Web `atob` (Buffer isn't available).
 */

/** Retired travel landing host — redirected wholesale. Env-overridable. */
const FLY_HOST = (process.env.FLY_HOST || 'fly.amirs.co.il').toLowerCase();

/** Travel insurance lives here now (fly host + old travel URLs). */
const TRAVEL_SITE = 'https://il-ins.co.il/';

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

  /* ---- 1. fly.amirs.co.il is retired: every path (static files included)
     301s to the travel site's home page ---- */
  if (requestHost(req) === FLY_HOST) {
    return NextResponse.redirect(TRAVEL_SITE, 301);
  }

  /* Framework internals and static files pass through untouched. */
  if (isInternal(pathname)) return NextResponse.next();

  /* ---- 2. futureins.co.il: old travel landing / affiliate URLs ----
     /fly and /api/go/* no longer exist; old links and ads land on the
     travel site instead of a 404. */
  if (pathname === '/fly' || pathname.startsWith('/fly/') || pathname.startsWith('/api/go')) {
    return NextResponse.redirect(TRAVEL_SITE, 301);
  }

  /* Leads API: the GET (list) handler is admin-only, same gate as /admin/*.
     POST stays public — the site's own lead forms submit to it. */
  const isLeadsRead = pathname.startsWith('/api/leads') && req.method !== 'POST';

  /* Public routes pass straight through; only admin reads reach the auth gate. */
  if (!pathname.startsWith('/admin') && !isLeadsRead) return NextResponse.next();

  /* ---- 3. Basic-Auth gate for /admin/* and /api/leads reads ---- */
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
