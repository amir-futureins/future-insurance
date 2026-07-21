'use client';

import { useState, type CSSProperties } from 'react';
import { HeartHandshake, ArrowLeft, Cigarette, CalendarClock } from 'lucide-react';
import { estimateLife } from '@/lib/estimators';
import { CountUp } from '@/components/travel/ui';
import LeadForm from '@/components/LeadForm';

const INCOME_MIN = 5000;
const INCOME_MAX = 20000;
const AGE_MIN = 20;
const AGE_MAX = 70;

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);
const pct = (v: number, min: number, max: number) => ((v - min) / (max - min)) * 100;

export default function LifeCalculator() {
  const [income, setIncome] = useState(10000);
  const [age, setAge] = useState(35);
  const [smoker, setSmoker] = useState(false);
  const [open, setOpen] = useState(false);

  const { coverageSum, monthlyPremium } = estimateLife({ monthlyIncome: income, age, smoker });

  return (
    <section
      id="calculator"
      className="glass-elevated relative z-10 mx-auto w-full max-w-container scroll-mt-24 p-6 sm:p-8 md:p-10"
    >
      <header className="mb-8 text-center">
        <span className="eyebrow inline-flex items-center gap-1.5 text-[13px]">
          <HeartHandshake className="h-4 w-4" aria-hidden />
          מחשבון הגנה משפחתית
        </span>
        <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
          כמה כיסוי המשפחה שלכם צריכה?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-[15px] leading-relaxed text-muted">
          בוחרים הכנסה חודשית רצויה, גיל ומעשן/לא — ומקבלים אומדן כיסוי ופרמיה בזמן אמת.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-8">
          {/* desired monthly income */}
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-[15px] font-bold text-ink">הכנסה חודשית רצויה למשפחה</span>
              <span className="currency text-[15px] font-bold text-gold-deep">
                ₪{fmt(income)}
              </span>
            </div>
            <input
              type="range"
              min={INCOME_MIN}
              max={INCOME_MAX}
              step={500}
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              aria-label="הכנסה חודשית רצויה"
              className="range-aurora"
              style={{ ['--pct' as string]: `${pct(income, INCOME_MIN, INCOME_MAX)}%` } as CSSProperties}
            />
            <div className="num mt-2 flex justify-between text-[12px] text-faint">
              <span>₪{fmt(INCOME_MIN)}</span>
              <span>₪{fmt(INCOME_MAX)}</span>
            </div>
          </div>

          {/* age */}
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="flex items-center gap-1.5 text-[15px] font-bold text-ink">
                <CalendarClock className="h-4 w-4 text-gold-deep" aria-hidden />
                גיל
              </span>
              <span className="num text-[15px] font-bold text-gold-deep">{age}</span>
            </div>
            <input
              type="range"
              min={AGE_MIN}
              max={AGE_MAX}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              aria-label="גיל"
              className="range-aurora"
              style={{ ['--pct' as string]: `${pct(age, AGE_MIN, AGE_MAX)}%` } as CSSProperties}
            />
            <div className="num mt-2 flex justify-between text-[12px] text-faint">
              <span>{AGE_MIN}</span>
              <span>{AGE_MAX}</span>
            </div>
          </div>

          {/* smoker toggle */}
          <div>
            <span className="mb-3 block text-[15px] font-bold text-ink">מעשן/ת?</span>
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: false, label: 'לא מעשן/ת' },
                { v: true, label: 'מעשן/ת' },
              ].map((o) => {
                const active = smoker === o.v;
                return (
                  <button
                    key={o.label}
                    type="button"
                    onClick={() => setSmoker(o.v)}
                    aria-pressed={active}
                    className={[
                      'inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-[14px] font-bold transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
                      active
                        ? 'bg-cta-fill text-navy-deep shadow-md'
                        : 'glass-chip text-ink hover:bg-navy/[0.06]',
                    ].join(' ')}
                  >
                    <Cigarette className="h-4 w-4" aria-hidden />
                    {o.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[12px] text-muted">עישון משפיע על גובה הפרמיה.</p>
          </div>
        </div>

        {/* quote rail */}
        <aside className="glass-elevated glass-recommended relative overflow-hidden p-6 lg:sticky lg:top-24 lg:self-start">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-recommend-highlight" />
          <div className="relative">
            <span className="eyebrow text-[13px]">האומדן שלכם</span>
            <div className="mt-3">
              <div className="text-[12px] font-semibold text-muted">כיסוי מומלץ</div>
              <div className="currency text-[clamp(26px,5vw,34px)] font-extrabold leading-none text-ink">
                ₪{fmt(coverageSum)}
              </div>
            </div>
            <div className="mt-4 border-t border-navy/10 pt-4">
              <div className="text-[12px] font-semibold text-muted">פרמיה חודשית משוערת</div>
              <div className="flex items-end gap-1.5">
                <span className="currency text-[clamp(30px,5vw,40px)] font-extrabold leading-none text-gold-deep">
                  ₪<CountUp value={monthlyPremium} />
                </span>
                <span className="pb-1.5 text-[13px] font-semibold text-muted">/ לחודש</span>
              </div>
            </div>
            <p className="mt-3 text-[12px] leading-snug text-muted">
              אומדן להמחשה בלבד. המחיר הסופי נקבע בחיתום מול חברת הביטוח.
            </p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-cta-fill px-4 py-3.5 text-[16px] font-extrabold text-navy-deep shadow-lg shadow-gold/40 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_26px_rgba(212,162,74,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright"
            >
              לקבלת הצעה מסוכן מורשה
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </aside>
      </div>

      {open && (
        <LeadForm
          open
          onClose={() => setOpen(false)}
          vertical="life"
          title="קבלת הצעה לביטוח חיים"
          subtitle="סוכן מורשה יתאים לכם כיסוי מדויק לפי הצרכים של המשפחה."
          summary={`כיסוי ₪${fmt(coverageSum)} · פרמיה ~₪${monthlyPremium}/חודש`}
        />
      )}
    </section>
  );
}
