import { LeadModalProvider } from '@/components/travel/LeadModal';
import SiteChrome from '@/components/SiteChrome';

/**
 * Layout for the public Future Insurance site — everything reachable on
 * futureins.co.il. Owns the marketing chrome (navbar, ticker, footer), the
 * floating conversion widgets and the ambient aurora glows.
 *
 * This lives in the `(site)` route group rather than in the root layout so that
 * routes OUTSIDE the group — currently /fly, the standalone agent landing page
 * served at the root of fly.amirs.co.il — inherit none of it. That is a
 * structural guarantee: previously SiteChrome tried to opt out by comparing
 * usePathname() against '/fly', which silently failed on the fly host because
 * middleware REWRITES "/" to /fly, leaving the client-visible pathname as "/".
 * The chrome then rendered on top of the landing page. Route groups remove the
 * need to detect anything.
 *
 * Route groups do not affect URLs: app/(site)/page.tsx still serves "/".
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <LeadModalProvider>
      {/* ambient aurora glows (decorative, behind everything) */}
      {/* Static blurred blobs — kept still so they don't force the sticky
          navbar / glass surfaces to re-composite their backdrop every frame. */}
      <div
        aria-hidden
        className="no-print pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-32 end-[-8rem] h-[520px] w-[520px] rounded-full bg-glow-gold opacity-50 blur-3xl" />
        <div className="absolute bottom-[-10rem] start-[-8rem] h-[560px] w-[560px] rounded-full bg-glow-navy opacity-40 blur-3xl" />
      </div>

      <SiteChrome>{children}</SiteChrome>
    </LeadModalProvider>
  );
}
