import type { CSSProperties } from 'react';

/**
 * BenefitMarquee — an infinite auto-scrolling strip of benefit/trust chips.
 * Uses the seamless-marquee trick: a `dir="ltr"` clip so the `w-max` track
 * left-anchors and `animate-marquee` (translateX -50%) loops with the doubled
 * list; each chip is `dir="rtl"`. Edge-faded, still under reduced-motion.
 */
const FADE: CSSProperties = {
  WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
  maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
};

export default function BenefitMarquee({
  items,
  accent = '#D4A24A',
}: {
  items: { emoji: string; text: string }[];
  accent?: string;
}) {
  const loop = [...items, ...items];
  return (
    <section className="mx-auto w-full max-w-container px-6 py-6 md:px-10">
      <div dir="ltr" className="hide-scroll relative overflow-hidden" style={FADE}>
        <div className="flex w-max animate-marquee gap-3.5">
          {loop.map((it, i) => (
            <div
              key={i}
              dir="rtl"
              className="flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 shadow-sm"
            >
              <span className="text-[18px] leading-none" aria-hidden>{it.emoji}</span>
              <span className="whitespace-nowrap text-[13.5px] font-bold text-ink">{it.text}</span>
              <span aria-hidden className="h-4 w-1 rounded-full" style={{ backgroundColor: accent }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
