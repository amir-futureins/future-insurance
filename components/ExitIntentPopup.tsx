'use client';

import { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/gtm';
import LeadForm from '@/components/LeadForm';

const STORAGE_KEY = 'futureins-exit-shown';

/**
 * Elegant conversion offer: fires on desktop exit-intent (mouse leaves toward
 * the top of the window) or, as a mobile-friendly fallback, after a delay.
 * Shown at most once per session. Reuses the shared LeadForm as the offer.
 */
export default function ExitIntentPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* ignore */
    }
    let fired = false;

    const fire = () => {
      if (fired) return;
      fired = true;
      try {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } catch {
        /* ignore */
      }
      setOpen(true);
      trackEvent('exit_intent_shown', {});
      cleanup();
    };

    const onMouseOut = (e: MouseEvent) => {
      // left the window through the top edge → intent to leave
      if (!e.relatedTarget && e.clientY <= 0) fire();
    };

    document.addEventListener('mouseout', onMouseOut);
    const timer = window.setTimeout(fire, 40000);

    function cleanup() {
      document.removeEventListener('mouseout', onMouseOut);
      window.clearTimeout(timer);
    }
    return cleanup;
  }, []);

  if (!open) return null;

  return (
    <LeadForm
      open
      onClose={() => setOpen(false)}
      vertical="exit_intent"
      title="בדיקת תיק ביטוחי מקיפה — ללא עלות"
      subtitle="רגע לפני שאתם עוזבים — נבדוק אם אתם משלמים יותר מדי או על כיסוי כפול. השאירו פרטים ונחזור אליכם."
      summary="בדיקה חינם · ללא התחייבות · חיסכון ממוצע של מאות ₪ בחודש"
    />
  );
}
