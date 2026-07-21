'use client';

import { Check, Sparkles, ArrowLeft } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { Provider } from '@/lib/providers';
import { ProviderAction } from './LeadModal';
import { CountUp } from './ui';

export default function ProviderCard({
  provider,
  pricePerDay,
  isRecommended,
}: {
  provider: Provider;
  pricePerDay: number;
  isRecommended: boolean;
}) {
  // Clal's brand cyan is too light for white text, so its solid CTA uses the
  // slightly deeper `glow` cyan; every other provider uses its exact brand hex.
  const ctaColor = provider.id === 'clal' ? provider.glow : provider.brand;

  return (
    <article
      style={
        {
          ['--brand']: provider.brand,
          ['--glow']: provider.glow,
        } as CSSProperties
      }
      aria-label={`${provider.name} — ${provider.tagline}`}
      className={[
        // Uniform footprint for every card — the recommended one is set apart
        // only by its gold ring + badge, never by size or dimming.
        'relative flex h-full flex-col p-6 transition-transform duration-300',
        isRecommended ? 'glass-elevated glass-recommended' : 'glass',
      ].join(' ')}
    >
      {/* recommended overlays */}
      {isRecommended && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 rounded-t-glass-lg bg-recommend-highlight" />
          <div className="pointer-events-none absolute inset-0 rounded-glass-lg bg-recommend-tint" />
        </>
      )}

      {/* brand accent bar on the inline-start (right) edge */}
      <span
        aria-hidden
        className="absolute bottom-5 top-5 start-0 z-10 w-1 rounded-e-full"
        style={{ backgroundColor: 'var(--brand)' }}
      />

      {/* recommended badge (gold, navy text) */}
      {isRecommended && (
        <span className="absolute -top-3 end-5 z-20 inline-flex animate-badge-drop items-center gap-1.5 rounded-full bg-cta-fill px-3 py-1.5 text-[12px] font-bold text-navy-deep shadow-lg shadow-gold/30">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          מומלץ עבורך
        </span>
      )}

      <div className="relative z-10 flex h-full flex-col ps-3">
        {/* header */}
        <header>
          <div
            className="text-xl font-extrabold tracking-tight"
            style={{ color: 'var(--glow)' }}
          >
            {provider.name}
          </div>
          {provider.signature && (
            <div className="mt-1.5 flex gap-1" aria-hidden>
              {provider.signature.map((c) => (
                <span
                  key={c}
                  className="h-1 w-6 rounded-full"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          )}
          <p className="mt-2 text-[13px] leading-snug text-muted">{provider.tagline}</p>
        </header>

        {/* best-for chip */}
        <div className="mt-4">
          <span className="glass-chip inline-block px-3 py-1 text-[12px] font-medium text-ink/80">
            {provider.bestFor}
          </span>
        </div>

        {/* benefits */}
        <ul className="mt-5 space-y-3">
          {provider.features.map((f) => {
            const Icon = f.icon;
            return (
              <li key={f.text} className="flex items-start gap-2.5">
                <span
                  className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${provider.glow} 18%, transparent)`,
                    color: 'var(--glow)',
                  }}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="text-[14px] leading-snug text-ink/90">{f.text}</span>
                <Check
                  className="ms-auto mt-1 h-4 w-4 shrink-0"
                  style={{ color: provider.check }}
                  aria-hidden
                />
              </li>
            );
          })}
        </ul>

        {/* price — mt-auto pins the whole bottom block (price + CTA) to the
            card floor, so all four CTAs align regardless of bullet count */}
        <div className="mt-auto flex items-end justify-between border-t border-navy/10 pt-4">
          <div>
            <div className="text-[12px] text-muted">החל מ־</div>
            <div className="currency text-3xl font-extrabold leading-none text-ink">
              ₪<CountUp value={pricePerDay} />
            </div>
          </div>
          <div className="pb-1 text-[12px] text-muted">ליום לנוסע</div>
        </div>

        {/* CTA — direct affiliate link (PassportCard/Harel) or lead modal */}
        <div className="mt-5">
          <ProviderAction
            provider={provider}
            position="provider_card"
            className="inline-flex h-12 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-[14px] font-extrabold text-white shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            style={{ backgroundColor: ctaColor }}
          >
            {provider.ctaLabel}
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          </ProviderAction>
        </div>
      </div>
    </article>
  );
}
