'use client';

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from 'react';

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * One-time entrance reveal on scroll. SSR renders `data-reveal=""` which CSS
 * hides; a <noscript> override keeps it visible without JS, and Googlebot
 * (which executes JS) reveals it normally — so content is always crawlable.
 * Not used on the hero, to keep the LCP element painting immediately.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div' as ElementType,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.setAttribute('data-reveal', 'in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.setAttribute('data-reveal', 'in');
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

/**
 * Animated integer count-up. First paint renders the real value (no CLS, fully
 * crawlable); subsequent value changes ease over `duration`. Respects
 * prefers-reduced-motion by snapping instantly.
 */
export function CountUp({
  value,
  duration = 400,
  className,
  format,
}: {
  value: number;
  duration?: number;
  className?: string;
  /** optional formatter for the displayed number (e.g. thousands separators). */
  format?: (n: number) => string;
}) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;

    if (prefersReducedMotion()) {
      setDisplay(to);
      fromRef.current = to;
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const current = Math.round(from + (to - from) * eased);
      setDisplay(current);
      // Keep the ref in sync with what's on screen so an animation interrupted
      // mid-flight (e.g. rapid slider drags) resumes from the visible value.
      fromRef.current = current;
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return <span className={className}>{format ? format(display) : display}</span>;
}
