import { ArrowLeft, Sparkles } from 'lucide-react';

/**
 * High-impact promo banner with an animated navy→indigo mesh + glow orbs and a
 * gold CTA. Fills otherwise-plain sections with visual life.
 */
export default function PromoBanner({
  eyebrow,
  title,
  text,
  ctaLabel,
  ctaHref,
  external,
}: {
  eyebrow?: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  external?: boolean;
}) {
  return (
    <section className="mx-auto w-full max-w-container px-6 py-8 md:px-10">
      <div className="relative overflow-hidden rounded-glass-lg bg-gradient-to-br from-[#1e3a70] via-navy to-navy-deep p-7 shadow-[0_24px_60px_-28px_rgba(20,43,85,0.6)] sm:p-9">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 end-[-3rem] h-64 w-64 rounded-full bg-glow-gold opacity-40 blur-3xl animate-orb-pulse"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-4rem] start-[-2rem] h-64 w-64 rounded-full bg-glow-royal opacity-50 blur-3xl animate-float-y"
        />
        <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-start">
          <div className="min-w-0">
            {eyebrow ? (
              <span className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-gold-bright">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                {eyebrow}
              </span>
            ) : null}
            <div className="mt-1 text-[clamp(20px,3.5vw,26px)] font-extrabold leading-tight text-white">
              {title}
            </div>
            <div className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-white/75">{text}</div>
          </div>
          <a
            href={ctaHref}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="inline-flex shrink-0 animate-pulse-glow items-center gap-2 rounded-xl bg-cta-fill px-6 py-3.5 text-[16px] font-extrabold text-navy-deep shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(212,162,74,0.75)]"
          >
            {ctaLabel}
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
