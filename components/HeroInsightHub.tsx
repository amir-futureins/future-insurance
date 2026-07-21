'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ScanLine, TrendingUp, ArrowLeft } from 'lucide-react';
import { estimateGrowth } from '@/lib/estimators';
import { CountUp } from '@/components/travel/ui';

/**
 * HeroInsightHub — the homepage "WOW" Visual Insight Hub: three CRISP WHITE
 * glass widgets that pop hard against the dark-navy hero (passed as PageHero's
 * `visual`). Deep-navy type on white for full readability, with vivid emerald
 * and gold accents.
 *   A · 🔍 duplicate-insurance alarm — a green savings gauge (₪3,400/yr).
 *   B · 💸 pension-fee "robbery" — a real, computed bar chart (₪850/mo·30y·7%,
 *        2% vs 0.8% fees → ₪707,420 vs ₪887,244, a ₪179,824 gap).
 *   C · 📈 illustrative investment-track returns — an auto-rotating carousel.
 * Honesty: Card B is COMPUTED and defensible; Card A's "87%" is flagged an
 * estimate (and decoupled from the gauge width); Card C shows GENERIC tracks
 * (no fabricated returns pinned to a named insurer) with clear illustrative
 * labels. The JS auto-rotate is gated by reduced-motion + hover/focus + tab
 * visibility; meter/bars use CSS grow-* so they render full when motion is off.
 */

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n));
const kShekel = (n: number) => `₪${Math.round(n / 1000)}K`;

/* ---- Card B: real fee math (monthly compound, 30y, 7% gross) ---- */
const FEE_GOOD = estimateGrowth({ monthly: 850, years: 30, annualRatePct: 7 - 0.8 }).finalValue; // ₪887,244
const FEE_BAD = estimateGrowth({ monthly: 850, years: 30, annualRatePct: 7 - 2.0 }).finalValue; //  ₪707,420
const FEE_DELTA = FEE_GOOD - FEE_BAD; // ₪179,824
const BAD_BAR_PCT = Math.round((FEE_BAD / FEE_GOOD) * 100); // 80

/* ---- Card C: GENERIC illustrative tracks (not attributed to any named firm) ---- */
const TRACKS = [
  { label: 'מסלול מנייתי S&P 500', ret: '+14.2%' },
  { label: 'מסלול כללי', ret: '+9.8%' },
  { label: 'מסלול מדד ת״א 125', ret: '+11.4%' },
  { label: 'מסלול אג״ח ממשלתי', ret: '+4.3%' },
];

export default function HeroInsightHub() {
  const [started, setStarted] = useState(false);
  const [slide, setSlide] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [liveMsg, setLiveMsg] = useState('');
  const touchX = useRef<number | null>(null);

  // Kick the count-up tickers 0 → target once mounted.
  useEffect(() => setStarted(true), []);

  // Track reduced-motion + tab visibility (both gate the auto-rotate).
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener?.('change', sync);
    const onVis = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      mq.removeEventListener?.('change', sync);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  // Auto-advance the carousel — paused on hover/focus, tab-hidden, reduced-motion.
  useEffect(() => {
    if (hovered || hidden || reduced) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % TRACKS.length), 3500);
    return () => clearInterval(id);
  }, [hovered, hidden, reduced]);

  // Manual navigation (dots/swipe) — announces via aria-live; auto-rotate stays silent.
  const go = (n: number) => {
    const idx = (n + TRACKS.length) % TRACKS.length;
    setSlide(idx);
    setLiveMsg(`${TRACKS[idx].label}: תשואה ${TRACKS[idx].ret} להמחשה`);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(slide + (dx < 0 ? 1 : -1)); // swipe left = next
    touchX.current = null;
  };

  return (
    <div dir="rtl" className="mx-auto flex w-full min-w-0 max-w-[460px] flex-col gap-4 lg:max-w-none">
      {/* ───────── Card A · duplicate-insurance alarm ───────── */}
      <article className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xl transition-transform duration-300 hover:scale-[1.02] animate-pulse-glow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy/5 text-[18px] ring-1 ring-navy/10" aria-hidden>
              🔍
            </span>
            <span className="text-[15px] font-extrabold text-ink">אזעקת כפילויות ביטוח</span>
          </div>
          <span aria-hidden className="relative grid h-2.5 w-2.5 place-items-center">
            <span className="absolute inset-0 animate-twinkle rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          </span>
        </div>

        <p className="mt-3 text-[17px] font-extrabold leading-snug text-ink">
          <span className="text-emerald-600">87%*</span> מהבתים מחזיקים כפל כיסויים מיותר
        </p>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[12.5px] font-medium text-muted">חיסכון ממוצע בזיהוי כפילויות</span>
            <span className="currency text-[19px] font-extrabold text-emerald-600" aria-label="חיסכון ממוצע כ-3,400 שקלים בשנה">
              <span aria-hidden>
                ₪<CountUp value={started ? 3400 : 0} duration={900} format={fmt} />/שנה
              </span>
            </span>
          </div>
          <div className="relative mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-slate-200">
            <div
              className="absolute inset-y-0 start-0 origin-right animate-grow-x rounded-full bg-gradient-to-l from-emerald-400 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
              style={{ width: '82%' }}
            >
              <span
                aria-hidden
                className="absolute inset-0 animate-sheen bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)] bg-[length:200%_100%]"
              />
            </div>
          </div>
        </div>

        <Link
          href="/har-habituach#checker"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cta-fill px-4 py-3 text-[15px] font-extrabold text-navy-deep shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-[0_0_26px_rgba(212,162,74,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <ScanLine className="h-5 w-5" aria-hidden />
          לסריקה מיידית — חינם
        </Link>
        <p className="mt-2 text-center text-[11px] text-faint">*הערכה להמחשה בלבד</p>
      </article>

      {/* ───────── Card B · pension-fee robbery (computed) ───────── */}
      <article className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xl transition-transform duration-300 hover:scale-[1.02]">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy/5 text-[18px] ring-1 ring-navy/10" aria-hidden>
            💸
          </span>
          <span className="text-[15px] font-extrabold text-ink">שוד דמי הניהול בפנסיה</span>
        </div>

        <div className="mt-4 flex items-end justify-center gap-7">
          {/* bad bar: 2% fees — amber fill + red "stolen" ghost cap */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="currency text-[12px] font-bold text-ink">{kShekel(FEE_BAD)}</span>
            <div className="relative flex h-[96px] w-11 flex-col justify-end overflow-hidden rounded-t-lg bg-slate-100">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 border border-dashed border-red-400/60 [background:repeating-linear-gradient(45deg,rgba(248,113,113,0.22)_0,rgba(248,113,113,0.22)_5px,transparent_5px,transparent_10px)]"
              />
              <div
                className="relative origin-bottom animate-grow-y rounded-t-lg bg-gradient-to-t from-amber-500 to-amber-400"
                style={{ height: `${BAD_BAR_PCT}%` }}
              />
            </div>
            <span className="text-[11px] font-medium text-muted">2% דמי ניהול</span>
          </div>

          {/* good bar: 0.8% fees — vivid green */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="currency text-[12px] font-bold text-emerald-600">{kShekel(FEE_GOOD)}</span>
            <div className="flex h-[96px] w-11 flex-col justify-end overflow-hidden rounded-t-lg bg-slate-100">
              <div
                className="origin-bottom animate-grow-y rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.35)] [animation-delay:160ms]"
                style={{ height: '100%' }}
              />
            </div>
            <span className="text-[11px] font-medium text-muted">0.8% דמי ניהול</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-[12px] font-medium text-muted">הפער אחרי 30 שנה</div>
          <div className="currency text-[27px] font-extrabold leading-tight text-emerald-600" aria-label={`הפער כ-${fmt(FEE_DELTA)} שקלים`}>
            <span aria-hidden>
              ₪<CountUp value={started ? FEE_DELTA : 0} duration={1100} format={fmt} />
            </span>
          </div>
        </div>

        <p className="mt-2 text-center text-[11px] text-faint">תרחיש להמחשה · ₪850/חודש · 30 שנה · 7% תשואה ברוטו</p>
        <Link
          href="/finance"
          className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-gold/60 bg-gold-tint px-4 py-2.5 text-[14px] font-bold text-ink transition-colors hover:bg-gold/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          למחשבון דמי הניהול
          <ArrowLeft className="h-4 w-4" aria-hidden />
        </Link>
      </article>

      {/* ───────── Card C · illustrative track returns ───────── */}
      <article
        className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setHovered(true)}
        onBlurCapture={() => setHovered(false)}
      >
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy/5 text-[18px] ring-1 ring-navy/10" aria-hidden>
            📈
          </span>
          <span className="text-[15px] font-extrabold text-ink">מסלולי השקעה ותשואות</span>
        </div>

        <div
          className="relative mt-4 min-h-[80px]"
          role="group"
          aria-roledescription="קרוסלה"
          aria-label="תשואות מסלולי השקעה להמחשה"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {TRACKS.map((t, i) => (
            <div
              key={t.label}
              aria-hidden={i !== slide}
              className={`${i === slide ? 'relative opacity-100' : 'pointer-events-none absolute inset-0 opacity-0'} transition-opacity duration-300`}
            >
              <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3.5 ring-1 ring-slate-200/70">
                <div className="min-w-0">
                  <div className="truncate text-[14.5px] font-extrabold text-ink">{t.label}</div>
                  <div className="text-[11.5px] text-faint">טווח להמחשה · 12 ח׳ אחרונים</div>
                </div>
                <span className="currency inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-[15px] font-extrabold text-emerald-800">
                  <TrendingUp className="h-4 w-4" aria-hidden />
                  {t.ret}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* dots */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {TRACKS.map((t, i) => (
            <button
              key={t.label}
              type="button"
              onClick={() => go(i)}
              aria-label={`מסלול ${i + 1}: ${t.label}`}
              aria-current={i === slide}
              className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-5 bg-gold-deep' : 'w-1.5 bg-navy/20 hover:bg-navy/40'}`}
            />
          ))}
        </div>

        <span className="sr-only" aria-live="polite">
          {liveMsg}
        </span>

        <p className="mt-3 text-center text-[11.5px] text-muted">
          מהחברות המובילות: <span className="font-semibold text-ink">הראל · מגדל · כלל · הפניקס</span>
        </p>

        <Link
          href="/finance"
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-gold/60 bg-gold-tint px-4 py-2.5 text-[14px] font-bold text-ink transition-colors hover:bg-gold/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          לכל המסלולים והתשואות
          <ArrowLeft className="h-4 w-4" aria-hidden />
        </Link>
        <p className="mt-2 text-center text-[11px] text-faint">
          נתוני המחשה בלבד · אינם תשואות רשמיות · תשואות עבר אינן מבטיחות עתיד
        </p>
      </article>
    </div>
  );
}
