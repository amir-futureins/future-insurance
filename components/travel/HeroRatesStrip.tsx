import {
  recommendProvider,
  estimatePricePerDay,
  type Destination,
  type HealthAddonId,
} from '@/lib/calculator';

/**
 * Live "daily rates for popular destinations" marquee that sits under the hero
 * subtext. Each micro-badge shows the smart-pick "from ₪X/day" for a 7-day,
 * single-traveler trip — computed from the same engine that powers the
 * calculator, so the numbers are always consistent. Pure CSS marquee (pauses on
 * hover; the global reduced-motion rule freezes it) → lightweight, no client JS.
 */

const STRIP: {
  emoji: string;
  label: string;
  destination: Destination;
  addons: HealthAddonId[];
}[] = [
  { emoji: '🇪🇺', label: 'אירופה', destination: 'europe', addons: [] },
  { emoji: '🇺🇸', label: 'ארה״ב', destination: 'usa', addons: [] },
  { emoji: '🏝️', label: 'תאילנד', destination: 'asia', addons: [] },
  { emoji: '⛷️', label: 'סקי', destination: 'europe', addons: ['winterSports'] },
  { emoji: '🗾', label: 'יפן', destination: 'asia', addons: [] },
  { emoji: '🌍', label: 'כל העולם', destination: 'worldwide', addons: [] },
];

// Deterministic baseline rates — computed once (fixed 7-day / 1-traveler trip).
const RATES = STRIP.map((d) => {
  const input = { destination: d.destination, durationDays: 7, travelers: 1, addons: d.addons };
  const rec = recommendProvider(input);
  return { ...d, rate: estimatePricePerDay(input, rec.providerId) };
});

function Badge({ item }: { item: (typeof RATES)[number] }) {
  return (
    <span
      dir="rtl"
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-navy/10 bg-white px-3 py-1.5 text-[12.5px] font-bold text-ink shadow-sm"
    >
      <span aria-hidden>{item.emoji}</span>
      {item.label}
      <span className="num text-gold-deep">מ־₪{item.rate}/יום</span>
    </span>
  );
}

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 pe-2.5" aria-hidden={hidden || undefined}>
      {RATES.map((item) => (
        <Badge key={item.label} item={item} />
      ))}
    </div>
  );
}

export default function HeroRatesStrip() {
  return (
    <div className="mt-5 max-w-xl">
      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gold-deep">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-deep" />
        </span>
        מחירים חיים ליעדים מבוקשים
      </div>
      {/* dir=ltr so the over-wide w-max track left-anchors → the -50% marquee
          is seamless in RTL (each badge keeps dir=rtl for Hebrew). */}
      <div dir="ltr" className="relative overflow-hidden">
        <div className="flex w-max animate-marquee py-1 hover:[animation-play-state:paused]">
          <Row />
          <Row hidden />
        </div>
        {/* soft edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#f2f5fa] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#f2f5fa] to-transparent" />
      </div>
    </div>
  );
}
