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
