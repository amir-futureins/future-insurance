import type { CSSProperties, ReactNode } from 'react';
import { ArrowLeft, type LucideIcon } from 'lucide-react';

/**
 * PageHero — the airy "Light Luxury Fintech" hero that opens every route,
 * matching /travel-insurance: the soft-slate body canvas shows through (no dark
 * block), lifted by two slow glow orbs + a faint mesh, with a gold-tint eyebrow
 * chip, a deep-navy headline (gold-deep highlight), a muted subtitle, vibrant
 * colored pill badges, a gold primary CTA + a light secondary, and an optional
 * `visual` (side, on lg) or `children` (full-width, below) slot for the white
 * card widgets — so every page reads bright, high-contrast, and highly visual.
 */

interface Cta {
  href: string;
  label: string;
  external?: boolean;
  icon?: LucideIcon;
}

interface PageHeroProps {
  icon: LucideIcon;
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  badges?: string[];
  primary: Cta;
  secondary?: Cta;
  /** Rendered as a side column on lg screens, below the text on mobile. */
  visual?: ReactNode;
  /** Rendered full-width beneath the hero text (e.g. step cards). */
  children?: ReactNode;
}

// Vibrant pill palette cycled across the badges (amber / emerald / coral / sky).
const PILLS = [
  'bg-amber-100 text-amber-900 ring-1 ring-amber-300/70',
  'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300/70',
  'bg-rose-100 text-rose-900 ring-1 ring-rose-300/70',
  'bg-sky-100 text-sky-900 ring-1 ring-sky-300/70',
];

const MESH: CSSProperties = {
  backgroundImage: 'radial-gradient(rgba(20,43,85,0.05) 1px, transparent 1px)',
  backgroundSize: '26px 26px',
  WebkitMaskImage: 'radial-gradient(ellipse 78% 72% at 50% 26%, #000 28%, transparent 84%)',
  maskImage: 'radial-gradient(ellipse 78% 72% at 50% 26%, #000 28%, transparent 84%)',
};

function CtaLink({ cta, variant }: { cta: Cta; variant: 'primary' | 'secondary' }) {
  const Icon = cta.icon;
  const ext = cta.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  const cls =
    variant === 'primary'
      ? 'inline-flex animate-pulse-glow items-center gap-2 rounded-xl bg-cta-fill px-6 py-3.5 text-[16px] font-extrabold text-navy-deep shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(212,162,74,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold'
      : 'inline-flex items-center gap-2 rounded-xl border border-navy/15 bg-white px-5 py-3.5 text-[16px] font-bold text-ink shadow-sm transition-colors hover:bg-navy/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';
  return (
    <a href={cta.href} {...ext} className={cls}>
      {Icon ? <Icon className="h-5 w-5" aria-hidden /> : null}
      {cta.label}
      {variant === 'primary' && !Icon ? <ArrowLeft className="h-5 w-5" aria-hidden /> : null}
    </a>
  );
}

export default function PageHero({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  badges,
  primary,
  secondary,
  visual,
  children,
}: PageHeroProps) {
  const hasVisual = Boolean(visual);
  return (
    <section className="relative overflow-hidden">
      {/* airy ambient glows on the light canvas */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 end-[-4rem] h-[460px] w-[460px] animate-orb-pulse rounded-full bg-glow-gold opacity-50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 start-[-6rem] h-[420px] w-[420px] animate-float-y rounded-full bg-glow-navy opacity-40 blur-3xl"
        style={{ animationDuration: '13s' }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70" style={MESH} />

      <div
        className={
          hasVisual
            ? 'relative mx-auto grid max-w-container items-center gap-10 px-6 pb-14 pt-12 md:px-10 md:pb-16 md:pt-16 lg:grid-cols-2 lg:gap-12'
            : 'relative mx-auto max-w-container px-6 pb-14 pt-14 text-center md:px-10 md:pb-16 md:pt-16'
        }
      >
        <div className={hasVisual ? 'text-center lg:text-start' : 'mx-auto max-w-3xl'}>
          <span className="glass-chip inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold text-gold-deep">
            <Icon className="h-4 w-4" aria-hidden />
            {eyebrow}
          </span>

          <h1
            className={`mt-4 text-[clamp(28px,6.4vw,46px)] font-extrabold leading-[1.1] tracking-[-0.015em] text-ink ${
              hasVisual ? 'mx-auto max-w-xl lg:mx-0' : 'mx-auto max-w-2xl'
            }`}
          >
            {title}
          </h1>

          <p
            className={`mt-4 text-[17px] leading-relaxed text-muted ${
              hasVisual ? 'mx-auto max-w-xl lg:mx-0' : 'mx-auto max-w-xl'
            }`}
          >
            {subtitle}
          </p>

          {badges && badges.length > 0 ? (
            <ul className={`mt-6 flex flex-wrap gap-2.5 ${hasVisual ? 'justify-center lg:justify-start' : 'justify-center'}`}>
              {badges.map((b, i) => (
                <li
                  key={b}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-bold ${PILLS[i % PILLS.length]}`}
                >
                  {b}
                </li>
              ))}
            </ul>
          ) : null}

          <div className={`mt-7 flex flex-wrap items-center gap-3 ${hasVisual ? 'justify-center lg:justify-start' : 'justify-center'}`}>
            <CtaLink cta={primary} variant="primary" />
            {secondary ? <CtaLink cta={secondary} variant="secondary" /> : null}
          </div>
        </div>

        {hasVisual ? <div className="relative">{visual}</div> : null}
      </div>

      {children ? (
        <div className="relative mx-auto mt-2 max-w-container px-6 pb-4 md:px-10">{children}</div>
      ) : null}
    </section>
  );
}
