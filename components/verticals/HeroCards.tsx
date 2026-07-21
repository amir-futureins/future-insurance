'use client';

import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Radar,
  Landmark,
  Stethoscope,
  Check,
  TrendingDown,
  Car,
  BadgeCheck,
} from 'lucide-react';
import { estimateMortgage, estimateLife, HEALTH_COVERAGES } from '@/lib/estimators';
import { CountUp } from '@/components/travel/ui';

/**
 * Premium hero visual cards — the "boarding-pass quality" bar of /travel-insurance,
 * one per vertical, sitting in the START-side (left) column of each 2-col hero.
 * White glass-elevated cards with a themed header band, animated meters/radar,
 * count-up tickers and a dashed "receipt" perforation. All figures are computed
 * from the shared estimators for a stated scenario (labelled "המחשה").
 */

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n));

function useStarted() {
  const [started, setStarted] = useState(false);
  useEffect(() => setStarted(true), []);
  return started;
}

function Perf() {
  return (
    <div className="relative my-4 border-t border-dashed border-navy/15">
      <span className="absolute -start-3 -top-2.5 h-5 w-5 rounded-full bg-base" aria-hidden />
      <span className="absolute -end-3 -top-2.5 h-5 w-5 rounded-full bg-base" aria-hidden />
    </div>
  );
}

/* ─────────────────────────── Mortgage · Bank vs Future ─────────────────────────── */

const M = estimateMortgage({ loanAmount: 1_500_000, years: 25, life: true, structure: true });
const M_LIFETIME = M.yearlySaving * 25;

export function HeroMortgageCard() {
  const started = useStarted();
  const bankH = 100;
  const futureH = Math.round((M.monthlyPremium / M.bankPremium) * 100);
  return (
    <div className="glass-elevated relative mx-auto w-full max-w-md overflow-hidden">
      <div className="flex items-center justify-between bg-gradient-to-l from-navy-deep to-[#22366A] px-5 py-3 text-white">
        <span className="flex items-center gap-2 text-[14px] font-extrabold">
          <Landmark className="h-4 w-4 text-gold-bright" aria-hidden />
          הבנק מול Future
        </span>
        <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[12px] font-bold text-gold-bright">
          חיסכון {M.savingPct}%
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-end justify-center gap-8">
          <div className="flex flex-col items-center gap-1.5">
            <span className="currency text-[13px] font-bold text-ink">₪{fmt(M.bankPremium)}</span>
            <div className="flex h-[92px] w-12 flex-col justify-end overflow-hidden rounded-t-lg bg-slate-100">
              <div className="origin-bottom animate-grow-y rounded-t-lg bg-gradient-to-t from-rose-500 to-rose-400" style={{ height: `${bankH}%` }} />
            </div>
            <span className="text-[11.5px] font-medium text-muted">דרך הבנק</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="currency text-[13px] font-bold text-emerald-700">₪{fmt(M.monthlyPremium)}</span>
            <div className="flex h-[92px] w-12 flex-col justify-end overflow-hidden rounded-t-lg bg-slate-100">
              <div className="origin-bottom animate-grow-y rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.35)] [animation-delay:160ms]" style={{ height: `${futureH}%` }} />
            </div>
            <span className="text-[11.5px] font-medium text-muted">דרך Future</span>
          </div>
        </div>

        <Perf />

        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-[12px] font-semibold text-muted">
            <TrendingDown className="h-4 w-4 text-emerald-600" aria-hidden />
            חיסכון מצטבר לאורך המשכנתא
          </div>
          <div className="currency mt-1 text-[28px] font-extrabold leading-none text-emerald-600">
            ₪<CountUp value={started ? M_LIFETIME : 0} duration={1100} format={fmt} />
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] text-faint">המחשה · הלוואה ₪1.5M · 25 שנה · חיים + מבנה</p>
      </div>
    </div>
  );
}

/* ─────────────────────────── Life · Family Shield ─────────────────────────── */

const L = estimateLife({ monthlyIncome: 12_000, age: 35, smoker: false });

export function HeroLifeCard() {
  const started = useStarted();
  return (
    <div className="glass-elevated relative mx-auto w-full max-w-md overflow-hidden">
      <div className="flex items-center justify-between bg-gradient-to-l from-gold-bright to-gold px-5 py-3 text-navy-deep">
        <span className="flex items-center gap-2 text-[14px] font-extrabold">
          <ShieldCheck className="h-4 w-4" aria-hidden />
          מגן משפחתי
        </span>
        <span className="text-[20px]" aria-hidden>👨‍👩‍👧‍👦</span>
      </div>

      <div className="p-5 sm:p-6 text-center">
        <div className="relative mx-auto grid h-20 w-20 place-items-center">
          <span className="absolute inset-0 animate-pulse-glow rounded-full bg-gold-tint" aria-hidden />
          <ShieldCheck className="relative h-11 w-11 text-gold-deep" aria-hidden />
        </div>
        <div className="mt-3 text-[12px] font-semibold text-muted">סכום כיסוי מומלץ למשפחה</div>
        <div className="currency text-[30px] font-extrabold leading-none text-ink">
          ₪<CountUp value={started ? L.coverageSum : 0} duration={1200} format={fmt} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 text-start">
          <div className="glass-chip px-3 py-2">
            <div className="text-[11px] text-muted">הכנסה מוגנת</div>
            <div className="currency text-[14px] font-bold text-ink">₪12,000/ח׳</div>
          </div>
          <div className="glass-chip px-3 py-2">
            <div className="text-[11px] text-muted">אומדן פרמיה</div>
            <div className="currency text-[14px] font-bold text-emerald-700">מ-₪{fmt(L.monthlyPremium)}/ח׳</div>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-faint">המחשה · גיל 35 · ריסק · הכנסה ₪12,000</p>
      </div>
    </div>
  );
}

/* ─────────────────────────── Health · Coverage Pass ─────────────────────────── */

const H_TOTAL = HEALTH_COVERAGES.reduce((s, c) => s + c.monthly, 0);

export function HeroHealthCard() {
  const started = useStarted();
  return (
    <div className="glass-elevated relative mx-auto w-full max-w-md overflow-hidden">
      <div className="flex items-center justify-between bg-gradient-to-l from-emerald-800 to-emerald-700 px-5 py-3 text-white">
        <span className="flex items-center gap-2 text-[14px] font-extrabold">
          <Stethoscope className="h-4 w-4" aria-hidden />
          כרטיס כיסוי בריאות
        </span>
        <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[12px] font-bold">ללא כפילויות</span>
      </div>

      <div className="p-5 sm:p-6">
        <ul className="space-y-2">
          {HEALTH_COVERAGES.map((c) => (
            <li key={c.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200/70">
              <span className="flex items-center gap-2 text-[13px] font-semibold text-ink">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-emerald-100 text-emerald-700">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span aria-hidden>{c.emoji}</span>
                {c.label}
              </span>
              <span className="currency text-[12.5px] font-bold text-muted">₪{c.monthly}/ח׳</span>
            </li>
          ))}
        </ul>

        <Perf />

        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-muted">כיסוי מלא</span>
          <span className="currency text-[24px] font-extrabold leading-none text-emerald-600">
            ₪<CountUp value={started ? H_TOTAL : 0} duration={900} format={fmt} />
            <span className="text-[14px] font-bold text-muted">/ח׳</span>
          </span>
        </div>
        <p className="mt-2 text-[11px] text-faint">המחשה · בונים כיסוי מדויק לפי הצורך שלכם</p>
      </div>
    </div>
  );
}

/* ─────────────────────────── Har-Habituach · Gov Scanner Receipt ─────────────────────────── */

export function HeroHarCard() {
  const started = useStarted();
  return (
    <div className="glass-elevated relative mx-auto w-full max-w-md overflow-hidden">
      <div className="flex items-center justify-between bg-gradient-to-l from-navy-deep to-[#22366A] px-5 py-3 text-white">
        <span className="flex items-center gap-2 text-[14px] font-extrabold">
          <Radar className="h-4 w-4 text-gold-bright" aria-hidden />
          סורק הר הביטוח
        </span>
        <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[12px] font-bold text-emerald-200">LIVE</span>
      </div>

      <div className="p-5 sm:p-6">
        {/* spinning radar */}
        <div className="relative mx-auto grid h-28 w-28 place-items-center">
          <span className="absolute inset-0 rounded-full border border-emerald-400/70" aria-hidden />
          <span className="absolute inset-[14%] rounded-full border border-emerald-400/50" aria-hidden />
          <span className="absolute inset-[30%] rounded-full border border-emerald-400/35" aria-hidden />
          <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-emerald-400/25" aria-hidden />
          <span className="absolute inset-y-0 start-1/2 w-px bg-emerald-400/25" aria-hidden />
          <span
            className="absolute inset-0 animate-spin rounded-full"
            style={{ animationDuration: '3.2s', background: 'conic-gradient(from 0deg, transparent 0deg, rgba(16,185,129,0.38) 55deg, transparent 90deg)' }}
            aria-hidden
          />
          <span className="absolute start-[26%] top-[34%] h-2 w-2 rounded-full bg-gold shadow-[0_0_8px_rgba(212,162,74,0.8)]" aria-hidden />
          <span className="absolute end-[30%] bottom-[30%] h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]" aria-hidden />
          <span className="relative h-2.5 w-2.5 animate-ping rounded-full bg-emerald-500" aria-hidden />
        </div>

        <div className="mt-3 text-center text-[13px] font-bold text-ink">נמצאו 3 כפילויות בתיק</div>

        <Perf />

        <div className="text-center">
          <div className="text-[12px] font-semibold text-muted">חיסכון פוטנציאלי</div>
          <div className="currency mt-1 text-[28px] font-extrabold leading-none text-emerald-600">
            ~₪<CountUp value={started ? 3400 : 0} duration={1000} format={fmt} />
            <span className="text-[14px] font-bold text-muted"> /שנה</span>
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-faint">נתוני המחשה · בדיקה חינם ללא התחייבות</p>
      </div>
    </div>
  );
}

/* ─────────────────────────── Car-claims · Insurance-History Certificate ─────────────────────────── */

export function HeroCarHistoryCard() {
  const started = useStarted();
  return (
    <div className="glass-elevated relative mx-auto w-full max-w-md overflow-hidden">
      <div className="flex items-center justify-between bg-gradient-to-l from-navy-deep to-[#22366A] px-5 py-3 text-white">
        <span className="flex items-center gap-2 text-[14px] font-extrabold">
          <Car className="h-4 w-4 text-gold-bright" aria-hidden />
          אישור עבר ביטוחי · רכב
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[12px] font-bold text-emerald-200">
          <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
          עבר נקי
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="glass-chip px-3 py-2.5">
            <div className="text-[11px] text-muted">ותק ביטוחי רציף</div>
            <div className="num text-[18px] font-extrabold text-ink">
              <CountUp value={started ? 7 : 0} duration={900} /> שנים
            </div>
          </div>
          <div className="glass-chip px-3 py-2.5">
            <div className="text-[11px] text-muted">תביעות ב-3 שנים</div>
            <div className="num text-[18px] font-extrabold text-emerald-700">
              <CountUp value={started ? 0 : 0} duration={600} />
            </div>
          </div>
        </div>

        <Perf />

        <div className="text-center">
          <div className="text-[12px] font-semibold text-muted">הנחה משוערת על עבר נקי</div>
          <div className="num mt-1 text-[28px] font-extrabold leading-none text-emerald-600">
            עד <CountUp value={started ? 15 : 0} duration={1000} />%
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-faint">נתוני המחשה · האישור מופק מהר הביטוח · בדיקה חינם</p>
      </div>
    </div>
  );
}
