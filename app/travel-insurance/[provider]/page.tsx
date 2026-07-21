import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { getProvider } from '@/lib/providers';
import type { PriceableProviderId } from '@/lib/calculator';
import { whatsappHref, FAQ_ITEMS } from '@/lib/content';
import PageHero from '@/components/PageHero';
import FaqSection from '@/components/FaqSection';
import VideoBlock from '@/components/VideoBlock';

/** Branded travel-carrier sub-pages: /travel-insurance/{passportcard,harel,clal,migdal}. */
const BRANDS = {
  passportcard: { id: 'passportcard', accent: '#E10600', label: 'PassportCard' },
  harel: { id: 'harel', accent: '#004B93', label: 'הראל' },
  clal: { id: 'clal', accent: '#002D62', label: 'כלל' },
  migdal: { id: 'migdal', accent: '#001E50', label: 'מגדל' },
} as const satisfies Record<string, { id: PriceableProviderId; accent: string; label: string }>;

type Slug = keyof typeof BRANDS;

export function generateStaticParams() {
  return Object.keys(BRANDS).map((provider) => ({ provider }));
}

export function generateMetadata({ params }: { params: { provider: string } }): Metadata {
  const b = BRANDS[params.provider as Slug];
  if (!b) return {};
  const p = getProvider(b.id);
  return {
    title: `ביטוח נסיעות ${b.label} — השוואה, מחיר ורכישה דיגיטלית`,
    description: `${p.tagline}. השוו את ביטוח הנסיעות של ${b.label} מול החברות המובילות, קבלו מחיר תוך שניות ורכשו פוליסה מיידית — בליווי סוכן מורשה.`,
    keywords: [`ביטוח נסיעות ${b.label}`, `${b.label} ביטוח נסיעות`, 'ביטוח נסיעות לחו״ל', 'השוואת ביטוח נסיעות'],
    alternates: { canonical: `/travel-insurance/${params.provider}` },
  };
}

function BrandCard({ slug }: { slug: Slug }) {
  const b = BRANDS[slug];
  const p = getProvider(b.id);
  return (
    <div className="glass-elevated relative mx-auto w-full max-w-md overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 text-white" style={{ backgroundColor: b.accent }}>
        <span className="text-[17px] font-extrabold tracking-tight">{b.label}</span>
        <ShieldCheck className="h-5 w-5" aria-hidden />
      </div>
      <div className="p-5 sm:p-6">
        <div className="text-[12.5px] font-semibold text-muted">מתאים במיוחד ל: {p.bestFor}</div>
        <ul className="mt-3 space-y-2.5">
          {p.features.slice(0, 4).map((f) => {
            const Icon = f.icon;
            return (
              <li key={f.text} className="flex items-center gap-2.5 text-[14px] text-ink/90">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-white" style={{ backgroundColor: b.accent }}>
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                </span>
                {f.text}
              </li>
            );
          })}
        </ul>
        <a
          href={`/api/go/${slug}`}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-navy-deep px-4 py-3 text-[15px] font-extrabold text-white shadow-lg transition-transform hover:-translate-y-0.5"
        >
          רכישה דיגיטלית מיידית
          <ArrowLeft className="h-4 w-4" aria-hidden />
        </a>
        <p className="mt-2 text-center text-[11px] text-faint">מעבר לרכישה מאובטחת באתר החברה</p>
      </div>
    </div>
  );
}

export default function BrandPage({ params }: { params: { provider: string } }) {
  const b = BRANDS[params.provider as Slug];
  if (!b) notFound();
  const p = getProvider(b.id);
  const faq = FAQ_ITEMS.slice(0, 5);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        icon={ShieldCheck}
        eyebrow={`ביטוח נסיעות · ${b.label}`}
        title={
          <>
            ביטוח נסיעות <span style={{ color: b.accent }}>{b.label}</span> — מחיר ורכישה מיידית
          </>
        }
        subtitle={`${p.tagline} — השוו את ${b.label} מול PassportCard, הראל, מגדל וכלל, קבלו מחיר תוך שניות ורכשו פוליסה דיגיטלית מיידית בליווי סוכן מורשה.`}
        badges={['✈️ פוליסה מיידית', '🌍 כיסוי עולמי', '📱 כרטיס דיגיטלי']}
        primary={{ href: '/travel-insurance#calculator', label: 'להשוואת מחיר' }}
        secondary={{ href: whatsappHref(), label: 'ייעוץ מהיר בוואטסאפ', external: true }}
        visual={<BrandCard slug={params.provider as Slug} />}
      />

      <section className="mx-auto w-full max-w-container px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-[13px]">למה {b.label}?</span>
          <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
            היתרונות של ביטוח הנסיעות של {b.label}
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-muted">
            השוואה שקופה מול החברות המובילות עוזרת לכם לבחור נכון. הנה מה שמייחד את {b.label} — ואיך משיגים
            את המחיר הטוב ביותר.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {p.features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.text} className="glass flex items-start gap-3 p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white" style={{ backgroundColor: b.accent }}>
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-[15px] font-medium leading-relaxed text-ink/90">{f.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <VideoBlock
        title={`איך בוחרים נכון ביטוח נסיעות של ${b.label}?`}
        subtitle={`מומחה מסביר מתי ${b.label} הכי משתלמת, מה חשוב לבדוק בפוליסה, ואיך משלבים הרחבות בלי לשלם מיותר.`}
        points={['התאמת הכיסוי ליעד ולפרופיל', 'מתי כדאי להרחיב (ספורט / מצב רפואי)', 'השוואת מחיר מול החברות האחרות']}
        href={whatsappHref()}
      />

      <FaqSection
        title={`שאלות ותשובות — ביטוח נסיעות ${b.label}`}
        subtitle="הכיסויים, המחיר והרכישה הדיגיטלית — כל מה שחשוב לדעת."
        items={faq}
      />
    </main>
  );
}
