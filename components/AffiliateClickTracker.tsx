'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/gtm';

/**
 * Site-wide conversion tracking for affiliate purchase clicks. A single
 * delegated listener catches every click on an `<a href="/api/go/...">` buy
 * button (brand pages, calculators, mobile banners, the action hub, provider
 * cards) and pushes a `purchase_click` event to the GTM dataLayer — no need to
 * wire each button individually. Purely additive; touches no lead/API logic.
 */
export default function AffiliateClickTracker() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.('a[href^="/api/go/"]') as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute('href') ?? '';
      const provider = href.split('/api/go/')[1]?.split(/[?#/]/)[0] ?? 'unknown';
      trackEvent('purchase_click', { provider, href });
    };
    document.addEventListener('click', handler, { capture: true });
    return () => document.removeEventListener('click', handler, { capture: true });
  }, []);

  return null;
}
