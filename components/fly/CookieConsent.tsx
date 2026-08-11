'use client';

import { useEffect, useState } from 'react';

/**
 * Cookie-consent notice for the /fly landing page.
 *
 * Position — it floats ABOVE the page's other fixed furniture rather than
 * sitting flush to the bottom edge, because three things already occupy that
 * corner and one of them must never be covered:
 *
 *            mobile (<lg)              desktop (lg+)
 *   buy bar  bottom 12px → 68px        bottom 12px → 68px (centred, 540px)
 *   whatsapp bottom 80px → 134px       bottom 96px → 150px
 *   a11y     bottom 80px → 132px       bottom 96px → 148px
 *
 * The accessibility button lives in the SHARED components/travel/Accessibility-
 * Menu (z-[70], used across the whole site), so it cannot be nudged for this
 * route alone — and obscuring it would breach IS 5568. Clearing the stack
 * entirely is therefore the only placement that needs no change to shared code:
 * bottom-36 (144px) on mobile and lg:bottom-44 (176px) from lg up both start
 * above the tallest neighbour. z-[65] keeps the notice over the purchase bar
 * (z-40) while still passing under the accessibility toolbar (z-[70]).
 *
 * The privacy policy is section 5 of /terms, linked ABSOLUTELY: middleware.ts
 * redirects every non-root path on fly.amirs.co.il back to "/", so a relative
 * "/terms" href would bounce the visitor to this landing page instead.
 */

const STORAGE_KEY = 'fly:cookie-consent';
const PRIVACY_URL = 'https://futureins.co.il/terms';

export default function CookieConsent() {
  /* Starts hidden and is revealed from an effect: localStorage does not exist
     while the page is prerendered, so reading it during render would make the
     server and first client render disagree and trigger a hydration error. */
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== 'accepted') setVisible(true);
    } catch {
      // Storage blocked (private mode, cookies disabled). Showing the notice
      // without being able to remember the answer is the safer failure.
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {
      /* nothing to persist to — dismiss for this page view only */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="הודעה בדבר שימוש בקובצי עוגיות"
      className="no-print fixed inset-x-3 bottom-36 z-[65] mx-auto max-w-[540px] rounded-2xl border border-navy/10 bg-white/95 p-3.5 shadow-[0_12px_32px_rgba(15,23,42,0.20)] backdrop-blur lg:bottom-44"
    >
      <p className="text-[12px] leading-relaxed text-muted">
        אתר זה עושה שימוש בקובצי עוגיות (Cookies) כדי לשפר את חווית הגלישה ולהתאים עבורך
        תוכן. בהמשך הגלישה באתר הנך מסכים{' '}
        <a
          href={PRIVACY_URL}
          target="_blank"
          rel="noopener"
          className="font-bold text-pc underline underline-offset-2"
        >
          למדיניות הפרטיות
        </a>{' '}
        שלנו.
      </p>

      <button
        type="button"
        onClick={accept}
        className="mt-2.5 w-full rounded-xl bg-navy-deep px-4 py-2.5 text-[13px] font-extrabold text-white transition-colors hover:bg-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy sm:w-auto sm:px-6"
      >
        אישור / הבנתי
      </button>
    </div>
  );
}
