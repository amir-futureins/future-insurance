'use client';

import { useState, type CSSProperties } from 'react';
import { Home, ArrowLeft, HeartPulse, Building, TrendingDown } from 'lucide-react';
import { estimateMortgage } from '@/lib/estimators';
import { CountUp } from '@/components/travel/ui';
import LeadForm from '@/components/LeadForm';

const LOAN_MIN = 200000;
const LOAN_MAX = 3000000;
const YEARS_MIN = 5;
const YEARS_MAX = 30;

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);
const shekelShort = (n: number) =>
  n >= 1000000 ? `₪${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M` : `₪${fmt(n)}`;
const pct = (v: number, min: number, max: number) => ((v - min) / (max - min)) * 100;

export default function MortgageCalculator() {
  const [loan, setLoan] = useState(1200000);
  const [years, setYears] = useState(25);
  const [life, setLife] = useState(true);
  const [structure, setStructure] = useState(true);
  const [open, setOpen] = useState(false);

  const { monthlyPremium, bankPremium, savingPct, yearlySaving } = estimateMortgage({
    loanAmount: loan,
    years,
    life,
    structure,
  });
  const noCover = !life && !structure;

  return (
    <section
      id="calculator"
      className="glass-elevated relative z-10 mx-auto w-full max-w-container scroll-mt-24 p-6 sm:p-8 md:p-10"
    >
      <header className="mb-8 text-center">
        <span className="eyebrow inline-flex items-center gap-1.5 text-[13px]">
          <Home className="h-4 w-4" aria-hidden />
          מחשבון ביטוח משכנתא
        </span>
        <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
          כמה תחסכו מול מחיר הבנק?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-[15px] leading-relaxed text-muted">
          מזינים את פרטי המשכנתא — ורואים מיד את הפער בין מחיר הבנק לפוליסה עצמאית.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-8">
          {/* loan amount */}
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-[15px] font-bold text-ink">סכום ההלוואה</span>
              <span className="currency text-[15px] font-bold text-gold-deep">{shekelShort(loan)}</span>
            </div>
            <input
              type="range"
              min={LOAN_MIN}
              max={LOAN_MAX}
              step={50000}
              value={loan}
              onChange={(e) => setLoan(Number(e.target.value))}
              aria-label="סכום ההלוואה"
              className="range-aurora"
              style={{ ['--pct' as string]: `${pct(loan, LOAN_MIN, LOAN_MAX)}%` } as CSSProperties}
            />
            <div className="num mt-2 flex justify-between text-[12px] text-faint">
              <span>{shekelShort(LOAN_MIN)}</span>
              <span>{shekelShort(LOAN_MAX)}</span>
            </div>
          </div>

          {/* years */}
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-[15px] font-bold text-ink">שנים שנותרו</span>
              <span className="num text-[15px] font-bold text-gold-deep">{years} שנים</span>
            </div>
            <input
              type="range"
              min={YEARS_MIN}
              max={YEARS_MAX}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              aria-label="שנים שנותרו"
              className="range-aurora"
              style={{ ['--pct' as string]: `${pct(years, YEARS_MIN, YEARS_MAX)}%` } as CSSProperties}
            />
            <div className="num mt-2 flex justify-between text-[12px] text-faint">
              <span>{YEARS_MIN}</span>
              <span>{YEARS_MAX}</span>
            </div>
          </div>

          {/* coverage toggles */}
          <div>
            <span className="mb-3 block text-[15px] font-bold text-ink">כיסויים (הבנק דורש את שניהם)</span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { on: life, set: setLife, icon: HeartPulse, label: 'ביטוח חיים', desc: 'מסלק את יתרת ההלוואה' },
                { on: structure, set: setStructure, icon: Building, label: 'ביטוח מבנה', desc: 'נזקי אש, מים ורעש' },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => t.set(!t.on)}
                    aria-pressed={t.on}
                    className={[
                      'flex items-start gap-3 rounded-2xl border p-4 text-start transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
                      t.on
                        ? 'border-gold/60 bg-gold-tint shadow-[0_0_0_1px_rgba(212,162,74,0.4),0_12px_30px_-12px_rgba(212,162,74,0.4)]'
                        : 'border-navy/10 bg-white hover:bg-navy/[0.03]',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors',
                        t.on ? 'bg-accent text-navy-deep' : 'bg-navy/[0.06] text-muted',
                      ].join(' ')}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-bold text-ink">{t.label}</span>
                      <span className="block text-[12px] leading-snug text-muted">{t.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* comparison rail */}
        <aside className="glass-elevated glass-recommended relative overflow-hidden p-6 lg:sticky lg:top-24 lg:self-start">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-recommend-highlight" />
          <div className="relative">
            <span className="eyebrow text-[13px]">ההשוואה שלכם</span>

            {noCover ? (
              <p className="mt-4 text-[14px] leading-snug text-muted">בחרו לפחות כיסוי אחד כדי לראות את החיסכון.</p>
            ) : (
              <>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-navy/[0.04] px-3 py-2.5">
                  <span className="text-[13px] font-semibold text-muted">מחיר הבנק (משוער)</span>
                  <span className="currency text-[16px] font-bold text-ink line-through decoration-pc-glow/70">
                    ₪{bankPremium}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between rounded-xl bg-gold-tint px-3 py-2.5 ring-1 ring-gold/30">
                  <span className="text-[13px] font-bold text-navy">דרך Future Insurance</span>
                  <span className="currency text-[20px] font-extrabold text-gold-deep">
                    ₪<CountUp value={monthlyPremium} />
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-harel-green/10 p-3">
                  <TrendingDown className="h-5 w-5 shrink-0 text-harel-green" aria-hidden />
                  <div className="leading-tight">
                    <div className="text-[13px] font-bold text-ink">
                      חיסכון של כ-{savingPct}% — ₪<CountUp value={yearlySaving} /> בשנה
                    </div>
                    <div className="text-[11.5px] text-muted">על אותו כיסוי בדיוק, לאורך המשכנתא.</div>
                  </div>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => setOpen(true)}
              disabled={noCover}
              className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-cta-fill px-4 py-3.5 text-[16px] font-extrabold text-navy-deep shadow-lg shadow-gold/40 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_26px_rgba(212,162,74,0.65)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright"
            >
              קבלו הצעה וחסכו
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </aside>
      </div>

      {open && (
        <LeadForm
          open
          onClose={() => setOpen(false)}
          vertical="mortgage"
          title="קבלת הצעה לביטוח משכנתא"
          subtitle="נשווה מול מחיר הבנק ונלווה אתכם גם במעבר — כולל ההודעה לבנק."
          summary={`${shekelShort(loan)} · ${years} שנים · ~₪${monthlyPremium}/חודש (חיסכון ~${savingPct}%)`}
        />
      )}
    </section>
  );
}
