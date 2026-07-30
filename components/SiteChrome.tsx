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
 * ticker, footer) and all floating widgets.
 *
 * Two route groups get a bare canvas instead:
 *   /admin/* — internal tools; the conversion floats would overlap the dashboard.
 *   /fly     — the standalone agent landing page served at the root of
 *              fly.amirs.co.il. It is a self-contained funnel with its own
 *              header, footer and widgets, so the Future Insurance chrome must
 *              not appear on that host — and inheriting it would also stack two
 *              WhatsApp buttons, two accessibility menus and two sticky bars.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/';
  const isBare = pathname.startsWith('/admin') || pathname === '/fly';

  if (isBare) {
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
