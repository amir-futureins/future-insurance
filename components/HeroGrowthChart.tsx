import { TrendingUp, Sparkles } from 'lucide-react';
import { estimateGrowth } from '@/lib/estimators';

/**
 * A self-contained, static "dashboard" card for the finance hero — a real
 * compound-growth curve (gold value area + dashed deposits line) computed from
 * a sample scenario, floating as a glass card on the dark hero so a chart is
 * visible before any scroll. Interactive tuning lives in FinanceCalculator just
 * below; this is the eye-catching teaser. Illustrative figures only.
 */

const W = 300;
const H = 148;
const PAD_TOP = 12;

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n));

// Sample scenario: ₪2,000/mo · 25y · 7% average annual return.
const SAMPLE = { monthly: 2000, years: 25, annualRatePct: 7 };

export default function HeroGrowthChart() {
  const { points, finalValue, totalDeposited, totalGain } = estimateGrowth(SAMPLE);
  const maxY = Math.max(finalValue, 1) * 1.08;
  const X = (y: number) => (y / SAMPLE.years) * W;
  const Y = (v: number) => H - (v / maxY) * (H - PAD_TOP);
  const valuePts = points.map((p) => `${X(p.year).toFixed(1)},${Y(p.value).toFixed(1)}`).join(' ');
  const depPts = points.map((p) => `${X(p.year).toFixed(1)},${Y(p.deposited).toFixed(1)}`).join(' ');
  const area = `M0,${H} L${valuePts} L${W},${H} Z`;

  return (
    <div className="glass-elevated relative mx-auto w-full max-w-sm overflow-hidden p-5 ring-1 ring-gold/30 lg:animate-float-y">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-recommend-highlight" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-gold-deep">
            <TrendingUp className="h-4 w-4" aria-hidden />
            תחזית צמיחת הון
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-gold-tint px-2 py-0.5 text-[11px] font-bold text-gold-deep ring-1 ring-gold/25">
            <Sparkles className="h-3 w-3" aria-hidden />
            25 שנים
          </span>
        </div>

        <div className="mt-2 flex items-end gap-1.5">
          <span className="currency text-[30px] font-extrabold leading-none text-ink">
            ₪{fmt(finalValue)}
          </span>
        </div>
        <p className="mt-0.5 text-[12px] text-muted">₪2,000 בחודש · תשואה ~7% שנתי</p>

        <div dir="ltr" className="mt-3 rounded-xl border border-navy/10 bg-white p-3">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            preserveAspectRatio="none"
            style={{ height: 'auto', aspectRatio: `${W} / ${H}` }}
            role="img"
            aria-label={`גרף צמיחה לדוגמה: לאחר ${SAMPLE.years} שנים החיסכון מגיע לכ-${fmt(finalValue)} שקלים`}
          >
            <defs>
              <linearGradient id="hero-fin-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4A24A" stopOpacity="0.38" />
                <stop offset="100%" stopColor="#D4A24A" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="0" y1={H - 0.5} x2={W} y2={H - 0.5} stroke="rgba(20,43,85,0.12)" strokeWidth="1" />
            <path d={area} fill="url(#hero-fin-fill)" />
            <polyline
              points={depPts}
              fill="none"
              stroke="#142B55"
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeLinejoin="round"
              opacity="0.55"
            />
            <polyline
              points={valuePts}
              fill="none"
              stroke="#B98C42"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
          <div className="mt-2 flex items-center justify-between text-[11px] text-faint" dir="ltr">
            <span className="num">היום</span>
            <span className="num">25 שנים</span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2" dir="rtl">
          <div className="rounded-xl bg-navy/[0.04] px-3 py-2">
            <div className="text-[11px] font-semibold text-muted">סך הפקדות</div>
            <div className="currency text-[14px] font-bold text-ink">₪{fmt(totalDeposited)}</div>
          </div>
          <div className="rounded-xl bg-harel-green/10 px-3 py-2">
            <div className="text-[11px] font-bold text-ink">רווח מריבית דריבית</div>
            <div className="currency text-[14px] font-extrabold text-harel-green">₪{fmt(totalGain)}</div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[10.5px] font-semibold text-faint">מסלולים מובילים:</span>
          {['S&P 500', 'מנייתי', 'כללי'].map((t) => (
            <span key={t} className="rounded-full bg-navy/[0.05] px-2 py-0.5 text-[10.5px] font-bold text-navy ring-1 ring-navy/10">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
