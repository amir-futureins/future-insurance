'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowLeft, X } from 'lucide-react';
import GovDataModal from '@/components/GovDataModal';

/**
 * StickyLeftGovCTA — an explicit, always-readable gold banner pinned to the left
 * edge that opens the GovDataModal. Shows the full value proposition up-front
 * (no hover needed). Dismissible with a ✕ (persisted in sessionStorage).
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
      /* private mode — show it */
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
    'animate-pulse-glow bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-navy-deep shadow-2xl shadow-amber-500/40 ring-1 ring-white/50';

  const Dismiss = () => (
    <button
      type="button"
      onClick={close}
      aria-label="סגירת ההצעה"
      className="absolute -top-2.5 right-2 z-10 grid h-6 w-6 place-items-center rounded-full bg-navy-deep text-white shadow-md ring-2 ring-white transition-transform hover:scale-110"
    >
      <X className="h-3.5 w-3.5" aria-hidden />
    </button>
  );

  return (
    <>
      {/* desktop: full explicit banner */}
      <div className="no-print fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="בדיקת עבר ביטוחי / הר הביטוח — ללא עלות"
          className={`block w-[216px] rounded-r-2xl p-4 text-start transition-transform duration-150 hover:translate-x-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${gold}`}
        >
          <div className="text-[14px] font-extrabold leading-snug">🛡️ בדיקת עבר ביטוחי / הר הביטוח</div>
          <div className="mt-1 text-[12.5px] font-bold text-navy-deep/90">🎁 ללא עלות וללא התחייבות!</div>
          <div className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-navy-deep px-2.5 py-1 text-[11.5px] font-extrabold text-gold-bright">
            ⚡ 2 דקות והדוח אצלך
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          </div>
        </button>
        <Dismiss />
      </div>

      {/* mobile: compact but still readable banner */}
      <div className="no-print fixed left-0 top-1/2 z-40 -translate-y-1/2 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="בדיקת עבר ביטוחי / הר הביטוח — ללא עלות"
          className={`block w-[142px] rounded-r-2xl p-2.5 text-start ${gold}`}
        >
          <div className="text-[12px] font-extrabold leading-tight">🛡️ בדיקת הר הביטוח</div>
          <div className="mt-1 inline-flex items-center gap-0.5 rounded-full bg-navy-deep px-2 py-0.5 text-[10px] font-extrabold text-gold-bright">
            חינם • 2 דקות
            <ArrowLeft className="h-3 w-3" aria-hidden />
          </div>
        </button>
        <Dismiss />
      </div>

      {open && <GovDataModal open onClose={() => setOpen(false)} topic={topic} title="הפקת דוח הר הביטוח" />}
    </>
  );
}
