'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Zap, ArrowLeft } from 'lucide-react';
import GovDataModal from '@/components/GovDataModal';

/**
 * StickyLeftGovCTA — a prominent, always-visible marketing trigger pinned to the
 * LEFT edge of the viewport that opens the GovDataModal (Har-Habituach report).
 * Desktop: a gold tab protruding from the left border. Mobile: a compact
 * bottom-left pill. Shown on the key marketing routes only. The left edge at
 * vertical-centre is free of the other floats (dock=right, WhatsApp/toast=corners).
 */
const showOn = (p: string) => p === '/' || p === '/health' || p.startsWith('/har-habituach');

export default function StickyLeftGovCTA() {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  if (!showOn(pathname)) return null;

  const topic = pathname.startsWith('/har-habituach')
    ? 'har_gov_report'
    : pathname === '/health'
      ? 'health_gov'
      : 'home_gov';

  const gold =
    'animate-pulse-glow bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-navy-deep shadow-2xl shadow-amber-500/40 ring-1 ring-white/40';

  return (
    <>
      {/* desktop: protruding left-edge tab */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="בדיקת הר הביטוח — הוצאת דוח עבר ביטוחי בחינם"
        className={`no-print fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-start gap-1 rounded-r-2xl py-3.5 pe-4 ps-3 transition-transform duration-150 hover:translate-x-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy lg:flex ${gold}`}
      >
        <span className="flex items-center gap-2 text-[15px] font-extrabold">
          <Zap className="h-5 w-5" aria-hidden />
          בדיקת הר הביטוח בחינם
          <ArrowLeft className="h-4 w-4" aria-hidden />
        </span>
        <span className="rounded-full bg-navy-deep/90 px-2 py-0.5 text-[11px] font-bold text-gold-bright">
          עבר ביטוחי • 2 דקות והדוח אצלך
        </span>
      </button>

      {/* mobile: compact bottom-left pill */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="בדיקת הר הביטוח בחינם — הוצאת דוח עבר ביטוחי"
        className={`no-print fixed bottom-20 left-3 z-40 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-extrabold lg:hidden ${gold}`}
      >
        <Zap className="h-4 w-4" aria-hidden />
        דוח הר הביטוח חינם
      </button>

      {open && <GovDataModal open onClose={() => setOpen(false)} topic={topic} title="הפקת דוח הר הביטוח" />}
    </>
  );
}
