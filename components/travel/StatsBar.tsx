'use client';

import { useEffect, useRef, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { STATS } from '@/lib/content';

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);

/** One stat that counts 0 → value the first time it scrolls into view. */
function Stat({
  value,
  prefix,
  suffix,
  label,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (done.current) return;
      done.current = true;
      if (prefersReducedMotion() || !('requestAnimationFrame' in window)) {
        setDisplay(value);
        return;
      }
      const duration = 1400;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        setDisplay(Math.round(value * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            run();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="flex-1 px-4 py-2 text-center">
      <div className="currency text-[clamp(30px,5vw,44px)] font-extrabold leading-none text-gold-deep">
        {prefix}
        {fmt(display)}
        {suffix}
      </div>
      <div className="mt-2 text-[14px] font-semibold text-muted">{label}</div>
    </div>
  );
}

export default function StatsBar() {
  return (
    <section className="mx-auto w-full max-w-container px-6 py-8 md:px-10 md:py-10">
      <div className="glass-elevated relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-recommend-highlight" />
        <div className="relative flex flex-col divide-y divide-navy/10 sm:flex-row sm:divide-x sm:divide-y-0 sm:divide-navy/10 rtl:sm:divide-x-reverse">
          {STATS.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
        <div className="relative mt-4 flex items-center justify-center gap-1.5 text-[12px] font-medium text-faint">
          <TrendingUp className="h-3.5 w-3.5 text-gold-deep" aria-hidden />
          נתונים מצטברים ממערכת ההשוואה של Future Insurance
        </div>
      </div>
    </section>
  );
}
