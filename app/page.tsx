import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  Phone,
  BadgeCheck,
  Check,
} from 'lucide-react';
import { SITE, whatsappHref } from '@/lib/content';
import { VERTICALS, AGENT, AGENCY_REVIEWS, AGENCY_ARTICLES } from '@/lib/agency';
import { Reveal } from '@/components/travel/ui';
import HomeHero from '@/components/HomeHero';
import BrandEmblem from '@/components/travel/BrandEmblem';
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
  priceRange: '₪₪',
  areaServed: { '@type': 'Country', name: 'Israel' },
  address: { '@type': 'PostalAddress', addressCountry: 'IL' },
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

      {/* ---- MOBILE-ONLY travel quick-buy banner (md:hidden) ---- */}
      <section className="px-4 pt-4 md:hidden">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-navy to-navy-deep p-5 shadow-xl ring-1 ring-white/10">
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-gold-bright">
            <span aria-hidden>✈️</span> ביטוח נסיעות לחו״ל
          </div>
          <h2 className="mt-1 text-[21px] font-extrabold leading-tight text-white">
            רכישה מהירה אונליין — בחרו חברה
          </h2>
          <p className="mt-1 text-[13px] leading-snug text-white/70">
            פוליסה דיגיטלית מיידית · השוואת מחירים · ליווי סוכן מורשה
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {[
              ['passportcard', 'PassportCard'],
              ['harel', 'הראל'],
              ['clal', 'כלל'],
              ['migdal', 'מגדל'],
            ].map(([slug, label]) => (
              <Link
                key={slug}
                href={`/travel-insurance/${slug}`}
                className="flex items-center gap-2.5 rounded-2xl bg-white/10 p-2.5 ring-1 ring-white/15 transition-colors active:bg-white/20"
              >
                <BrandEmblem slug={slug} variant="sm" />
                <span className="flex-1 text-start text-[14px] font-bold text-white">{label}</span>
                <ArrowLeft className="h-4 w-4 shrink-0 text-white/60" aria-hidden />
              </Link>
            ))}
          </div>
          <Link
            href="/travel-insurance"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 px-4 py-3.5 text-[15px] font-extrabold text-navy-deep shadow-lg transition-transform active:scale-[0.98]"
          >
            השוואת כל חברות החו״ל
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </Link>
        </div>
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
        text="סורקים את הר הביטוח, מזהים כפילויות ומאחדים את התיק — לרוב בחיסכון של מאות שקלים בחודש."
        ctaLabel="לסריקת כפילויות"
        ctaHref="/har-habituach"
      />

      {/* ---- VIDEO / EXPERT ---- */}
      <VideoBlock
        title="נסביר בקצרה איך חוסכים בכל תחומי הביטוח"
        subtitle="סוכן מורשה מסביר איך המערכת עובדת, איך משווים חברות בשקיפות, ואיך מזהים כפילויות וחיסכון בתיק הביטוח והפנסיה שלכם."
        points={['השוואה שקופה בין החברות המובילות', 'זיהוי כפילויות וחיסכון מיידי', 'ליווי אישי של סוכן מורשה']}
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
                <span>· {AGENT.years} שנות ניסיון</span>
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

      {/* ---- REVIEWS ---- */}
      <section className="mx-auto w-full max-w-container px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow inline-flex items-center gap-1.5 text-[13px]">
            <Star className="h-4 w-4" aria-hidden />
            לקוחות ממליצים
          </span>
          <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
            אלפי לקוחות בחרו נכון
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {AGENCY_REVIEWS.slice(0, 3).map((r, i) => (
            <Reveal key={r.name} delay={(i % 3) * 80} className="glass flex h-full flex-col p-6">
              <div className="flex items-center gap-3">
                <span
                  className="grid h-11 w-11 place-items-center rounded-full text-[15px] font-extrabold text-white shadow"
                  style={{ background: `linear-gradient(135deg, ${r.from}, ${r.to})` }}
                  aria-hidden
                >
                  {r.initials}
                </span>
                <div className="min-w-0">
                  <div className="text-[15px] font-extrabold text-ink">{r.name}</div>
                  <div className="flex items-center gap-1 text-[12px] text-muted">
                    {r.city}
                    <span className="mx-1 text-faint">·</span>
                    <span className="inline-flex" aria-label={`דירוג ${r.rating} מתוך 5`}>
                      {Array.from({ length: r.rating }).map((_, s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-gold text-gold" aria-hidden />
                      ))}
                    </span>
                  </div>
                </div>
              </div>
              <span className="mt-3 inline-flex w-fit items-center rounded-full bg-gold-tint px-2.5 py-0.5 text-[11px] font-semibold text-gold-deep">
                {r.vertical}
              </span>
              <blockquote className="mt-3 flex-1 text-[14px] leading-relaxed text-ink/90">
                ״{r.quote}״
              </blockquote>
            </Reveal>
          ))}
        </div>
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
