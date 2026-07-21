'use client';

import type { CSSProperties } from 'react';
import {
  Landmark,
  Flag,
  Plane,
  Globe2,
  Minus,
  Plus,
  Users,
  Check,
  Calculator as CalcIcon,
  type LucideIcon,
} from 'lucide-react';
import {
  DESTINATIONS,
  HEALTH_ADDONS,
  FAMILY_THRESHOLD,
  TRAVELER_PRESETS,
  addonDeltaPerDay,
  type Destination,
  type HealthAddonId,
  type TravelInput,
  type Recommendation,
} from '@/lib/calculator';
import type { Provider } from '@/lib/providers';
import RecommendationRail from './RecommendationRail';

const DEST_ICON: Record<Destination, LucideIcon> = {
  europe: Landmark,
  usa: Flag,
  asia: Plane,
  worldwide: Globe2,
};

/** Gamified emoji per add-on for the visual toggle cards. */
const ADDON_EMOJI: Record<HealthAddonId, string> = {
  preExisting: '🩺',
  extremeSports: '🪂',
  winterSports: '⛷️',
  pregnancy: '🤰',
};

const DURATION_MIN = 1;
const DURATION_MAX = 90;
const TRAVELERS_MIN = 1;
const TRAVELERS_MAX = 10;
const QUICK_DAYS = [3, 7, 14, 30];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 text-start text-[15px] font-bold text-ink">{children}</div>
  );
}

function Stepper({
  value,
  min,
  max,
  onChange,
  icon: Icon,
  unit,
  ariaLabel,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  icon: LucideIcon;
  unit: string;
  ariaLabel: string;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const btn =
    'grid h-10 w-10 place-items-center rounded-xl bg-navy/[0.06] text-ink shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-navy/10 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

  return (
    <div className="glass-chip flex items-center justify-between p-2">
      <button
        type="button"
        className={btn}
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label={`${ariaLabel}: הפחתה`}
      >
        <Minus className="h-4 w-4" aria-hidden />
      </button>

      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-gold-deep" aria-hidden />
        <span className="num text-2xl font-extrabold text-ink">{value}</span>
        <span className="text-[14px] text-muted">{unit}</span>
        {/* Self-describing polite announcement, e.g. "מספר מטיילים: 5 נוסעים". */}
        <span className="sr-only" aria-live="polite">{`${ariaLabel}: ${value} ${unit}`}</span>
      </div>

      <button
        type="button"
        className={btn}
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label={`${ariaLabel}: הוספה`}
      >
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

export default function TravelCalculator({
  input,
  recommendation,
  recommendedProvider,
  recommendedPrice,
  onDestination,
  onDuration,
  onTravelers,
  onToggleAddon,
}: {
  input: TravelInput;
  recommendation: Recommendation;
  recommendedProvider: Provider;
  recommendedPrice: number;
  onDestination: (d: Destination) => void;
  onDuration: (v: number) => void;
  onTravelers: (v: number) => void;
  onToggleAddon: (id: HealthAddonId) => void;
}) {
  const durationPct =
    ((input.durationDays - DURATION_MIN) / (DURATION_MAX - DURATION_MIN)) * 100;

  return (
    <section
      id="calculator"
      className="glass-elevated relative z-10 mx-auto -mt-12 w-full max-w-container scroll-mt-24 p-6 sm:p-8 md:p-10"
    >
      <header className="mb-8 text-center">
        <span className="eyebrow inline-flex items-center gap-1.5 text-[13px]">
          <CalcIcon className="h-4 w-4" aria-hidden />
          מחשבון חכם
        </span>
        <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
          כמה עולה לכם ביטוח נסיעות?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-[15px] leading-relaxed text-muted">
          בוחרים יעד, משך והרחבות — וההמלצה מתעדכנת בזמן אמת. ללא טפסים, ללא המתנה.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* ---- inputs (inline-start / right) ---- */}
        <div className="space-y-8">
          {/* destination */}
          <fieldset>
            <legend className="mb-3 text-start text-[15px] font-bold text-ink">
              לאן טסים?
            </legend>
            <div
              role="radiogroup"
              aria-label="יעד הנסיעה"
              className="grid grid-cols-2 gap-3 md:grid-cols-4"
            >
              {DESTINATIONS.map((d) => {
                const Icon = DEST_ICON[d.id];
                const selected = input.destination === d.id;
                return (
                  <label key={d.id} className="group relative cursor-pointer">
                    <input
                      type="radio"
                      name="destination"
                      className="peer sr-only"
                      checked={selected}
                      onChange={() => onDestination(d.id)}
                    />
                    <span className="glass-chip flex items-center justify-center gap-2 px-2 py-3.5 text-[14px] font-semibold text-ink transition-all duration-150 peer-checked:border-transparent peer-checked:bg-cta-fill peer-checked:text-navy-deep peer-checked:shadow-md peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">
                      <Icon className="h-4 w-4" aria-hidden />
                      {d.label}
                      <Check className="h-4 w-4 scale-50 opacity-0 transition-all group-has-[:checked]:scale-100 group-has-[:checked]:opacity-100" aria-hidden />
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* duration */}
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-[15px] font-bold text-ink">משך הנסיעה</span>
              <span className="num text-[15px] font-bold text-gold-deep">
                {input.durationDays} ימים
              </span>
            </div>
            <input
              type="range"
              min={DURATION_MIN}
              max={DURATION_MAX}
              value={input.durationDays}
              onChange={(e) => onDuration(Number(e.target.value))}
              aria-label="משך הנסיעה בימים"
              className="range-aurora"
              style={{ ['--pct' as string]: `${durationPct}%` } as CSSProperties}
            />
            {/* tick marks aligned to the quick-day presets */}
            <div className="relative mt-2 h-2.5" aria-hidden>
              {QUICK_DAYS.map((d) => {
                const pct = ((d - DURATION_MIN) / (DURATION_MAX - DURATION_MIN)) * 100;
                return (
                  <span
                    key={d}
                    className={[
                      'absolute top-0 h-2 w-px rounded-full',
                      input.durationDays >= d ? 'bg-gold' : 'bg-navy/20',
                    ].join(' ')}
                    style={{ insetInlineStart: `${pct}%` }}
                  />
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK_DAYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onDuration(d)}
                  className={[
                    'num rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                    input.durationDays === d
                      ? 'bg-accent text-navy-deep'
                      : 'glass-chip text-ink/80',
                  ].join(' ')}
                >
                  {d} ימים
                </button>
              ))}
            </div>
          </div>

          {/* travelers */}
          <div>
            <FieldLabel>מספר מטיילים</FieldLabel>
            {/* quick preset chips */}
            <div className="mb-3 flex flex-wrap gap-2">
              {TRAVELER_PRESETS.map((p) => {
                const active = p.andUp
                  ? input.travelers >= p.value
                  : input.travelers === p.value;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => onTravelers(p.value)}
                    aria-pressed={active}
                    className={[
                      'inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-bold transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
                      active
                        ? 'bg-cta-fill text-navy-deep shadow-md'
                        : 'glass-chip text-ink hover:bg-navy/[0.06]',
                    ].join(' ')}
                  >
                    <span className="text-[15px] leading-none" aria-hidden>
                      {p.emoji}
                    </span>
                    {p.label}
                    {p.andUp ? ' (3+)' : ''}
                  </button>
                );
              })}
            </div>
            <Stepper
              value={input.travelers}
              min={TRAVELERS_MIN}
              max={TRAVELERS_MAX}
              onChange={onTravelers}
              icon={Users}
              unit="נוסעים"
              ariaLabel="מספר מטיילים"
            />
            <p className="mt-2 text-[12px] text-muted">
              מ־{FAMILY_THRESHOLD} נוסעים ומעלה מותאם פרופיל משפחתי אוטומטית.
            </p>
          </div>

          {/* add-ons */}
          <fieldset>
            <legend className="mb-3 text-start text-[15px] font-bold text-ink">
              הרחבות בריאות
            </legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {HEALTH_ADDONS.map((a) => {
                const active = input.addons.includes(a.id);
                const delta = addonDeltaPerDay(input, recommendedProvider.id, a.id);
                return (
                  <label
                    key={a.id}
                    className="group relative flex cursor-pointer items-start gap-3 rounded-2xl border border-navy/10 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md has-[:checked]:-translate-y-0.5 has-[:checked]:border-gold/60 has-[:checked]:bg-gold-tint has-[:checked]:shadow-[0_0_0_1px_rgba(212,162,74,0.45),0_14px_34px_-12px_rgba(212,162,74,0.5)] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold"
                  >
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={active}
                      onChange={() => onToggleAddon(a.id)}
                    />
                    <span
                      className="text-[26px] leading-none transition-transform duration-200 group-has-[:checked]:scale-110"
                      aria-hidden
                    >
                      {ADDON_EMOJI[a.id]}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-bold text-ink">{a.label}</span>
                      <span className="num mt-1.5 inline-flex items-center rounded-full bg-navy/[0.05] px-2 py-0.5 text-[11px] font-extrabold text-gold-deep transition-colors group-has-[:checked]:bg-gold/25">
                        +₪{delta} ליום
                      </span>
                    </span>
                    <span
                      className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-navy/25 transition-all group-has-[:checked]:border-gold group-has-[:checked]:bg-gold"
                      aria-hidden
                    >
                      <Check className="h-3 w-3 scale-50 text-navy-deep opacity-0 transition-all group-has-[:checked]:scale-100 group-has-[:checked]:opacity-100" />
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* ---- recommendation rail (inline-end / left) ---- */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <RecommendationRail
            recommendation={recommendation}
            provider={recommendedProvider}
            pricePerDay={recommendedPrice}
          />
        </div>
      </div>
    </section>
  );
}
