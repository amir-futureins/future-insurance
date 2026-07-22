'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowLeft, X, ShieldCheck } from 'lucide-react';
import GovDataModal from '@/components/GovDataModal';

/**
 * StickyLeftGovCTA — a Gov-data CTA anchored to the BOTTOM-left corner so it can
 * never intersect the central hero card, on any screen size.
 *  • First ~3s (or until first scroll): expanded + glowing so the offer registers.
 *  • Then: collapses to a thin w-10 vertical tab flush to left-0 with vertical
 *    Hebrew text ("🛡️ בדיקת הר הביטוח").
 *  • Hover / focus / tap: smoothly expands to the full banner near the bottom-left,
 *    leaving page content 100% visible.
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
      <div className="no-print fixed bottom-28 left-0 z-40 lg:bottom-24">
        <button
          type="button"
          onClick={onClick}
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          aria-label="בדיקת עבר ביטוחי / הר הביטוח — ללא עלות"
          aria-expanded={expanded}
          className={`relative block h-44 overflow-hidden rounded-r-2xl text-navy-deep shadow-2xl shadow-amber-500/40 ring-1 ring-white/50 transition-[width] duration-300 ease-out animate-pulse-glow bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
            expanded ? 'w-[250px]' : 'w-10'
          }`}
        >
          {/* collapsed — thin vertical tab */}
          <span
            className={`absolute inset-0 grid place-items-center transition-opacity duration-150 ${
              expanded ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <span className="whitespace-nowrap text-[12px] font-extrabold leading-none tracking-wide [writing-mode:vertical-rl]">
              🛡️ בדיקת הר הביטוח
            </span>
          </span>

          {/* expanded — full horizontal banner */}
          <span
            dir="rtl"
            className={`absolute inset-0 flex h-full items-center gap-2.5 px-3.5 transition-opacity duration-200 ${
              expanded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-navy-deep/10">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0 whitespace-nowrap text-start">
              <span className="block text-[14px] font-extrabold leading-snug">🛡️ בדיקת הר הביטוח</span>
              <span className="mt-0.5 block text-[12px] font-bold text-navy-deep/90">
                🎁 ללא עלות וללא התחייבות
              </span>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-navy-deep px-2.5 py-0.5 text-[11px] font-extrabold text-gold-bright">
                ⚡ 2 דקות והדוח אצלך
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              </span>
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={close}
          aria-label="סגירת ההצעה"
          className="absolute -top-2.5 left-2 z-10 grid h-6 w-6 place-items-center rounded-full bg-navy-deep text-white shadow-md ring-2 ring-white transition-transform hover:scale-110"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>

      {open && <GovDataModal open onClose={() => setOpen(false)} topic={topic} title="הפקת דוח הר הביטוח" />}
    </>
  );
}
