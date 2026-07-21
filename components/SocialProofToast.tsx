'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

/**
 * SocialProofToast — a light-luxury floating toast for the agency pages (the
 * travel route has its own <SocialProof/>, so this one self-disables there to
 * avoid a double toast). It cycles representative customer success stories.
 *
 * ⚠️ ILLUSTRATIVE / PLACEHOLDER DATA: these are example stories, marked
 * "לדוגמה" in-widget. Replace with REAL, consented customer testimonials before
 * launch — presenting fabricated customer activity as genuine is a consumer-
 * protection / misleading-advertising risk. No "just now" live-time claim is made.
 */

const STORIES = [
  { emoji: '🎉', name: 'דניאל', city: 'רמת גן', text: 'מצא ₪3,800 כפילויות בהר הביטוח', accent: '#16A34A' },
  { emoji: '📈', name: 'מיכל', city: 'חיפה', text: 'הוזילה את ביטוח המשכנתא ב-35%', accent: '#0057B8' },
  { emoji: '💰', name: 'אורי', city: 'תל אביב', text: 'הפחית דמי ניהול וחסך מאות אלפי ₪ לפרישה', accent: '#A97C34' },
  { emoji: '🏥', name: 'נועה', city: 'באר שבע', text: 'בנתה כיסוי בריאות חכם — בלי לשלם על כפילויות', accent: '#DC2626' },
  { emoji: '🛡️', name: 'משפחת לוי', city: 'השרון', text: 'סגרה ביטוח חיים מותאם בתוך דקות', accent: '#003399' },
];

const INITIAL_DELAY = 6000;
const VISIBLE_MS = 5500;
const GAP_MS = 9000;
const MAX_SHOWS = 4;

export default function SocialProofToast() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const timer = useRef<number | null>(null);
  const shows = useRef(0);
  const pathname = usePathname();
  // Travel route ships its own SocialProof; keep this to the agency pages.
  const active = pathname !== '/travel-insurance';

  useEffect(() => {
    if (dismissed || !active) return;
    const at = (fn: () => void, ms: number) => {
      timer.current = window.setTimeout(fn, ms);
    };
    const hidden = () => typeof document !== 'undefined' && document.hidden;
    function show() {
      if (shows.current >= MAX_SHOWS) return;
      if (hidden()) return at(show, 2000); // wait for the tab to come back
      shows.current += 1;
      setVisible(true);
      at(hide, VISIBLE_MS);
    }
    function hide() {
      setVisible(false);
      at(next, 600);
    }
    function next() {
      setIndex((i) => (i + 1) % STORIES.length);
      at(show, GAP_MS);
    }
    at(show, INITIAL_DELAY);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [dismissed, active]);

  // Leaving the agency pages (e.g. to /travel-insurance) must hide any live
  // toast so returning starts cleanly from INITIAL_DELAY, not a stale flash.
  useEffect(() => {
    if (!active) setVisible(false);
  }, [active]);

  if (dismissed || !visible || !active) return null;

  const item = STORIES[index];

  return (
    <div className="no-print pointer-events-none fixed bottom-24 end-4 z-40 w-[min(20rem,calc(100vw-6rem))]">
      <div className="glass pointer-events-auto flex animate-toast-in items-center gap-3 p-3 pe-9">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[18px]"
          style={{ backgroundColor: `color-mix(in srgb, ${item.accent} 16%, white)` }}
          aria-hidden
        >
          {item.emoji}
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[13px] font-bold text-ink">
            <span className="truncate">
              {item.name} מ{item.city}
            </span>
            <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[9.5px] font-semibold text-faint">
              לדוגמה
            </span>
          </p>
          <p className="text-[12px] leading-snug text-muted">{item.text}</p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="סגירת ההתראות"
          className="pointer-events-auto absolute end-2 top-2 grid h-6 w-6 place-items-center rounded-full text-faint transition-colors hover:text-ink"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
