'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { MapPin, ArrowLeft, Compass, Pause, Play } from 'lucide-react';
import type { Destination, HealthAddonId } from '@/lib/calculator';
import { IMG, unsplash, type ImageKey } from '@/lib/images';

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

const DESTS: {
  key: string;
  label: string;
  sub: string;
  img: ImageKey;
  destination: Destination;
  addon?: HealthAddonId;
}[] = [
  { key: 'europe', label: 'אירופה', sub: 'ערים, אלפים ותרבות', img: 'europe', destination: 'europe' },
  { key: 'usa', label: 'ארה״ב', sub: 'ניו יורק, המערב ופארקים', img: 'usa', destination: 'usa' },
  { key: 'thailand', label: 'תאילנד', sub: 'חופים ואיים טרופיים', img: 'beach', destination: 'asia' },
  { key: 'ski', label: 'סקי ואתגרי', sub: 'גלישה וספורט חורף', img: 'ski', destination: 'europe', addon: 'extremeSports' },
  { key: 'japan', label: 'יפן', sub: 'טוקיו, מקדשים וטבע', img: 'asia', destination: 'asia' },
];

/**
 * Auto-sliding "popular destinations" strip. Clicking a card updates the
 * calculator's destination (and, for ski, the extreme-sports add-on) via
 * `onPick`. Autoplay scrolls ONLY the track container (physical-pixel deltas,
 * so it's RTL-safe and can never move the page), pauses on hover/focus, exposes
 * a keyboard-operable pause/play control (WCAG 2.2.2), and is off entirely for
 * reduced-motion users. Native swipe/scroll always works.
 */
export default function DestinationCarousel({
  onPick,
}: {
  onPick: (destination: Destination, addon?: HealthAddonId) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const idx = useRef(0);
  const paused = useRef(false);
  const visible = useRef(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion() || !playing) return;

    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
      },
      { threshold: 0.5 },
    );
    io.observe(track);

    const pause = () => (paused.current = true);
    const resume = () => (paused.current = false);
    track.addEventListener('pointerenter', pause);
    track.addEventListener('pointerleave', resume);
    track.addEventListener('focusin', pause);
    track.addEventListener('focusout', resume);

    const timer = window.setInterval(() => {
      if (!visible.current || paused.current) return;
      const cards = track.children;
      if (!cards.length) return;
      idx.current = (idx.current + 1) % cards.length;
      const card = cards[idx.current] as HTMLElement;
      // Physical-pixel delta to centre the card in the track viewport. Using
      // getBoundingClientRect + track.scrollBy keeps this correct in RTL and
      // scrolls the CONTAINER only — the document is never affected.
      const t = track.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      const delta = c.left + c.width / 2 - (t.left + t.width / 2);
      track.scrollBy({ left: delta, behavior: 'smooth' });
    }, 3800);

    return () => {
      io.disconnect();
      window.clearInterval(timer);
      track.removeEventListener('pointerenter', pause);
      track.removeEventListener('pointerleave', resume);
      track.removeEventListener('focusin', pause);
      track.removeEventListener('focusout', resume);
    };
  }, [playing]);

  return (
    <section id="destinations" className="scroll-mt-24 py-14 md:py-16">
      <div className="mx-auto max-w-container px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow inline-flex items-center gap-1.5 text-[13px]">
            <Compass className="h-4 w-4" aria-hidden />
            יעדים פופולריים
          </span>
          <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
            לאן טסים? בחרו יעד והמחשבון יתאים את עצמו
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-muted">
            לחיצה על יעד מעדכנת מיד את מסנן היעד במחשבון ומקפיצה אתכם להמלצה.
          </p>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-pressed={!playing}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-navy/10 bg-white px-3 py-1.5 text-[12px] font-semibold text-muted shadow-sm transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            {playing ? (
              <>
                <Pause className="h-3.5 w-3.5" aria-hidden />
                השהיית המצגת
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" aria-hidden />
                הפעלת המצגת
              </>
            )}
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="hide-scroll mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-2 md:px-10"
        role="list"
        aria-label="יעדים פופולריים"
      >
        {DESTS.map((d) => (
          <div
            key={d.key}
            role="listitem"
            className="w-[78%] shrink-0 snap-center sm:w-[46%] lg:w-[31%]"
          >
            <button
              type="button"
              onClick={() => onPick(d.destination, d.addon)}
              aria-label={`בחירת יעד ${d.label} במחשבון`}
              className="group relative block h-56 w-full overflow-hidden rounded-glass-lg text-start shadow-md ring-1 ring-navy/10 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <Image
                src={unsplash(IMG[d.img], 720, 60)}
                alt={d.label}
                fill
                sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 31vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="flex items-center gap-1.5 text-[12px] font-medium text-white/80">
                  <MapPin className="h-3.5 w-3.5 text-gold-bright" aria-hidden />
                  יעד פופולרי
                </div>
                <div className="mt-0.5 text-[20px] font-extrabold drop-shadow">{d.label}</div>
                <div className="text-[13px] text-white/85">{d.sub}</div>
                <span className="mt-2.5 inline-flex items-center gap-1 text-[13px] font-bold text-gold-bright">
                  בדקו כיסוי ליעד
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
