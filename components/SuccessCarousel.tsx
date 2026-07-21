'use client';

import { useEffect, useRef, useState } from 'react';
import { Star, Quote, BadgeCheck, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import type { Review } from '@/lib/agency';

const AUTOPLAY_MS = 6000;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Auto-playing customer success-story carousel (generic over agency reviews). */
export default function SuccessCarousel({
  title,
  reviews,
}: {
  title: string;
  reviews: Review[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);
  const len = reviews.length;

  const go = (i: number) => setIndex(((i % len) + len) % len);

  useEffect(() => {
    if (paused || prefersReducedMotion() || len <= 1) return;
    timer.current = window.setTimeout(() => setIndex((i) => (i + 1) % len), AUTOPLAY_MS);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [index, paused, len]);

  if (!len) return null;
  const t = reviews[index];

  return (
    <section className="mx-auto w-full max-w-container px-6 py-14 md:px-10 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow inline-flex items-center gap-1.5 text-[13px]">
          <BadgeCheck className="h-4 w-4" aria-hidden />
          סיפורי הצלחה
        </span>
        <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">{title}</h2>
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
          aria-label="סיפורי הצלחה"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-recommend-highlight" />
          <Quote className="absolute end-6 top-6 h-12 w-12 text-gold/25" aria-hidden />
          <figure key={index} className="relative animate-slide-in">
            <div className="flex items-center gap-4">
              <span
                className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-[18px] font-extrabold text-white shadow-md"
                style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
                aria-hidden
              >
                {t.initials}
              </span>
              <div className="min-w-0">
                <figcaption className="text-[17px] font-extrabold text-ink">{t.name}</figcaption>
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
            <span className="mt-4 inline-flex items-center rounded-full bg-gold-tint px-3 py-1 text-[12px] font-semibold text-gold-deep ring-1 ring-gold/25">
              {t.vertical}
            </span>
            <blockquote className="mt-4 text-[17px] leading-relaxed text-ink/90">
              ״{t.quote}״
            </blockquote>
          </figure>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="הסיפור הקודם"
            className="grid h-10 w-10 place-items-center rounded-full border border-navy/10 bg-white text-ink shadow-sm transition-colors hover:bg-navy/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
          <div className="flex items-center gap-2" role="group" aria-label="בחירת סיפור">
            {reviews.map((rv, i) => (
              <button
                key={rv.name}
                type="button"
                aria-label={`מעבר לסיפור ${i + 1}`}
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
            aria-label="הסיפור הבא"
            className="grid h-10 w-10 place-items-center rounded-full border border-navy/10 bg-white text-ink shadow-sm transition-colors hover:bg-navy/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
