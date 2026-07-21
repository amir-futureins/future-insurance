'use client';

import { useState, type CSSProperties } from 'react';
import { TrendingDown, Percent } from 'lucide-react';
import { estimateGrowth } from '@/lib/estimators';
import { CountUp } from '@/components/travel/ui';

// Assumed average gross annual return (before fees), and an "optimized" fee.
const GROSS = 7;
const BASE_FEE = 0.5;

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n));
const pct = (v: number, min: number, max: number) => ((v - min) / (max - min)) * 100;

export default function FeesImpact() {
  const [monthly, setMonthly] = useState(1500);
  const [years, setYears] = useState(25);
  const [fee, setFee] = useState(1.2);

  const optimized = estimateGrowth({ monthly, years, annualRatePct: GROSS - BASE_FEE }).finalValue;
  const yours = estimateGrowth({ monthly, years, annualRatePct: GROSS - fee }).finalValue;
  const loss = Math.max(0, optimized - yours);
  const yoursWidth = optimized > 0 ? Math.min(100, Math.max(6, (yours / optimized) * 100)) : 100;

  return (
    <section className="mx-auto w-full max-w-container px-6 py-14 md:px-10 md:py-16">
      <div className="glass-elevated relative overflow-hidden p-6 sm:p-8 md:p-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-recommend-highlight" />
        <div className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow inline-flex items-center gap-1.5 text-[13px]">
              <Percent className="h-4 w-4" aria-hidden />
              המחיר הסמוי של דמי ניהול
            </span>
            <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
              כמה אתם מפסידים בדמי ניהול?
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              דמי ניהול נראים זניחים — אבל לאורך שנים הם ״אוכלים״ נתח עצום מהחיסכון. גררו וראו את הפער.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <div>
                <div className="mb-3 flex items-baseline justify-between">
                  <span className="text-[15px] font-bold text-ink">הפקדה חודשית</span>
                  <span className="currency text-[15px] font-bold text-gold-deep">₪{fmt(monthly)}</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={5000}
                  step={100}
                  value={monthly}
                  onChange={(e) => setMonthly(Number(e.target.value))}
                  aria-label="הפקדה חודשית"
                  className="range-aurora"
                  style={{ ['--pct' as string]: `${pct(monthly, 500, 5000)}%` } as CSSProperties}
                />
              </div>
              <div>
                <div className="mb-3 flex items-baseline justify-between">
                  <span className="text-[15px] font-bold text-ink">משך החיסכון</span>
                  <span className="num text-[15px] font-bold text-gold-deep">{years} שנים</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={40}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  aria-label="משך החיסכון בשנים"
                  className="range-aurora"
                  style={{ ['--pct' as string]: `${pct(years, 5, 40)}%` } as CSSProperties}
                />
              </div>
              <div>
                <div className="mb-3 flex items-baseline justify-between">
                  <span className="text-[15px] font-bold text-ink">דמי ניהול נוכחיים</span>
                  <span className="num text-[15px] font-bold text-pc-glow">{fee.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={2}
                  step={0.1}
                  value={fee}
                  onChange={(e) => setFee(Number(e.target.value))}
                  aria-label="דמי ניהול נוכחיים באחוזים"
                  className="range-aurora"
                  style={{ ['--pct' as string]: `${pct(fee, 0.1, 2)}%` } as CSSProperties}
                />
              </div>

              {/* comparison bars */}
              <div className="space-y-3 pt-2" dir="rtl">
                <div>
                  <div className="mb-1 flex items-center justify-between text-[12.5px] font-semibold">
                    <span className="text-harel-green">אצלנו (0.5% דמי ניהול)</span>
                    <span className="currency text-ink">₪{fmt(optimized)}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-navy/10">
                    <div className="h-full rounded-full bg-harel-green" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-[12.5px] font-semibold">
                    <span className="text-muted">כיום ({fee.toFixed(1)}% דמי ניהול)</span>
                    <span className="currency text-ink">₪{fmt(yours)}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-navy/10">
                    <div
                      className="h-full rounded-full bg-gold-deep transition-all duration-300"
                      style={{ width: `${yoursWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* loss rail */}
            <aside className="rounded-2xl border border-pc-glow/30 bg-pc-glow/5 p-6 lg:sticky lg:top-24 lg:self-start">
              <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-pc-glow">
                <TrendingDown className="h-4 w-4" aria-hidden />
                ההפסד שלכם
              </span>
              <div className="mt-2 flex items-end gap-1.5">
                <span className="currency text-[clamp(30px,5vw,42px)] font-extrabold leading-none text-pc-glow">
                  ₪<CountUp value={loss} duration={500} format={fmt} />
                </span>
              </div>
              <p className="mt-2 text-[13px] leading-snug text-muted">
                כך שווה הפער בדמי הניהול לאורך {years} שנים — כסף שנשאר בכיס במקום להימחק.
              </p>
              <a
                href="#calculator"
                className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-cta-fill px-4 py-3.5 text-[16px] font-extrabold text-navy-deep shadow-lg shadow-gold/40 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_26px_rgba(212,162,74,0.65)]"
              >
                לבדיקת דמי הניהול שלי
              </a>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
