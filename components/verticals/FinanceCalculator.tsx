'use client';

import { useState, type CSSProperties } from 'react';
import { TrendingUp, ArrowLeft, Coins, PiggyBank } from 'lucide-react';
import { estimateGrowth } from '@/lib/estimators';
import { CountUp } from '@/components/travel/ui';
import LeadForm from '@/components/LeadForm';

const MONTHLY_MIN = 250;
const MONTHLY_MAX = 5000;
const YEARS_MIN = 5;
const YEARS_MAX = 40;
const RATE_MIN = 2;
const RATE_MAX = 12;

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n));
const pct = (v: number, min: number, max: number) => ((v - min) / (max - min)) * 100;

// chart geometry
const W = 340;
const H = 170;
const PAD_TOP = 14;

export default function FinanceCalculator() {
  const [monthly, setMonthly] = useState(1000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(6);
  const [open, setOpen] = useState(false);

  const { points, finalValue, totalDeposited, totalGain } = estimateGrowth({
    monthly,
    years,
    annualRatePct: rate,
  });

  const maxY = Math.max(finalValue, 1) * 1.08;
  const lastYear = years || 1;
  const X = (y: number) => (y / lastYear) * W;
  const Y = (v: number) => H - (v / maxY) * (H - PAD_TOP);
  const valuePts = points.map((p) => `${X(p.year).toFixed(1)},${Y(p.value).toFixed(1)}`).join(' ');
  const depPts = points.map((p) => `${X(p.year).toFixed(1)},${Y(p.deposited).toFixed(1)}`).join(' ');
  const area = `M0,${H} L${valuePts} L${W},${H} Z`;

  return (
    <section
      id="calculator"
      className="glass-elevated relative z-10 mx-auto w-full max-w-container scroll-mt-24 p-6 sm:p-8 md:p-10"
    >
      <header className="mb-8 text-center">
        <span className="eyebrow inline-flex items-center gap-1.5 text-[13px]">
          <TrendingUp className="h-4 w-4" aria-hidden />
          סימולטור צמיחת הון
        </span>
        <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
          כמה יצמח החיסכון שלכם?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-[15px] leading-relaxed text-muted">
          משחקים עם ההפקדה, משך החיסכון והתשואה — והגרף מתעדכן בזמן אמת. זהו כוחה של ריבית דריבית.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-7">
          {/* monthly deposit */}
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-[15px] font-bold text-ink">הפקדה חודשית</span>
              <span className="currency text-[15px] font-bold text-gold-deep">₪{fmt(monthly)}</span>
            </div>
            <input
              type="range"
              min={MONTHLY_MIN}
              max={MONTHLY_MAX}
              step={50}
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              aria-label="הפקדה חודשית"
              className="range-aurora"
              style={{ ['--pct' as string]: `${pct(monthly, MONTHLY_MIN, MONTHLY_MAX)}%` } as CSSProperties}
            />
          </div>

          {/* years */}
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-[15px] font-bold text-ink">משך החיסכון</span>
              <span className="num text-[15px] font-bold text-gold-deep">{years} שנים</span>
            </div>
            <input
              type="range"
              min={YEARS_MIN}
              max={YEARS_MAX}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              aria-label="משך החיסכון בשנים"
              className="range-aurora"
              style={{ ['--pct' as string]: `${pct(years, YEARS_MIN, YEARS_MAX)}%` } as CSSProperties}
            />
          </div>

          {/* return rate */}
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-[15px] font-bold text-ink">תשואה שנתית ממוצעת</span>
              <span className="num text-[15px] font-bold text-gold-deep">{rate.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={RATE_MIN}
              max={RATE_MAX}
              step={0.5}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              aria-label="תשואה שנתית ממוצעת באחוזים"
              className="range-aurora"
              style={{ ['--pct' as string]: `${pct(rate, RATE_MIN, RATE_MAX)}%` } as CSSProperties}
            />
          </div>

          {/* live growth chart (LTR: time flows left→right) */}
          <div dir="ltr" className="rounded-2xl border border-navy/10 bg-white p-4">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              preserveAspectRatio="none"
              style={{ height: 'auto', aspectRatio: `${W} / ${H}` }}
              role="img"
              aria-label={`גרף צמיחה: לאחר ${years} שנים החיסכון מגיע לכ-${fmt(finalValue)} שקלים`}
            >
              <defs>
                <linearGradient id="fin-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4A24A" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#D4A24A" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1={H - 0.5} x2={W} y2={H - 0.5} stroke="rgba(20,43,85,0.12)" strokeWidth="1" />
              <path d={area} fill="url(#fin-fill)" />
              <polyline points={depPts} fill="none" stroke="#142B55" strokeWidth="2" strokeDasharray="4 4" strokeLinejoin="round" opacity="0.6" />
              <polyline points={valuePts} fill="none" stroke="#B98C42" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <div className="mt-2 flex items-center justify-between text-[11px] text-faint" dir="ltr">
              <span className="num">היום</span>
              <span className="num">{years} שנים</span>
            </div>
            <div className="mt-1 flex items-center gap-4 text-[11px] font-semibold" dir="rtl">
              <span className="inline-flex items-center gap-1 text-gold-deep">
                <span className="h-0.5 w-4 rounded bg-gold-deep" /> שווי צבור
              </span>
              <span className="inline-flex items-center gap-1 text-navy/70">
                <span className="h-0 w-4 border-t-2 border-dashed border-navy/60" /> סך הפקדות
              </span>
            </div>
          </div>
        </div>

        {/* results rail */}
        <aside className="glass-elevated glass-recommended relative overflow-hidden p-6 lg:sticky lg:top-24 lg:self-start">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-recommend-highlight" />
          <div className="relative">
            <span className="eyebrow text-[13px]">בעוד {years} שנים</span>
            <div className="mt-2 flex items-end gap-1.5">
              <span className="currency text-[clamp(30px,5vw,42px)] font-extrabold leading-none text-ink">
                ₪<CountUp value={finalValue} duration={500} format={fmt} />
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-navy/[0.04] px-3 py-2">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted">
                  <PiggyBank className="h-4 w-4 text-gold-deep" aria-hidden />
                  סך הפקדות
                </span>
                <span className="currency text-[15px] font-bold text-ink">₪{fmt(totalDeposited)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-harel-green/10 px-3 py-2">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-ink">
                  <Coins className="h-4 w-4 text-harel-green" aria-hidden />
                  רווח מריבית דריבית
                </span>
                <span className="currency text-[16px] font-extrabold text-harel-green">
                  ₪<CountUp value={totalGain} duration={500} format={fmt} />
                </span>
              </div>
            </div>

            <p className="mt-3 text-[12px] leading-snug text-muted">
              הדמיה להמחשה בלבד. התשואה בפועל משתנה; דמי ניהול נמוכים ומסלול מתאים משפיעים מאוד.
            </p>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-cta-fill px-4 py-3.5 text-[16px] font-extrabold text-navy-deep shadow-lg shadow-gold/40 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_26px_rgba(212,162,74,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright"
            >
              בדיקת פנסיה וגמל חינם
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </aside>
      </div>

      {open && (
        <LeadForm
          open
          onClose={() => setOpen(false)}
          vertical="finance"
          title="בדיקת פנסיה, גמל והשתלמות"
          subtitle="נבדוק דמי ניהול, מסלולים וכפילויות — ונמקסם לכם את החיסכון."
          summary={`הפקדה ₪${fmt(monthly)}/חודש · ${years} שנים · צפי ~₪${fmt(finalValue)}`}
        />
      )}
    </section>
  );
}
