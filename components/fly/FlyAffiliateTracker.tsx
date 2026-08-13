'use client';

import { useEffect } from 'react';
import { pushToDataLayer } from '@/lib/gtm';

/**
 * Fires the PassportCard click-out conversion event for /fly.
 *
 * Delegated rather than per-button: the purchase CTAs live in a SERVER
 * component (app/fly/page.tsx) and one more sits inside FlyWidgets, so wiring
 * onClick to each would mean turning the whole page into a client component for
 * the sake of a single dataLayer push. One capture-phase listener on the
 * document covers every current and future affiliate link on the route.
 *
 * Capture phase, not bubble: the anchors have target="_blank", and in the
 * same-tab fallback case a bubble-phase listener can lose the race with
 * navigation. Capture runs before anything can cancel or redirect the event.
 *
 * Matched on the ROUTE (/api/go/passportcard) rather than the partner domain,
 * because that redirect is the only href the markup ever contains — the real
 * affiliate deep-link is resolved server-side and never appears in the DOM.
 */

const AFFILIATE_PATH = '/api/go/passportcard';

export default function FlyAffiliateTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;
      const anchor = target?.closest?.('a');
      if (!anchor) return;

      // getAttribute, not .href: the property resolves to an absolute URL,
      // which would stop this matching the relative path in the markup.
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith(AFFILIATE_PATH)) return;

      pushToDataLayer({
        event: 'passportcard_click_out',
        destination: 'passportcard',
      });
    }

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
