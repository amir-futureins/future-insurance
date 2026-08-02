'use client';

import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { TrustBar, SiteFooter } from '@/components/travel/Sections';
import WhatsAppFloat from '@/components/travel/WhatsAppFloat';
import MobileStickyBar from '@/components/travel/MobileStickyBar';
import SideActionDock from '@/components/travel/SideActionDock';
import QuickActionDock from '@/components/QuickActionDock';
import MarketTicker from '@/components/MarketTicker';
import AffiliateClickTracker from '@/components/AffiliateClickTracker';
import HarDisclaimer from '@/components/HarDisclaimer';

/**
 * Deferred widgets. None of these are needed to render or convert on first
 * paint, and together they were the largest client-side cost in the chrome — the
 * assistant alone carries an intent table, a chat surface and the lead form.
 * ssr:false keeps them out of the server payload entirely; they mount after
 * hydration, so the initial HTML and the critical path stay small.
 *
 * AccessibilityMenu is deliberately NOT ssr:false. It is still code-split into
 * its own chunk, but it keeps server-rendering so the accessibility entry point
 * exists in the initial HTML rather than appearing only once JS has run — that
 * entry point is a compliance surface (תקן ישראלי 5568), not a marketing widget.
 * Note this only changes how SiteChrome loads it; /fly imports the component
 * directly and is completely unaffected.
 */
const AccessibilityMenu = dynamic(() => import('@/components/travel/AccessibilityMenu'));
const AiAssistantWidget = dynamic(() => import('@/components/AiAssistantWidget'), { ssr: false });
const ExitIntentPopup = dynamic(() => import('@/components/ExitIntentPopup'), { ssr: false });
const SocialProof = dynamic(() => import('@/components/travel/SocialProof'), { ssr: false });
const SocialProofToast = dynamic(() => import('@/components/SocialProofToast'), { ssr: false });
const StickyLeftGovCTA = dynamic(() => import('@/components/StickyLeftGovCTA'), { ssr: false });

/**
 * SiteChrome — wraps page content with the public marketing chrome (navbar,
 * ticker, footer) and all floating widgets. Internal tools under /admin get a
 * bare canvas: no public nav/ticker/footer and none of the conversion floats,
 * which would otherwise overlap the dashboard.
 *
 * Routes that must not inherit the chrome at all (currently /fly) are placed
 * OUTSIDE the app/(site) route group instead of being special-cased here. A
 * pathname comparison cannot work for them: middleware rewrites "/" on the fly
 * host to /fly, so the client-visible pathname stays "/" and any check here
 * would silently fail, rendering the chrome on top of that page.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/';
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <div id="a11y-content">{children}</div>;
  }

  return (
    <>
      {/* a11y toolbar applies visual filters/zoom to this scope only */}
      <div id="a11y-content">
        <TrustBar />
        <MarketTicker />
        {children}
        <HarDisclaimer />
        <SiteFooter />
      </div>

      {/* floating widgets stay outside #a11y-content so the toolbar itself
          is never inverted/grayscaled */}
      <AccessibilityMenu />
      <SocialProof />
      <WhatsAppFloat />
      <SideActionDock />
      <QuickActionDock />
      <MobileStickyBar />
      <AiAssistantWidget />
      <ExitIntentPopup />
      <SocialProofToast />
      <StickyLeftGovCTA />
      <AffiliateClickTracker />
    </>
  );
}
