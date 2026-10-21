'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { TrustBar, SiteFooter } from '@/components/travel/Sections';
import AccessibilityMenu from '@/components/travel/AccessibilityMenu';
import WhatsAppFloat from '@/components/travel/WhatsAppFloat';
import MobileStickyBar from '@/components/travel/MobileStickyBar';
import QuickActionDock from '@/components/QuickActionDock';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import StickyLeftGovCTA from '@/components/StickyLeftGovCTA';
import HarDisclaimer from '@/components/HarDisclaimer';
import CookieBanner from '@/components/CookieBanner';

/**
 * SiteChrome — wraps page content with the public marketing chrome (navbar,
 * footer) and all floating widgets. Internal tools under /admin get a
 * bare canvas: no public nav/footer and none of the conversion floats,
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
        {children}
        <HarDisclaimer />
        <SiteFooter />
      </div>

      {/* floating widgets stay outside #a11y-content so the toolbar itself
          is never inverted/grayscaled */}
      <AccessibilityMenu />
      <WhatsAppFloat />
      <QuickActionDock />
      <MobileStickyBar />
      <ExitIntentPopup />
      <StickyLeftGovCTA />
      <CookieBanner />
    </>
  );
}
