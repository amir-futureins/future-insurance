import { NextResponse, type NextRequest } from 'next/server';

/**
 * HTTP Basic-Auth gate for the internal admin tools (/admin/*).
 * Credentials come from env vars — set ADMIN_USER + ADMIN_PASSWORD in Vercel
 * (and .env.local for local dev). If they are NOT configured the section is
 * locked (fail-closed), never left open. Runs on the Edge runtime, so it uses
 * the Web `atob` (Buffer isn't available there).
 */
export const config = {
  matcher: ['/admin/:path*'],
};

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
