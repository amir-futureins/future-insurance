'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { TrustBar, SiteFooter } from '@/components/travel/Sections';
import AccessibilityMenu from '@/components/travel/AccessibilityMenu';
import SocialProof from '@/components/travel/SocialProof';
import WhatsAppFloat from '@/components/travel/WhatsAppFloat';
import MobileStickyBar from '@/components/travel/MobileStickyBar';
import SideActionDock from '@/components/travel/SideActionDock';
import QuickActionDock from '@/components/QuickActionDock';
import MarketTicker from '@/components/MarketTicker';
import AiAssistantWidget from '@/components/AiAssistantWidget';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import SocialProofToast from '@/components/SocialProofToast';
import StickyLeftGovCTA from '@/components/StickyLeftGovCTA';
import AffiliateClickTracker from '@/components/AffiliateClickTracker';
import HarDisclaimer from '@/components/HarDisclaimer';

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
      {/* Mobile float ladder (<lg), measured from the safe-area-adjusted bottom
          so nothing collides and nothing hides under the iOS home indicator:
            MobileStickyBar   0      → ~3.9rem
            AccessibilityMenu 5.5rem → ~8.75rem
            AiAssistantWidget 9.5rem → ~12.9rem
            StickyLeftGovCTA  13.5rem (md+)
            SocialProofToast  17.5rem (md+)
          Each offset is written as a literal here / in the component so Tailwind
          can generate it. Desktop (lg+) positions are unchanged. */}
      <AccessibilityMenu offsetClass="bottom-[calc(env(safe-area-inset-bottom)_+_5.5rem)] left-4 lg:bottom-24 lg:left-auto lg:start-5" />
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
