/**
 * Lightweight Google Tag Manager helper — no external dependency, SSR-safe.
 * The GTM container itself is injected once in app/layout.tsx via next/script.
 */

/**
 * GTM container. A container ID is public by nature (it ships in every page
 * that loads it); the env var still wins. Loaded only after cookie consent —
 * see lib/consent.ts.
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-MLJZ6T87';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Push an arbitrary object onto the GTM dataLayer (no-op on the server). */
export function pushToDataLayer(payload: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}

/**
 * Track a named conversion event (e.g. 'generate_lead', 'click_call').
 */
export function trackEvent(
  event: string,
  params: Record<string, unknown> = {},
): void {
  pushToDataLayer({ event, ...params });
}
