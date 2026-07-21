'use client';

import { useEffect, useRef, useState } from 'react';
import { Star, Quote, BadgeCheck, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/content';

const AUTOPLAY_MS = 6000;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);
  const len = TESTIMONIALS.length;

  const go = (i: number) => setIndex(((i % len) + len) % len);

  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    timer.current = window.setTimeout(() => setIndex((i) => (i + 1) % len), AUTOPLAY_MS);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [index, paused, len]);

  const t = TESTIMONIALS[index];

  return (
    <section
      id="testimonials"
      className="mx-auto w-full max-w-container scroll-mt-24 px-6 py-14 md:px-10 md:py-16"
    >
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow inline-flex items-center gap-1.5 text-[13px]">
          <BadgeCheck className="h-4 w-4" aria-hidden />
          לקוחות ממליצים
        </span>
        <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
          אלפי מטיילים כבר בחרו נכון
        </h2>
        <p className="mt-3 text-[16px] leading-relaxed text-muted">
          מה מספרים לקוחות שיצאו לדרך עם הפוליסה שהתאמנו להם.
        </p>
      </div>

      <div
        className="relative mx-auto mt-10 max-w-3xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div
          className="glass-elevated relative overflow-hidden p-7 sm:p-9"
          aria-roledescription="carousel"
          aria-label="המלצות לקוחות"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-recommend-highlight" />
          <Quote
            className="absolute end-6 top-6 h-12 w-12 text-gold/25"
            aria-hidden
          />

          {/* keyed so each change re-runs the slide-in transition */}
          <figure key={index} className="relative animate-slide-in">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <span
                  className="grid h-14 w-14 place-items-center rounded-full text-[18px] font-extrabold text-white shadow-md"
                  style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
                  aria-hidden
                >
                  {t.initials}
                </span>
                <span className="absolute -bottom-1 -end-1 grid h-6 w-6 place-items-center rounded-full bg-white text-harel-green shadow ring-1 ring-navy/5">
                  <BadgeCheck className="h-4 w-4" aria-hidden />
                </span>
              </div>

              <div className="min-w-0">
                <figcaption className="text-[17px] font-extrabold text-ink">
                  {t.name}
                </figcaption>
                <div className="mt-0.5 flex items-center gap-1 text-[13px] text-muted">
                  <MapPin className="h-3.5 w-3.5 text-gold-deep" aria-hidden />
                  {t.city}
                  <span className="mx-1 text-faint">·</span>
                  <span className="inline-flex" aria-label={`דירוג ${t.rating} מתוך 5`}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" aria-hidden />
                    ))}
                  </span>
                </div>
              </div>
            </div>

            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gold-tint px-3 py-1 text-[12px] font-semibold text-gold-deep ring-1 ring-gold/25">
              {t.tag}
            </span>

            <blockquote className="mt-4 text-[17px] leading-relaxed text-ink/90">
              ״{t.quote}״
            </blockquote>
          </figure>
        </div>

        {/* controls */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="ההמלצה הקודמת"
            className="grid h-10 w-10 place-items-center rounded-full border border-navy/10 bg-white text-ink shadow-sm transition-colors hover:bg-navy/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>

          <div className="flex items-center gap-2" role="group" aria-label="בחירת המלצה">
            {TESTIMONIALS.map((tt, i) => (
              <button
                key={tt.name}
                type="button"
                aria-label={`מעבר להמלצה ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => go(i)}
                className={[
                  'h-2.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
                  i === index ? 'w-7 bg-cta-fill' : 'w-2.5 bg-navy/15 hover:bg-navy/30',
                ].join(' ')}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="ההמלצה הבאה"
            className="grid h-10 w-10 place-items-center rounded-full border border-navy/10 bg-white text-ink shadow-sm transition-colors hover:bg-navy/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
