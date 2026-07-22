'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { ArrowLeft, Calculator as CalcIcon, MessageCircle } from 'lucide-react';
import {
  estimatePricePerDay,
  DESTINATIONS,
  HEALTH_ADDONS,
  type Destination,
  type HealthAddonId,
} from '@/lib/calculator';
import type { BrandConfig } from '@/lib/brands';
import { CountUp } from '@/components/travel/ui';
import LeadForm from '@/components/LeadForm';

/** Age band → indicative multiplier (older travellers cost more). Illustrative. */
const AGES = [
  { id: '18-40', label: '18–40', mult: 1.0 },
  { id: '41-60', label: '41–60', mult: 1.25 },
  { id: '61-75', label: '61–75', mult: 1.7 },
  { id: '76+', label: '76+', mult: 2.2 },
];

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n));
const pct = (v: number, min: number, max: number) => ((v - min) / (max - min)) * 100;

export default function BrandCalculator({ brand }: { brand: BrandConfig }) {
  const [days, setDays] = useState(7);
  const [ageIdx, setAgeIdx] = useState(0);
  const [destination, setDestination] = useState<Destination>('europe');
  const [addons, setAddons] = useState<HealthAddonId[]>([]);
  const [open, setOpen] = useState(false);

  const perDay = useMemo(() => {
    const base = estimatePricePerDay({ destination, durationDays: days, travelers: 1, addons }, brand.providerId);
    return Math.round(base * AGES[ageIdx].mult);
  }, [destination, days, addons, ageIdx, brand.providerId]);

  const total = perDay * days;

  const toggle = (id: HealthAddonId) =>
    setAddons((s) => (s.includes(id) ? s.filter((a) => a !== id) : [...s, id]));

  const chip = (active: boolean) =>
    `rounded-xl px-3 py-2 text-[13px] font-bold transition-colors ${
      active ? 'text-white shadow-sm' : 'bg-slate-100 text-ink hover:bg-slate-200'
    }`;

  return (
    <section
      id="calculator"
      className="glass-elevated relative mx-auto w-full max-w-container scroll-mt-24 overflow-hidden p-6 sm:p-8 md:p-10"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: brand.accent }} />
      <header className="mb-8 text-center">
        <span className="eyebrow inline-flex items-center gap-1.5 text-[13px]">
          <CalcIcon className="h-4 w-4" aria-hidden />
          מחשבון עלות יומית
        </span>
        <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
          מחשבון עלות יומית ב{brand.name}
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-[15px] leading-relaxed text-muted">
          בוחרים משך נסיעה, גיל, יעד והרחבות — ומקבלים אומדן מחיר מיידי. הדמיה להמחשה בלבד.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {/* days */}
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-[15px] font-bold text-ink">משך הנסיעה</span>
              <span className="num text-[15px] font-bold text-gold-deep">{days} ימים</span>
            </div>
            <input
              type="range"
              min={1}
              max={90}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              aria-label="משך הנסיעה בימים"
              className="range-aurora"
              style={{ ['--pct' as string]: `${pct(days, 1, 90)}%` } as CSSProperties}
            />
          </div>

          {/* destination */}
          <div>
            <div className="mb-2 text-[14px] font-bold text-ink">יעד</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {DESTINATIONS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={destination === d.id}
                  onClick={() => setDestination(d.id)}
                  className={chip(destination === d.id)}
                  style={destination === d.id ? { backgroundColor: brand.accent } : undefined}
                >
                  <span aria-hidden className="me-1">{d.emoji}</span>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* age */}
          <div>
            <div className="mb-2 text-[14px] font-bold text-ink">קבוצת גיל</div>
            <div className="grid grid-cols-4 gap-2">
              {AGES.map((a, i) => (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={ageIdx === i}
                  onClick={() => setAgeIdx(i)}
                  className={chip(ageIdx === i)}
                  style={ageIdx === i ? { backgroundColor: brand.accent } : undefined}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* add-ons */}
          <div>
            <div className="mb-2 text-[14px] font-bold text-ink">הרחבות רפואיות</div>
            <div className="grid grid-cols-2 gap-2">
              {HEALTH_ADDONS.map((a) => {
                const on = addons.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(a.id)}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                      on ? 'text-white' : 'bg-slate-100 text-ink hover:bg-slate-200'
                    }`}
                    style={on ? { backgroundColor: brand.accent } : undefined}
                  >
                    {a.label}
                    <span aria-hidden className={on ? 'text-white' : 'text-faint'}>{on ? '✓' : '+'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* result rail */}
        <aside className="glass-elevated glass-recommended relative overflow-hidden p-6 lg:sticky lg:top-24 lg:self-start">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-recommend-highlight" />
          <div className="relative">
            <span className="eyebrow text-[13px]">האומדן שלכם ב{brand.name}</span>
            <div className="mt-2 flex items-end gap-1.5">
              <span className="currency text-[clamp(30px,5vw,42px)] font-extrabold leading-none" style={{ color: brand.accent }}>
                ₪<CountUp value={perDay} duration={450} format={fmt} />
              </span>
              <span className="mb-1 text-[14px] font-bold text-muted">/ יום לנוסע</span>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-navy/[0.04] px-3 py-2 text-[13px]">
              <span className="font-semibold text-muted">סה״כ ל-{days} ימים</span>
              <span className="currency text-[16px] font-extrabold text-ink">
                ₪<CountUp value={total} duration={450} format={fmt} />
              </span>
            </div>
            <p className="mt-3 text-[12px] leading-snug text-muted">
              הדמיה להמחשה — המחיר הסופי נקבע בהצעת החברה לפי הפרטים המלאים.
            </p>

            <a
              href={`/api/go/${brand.slug}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-3.5 text-[16px] font-extrabold text-white shadow-lg transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: brand.accent }}
            >
              המשך לרכישה מהירה ב{brand.name}
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-[14px] font-bold text-ink transition-colors hover:bg-navy/[0.04]"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden />
              או השאירו טלפון — נחזור ב-30 שניות
            </button>
          </div>
        </aside>
      </div>

      {open && (
        <LeadForm
          open
          onClose={() => setOpen(false)}
          vertical={`travel_${brand.slug}`}
          title={`השוואת הצעה — ${brand.name}`}
          subtitle={`נשווה עבורכם את ${brand.name} מול החברות המובילות ונחזור אליכם עם המחיר הטוב ביותר.`}
          summary={`${brand.name} · ${days} ימים · ${DESTINATIONS.find((d) => d.id === destination)?.label} · אומדן ~₪${fmt(total)}`}
        />
      )}
    </section>
  );
}
