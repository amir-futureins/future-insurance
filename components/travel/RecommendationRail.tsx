'use client';

import { Sparkles, ChevronDown, ArrowLeft, ShieldCheck } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { Recommendation } from '@/lib/calculator';
import type { Provider } from '@/lib/providers';
import { ProviderAction } from './LeadModal';
import { CountUp } from './ui';

/**
 * Live radial "match gauge" — the gold arc + number both micro-animate whenever
 * the confidence changes (CSS transition on the arc, count-up on the number).
 */
function MatchGauge({ value }: { value: number }) {
  const R = 20;
  const CIRC = 2 * Math.PI * R;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = CIRC * (1 - clamped / 100);
  return (
    <div
      className="relative grid h-[58px] w-[58px] shrink-0 place-items-center"
      role="img"
      aria-label={`${clamped}% התאמה לפרופיל`}
    >
      <svg viewBox="0 0 48 48" className="h-[58px] w-[58px] -rotate-90" aria-hidden>
        <circle cx="24" cy="24" r={R} fill="none" stroke="rgba(20,43,85,0.1)" strokeWidth="4" />
        <circle
          cx="24"
          cy="24"
          r={R}
          fill="none"
          stroke="#D4A24A"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="num absolute text-[14px] font-extrabold text-ink" aria-hidden>
        <CountUp value={clamped} />%
      </span>
    </div>
  );
}

/**
 * The live recommendation card. A concise sr-only status is the only live
 * region (so the per-frame price count-up is never voiced). Visually it shares
 * the gold house glow with the matching provider card below.
 */
export default function RecommendationRail({
  recommendation,
  provider,
  pricePerDay,
}: {
  recommendation: Recommendation;
  provider: Provider;
  pricePerDay: number;
}) {
  return (
    <aside
      aria-label="ההמלצה שלנו"
      style={
        {
          ['--brand']: provider.brand,
          ['--glow']: provider.glow,
        } as CSSProperties
      }
      className="glass-elevated glass-recommended relative overflow-hidden p-6"
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {`המלצה עבורך: ${provider.name}, התאמה ${recommendation.confidence} אחוז.${
          recommendation.reasons[0] ? ' ' + recommendation.reasons[0].label : ''
        }`}
      </p>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-recommend-highlight" />

      <div className="relative">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gold" aria-hidden />
          <span className="eyebrow text-[13px]">ההמלצה שלנו</span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div
              className="animate-content-swap text-[26px] font-extrabold leading-none tracking-tight"
              key={provider.id}
              style={{ color: 'var(--glow)' }}
            >
              {provider.name}
            </div>
            <div className="mt-1.5 text-[12px] font-semibold text-muted">
              התאמה לפרופיל שלכם
            </div>
          </div>
          <MatchGauge value={recommendation.confidence} />
        </div>

        {recommendation.reasons[0] && (
          <p
            key={recommendation.reasons[0].code}
            className="mt-3 animate-content-swap text-[14px] leading-snug text-ink/85"
          >
            {recommendation.reasons[0].label}
          </p>
        )}

        <div className="mt-5 flex items-end gap-2">
          <span className="text-[13px] text-muted">החל מ־</span>
          <span className="currency text-[clamp(30px,4vw,36px)] font-extrabold leading-none text-ink">
            ₪<CountUp value={pricePerDay} />
          </span>
          <span className="pb-1 text-[13px] text-muted">ליום לנוסע</span>
        </div>

        <ProviderAction
          provider={provider}
          position="recommendation_rail"
          className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-cta-fill px-4 py-3.5 text-[16px] font-extrabold text-navy-deep shadow-lg shadow-gold/40 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_26px_rgba(212,162,74,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright"
        >
          קבלו הצעה
          <ArrowLeft className="h-4 w-4" aria-hidden />
        </ProviderAction>

        <details className="group mt-3">
          <summary className="flex items-center justify-center gap-1 text-[13px] font-semibold text-gold-deep">
            למה מומלצת עבורי?
            <ChevronDown className="faq-chevron h-4 w-4 transition-transform" aria-hidden />
          </summary>
          <ul className="mt-3 space-y-2 rounded-xl bg-gold-tint p-3">
            {recommendation.reasons.map((r) => (
              <li key={r.code} className="flex items-start gap-2 text-[13px] text-ink/85">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                {r.label}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </aside>
  );
}
