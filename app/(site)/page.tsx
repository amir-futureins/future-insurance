import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Phone, BadgeCheck, Check } from 'lucide-react';
import { SITE, TRAVEL_URL, whatsappHref } from '@/lib/content';
import { VERTICALS, AGENT, AGENCY_ARTICLES, HOW_IT_WORKS } from '@/lib/agency';
import { Reveal } from '@/components/travel/ui';
import HomeHero from '@/components/HomeHero';
import HomeActionHub from '@/components/HomeActionHub';
import VideoBlock from '@/components/VideoBlock';
import ArticleGrid from '@/components/ArticleGrid';
import PromoBanner from '@/components/PromoBanner';

export const metadata: Metadata = {
  title: 'Future Insurance — הביטוח החכם של המחר',
  description:
    'סוכנות ביטוח דיגיטלית וחכמה: ביטוח נסיעות לחו״ל, ביטוח בריאות פרטי, ביטוח חיים והגנה משפחתית וביטוח משכנתא — השוואה שקופה, מחשבונים חכמים וליווי סוכן מורשה.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: SITE.url,
    siteName: SITE.name,
    title: 'Future Insurance — הביטוח החכם של המחר',
    description:
      'ביטוח נסיעות, בריאות, חיים ומשכנתא — במקום אחד, עם מחשבונים חכמים וליווי אישי.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'InsuranceAgency',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  alternateName: SITE.nameHe,
  url: SITE.url,
  logo: `${SITE.url}/new-logo.png`,
  image: `${SITE.url}/opengraph-image`,
  telephone: '+972-52-842-2884',
  email: SITE.email,
  priceRange: '₪₪',
  areaServed: { '@type': 'Country', name: 'Israel' },
  address: { '@type': 'PostalAddress', addressLocality: 'אור יהודה', addressCountry: 'IL' },
  openingHours: ['Su-Th 09:00-20:00', 'Fr 09:00-14:00'],
  inLanguage: 'he-IL',
  knowsAbout: [
    'ביטוח נסיעות לחו״ל',
    'ביטוח בריאות',
    'ביטוח חיים',
    'ביטוח משכנתא',
    'הר הביטוח',
    'בדיקת עבר ביטוחי',
  ],
};

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---- "מה תרצה לעשות היום?" quick-action hub (mobile + desktop) ---- */}
      <HomeActionHub />

      {/* ---- MOBILE-ONLY travel banner (md:hidden) → il-ins.co.il ---- */}
      <section className="px-4 pt-3.5 md:hidden">
        <a
          href={TRAVEL_URL}
          className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-lg backdrop-blur-sm"
        >
          <span className="text-[28px] leading-none" aria-hidden>✈️</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[16px] font-extrabold text-ink">ביטוח נסיעות לחו״ל</span>
            <span className="block text-[12.5px] text-muted">רכישה ומידע באתר הנסיעות שלנו</span>
          </span>
          <ArrowLeft className="h-5 w-5 shrink-0 text-gold-deep" aria-hidden />
        </a>
      </section>

      {/* ---- HERO ---- */}
      <HomeHero />

      {/* ---- 4 VERTICAL CARDS ---- */}
      <section
        id="verticals"
        className="mx-auto w-full max-w-container scroll-mt-24 px-6 py-14 md:px-10 md:py-16"
      >
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-[13px]">תחומי הביטוח שלנו</span>
          <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
            במה נוכל לעזור לכם היום?
          </h2>
        </div>
        <div className="mt-10 grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VERTICALS.map((v, i) => (
            <Reveal key={v.key} delay={(i % 3) * 80} className="h-full">
              <Link
                href={v.href}
                className="group relative flex h-full flex-col overflow-hidden glass p-6 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: v.accent }}
                />
                <div className="flex items-start justify-between">
                  <span className="text-[34px] leading-none" aria-hidden>
                    {v.emoji}
                  </span>
                  <span
                    className="grid h-9 w-9 place-items-center rounded-full text-white transition-transform group-hover:-translate-x-0.5"
                    style={{ backgroundColor: v.accent }}
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                  </span>
                </div>
                <h3 className="mt-4 text-[20px] font-extrabold text-ink">{v.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{v.sub}</p>
                <ul className="mt-4 space-y-2">
                  {v.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-center gap-2 text-[13.5px] font-medium text-ink/85"
                    >
                      <Check
                        className="h-4 w-4 shrink-0"
                        style={{ color: v.accent }}
                        aria-hidden
                      />
                      {p}
                    </li>
                  ))}
                </ul>
                <span className="mt-5 inline-flex items-center gap-1 text-[14px] font-bold text-gold-deep">
                  למעבר ולחישוב
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- PROMO BANNER ---- */}
      <PromoBanner
        eyebrow="בדיקה חינם"
        title="משלמים על כיסוי כפול בלי לדעת?"
        text="עוברים יחד על דוח הר הביטוח שלכם, מזהים כפילויות ומסדרים את התיק — ללא עלות."
        ctaLabel="לבדיקת כפילויות"
        ctaHref="/har-habituach"
      />

      {/* ---- VIDEO / EXPERT ---- */}
      <VideoBlock
        title="נסביר בקצרה איך חוסכים בכל תחומי הביטוח"
        subtitle="סוכן מורשה מסביר איך המערכת עובדת, איך משווים חברות בשקיפות, ואיך מזהים כפילויות וחיסכון בתיק הביטוח והפנסיה שלכם."
        points={['השוואה בין חברות הביטוח', 'זיהוי כפילויות בתיק', 'ליווי אישי של סוכן מורשה']}
        href={whatsappHref()}
      />

      {/* ---- AGENT BIO / LICENSE ---- */}
      <section className="mx-auto w-full max-w-container px-6 py-14 md:px-10 md:py-16">
        <div className="glass-elevated relative overflow-hidden p-7 sm:p-9">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-recommend-highlight" />
          <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:text-start">
            <span
              className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-[24px] font-extrabold text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #142B55, #22366A)' }}
              aria-hidden
            >
              {AGENT.initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
                <h2 className="text-[22px] font-extrabold text-ink">{AGENT.name}</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-gold-tint px-2.5 py-1 text-[12px] font-bold text-gold-deep ring-1 ring-gold/25">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                  {AGENT.title}
                </span>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{AGENT.blurb}</p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12.5px] font-medium text-faint sm:justify-start">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-gold-deep" aria-hidden />
                  {AGENT.license}
                </span>
                <span>· {SITE.address}</span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-[14px] font-bold text-white shadow-md"
              >
                וואטסאפ
              </a>
              <a
                href={SITE.phoneHref}
                aria-label={SITE.phoneCta}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cta-fill px-5 py-2.5 text-[14px] font-extrabold text-navy-deep shadow-md"
              >
                <Phone className="h-4 w-4" aria-hidden />
                {SITE.phoneCta}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---- HOW IT WORKS ---- */}
      <section className="mx-auto w-full max-w-container px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-[13px]">איך זה עובד</span>
          <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
            שלושה שלבים פשוטים
          </h2>
        </div>
        <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.map((step, i) => (
            <Reveal key={step.title} delay={i * 80} className="glass flex h-full flex-col p-6">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-navy text-[18px] font-extrabold text-gold-bright shadow">
                {i + 1}
              </span>
              <h3 className="mt-4 text-[18px] font-extrabold text-ink">{step.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ---- ARTICLES ---- */}
      <ArticleGrid
        title="מדריכים וכתבות ביטוח"
        subtitle="ידע שיעזור לכם לקבל את ההחלטות הנכונות — בכל תחומי הביטוח."
        articles={AGENCY_ARTICLES}
      />
    </main>
  );
}
