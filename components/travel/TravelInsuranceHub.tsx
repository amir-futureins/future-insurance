'use client';

import { useMemo, useState } from 'react';
import { ShieldCheck, Check, Calculator as CalcIcon, ArrowLeft } from 'lucide-react';
import {
  recommendProvider,
  estimatePricePerDay,
  type TravelInput,
  type Destination,
  type HealthAddonId,
} from '@/lib/calculator';
import { getProvider } from '@/lib/providers';
import { TRUST_BADGES } from '@/lib/content';
import BoardingPass from './BoardingPass';
import TravelCalculator from './TravelCalculator';
import ProviderGrid from './ProviderGrid';
import DestinationCarousel from './DestinationCarousel';
import HeroRatesStrip from './HeroRatesStrip';

const DURATION_MIN = 1;
const DURATION_MAX = 90;
const TRAVELERS_MIN = 1;
const TRAVELERS_MAX = 10;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(v) ? v : min));

const INITIAL: TravelInput = {
  destination: 'europe',
  durationDays: 7,
  travelers: 2,
  addons: [],
};

export default function TravelInsuranceHub() {
  const [input, setInput] = useState<TravelInput>(INITIAL);

  const recommendation = useMemo(() => recommendProvider(input), [input]);
  const recommendedProvider = useMemo(
    () => getProvider(recommendation.providerId),
    [recommendation.providerId],
  );
  const recommendedPrice = useMemo(
    () => estimatePricePerDay(input, recommendation.providerId),
    [input, recommendation.providerId],
  );

  const setDestination = (destination: Destination) =>
    setInput((s) => ({ ...s, destination }));
  const setDuration = (durationDays: number) =>
    setInput((s) => ({ ...s, durationDays: clamp(durationDays, DURATION_MIN, DURATION_MAX) }));
  const setTravelers = (travelers: number) =>
    setInput((s) => ({ ...s, travelers: clamp(travelers, TRAVELERS_MIN, TRAVELERS_MAX) }));
  const toggleAddon = (id: HealthAddonId) =>
    setInput((s) => ({
      ...s,
      addons: s.addons.includes(id)
        ? s.addons.filter((a) => a !== id)
        : [...s.addons, id],
    }));

  // Destination carousel → update the calculator filter (+ optional add-on),
  // then glide back up to the (now-updated) calculator + recommendation.
  const pickDestination = (destination: Destination, addon?: HealthAddonId) => {
    setInput((s) => ({
      ...s,
      destination,
      addons: addon && !s.addons.includes(addon) ? [...s.addons, addon] : s.addons,
    }));
    if (typeof document !== 'undefined') {
      document
        .getElementById('calculator')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main>
      {/* ---- HERO ---- */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 end-[-4rem] h-[460px] w-[460px] rounded-full bg-glow-gold opacity-50 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-40 start-[-6rem] h-[420px] w-[420px] rounded-full bg-glow-navy opacity-45 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-container items-center gap-10 px-6 pb-24 pt-12 md:px-10 md:pb-28 md:pt-16 lg:grid-cols-[1.1fr_0.9fr]">
          {/* copy — first in DOM, lands at the reading-start (right) */}
          <div className="min-w-0">
            <div className="mb-4 flex w-fit animate-badge-drop items-center gap-2 rounded-full border border-gold/50 bg-gold-tint px-3.5 py-1.5 text-[12.5px] font-bold text-navy shadow-sm">
              <span className="animate-breathe" aria-hidden>🔥</span>
              חדש ב-Future Fly: השוואת פוליסות דינמית ב-10 שניות
            </div>
            <span className="glass-chip inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold text-gold-deep">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              ביטוח נסיעות לחו״ל
            </span>

            <h1 className="mt-5 break-words text-[clamp(23px,6.2vw,44px)] font-extrabold leading-[1.14] tracking-[-0.015em] text-ink">
              הכיסוי הנכון לנסיעה שלכם,{' '}
              <span className="text-gold-deep">בלי לבזבז זמן וכסף</span>
            </h1>

            <p className="mt-4 max-w-xl text-[18px] leading-relaxed text-muted">
              עונים על כמה שאלות והמחשבון החכם ממליץ על חברת הביטוח שמתאימה בדיוק לפרופיל
              שלכם — PassportCard, הראל, מגדל או כלל. השוואה שקופה, פוליסה מיידית.
            </p>

            {/* live destination rates marquee */}
            <HeroRatesStrip />

            {/* trust badges */}
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {TRUST_BADGES.map((b) => (
                <li key={b} className="flex items-center gap-1.5 text-[14px] font-medium text-ink/80">
                  <Check className="h-4 w-4 text-gold-deep" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#calculator"
                className="inline-flex animate-pulse-glow items-center gap-2 rounded-xl bg-cta-fill px-6 py-3.5 text-[16px] font-extrabold text-navy-deep shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(212,162,74,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright"
              >
                <CalcIcon className="h-5 w-5" aria-hidden />
                לחישוב מיידי
              </a>
              <a
                href="#providers"
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-3.5 text-[16px] font-bold text-gold-deep transition-colors hover:text-gold"
              >
                השוואת חברות
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>

          {/* boarding-pass card */}
          <div className="mx-auto w-full max-w-md lg:mx-0">
            <BoardingPass
              input={input}
              providerName={recommendedProvider.name}
              glow={recommendedProvider.glow}
            />
          </div>
        </div>
      </section>

      {/* ---- CALCULATOR (overlaps hero) ---- */}
      <div className="px-6 md:px-10">
        <TravelCalculator
          input={input}
          recommendation={recommendation}
          recommendedProvider={recommendedProvider}
          recommendedPrice={recommendedPrice}
          onDestination={setDestination}
          onDuration={setDuration}
          onTravelers={setTravelers}
          onToggleAddon={toggleAddon}
        />
      </div>

      {/* ---- POPULAR DESTINATIONS (drives the calculator) ---- */}
      <DestinationCarousel onPick={pickDestination} />

      {/* ---- PROVIDER GRID ---- */}
      <ProviderGrid input={input} recommendedId={recommendation.providerId} />
    </main>
  );
}
