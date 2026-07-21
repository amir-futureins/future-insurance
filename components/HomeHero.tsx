'use client';

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { Zap, MessageCircle, ArrowLeft, Check, Rocket } from 'lucide-react';
import { whatsappHref } from '@/lib/content';
import { AGENCY_TRUST } from '@/lib/agency';
import { CountUp } from '@/components/travel/ui';
import HeroControlCenter from '@/components/HeroControlCenter';

/**
 * HomeHero — a tight, balanced RTL 12-col split that eliminates the old top-right
 * "dead zone": the START (right) column is packed top-to-bottom with a pulsing
 * gold pill, a gold→navy gradient headline, a value-prop subtitle with inline
 * highlight tags, a LIVE quick-quote launchpad (vertical tabs → animated estimate
 * counter), dual CTAs and a trust strip — sized to balance the tall white
 * HeroInsightHub cards in the END (left) column. Launchpad figures are
 * illustrative "from/estimate" numbers (labelled), consistent with the widgets.
 */

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n));
const plain = (n: number) => String(Math.round(n));

const LAUNCH = [
  { tab: 'חו״ל', emoji: '✈️', value: 8, format: plain, prefix: 'מ-₪', suffix: ' ליום', label: 'ביטוח נסיעות לכל יעד', href: '/travel-insurance#calculator', cta: 'למחשבון נסיעות' },
  { tab: 'הר הביטוח', emoji: '🔍', value: 3400, format: fmt, prefix: '~₪', suffix: ' בשנה', label: 'חיסכון ממוצע בזיהוי כפילויות', href: '/har-habituach#checker', cta: 'לסריקת כפילויות' },
  { tab: 'פנסיה', emoji: '📈', value: 1620143, format: fmt, prefix: '₪', suffix: '', label: 'צפי צבירה ל-25 שנה (₪2,000/ח׳)', href: '/finance#calculator', cta: 'לסימולטור' },
  { tab: 'משכנתא', emoji: '🏠', value: 50, format: plain, prefix: 'עד ', suffix: '%', label: 'חיסכון מול מחיר הבנק', href: '/mortgage#calculator', cta: 'לחישוב המשכנתא' },
];

const MESH: CSSProperties = {
  backgroundImage: 'radial-gradient(rgba(20,43,85,0.05) 1px, transparent 1px)',
  backgroundSize: '26px 26px',
  WebkitMaskImage: 'radial-gradient(ellipse 78% 72% at 50% 26%, #000 28%, transparent 84%)',
  maskImage: 'radial-gradient(ellipse 78% 72% at 50% 26%, #000 28%, transparent 84%)',
};

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="mx-0.5 inline-flex items-center gap-1 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[14px] font-bold text-emerald-800">
      <Check className="h-3.5 w-3.5" aria-hidden />
      {children}
    </span>
  );
}

export default function HomeHero() {
  const [tab, setTab] = useState(1); // default: הר הביטוח
  const active = LAUNCH[tab];

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-24 end-[-4rem] h-[460px] w-[460px] animate-orb-pulse rounded-full bg-glow-gold opacity-50 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute top-40 start-[-6rem] h-[420px] w-[420px] animate-float-y rounded-full bg-glow-navy opacity-40 blur-3xl" style={{ animationDuration: '13s' }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70" style={MESH} />

      <div className="relative mx-auto max-w-container px-6 pb-14 pt-10 md:px-10 md:pt-12 lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-8">
        {/* START (right) — copy + launchpad */}
        <div className="flex flex-col justify-center gap-5 text-center lg:col-span-6 lg:text-start">
          <div className="mx-auto w-fit lg:mx-0">
            <span className="inline-flex animate-pulse-glow items-center gap-2 rounded-full border border-gold/50 bg-gold-tint px-4 py-1.5 text-[12.5px] font-bold text-navy shadow-sm">
              <Rocket className="h-3.5 w-3.5 text-gold-deep" aria-hidden />
              🚀 טכנולוגיית הביטוח המתקדמת בישראל 2026
            </span>
          </div>

          <h1 className="mx-auto max-w-xl text-[clamp(30px,6.4vw,50px)] font-black leading-[1.08] tracking-[-0.02em] text-ink lg:mx-0">
            Future Insurance —{' '}
            <span className="animate-sheen bg-[linear-gradient(100deg,#8A6220,#142B55,#8A6220)] bg-[length:220%_auto] bg-clip-text text-transparent">
              הביטוח החכם של המחר
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-[17px] leading-relaxed text-muted lg:mx-0">
            כל עולמות הביטוח במקום אחד — מחשבונים חכמים שמראים בדיוק מה נכון עבורכם:{' '}
            <Tag>ללא טפסים</Tag>
            <Tag>חיסכון מוכח</Tag>
            <Tag>ייעוץ אובייקטיבי 100%</Tag>
          </p>

          {/* LIVE quick-quote launchpad */}
          <div className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xl lg:mx-0">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-muted">
              <Zap className="h-4 w-4 text-gold-deep" aria-hidden />
              חישוב חיסכון מהיר — בחרו תחום
            </div>
            <div className="mt-2.5 grid grid-cols-4 gap-1.5" role="group" aria-label="בחירת תחום לחישוב">
              {LAUNCH.map((l, i) => (
                <button
                  key={l.tab}
                  type="button"
                  aria-pressed={i === tab}
                  onClick={() => setTab(i)}
                  className={`flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[12px] font-bold transition-colors ${
                    i === tab
                      ? 'bg-navy text-white shadow-sm'
                      : 'bg-slate-100 text-ink hover:bg-slate-200'
                  }`}
                >
                  <span aria-hidden className="text-[15px] leading-none">{l.emoji}</span>
                  <span className="leading-none">{l.tab}</span>
                </button>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/70">
              <div className="min-w-0">
                <div className="truncate text-[11.5px] font-medium text-muted">{active.label}</div>
                <div className="currency text-[clamp(22px,4.5vw,28px)] font-extrabold leading-none text-emerald-600">
                  {active.prefix}
                  <CountUp value={active.value} duration={600} format={active.format} />
                  {active.suffix}
                </div>
              </div>
              <Link
                href={active.href}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-cta-fill px-3.5 py-2.5 text-[13px] font-extrabold text-navy-deep shadow-sm transition-transform hover:-translate-y-0.5"
              >
                {active.cta}
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <p className="mt-1.5 text-[10.5px] text-faint">* הערכות להמחשה — התוצאה בפועל נקבעת לפי הנתונים שלכם</p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a
              href="#verticals"
              className="inline-flex animate-pulse-glow items-center gap-2 rounded-xl bg-cta-fill px-6 py-3.5 text-[16px] font-extrabold text-navy-deep shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(212,162,74,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <Zap className="h-5 w-5" aria-hidden />
              חישוב חיסכון מיידי
            </a>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-navy/15 bg-white px-5 py-3.5 text-[16px] font-bold text-ink shadow-sm transition-colors hover:bg-navy/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <MessageCircle className="h-5 w-5 text-[#25D366]" aria-hidden />
              שיחה עם מומחה
            </a>
          </div>

          {/* trust strip — fills the column + adds credibility */}
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 pt-1 lg:justify-start">
            {AGENCY_TRUST.map((b) => (
              <li key={b} className="flex items-center gap-1.5 text-[13px] font-medium text-ink/75">
                <Check className="h-4 w-4 text-gold-deep" aria-hidden />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* END (left) — smart digital control center */}
        <div className="mt-12 lg:col-span-6 lg:mt-0 lg:self-center">
          <HeroControlCenter />
        </div>
      </div>
    </section>
  );
}
