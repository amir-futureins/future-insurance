import type { Metadata } from 'next';
import { Stethoscope, ShieldCheck, Layers, Check } from 'lucide-react';
import { whatsappHref } from '@/lib/content';
import { HEALTH_FAQ, relatedArticles, EXPERT_TIPS, AGENCY_REVIEWS } from '@/lib/agency';
import HealthCalculator from '@/components/verticals/HealthCalculator';
import PageHero from '@/components/PageHero';
import { HeroHealthCard } from '@/components/verticals/HeroCards';
import VideoBlock from '@/components/VideoBlock';
import FaqSection from '@/components/FaqSection';
import ArticleGrid from '@/components/ArticleGrid';
import ExpertTips from '@/components/ExpertTips';
import SuccessCarousel from '@/components/SuccessCarousel';

export const metadata: Metadata = {
  title: 'ביטוח בריאות פרטי — ניתוחים, השתלות ותרופות מחוץ לסל',
  description:
    'ביטוח בריאות פרטי חכם: כיסוי לניתוחים פרטיים, השתלות, תרופות מחוץ לסל ומחלות קשות. בדיקת כפילות ביטוחים חינם וליווי סוכן מורשה. בונים כיסוי מדויק בלי לשלם על מיותר.',
  keywords: ['ביטוח בריאות פרטי', 'כפילות ביטוחים', 'ביטוח ניתוחים', 'תרופות מחוץ לסל', 'ביטוח מחלות קשות'],
  alternates: { canonical: '/health' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: HEALTH_FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const GUIDE_POINTS = [
  { title: 'מזהים חפיפות', text: 'ניתוחים גם בקופה וגם בפרטי? לעולם לא תקבלו כפל פיצוי.' },
  { title: 'מבטלים את המיותר', text: 'משאירים כיסוי אחד חכם ומורידים עלות מיותרת.' },
  { title: 'חוסכים כל חודש', text: 'לקוחות רבים חוסכים מאות שקלים אחרי בדיקה אחת.' },
];

export default function HealthPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* hero */}
      <PageHero
        icon={Stethoscope}
        eyebrow="ביטוח בריאות פרטי"
        title={
          <>
            הבריאות שלכם לא צריכה <span className="text-gold-deep">לחכות בתור</span>
          </>
        }
        subtitle="כיסוי לניתוחים פרטיים, השתלות ותרופות מחוץ לסל — עם בדיקת כפילויות שמוודאת שאתם לא משלמים פעמיים על אותו דבר."
        badges={['🏥 ניתוחים פרטיים', '💊 תרופות מחוץ לסל', '🎗️ מחלות קשות', '🔍 בדיקת כפילויות חינם']}
        primary={{ href: '#calculator', label: 'לבניית כיסוי' }}
        secondary={{ href: whatsappHref(), label: 'בדיקת כפילויות חינם', external: true }}
        visual={<HeroHealthCard />}
      />

      {/* calculator */}
      <div className="px-6 md:px-10">
        <HealthCalculator />
      </div>

      {/* duplication guide */}
      <section className="mx-auto w-full max-w-container px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow inline-flex items-center gap-1.5 text-[13px]">
            <Layers className="h-4 w-4" aria-hidden />
            מדריך קצר
          </span>
          <h2 className="mt-2 text-[clamp(22px,5vw,28px)] font-bold leading-tight text-ink">
            כפילות ביטוחים — למה חשוב לבדוק?
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            רבים משלמים שנים על כיסויים כפולים — ולא יודעים שלעולם לא יקבלו כפל פיצוי.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {GUIDE_POINTS.map((g, i) => (
            <div key={g.title} className="glass p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-tint text-gold-deep ring-1 ring-gold/25">
                <span className="num text-[15px] font-extrabold">{i + 1}</span>
              </span>
              <h3 className="mt-3 text-[16px] font-bold text-ink">{g.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{g.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-[13px] font-medium text-muted">
          <Check className="h-4 w-4 text-gold-deep" aria-hidden />
          <ShieldCheck className="h-4 w-4 text-gold-deep" aria-hidden />
          הבדיקה חינם, ללא התחייבות, ובליווי סוכן מורשה.
        </div>
      </section>

      <VideoBlock
        title="בונים כיסוי בריאות חכם — בלי כפילויות"
        subtitle="מומחה מסביר אילו כיסויים באמת שווים (ניתוחים, השתלות, תרופות מחוץ לסל), ואיך מוודאים שאתם לא משלמים פעמיים על אותו דבר."
        points={['אילו כיסויים חשובים באמת', 'איך מזהים כפילות מול הקופה', 'מתאימים את הכיסוי לתקציב']}
        href={whatsappHref()}
      />

      <ExpertTips title="טיפים לבחירת ביטוח בריאות" tips={EXPERT_TIPS.health} />

      <SuccessCarousel title="לקוחות שכבר חוסכים איתנו" reviews={AGENCY_REVIEWS} />

      <ArticleGrid
        title="מדריכי ביטוח בריאות"
        subtitle="ידע שיעזור לכם לבחור כיסוי חכם ולהימנע מכפילויות."
        articles={relatedArticles('/health')}
      />

      {/* FAQ */}
      <FaqSection
        title="שאלות ותשובות — ביטוח בריאות וכפילויות"
        subtitle="כל מה שחשוב לדעת לפני שבוחרים כיסוי בריאות פרטי."
        items={HEALTH_FAQ}
      />
    </main>
  );
}
