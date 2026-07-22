'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Zap, ArrowLeft, X } from 'lucide-react';
import GovDataModal from '@/components/GovDataModal';

/**
 * StickyLeftGovCTA — an ULTRA-SLIM left-edge tab that opens the GovDataModal.
 * Resting: a ~56px icon-only tab flush to the edge (never covers the central
 * cards). Hover (desktop): slides open to reveal the full copy. A small ✕
 * dismisses it for the session (sessionStorage). Pinned at vertical-centre on
 * both desktop and mobile so it stays out of the bottom-left float stack
 * (WhatsApp + social-proof toast).
 */
const showOn = (p: string) => p === '/' || p === '/health' || p.startsWith('/har-habituach');
const KEY = 'futureins-gov-tab';

export default function StickyLeftGovCTA() {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY) === 'closed') setDismissed(true);
    } catch {
      /* private mode — just show it */
    }
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
  const gold =
    'animate-pulse-glow bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-navy-deep shadow-2xl shadow-amber-500/40 ring-1 ring-white/40';

  const Dismiss = () => (
    <button
      type="button"
      onClick={close}
      aria-label="סגירת ההצעה"
      className="absolute -top-2 left-3 z-10 grid h-5 w-5 place-items-center rounded-full bg-navy-deep text-white shadow ring-2 ring-white transition-transform hover:scale-110"
    >
      <X className="h-3 w-3" aria-hidden />
    </button>
  );

  return (
    <>
      {/* desktop: ultra-slim edge tab, expands on hover */}
      <div className="group no-print fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="הוצאת דוח עבר ביטוחי בחינם — הר הביטוח"
          className={`flex max-w-[56px] items-center gap-2.5 overflow-hidden rounded-r-2xl py-4 pe-3 ps-3.5 transition-[max-width] duration-300 ease-out group-hover:max-w-[340px] focus-visible:max-w-[340px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${gold}`}
        >
          <Zap className="h-6 w-6 shrink-0" aria-hidden />
          <span className="flex flex-col items-start whitespace-nowrap text-start opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="text-[14.5px] font-extrabold leading-tight">הוצאת דוח עבר ביטוחי ב-2 דקות</span>
            <span className="text-[11px] font-bold text-navy-deep/70">ללא עלות • 2 דקות והדוח אצלך</span>
          </span>
          <ArrowLeft className="h-4 w-4 shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" aria-hidden />
        </button>
        <Dismiss />
      </div>

      {/* mobile: compact icon tab at the edge-centre (out of the bottom float stack) */}
      <div className="no-print fixed left-0 top-1/2 z-40 -translate-y-1/2 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="הוצאת דוח עבר ביטוחי בחינם — הר הביטוח"
          className={`flex w-[60px] flex-col items-center gap-1 rounded-r-2xl px-1.5 py-3 text-center ${gold}`}
        >
          <Zap className="h-5 w-5" aria-hidden />
          <span className="text-[10px] font-extrabold leading-tight">דוח הר הביטוח חינם</span>
        </button>
        <Dismiss />
      </div>

      {open && <GovDataModal open onClose={() => setOpen(false)} topic={topic} title="הפקת דוח הר הביטוח" />}
    </>
  );
}
