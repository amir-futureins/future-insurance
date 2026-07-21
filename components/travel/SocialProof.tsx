'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X, BadgeCheck } from 'lucide-react';
import { SOCIAL_PROOF } from '@/lib/content';

const PROVIDER_COLOR: Record<string, string> = {
  PassportCard: '#E11933',
  הראל: '#0057B8',
  כלל: '#0086BC',
};

const INITIAL_DELAY = 4500;
const VISIBLE_MS = 5500;

export default function SocialProof() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  // A single live timer id — always overwritten, so it can't accumulate.
  const timer = useRef<number | null>(null);
  // Travel-only: the proof items reference travel providers.
  const pathname = usePathname();
  const active = pathname === '/travel-insurance';

  useEffect(() => {
    if (dismissed || !active) return;
    const at = (fn: () => void, ms: number) => {
      timer.current = window.setTimeout(fn, ms);
    };
    function show() {
      setVisible(true);
      at(hide, VISIBLE_MS);
    }
    function hide() {
      setVisible(false);
      at(next, 600);
    }
    function next() {
      setIndex((i) => (i + 1) % SOCIAL_PROOF.length);
      at(show, 1500);
    }

    // Vary the first gap a little so it feels organic (browser runtime — ok).
    at(show, INITIAL_DELAY + Math.round(Math.random() * 2000));
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [dismissed, active]);

  if (dismissed || !visible || !active) return null;

  const item = SOCIAL_PROOF[index];
  const color = PROVIDER_COLOR[item.provider] ?? '#A97C34';

  return (
    <div className="no-print pointer-events-none fixed bottom-24 end-4 z-40 w-[min(20rem,calc(100vw-2rem))] lg:bottom-6">
      <div className="glass pointer-events-auto flex animate-toast-in items-center gap-3 p-3 pe-9">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
          style={{ backgroundColor: `color-mix(in srgb, ${color} 22%, transparent)`, color }}
        >
          <BadgeCheck className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold text-ink">
            {item.name} מ{item.city} רכש/ה הרגע
          </p>
          <p className="text-[12px] text-muted">
            ביטוח{' '}
            <span className="font-semibold" style={{ color }}>
              {item.provider}
            </span>{' '}
            · לפני {item.minutesAgo} דק׳
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="סגירת התראות"
          className="pointer-events-auto absolute end-2 top-2 grid h-6 w-6 place-items-center rounded-full text-faint hover:text-ink"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
