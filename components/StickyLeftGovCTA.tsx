'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowLeft, X, ShieldCheck } from 'lucide-react';
import GovDataModal from '@/components/GovDataModal';

/**
 * StickyLeftGovCTA — left-edge Gov-data CTA that AUTO-COLLAPSES:
 *  • First ~3s (or until first scroll): fully expanded + glowing, so the offer
 *    registers immediately.
 *  • Then: collapses to a slim ~56px tab flush to left-0 (never covers the hero
 *    card, which starts ~123px in).
 *  • Hover / focus / tap: smoothly expands back out to read + interact.
 * Dismissible with a ✕ (persisted in sessionStorage).
 */
const showOn = (p: string) => p === '/' || p === '/health' || p.startsWith('/har-habituach');
const KEY = 'futureins-gov-tab';

export default function StickyLeftGovCTA() {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // set after the intro window
  const [active, setActive] = useState(false); // hover / focus / tap-to-expand

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY) === 'closed') setDismissed(true);
    } catch {
      /* private mode */
    }
    const t = window.setTimeout(() => setCollapsed(true), 3000);
    const onScroll = () => setCollapsed(true);
    window.addEventListener('scroll', onScroll, { once: true, passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const close = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(KEY, 'closed');
    } catch {
      /* ignore */
    }
  };

  if (!showOn(pathname) || dismissed) return null;

  const topic = pathname.startsWith('/har-habituach')
    ? 'har_gov_report'
    : pathname === '/health'
      ? 'health_gov'
      : 'home_gov';

  const expanded = !collapsed || active;

  const onClick = () => {
    if (!expanded) {
      setActive(true); // first tap expands (mobile has no hover)
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <div className="no-print fixed left-0 top-1/2 z-40 -translate-y-1/2">
        <button
          type="button"
          onClick={onClick}
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          aria-label="בדיקת עבר ביטוחי / הר הביטוח — ללא עלות"
          aria-expanded={expanded}
          dir="ltr"
          className={`flex items-center gap-2.5 overflow-hidden rounded-r-2xl py-3 pe-4 ps-3 text-navy-deep shadow-2xl shadow-amber-500/40 ring-1 ring-white/50 transition-[max-width] duration-300 ease-out animate-pulse-glow bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
            expanded ? 'max-w-[248px]' : 'max-w-[54px]'
          }`}
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy-deep/10">
            <ShieldCheck className="h-5 w-5" aria-hidden />
          </span>
          <div
            dir="rtl"
            className={`whitespace-nowrap text-start transition-opacity duration-200 ${
              expanded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="text-[13.5px] font-extrabold leading-snug">🛡️ בדיקת עבר ביטוחי / הר הביטוח</div>
            <div className="mt-0.5 text-[12px] font-bold text-navy-deep/90">🎁 ללא עלות וללא התחייבות!</div>
            <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-navy-deep px-2.5 py-0.5 text-[11px] font-extrabold text-gold-bright">
              ⚡ 2 דקות והדוח אצלך
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={close}
          aria-label="סגירת ההצעה"
          className="absolute -top-2.5 left-3 z-10 grid h-6 w-6 place-items-center rounded-full bg-navy-deep text-white shadow-md ring-2 ring-white transition-transform hover:scale-110"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>

      {open && <GovDataModal open onClose={() => setOpen(false)} topic={topic} title="הפקת דוח הר הביטוח" />}
    </>
  );
}
