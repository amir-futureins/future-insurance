import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ShieldCheck, ArrowLeft, Star, Check } from 'lucide-react';
import { getProvider } from '@/lib/providers';
import { getBrand, BRANDS, type BrandConfig } from '@/lib/brands';
import { whatsappHref } from '@/lib/content';
import { IMG, unsplash } from '@/lib/images';
import PageHero from '@/components/PageHero';
import BrandEmblem from '@/components/travel/BrandEmblem';
import BrandCalculator from '@/components/travel/BrandCalculator';
import FloatingPurchaseCTA from '@/components/FloatingPurchaseCTA';
import FaqSection from '@/components/FaqSection';

/** Branded travel-carrier landing pages: /travel-insurance/{passportcard,harel,clal,migdal}. */
export function generateStaticParams() {
  return Object.keys(BRANDS).map((provider) => ({ provider }));
}

export function generateMetadata({ params }: { params: { provider: string } }): Metadata {
  const b = getBrand(params.provider);
  if (!b) return {};
  return {
    title: `ביטוח נסיעות ${b.name} — מחשבון מחיר, השוואה ורכישה דיגיטלית 2026`,
    description: `ביטוח נסיעות ${b.name}: מחשבון עלות יומית, השוואה מול החברות המובילות, ביקורות ומדריכים — ורכישה דיגיטלית מיידית בליווי סוכן מורשה.`,
    keywords: [`ביטוח נסיעות ${b.name}`, `${b.name} ביטוח נסיעות`, `ביטוח נסיעות ${b.name} מחיר`, 'ביטוח נסיעות לחו״ל', 'השוואת ביטוח נסיעות'],
    alternates: { canonical: `/travel-insurance/${params.provider}` },
  };
}

function Stars({ score, size = 'h-4 w-4' }: { score: number; size?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`דירוג ${score} מתוך 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${size} ${i <= Math.round(score) ? 'fill-gold text-gold' : 'fill-navy/10 text-navy/20'}`} aria-hidden />
      ))}
    </span>
  );
}

function BrandPass({ brand }: { brand: BrandConfig }) {
  const p = getProvider(brand.providerId);
  return (
    <div className="glass-elevated relative mx-auto w-full max-w-md overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 text-white" style={{ backgroundColor: brand.accent }}>
        <span className="text-[17px] font-extrabold tracking-tight">{brand.name}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-bold">
          <Star className="h-3.5 w-3.5 fill-current" aria-hidden />
          {brand.ratingScore}
        </span>
      </div>
      <div className="p-5 sm:p-6">
        {/* signature feature */}
        <div className="flex items-start gap-3 rounded-2xl p-3.5" style={{ backgroundColor: `color-mix(in srgb, ${brand.accent} 8%, white)`, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${brand.accent} 20%, transparent)` }}>
          <span className="text-[26px] leading-none" aria-hidden>{brand.appBadge.emoji}</span>
          <div>
            <div className="text-[14px] font-extrabold text-ink">{brand.appBadge.title}</div>
            <div className="mt-0.5 text-[12.5px] leading-snug text-muted">{brand.appBadge.text}</div>
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {p.features.slice(0, 3).map((f) => {
            const Icon = f.icon;
            return (
              <li key={f.text} className="flex items-center gap-2.5 text-[13.5px] text-ink/90">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-white" style={{ backgroundColor: brand.accent }}>
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                </span>
                {f.text}
              </li>
            );
          })}
        </ul>

        {/* barcode strip */}
        <div className="mt-4 border-t border-dashed border-navy/15 pt-3">
          <div className="flex h-9 items-end gap-[3px]" aria-hidden>
            {Array.from({ length: 30 }).map((_, i) => (
              <span key={i} className="w-[3px] rounded-sm bg-ink" style={{ height: `${45 + ((i * 41) % 55)}%` }} />
            ))}
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-faint">
            <span className="num">NO. {brand.slug.toUpperCase()}-2026</span>
            <span>FUTURE • כרטיס נסיעה</span>
          </div>
        </div>

        <a
          href={`/api/go/${brand.slug}`}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[15px] font-extrabold text-white shadow-lg transition-transform hover:-translate-y-0.5"
          style={{ backgroundColor: brand.accent }}
        >
          רכישה דיגיטלית מיידית
          <ArrowLeft className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </div>
  );
}

export default function BrandPage({ params }: { params: { provider: string } }) {
  const brand = getBrand(params.provider);
  if (!brand) notFound();
  const p = getProvider(brand.providerId);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: brand.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* prominent brand emblem (stylized wordmark — see BrandEmblem for the real-logo swap) */}
      <div className="mx-auto flex max-w-container items-center justify-center gap-3 px-6 pt-6 md:justify-start md:px-10">
        <BrandEmblem slug={brand.slug} variant="lg" />
        <div className="text-center md:text-start">
          <div className="text-[19px] font-extrabold text-ink">ביטוח נסיעות {brand.name}</div>
          <div className="text-[13px] text-muted">{brand.appBadge.title}</div>
        </div>
      </div>

      <PageHero
        icon={ShieldCheck}
        eyebrow={`ביטוח נסיעות · ${brand.name}`}
        title={
          <>
            ביטוח נסיעות <span style={{ color: brand.accent }}>{brand.name}</span> — מחיר ורכישה מיידית
          </>
        }
        subtitle={`${p.tagline} — מחשבון עלות יומית, השוואה מול החברות המובילות ורכישה דיגיטלית מיידית בליווי סוכן מורשה.`}
        badges={['✈️ פוליסה מיידית', `${brand.appBadge.emoji} ${brand.appBadge.title}`, '📱 כרטיס דיגיטלי']}
        primary={{ href: '#calculator', label: 'למחשבון המחיר' }}
        secondary={{ href: whatsappHref(), label: 'ייעוץ מהיר בוואטסאפ', external: true }}
        visual={<BrandPass brand={brand} />}
      />

      <div className="px-6 md:px-10">
        <BrandCalculator brand={brand} />
      </div>

      {/* rich perks with imagery */}
      <section className="mx-auto w-full max-w-container px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-[13px]">היתרונות של {brand.name}</span>
          <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
            למה כדאי לבחור בביטוח הנסיעות של {brand.name}?
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {brand.perks.map((perk) => (
            <article key={perk.title} className="glass group flex h-full flex-col overflow-hidden">
              <div className="relative h-40">
                <Image
                  src={unsplash(IMG[perk.img], 700, 60)}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${brand.accent}cc, transparent 62%)` }} />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-[16px] font-bold text-ink">{perk.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{perk.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ratings + reviews */}
      <section className="mx-auto w-full max-w-container px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-2">
            <Stars score={brand.ratingScore} size="h-5 w-5" />
            <span className="text-[20px] font-extrabold text-ink">{brand.ratingScore}/5</span>
          </div>
          <p className="mt-1.5 text-[14px] text-muted">
            מבוסס על {brand.ratingCount} ביקורות · <span className="font-semibold text-faint">נתוני המחשה</span>
          </p>
          <h2 className="mt-4 text-[clamp(22px,5vw,28px)] font-bold leading-tight text-ink">
            למה לקוחות בוחרים ב{brand.name}?
          </h2>
        </div>
        <div className="mt-9 grid grid-cols-1 gap-6 md:grid-cols-2">
          {brand.reviews.map((r) => (
            <div key={r.name} className="glass flex h-full flex-col p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full text-[14px] font-extrabold text-white shadow" style={{ background: `linear-gradient(135deg, ${r.from}, ${r.to})` }} aria-hidden>
                  {r.initials}
                </span>
                <div className="min-w-0">
                  <div className="text-[15px] font-extrabold text-ink">{r.name}</div>
                  <div className="flex items-center gap-1.5 text-[12px] text-muted">
                    {r.city}
                    <Stars score={5} size="h-3 w-3" />
                    <span className="rounded-full bg-slate-100 px-1.5 text-[10px] font-semibold text-faint">לדוגמה</span>
                  </div>
                </div>
              </div>
              <blockquote className="mt-3 flex-1 text-[14px] leading-relaxed text-ink/90">״{r.text}״</blockquote>
            </div>
          ))}
        </div>
      </section>

      {/* comparison: brand direct vs Future VIP */}
      <section className="mx-auto w-full max-w-container px-6 pb-4 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-[13px]">השוואה שקופה</span>
          <h2 className="mt-2 text-[clamp(22px,5vw,28px)] font-bold leading-tight text-ink">
            {brand.name} ישירות מול {brand.name} דרך Future
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">אותו מחיר בדיוק — ההבדל הוא בשירות, בהשוואה ובליווי.</p>
        </div>
        <div className="mt-8 glass overflow-hidden p-1.5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-center">
              <thead>
                <tr className="border-b border-navy/10">
                  <th scope="col" className="p-4 text-start text-[13px] font-semibold text-muted">מה בודקים</th>
                  <th scope="col" className="p-4 text-[14px] font-extrabold text-ink">ישירות ב{brand.name}</th>
                  <th scope="col" className="rounded-t-xl bg-gold-tint p-4 text-[14px] font-extrabold text-gold-deep">דרך Future</th>
                </tr>
              </thead>
              <tbody>
                {brand.compare.map((row) => (
                  <tr key={row.label} className="border-b border-navy/[0.06] last:border-0">
                    <td className="p-4 text-start text-[14px] font-medium text-ink">{row.label}</td>
                    <td className="p-4 text-[13.5px] text-muted">{row.direct}</td>
                    <td className="bg-gold-tint/40 p-4 text-[13.5px] font-bold text-ink">
                      <span className="inline-flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-harel-green" aria-hidden />
                        {row.future}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SEO articles */}
      <section className="mx-auto w-full max-w-container px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-[13px]">כתבות ומידע מקצועי</span>
          <h2 className="mt-2 text-[clamp(22px,5vw,28px)] font-bold leading-tight text-ink">מדריכי {brand.name}</h2>
        </div>
        <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {brand.articles.map((a, i) => (
            <article key={a.title} className="glass group flex h-full flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-2">
              <div className="relative h-28" style={{ background: `linear-gradient(135deg, ${brand.accent}, ${i % 2 ? brand.accent2 : '#0F2141'})` }}>
                <span className="absolute bottom-2 start-3 rounded-full bg-white/85 px-2.5 py-0.5 text-[11px] font-bold text-ink">{a.tag}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-[15.5px] font-bold leading-snug text-ink">{a.title}</h3>
                <div className="mt-auto flex items-center gap-2 pt-4 text-[12px] font-medium text-faint">
                  <span>סוכן מורשה</span>
                  <span>·</span>
                  <span>{a.read} קריאה</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <FaqSection
        title={`שאלות ותשובות — ביטוח נסיעות ${brand.name}`}
        subtitle="הכיסויים, המחיר, התביעות והרכישה הדיגיטלית — כל מה שחשוב לדעת."
        items={brand.faq}
      />

      {/* independence / anti-impersonation note */}
      <div className="mx-auto max-w-container px-6 pb-12 md:px-10">
        <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-[12px] leading-relaxed text-slate-600">
          אתר עצמאי של סוכנות ביטוח מורשה (״Future Insurance״) — אינו האתר הרשמי של {brand.name}. שמות
          החברות מוזכרים לצורך השוואה ומידע. השירות בכפוף להסכמת המשתמש ולתקנון האתר.
        </p>
      </div>

      <FloatingPurchaseCTA slug={brand.slug} name={brand.name} accent={brand.accent} />
    </main>
  );
}
