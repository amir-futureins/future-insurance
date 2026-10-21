import { GTM_ID } from './gtm';

/**
 * Cookie consent — Google Consent Mode v2, opt-in (Amendment 13 to the
 * Privacy Protection Law).
 *
 * Every Google storage signal defaults to "denied", and the GTM container
 * itself is only injected after the visitor clicks "אישור". Before that no
 * Google tag runs, so no /collect request leaves the browser. Events pushed
 * earlier (e.g. generate_lead) wait in window.dataLayer and are processed as
 * soon as GTM loads.
 */

export const CONSENT_KEY = 'fi_cookie_consent_v1';
export type ConsentChoice = 'all' | 'essential';

/**
 * Inline <head> bootstrap — runs before any other script. Sets the denied
 * defaults, and re-applies a stored "all" choice (update + GTM load) so a
 * returning visitor who already agreed is measured without a new banner.
 */
export const CONSENT_BOOTSTRAP = `(function(w,d){
w.dataLayer=w.dataLayer||[];w.gtag=w.gtag||function(){w.dataLayer.push(arguments);};
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
w.__loadGTM=function(){if(w.__gtmLoaded)return;w.__gtmLoaded=1;
w.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var s=d.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtm.js?id=${GTM_ID}';d.head.appendChild(s);};
var c=null;try{c=localStorage.getItem('${CONSENT_KEY}');}catch(e){}
if(c==='all'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});w.__loadGTM();}
})(window,document);`;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __loadGTM?: () => void;
  }
}

export function readConsent(): ConsentChoice | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'all' || v === 'essential' ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: ConsentChoice): void {
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    /* storage blocked — the choice still applies for this page view */
  }
  const g = choice === 'all' ? 'granted' : 'denied';
  window.gtag?.('consent', 'update', {
    ad_storage: g,
    ad_user_data: g,
    ad_personalization: g,
    analytics_storage: g,
  });
  if (choice === 'all') window.__loadGTM?.();
}
