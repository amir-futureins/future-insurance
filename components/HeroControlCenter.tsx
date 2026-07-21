'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ScanLine } from 'lucide-react';
import { CountUp } from '@/components/travel/ui';

/**
 * HeroControlCenter — the homepage "כרטיס הפינטק הדיגיטלי": a light-luxury
 * glass pass with a live gold scan line, a metallic live-savings counter, an
 * interactive vertical tab selector that swaps the live figure, and three
 * floating peripheral badges. Figures are illustrative "from/estimate" values
 * (labelled נתוני המחשה), consistent with the rest of the site's widgets.
 */

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n));

const TABS = [
  { key: 'har', label: 'הר הביטוח', prefix: '₪', value: 3840, suffix: '', desc: 'חיסכון ממוצע למשפחה', sub: 'סריקת כפילויות בזמן אמת', accent: '#15803D', href: '/har-habituach#checker', cta: 'לסריקת כפילויות' },
  { key: 'finance', label: 'פנסיה', prefix: '₪', value: 1620143, suffix: '', desc: 'צפי צבירה ל-25 שנה', sub: 'ריבית דריבית · דמי ניהול', accent: '#0057B8', href: '/finance#calculator', cta: 'לסימולטור הצמיחה' },
  { key: 'mortgage', label: 'משכנתא', prefix: 'עד ', value: 30, suffix: '%', desc: 'חיסכון מול מחיר הבנק', sub: 'ביטוח חיים + מבנה', accent: '#8A6220', href: '/mortgage#calculator', cta: 'לחישוב החיסכון' },
  { key: 'travel', label: 'חו״ל', prefix: 'מ-₪', value: 8, suffix: '', desc: 'ליום לנוסע', sub: '4 חברות · פוליסה מיידית', accent: '#0369A1', href: '/travel-insurance#calculator', cta: 'להשוואת מחיר' },
];

export default function HeroControlCenter() {
  const [started, setStarted] = useState(false);
  const [tab, setTab] = useState(0);
  useEffect(() => setStarted(true), []);
  const active = TABS[tab];

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* floating peripheral badges */}
      <span className="pointer-events-none absolute -top-3.5 -start-2 z-20 hidden animate-float items-center gap-1 rounded-full border border-gold/50 bg-white/90 px-3 py-1.5 text-[11.5px] font-bold text-ink shadow-lg backdrop-blur sm:flex">
        🛡️ סוכנות מורשה ומפוקחת
      </span>
      <span
        className="pointer-events-none absolute -bottom-4 -end-2 z-20 hidden animate-float items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-[11.5px] font-bold text-emerald-900 shadow-lg sm:flex"
        style={{ animationDelay: '1.4s' }}
      >
        ⚡ נמצא כפל ביטוח! חיסכון ₪420/חודש
      </span>
      <span
        className="pointer-events-none absolute -top-4 end-10 z-20 hidden animate-float items-center gap-1 rounded-full border border-sky-300 bg-sky-50 px-3 py-1.5 text-[11.5px] font-bold text-sky-900 shadow-lg lg:flex"
        style={{ animationDelay: '0.7s' }}
      >
        🤖 98.2% דיוק סריקה
      </span>

      {/* main pass card */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-300/40 bg-gradient-to-br from-white/95 to-slate-100/90 p-6 shadow-2xl backdrop-blur-xl">
        {/* live gold scan line */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] animate-scan bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_10px_rgba(251,191,36,0.7)]"
        />

        <div className="relative flex items-center justify-between">
          <span className="flex items-center gap-2 text-[14px] font-extrabold text-ink">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-navy text-amber-400 ring-1 ring-gold/30">
              <ScanLine className="h-4 w-4" aria-hidden />
            </span>
            כרטיס הפינטק הדיגיטלי
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 ring-1 ring-emerald-200">
            <span className="relative grid h-2 w-2 place-items-center" aria-hidden>
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/70" />
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            סריקה בזמן אמת
          </span>
        </div>

        {/* live metric */}
        <div className="relative mt-5 text-center">
          <div className="currency text-[clamp(30px,7vw,44px)] font-extrabold leading-none">
            <span className="bg-gradient-to-b from-emerald-800 via-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              {active.prefix}
              <CountUp value={started ? active.value : 0} duration={800} format={fmt} />
              {active.suffix}
            </span>
          </div>
          <div className="mt-1.5 text-[14px] font-bold text-ink">{active.desc}</div>
          <div className="text-[12px] text-muted">{active.sub}</div>
        </div>

        {/* tab selector */}
        <div className="mt-5 grid grid-cols-4 gap-1.5" role="group" aria-label="בחירת תחום">
          {TABS.map((t, i) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={i === tab}
              onClick={() => setTab(i)}
              className={`rounded-xl px-1 py-2 text-[12px] font-bold transition-colors ${
                i === tab ? 'text-white shadow-sm' : 'bg-slate-100 text-ink hover:bg-slate-200'
              }`}
              style={i === tab ? { backgroundColor: t.accent } : undefined}
            >
              {t.label}
            </button>
          ))}
        </div>

        <Link
          href={active.href}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cta-fill px-4 py-3 text-[15px] font-extrabold text-navy-deep shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-[0_0_26px_rgba(212,162,74,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          {active.cta}
          <ArrowLeft className="h-4 w-4" aria-hidden />
        </Link>
        <p className="mt-2 text-center text-[11px] text-faint">נתוני המחשה · ההערכה מתעדכנת לפי הנתונים שלכם</p>
      </div>
    </div>
  );
}
