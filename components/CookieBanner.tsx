'use client';

import { useEffect, useState } from 'react';
import { readConsent, saveConsent, type ConsentChoice } from '@/lib/consent';

/**
 * Opt-in cookie banner ("אישור" / "דחייה"). Shown until the visitor chooses;
 * any element with [data-cookie-settings] (the footer's "הגדרות עוגיות")
 * reopens it. Withdrawing a previous "אישור" reloads the page so the already
 * loaded GTM container is dropped, not just told to stop storing cookies.
 */
export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!readConsent()) setOpen(true);
    const onClick = (e: MouseEvent) => {
      const el = e.target as Element | null;
      if (el?.closest?.('[data-cookie-settings]')) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const choose = (choice: ConsentChoice) => {
    const withdrew = choice === 'essential' && readConsent() === 'all';
    saveConsent(choice);
    setOpen(false);
    if (withdrew) window.location.reload();
  };

  if (!open) return null;

  return (
    <div
      role="region"
      aria-label="הודעה על שימוש בעוגיות"
      className="no-print fixed inset-x-3 bottom-20 z-[120] mx-auto max-w-2xl rounded-2xl border border-navy/10 bg-white p-4 shadow-2xl sm:bottom-4 lg:bottom-6"
    >
      <p className="text-[13.5px] leading-relaxed text-ink">
        <b>האתר משתמש בעוגיות</b> לתפעול האתר, ובכפוף להסכמתכם גם למדידה ולפרסום (Google).
        אפשר לשנות את הבחירה בכל עת דרך &quot;הגדרות עוגיות&quot; בתחתית העמוד.{' '}
        <a href="/terms" className="font-semibold text-gold-deep underline">
          למדיניות הפרטיות
        </a>
      </p>
      <div className="mt-3 flex gap-2.5">
        <button
          type="button"
          onClick={() => choose('all')}
          className="flex-1 rounded-xl bg-cta-fill px-4 py-2.5 text-[14px] font-extrabold text-navy-deep shadow-sm"
        >
          אישור
        </button>
        <button
          type="button"
          onClick={() => choose('essential')}
          className="flex-1 rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-[14px] font-bold text-ink"
        >
          דחייה
        </button>
      </div>
    </div>
  );
}
