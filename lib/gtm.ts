/**
 * Lightweight Google Tag Manager helper — no external dependency, SSR-safe.
 * The GTM container itself is injected once in app/layout.tsx via next/script.
 */

/**
 * GTM container.
 *
 * The fallback exists because app/layout.tsx renders the container ONLY when
 * this is non-empty, and the environment serving fly.amirs.co.il had no
 * NEXT_PUBLIC_GTM_ID set — so GTM (and therefore every dataLayer event on the
 * landing page) was silently dead in production while futureins.co.il, which
 * does have the var, loaded GTM-MLJZ6T87 normally.
 *
 * A container ID is public by nature — it ships in the HTML of every page that
 * loads it — so defaulting to it leaks nothing. The env var still wins, so any
 * environment can point at a different container. Setting NEXT_PUBLIC_GTM_ID
 * explicitly in Vercel for BOTH domains is still the correct end state; this
 * only stops a missing var from silently disabling all measurement.
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
 * Track a named conversion event. Used for the provider CTAs
 * (e.g. 'click_passportcard', 'click_harel').
 */
export function trackEvent(
  event: string,
  params: Record<string, unknown> = {},
): void {
  pushToDataLayer({ event, ...params });
}
