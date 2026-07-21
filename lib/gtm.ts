/**
 * Lightweight Google Tag Manager helper — no external dependency, SSR-safe.
 * The GTM container itself is injected once in app/layout.tsx via next/script.
 */

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? '';

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
 * Track a named conversion event. Used for the provider CTAs
 * (e.g. 'click_passportcard', 'click_harel').
 */
export function trackEvent(
  event: string,
  params: Record<string, unknown> = {},
): void {
  pushToDataLayer({ event, ...params });
}
