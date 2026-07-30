import type { Metadata } from 'next';
import { TrendingUp, Percent } from 'lucide-react';
import { whatsappHref } from '@/lib/content';
import { FINANCE_FAQ, AGENCY_ARTICLES } from '@/lib/agency';
import FinanceCalculator from '@/components/verticals/FinanceCalculator';
import FeesImpact from '@/components/verticals/FeesImpact';
import PageHero from '@/components/PageHero';
import HeroGrowthChart from '@/components/HeroGrowthChart';
import VideoBlock from '@/components/VideoBlock';
import FaqSection from '@/components/FaqSection';
import ArticleGrid from '@/components/ArticleGrid';
import PromoBanner from '@/components/PromoBanner';

export const metadata: Metadata = {
  title: 'פנסיה, קרן השתלמות וקופת גמל — סימולטור צמיחת הון',
  description:
    'מרכז פיננסי לפנסיה, קרן השתלמות וקופת גמל. סימולטור ריבית דריבית עם גרף צמיחה חי, בדיקת דמי ניהול והתאמת מסלול השקעה — לחיסכון מקסימלי לפרישה.',
  keywords: [
    'פנסיה',
    'קרן השתלמות',
    'קופת גמל',
    'ביטוח השקעות',
    'ריבית דריבית',
    'מחשבון פנסיה',
    'הוזלת דמי ניהול',
  ],
  alternates: { canonical: '/finance' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'FAQPage',
      mainEntity: FINANCE_FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@type': 'FinancialProduct',
      name: 'פנסיה, קרן השתלמות וקופת גמל',
      category: 'חיסכון פנסיוני והשקעות',
      description:
        'מסלולי חיסכון פנסיוני והשקעות — פנסיה, קרן השתלמות וקופת גמל, עם התאמת מסלול השקעה והוזלת דמי ניהול לחיסכון מקסימלי לפרישה.',
      areaServed: 'IL',
      provider: { '@id': 'https://futureins.co.il/#organization' },
    },
  ],
};

const PRODUCTS = [
  { emoji: '🏦', title: 'פנסיה', text: 'חיסכון ארוך-טווח לגיל פרישה, עם כיסויים ביטוחיים מובנים.' },
  { emoji: '🎓', title: 'קרן השתלמות', text: 'חיסכון נזיל עם הטבות מס מצוינות — נזיל אחרי 6 שנים.' },
  { emoji: '💰', title: 'קופת גמל', text: 'מכשיר חיסכון גמיש עם יתרונות מס לטווח הבינוני והארוך.' },
];

export default function FinancePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        icon={TrendingUp}
        eyebrow="פנסיה, גמל והשתלמות"
        title={
          <>
            תנו לכסף שלכם <span className="text-gold-deep">לעבוד בשבילכם</span>
          </>
        }
        subtitle="ריבית דריבית היא הכוח החזק בעולם החיסכון. גררו את הסליידרים וראו איך הפקדה חודשית קטנה הופכת להון משמעותי לפרישה."
        badges={['📈 מנוע תשואות ודמי ניהול', '🧮 ריבית דריבית', '🎓 פנסיה · גמל · השתלמות']}
        primary={{ href: '#calculator', label: 'לסימולטור הצמיחה' }}
        secondary={{ href: whatsappHref(), label: 'בדיקת דמי ניהול', external: true, icon: Percent }}
        visual={<HeroGrowthChart />}
      />

      <div className="px-6 pt-10 md:px-10">
        <FinanceCalculator />
      </div>

      {/* product trio */}
      <section className="mx-auto w-full max-w-container px-6 pt-12 md:px-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {PRODUCTS.map((p) => (
            <div key={p.title} className="glass p-6 text-center sm:text-start">
              <span className="text-[30px] leading-none" aria-hidden>
                {p.emoji}
              </span>
              <h3 className="mt-2 text-[17px] font-bold text-ink">{p.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <FeesImpact />

      {/* investment tracks */}
      <section className="mx-auto w-full max-w-container px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-[13px]">מסלולי השקעה</span>
          <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
            איזה מסלול מתאים לכם?
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-muted">
            התאמת מסלול ההשקעה לגיל ולסיכון היא אחת ההחלטות המשפיעות ביותר על החיסכון.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="glass p-7">
            <div className="flex items-center gap-2">
              <span className="text-[24px]" aria-hidden>📈</span>
              <h3 className="text-[18px] font-extrabold text-ink">מסלול עוקב S&amp;P 500</h3>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              משקיע במדד 500 החברות הגדולות בארה״ב. היסטורית הניב תשואה גבוהה משמעותית ממסלולים
              סולידיים — אך עם תנודתיות גבוהה יותר. מתאים בעיקר לחוסכים עם אופק ארוך (צעירים),
              וחשוב לשלב אותו נכון בתמהיל הכולל.
            </p>
            <ul className="mt-4 space-y-2 text-[14px] text-ink/85">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-deep" aria-hidden />
                פוטנציאל תשואה גבוה לאורך זמן
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-deep" aria-hidden />
                מתאים לאופק חיסכון ארוך
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-deep" aria-hidden />
                תנודתיות — דורש קור רוח
              </li>
            </ul>
          </div>
          <div className="glass p-7">
            <div className="flex items-center gap-2">
              <span className="text-[24px]" aria-hidden>🎓</span>
              <h3 className="text-[18px] font-extrabold text-ink">קרן השתלמות</h3>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              מכשיר החיסכון המשתלם בישראל — נזיל אחרי 6 שנים, עם פטור ממס רווחי הון. אפשר להשאיר
              אותו כאפיק חיסכון ממשיך שממשיך לצבור פטור, במקום למשוך. אחד הכלים החזקים לבניית הון.
            </p>
            <ul className="mt-4 space-y-2 text-[14px] text-ink/85">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-deep" aria-hidden />
                נזיל אחרי 6 שנים
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-deep" aria-hidden />
                פטור ממס רווחי הון
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-deep" aria-hidden />
                אפשר להמשיך לצבור פטור
              </li>
            </ul>
          </div>
        </div>
      </section>

      <VideoBlock
        title="כך מנצחים את דמי הניהול בפנסיה"
        subtitle="מומחה מסביר איך אחוז בודד בדמי ניהול הופך למאות אלפי שקלים לאורך שנים, ואיך בוחרים מסלול השקעה שמתאים לגיל ולסיכון שלכם."
        points={['ההשפעה האמיתית של דמי ניהול', 'מסלול מנייתי מול כללי', 'איך עוברים ומנהלים מו״מ על דמי ניהול']}
        href={whatsappHref()}
      />

      <PromoBanner
        eyebrow="הטיפ ששווה זהב"
        title="אחוז אחד בדמי ניהול = מאות אלפי שקלים"
        text="הפחתת דמי ניהול והתאמת מסלול הן ההחלטות המשתלמות ביותר בחיסכון שלכם. נבדוק וננהל עבורכם משא ומתן — בחינם."
        ctaLabel="לבדיקת דמי ניהול"
        ctaHref={whatsappHref()}
        external
      />

      <ArticleGrid
        title="מדריכי פנסיה וחיסכון"
        subtitle="כל מה שצריך לדעת כדי למקסם את החיסכון ארוך-הטווח."
        articles={AGENCY_ARTICLES.filter((a) => a.href === '/finance')}
      />

      <FaqSection
        title="שאלות ותשובות — פנסיה, גמל והשתלמות"
        subtitle="ההבדלים בין המכשירים, כוח הריבית דריבית והשפעת דמי הניהול."
        items={FINANCE_FAQ}
      />
    </main>
  );
}
