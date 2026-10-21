'use client';

import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Radar,
  Landmark,
  Stethoscope,
  Check,
  Car,
  BadgeCheck,
} from 'lucide-react';
import { estimateLife, HEALTH_COVERAGES } from '@/lib/estimators';
import { CountUp } from '@/components/travel/ui';

/**
 * Hero visual cards, one per vertical, sitting in the START-side (left) column
 * of each 2-col hero. Health/Life show a premium for a stated sample scenario
 * (labelled "המחשה בלבד"); mortgage, Har HaBituach and car history are plain
 * checklists — no savings figures appear unless the user entered the inputs.
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

/* ─────────────────────────── Mortgage ─────────────────────────── */

/** Plain "what we check" card — no figures, no simulated results. */
function ChecklistCard({ icon: Icon, title, items }: { icon: typeof Landmark; title: string; items: string[] }) {
  return (
    <div className="glass-elevated relative mx-auto w-full max-w-md overflow-hidden">
      <div className="flex items-center gap-2 bg-gradient-to-l from-navy-deep to-[#22366A] px-5 py-3 text-[14px] font-extrabold text-white">
        <Icon className="h-4 w-4 text-gold-bright" aria-hidden />
        {title}
      </div>
      <ul className="space-y-3 p-5 sm:p-6">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-2.5 text-[14.5px] font-medium text-ink/90">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
            {t}
          </li>
        ))}
      </ul>
      <p className="px-5 pb-4 text-center text-[11px] text-faint sm:px-6">בדיקה ללא עלות וללא התחייבות</p>
    </div>
  );
}

export function HeroMortgageCard() {
  return (
    <ChecklistCard
      icon={Landmark}
      title="מה בודקים בביטוח המשכנתא"
      items={[
        'ביטוח חיים לכל אחד מהלווים',
        'ביטוח מבנה לפי דרישות הבנק',
        'השוואה מול המחיר שהבנק מציע',
        'ליווי בהעברת הפוליסה לבנק',
      ]}
    />
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
        <p className="mt-3 text-[11px] text-faint">המחשה בלבד · גיל 35 · ריסק · הכנסה ₪12,000</p>
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
        <p className="mt-2 text-[11px] text-faint">המחשה בלבד · התוצאה תלויה בנתונים שלכם</p>
      </div>
    </div>
  );
}

/* ─────────────────────────── Har-Habituach ─────────────────────────── */

export function HeroHarCard() {
  return (
    <ChecklistCard
      icon={Radar}
      title="מה בודקים בתיק הביטוח"
      items={[
        'עוברים יחד על דוח הר הביטוח שהפקתם',
        'מזהים כיסויים חופפים בין פוליסות',
        'מסמנים מה כדאי לבטל ומה לשמור',
        'מלווים באיחוד התיק מול החברות',
      ]}
    />
  );
}

/* ─────────────────────────── Car-claims · Insurance-History Certificate ─────────────────────────── */

export function HeroCarHistoryCard() {
  return (
    <ChecklistCard
      icon={Car}
      title="אישור עבר ביטוחי לרכב"
      items={[
        'הסבר איך מפיקים את האישור',
        'בדיקה שהוותק והתביעות רשומים נכון',
        'השוואת הצעות לביטוח הרכב',
      ]}
    />
  );
}
