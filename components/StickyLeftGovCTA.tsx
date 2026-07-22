'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowLeft, X, ShieldCheck } from 'lucide-react';
import GovDataModal from '@/components/GovDataModal';

/**
 * StickyLeftGovCTA — a sleek, permanent HORIZONTAL badge attached to the left
 * edge. Parked in the left "safe zone" (~top-[62%]): high enough to clear the
 * bottom-left WhatsApp/toast floats, low enough never to touch the central hero
 * card. Fully readable Hebrew, no vertical writing-mode. Opens the Gov-data
 * modal; dismissible with a ✕ (persisted in sessionStorage).
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
      /* private mode */
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

  return (
    <>
      <div className="no-print fixed bottom-48 left-0 z-40">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="בדיקת הר הביטוח בחינם"
          className="flex items-center gap-2 whitespace-nowrap rounded-r-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 py-2.5 pe-4 ps-3 text-navy-deep shadow-2xl shadow-amber-500/40 ring-1 ring-white/50 transition-transform duration-150 animate-pulse-glow hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy-deep/10">
            <ShieldCheck className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-[13.5px] font-extrabold leading-tight">בדיקת הר הביטוח בחינם</span>
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
        </button>

        <button
          type="button"
          onClick={close}
          aria-label="סגירת ההצעה"
          className="absolute -top-2.5 -right-2 z-10 grid h-6 w-6 place-items-center rounded-full bg-navy-deep text-white shadow-md ring-2 ring-white transition-transform hover:scale-110"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>

      {open && <GovDataModal open onClose={() => setOpen(false)} topic={topic} title="הפקת דוח הר הביטוח" />}
    </>
  );
}
