import type { CSSProperties } from 'react';
import Link from 'next/link';
import { MessageCircle, ArrowLeft, Check, Phone } from 'lucide-react';
import { SITE, TRAVEL_URL, whatsappHref } from '@/lib/content';
import { AGENCY_TRUST } from '@/lib/agency';
import HeroControlCenter from '@/components/HeroControlCenter';

/**
 * HomeHero — RTL 12-col split: the START (right) column carries the headline,
 * a plain value-prop subtitle, quick links into each vertical, dual CTAs and a
 * trust strip; the END (left) column holds the illustrative HeroControlCenter.
 * No figures appear here: every number on the site is either the user's own
 * calculator result or a labelled illustration.
 */

const QUICK = [
  { emoji: '✈️', label: 'ביטוח נסיעות', href: TRAVEL_URL },
  { emoji: '🔍', label: 'הר הביטוח', href: '/har-habituach' },
  { emoji: '📈', label: 'פנסיה וגמל', href: '/finance' },
  { emoji: '🏠', label: 'משכנתא', href: '/mortgage' },
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
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-24 end-[-4rem] h-[460px] w-[460px] animate-orb-pulse rounded-full bg-glow-gold opacity-50 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute top-40 start-[-6rem] h-[420px] w-[420px] animate-float-y rounded-full bg-glow-navy opacity-40 blur-3xl" style={{ animationDuration: '13s' }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70" style={MESH} />

      <div className="relative mx-auto max-w-container px-6 pb-14 pt-10 md:px-10 md:pt-12 lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-8">
        {/* START (right) — copy + launchpad */}
        <div className="flex flex-col justify-center gap-5 text-center lg:col-span-6 lg:text-start">
          <h1 className="mx-auto max-w-xl text-[clamp(30px,6.4vw,50px)] font-black leading-[1.08] tracking-[-0.02em] text-ink lg:mx-0">
            Future Insurance —{' '}
            <span className="animate-sheen bg-[linear-gradient(100deg,#8A6220,#142B55,#8A6220)] bg-[length:220%_auto] bg-clip-text text-transparent">
              הביטוח החכם של המחר
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-[17px] leading-relaxed text-muted lg:mx-0">
            כל עולמות הביטוח במקום אחד — מחשבונים להערכה ראשונית וליווי אישי של סוכן ביטוח
            מורשה:{' '}
            <Tag>ללא עלות</Tag>
            <Tag>ללא התחייבות</Tag>
          </p>

          {/* quick links into each vertical */}
          <nav
            aria-label="בחירת תחום"
            className="mx-auto grid w-full max-w-xl grid-cols-2 gap-2 sm:grid-cols-4 lg:mx-0"
          >
            {QUICK.map((q) => (
              <Link
                key={q.label}
                href={q.href}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-2 py-3 text-[14px] font-bold text-ink shadow-sm transition-colors hover:bg-gold-tint"
              >
                <span aria-hidden>{q.emoji}</span>
                {q.label}
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a
              href="#verticals"
              className="inline-flex items-center gap-2 rounded-xl bg-cta-fill px-6 py-3.5 text-[16px] font-extrabold text-navy-deep shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(212,162,74,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
              לכל תחומי הביטוח
            </a>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-navy/15 bg-white px-5 py-3.5 text-[16px] font-bold text-ink shadow-sm transition-colors hover:bg-navy/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <MessageCircle className="h-5 w-5 text-[#25D366]" aria-hidden />
              וואטסאפ
            </a>
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center gap-2 rounded-xl border border-navy/15 bg-white px-5 py-3.5 text-[16px] font-bold text-ink shadow-sm transition-colors hover:bg-navy/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <Phone className="h-5 w-5 text-gold-deep" aria-hidden />
              <span dir="ltr">{SITE.phoneDisplay}</span>
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
