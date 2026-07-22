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
import HarDisclaimer from '@/components/HarDisclaimer';

/**
 * SiteChrome — wraps page content with the public marketing chrome (navbar,
 * ticker, footer) and all floating widgets. Internal tools under /admin get a
 * bare canvas: no public nav/ticker/footer and none of the conversion floats,
 * which would otherwise overlap the dashboard.
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
    </>
  );
}
