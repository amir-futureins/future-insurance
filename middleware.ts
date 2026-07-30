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
  /**
   * Everything except Next internals and files with an extension. The broad
   * matcher is required so the fly host can be confined to its landing page
   * (see below); on the main host any path that is not /admin/* returns
   * NextResponse.next() before reaching the auth gate, so the public site can
   * never be locked by this middleware.
   */
  matcher: ['/((?!_next/static|_next/image|_next/data|favicon\\.ico|.*\\.[\\w]+$).*)'],
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
    // goes back to the single canonical landing URL. Redirecting /fly itself is
    // safe and cannot loop: the redirect lands on "/", which is then rewritten
    // internally (the browser never requests /fly again).
    // Built as a plain string rather than by mutating a cloned NextURL, whose
    // host/port setters keep the original port and emitted a Location like
    // https://fly.amirs.co.il:3000/ when running behind a proxy.
    // x-forwarded-* keeps the visitor on the public host and scheme; without
    // them (local dev) the request's own host — including its port — is reused.
    const first = (v: string | null) => v?.split(',')[0].trim() || '';
    const host = first(req.headers.get('x-forwarded-host')) || req.nextUrl.host;
    const proto =
      first(req.headers.get('x-forwarded-proto')) ||
      req.nextUrl.protocol.replace(':', '');
    return NextResponse.redirect(`${proto}://${host}/`, 308);
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
