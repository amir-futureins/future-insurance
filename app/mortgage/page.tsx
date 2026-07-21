import type { Metadata } from 'next';
import { Home, TrendingDown } from 'lucide-react';
import { whatsappHref } from '@/lib/content';
import {
  MORTGAGE_FAQ,
  relatedArticles,
  EXPERT_TIPS,
  AGENCY_REVIEWS,
  MORTGAGE_COMPARE,
} from '@/lib/agency';
import MortgageCalculator from '@/components/verticals/MortgageCalculator';
import PageHero from '@/components/PageHero';
import { HeroMortgageCard } from '@/components/verticals/HeroCards';
import VideoBlock from '@/components/VideoBlock';
import FaqSection from '@/components/FaqSection';
import ArticleGrid from '@/components/ArticleGrid';
import PromoBanner from '@/components/PromoBanner';
import ComparisonTable from '@/components/ComparisonTable';
import ExpertTips from '@/components/ExpertTips';
import SuccessCarousel from '@/components/SuccessCarousel';

export const metadata: Metadata = {
  title: 'ביטוח משכנתא — חיים + מבנה, חיסכון מול הבנק',
  description:
    'ביטוח משכנתא (חיים + מבנה) עצמאי, זול בעשרות אחוזים ממחיר הבנק. מחשבון שמראה בדיוק כמה תחסכו, וליווי מלא במעבר — כולל ההודעה לבנק.',
  keywords: ['ביטוח משכנתא', 'ביטוח חיים למשכנתא', 'ביטוח מבנה', 'חיסכון בביטוח משכנתא', 'ביטוח משכנתא מול הבנק'],
  alternates: { canonical: '/mortgage' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: MORTGAGE_FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function MortgagePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        icon={Home}
        eyebrow="ביטוח משכנתא"
        title={
          <>
            אותו כיסוי בדיוק — <span className="text-gold-deep">בחצי מהמחיר</span> של הבנק
          </>
        }
        subtitle="הבנק מחייב ביטוח חיים ומבנה — אבל לא חייבים לקנות דרכו. פוליסה עצמאית חוסכת אלפי שקלים לאורך המשכנתא, על אותו כיסוי בדיוק."
        badges={['🏠 חיים + מבנה', '💰 חיסכון של אלפי ₪', '🤝 ליווי מלא במעבר', '🏦 זול ממחיר הבנק']}
        primary={{ href: '#calculator', label: 'לחישוב החיסכון' }}
        secondary={{ href: whatsappHref(), label: 'כמה אחסוך?', external: true, icon: TrendingDown }}
        visual={<HeroMortgageCard />}
      />

      <div className="px-6 md:px-10">
        <MortgageCalculator />
      </div>

      <ComparisonTable
        title="ביטוח משכנתא: הבנק מול סוכן עצמאי"
        subtitle="אותו כיסוי בדיוק — ההבדל הוא במחיר, בשירות ובגמישות."
        rows={MORTGAGE_COMPARE}
      />

      <VideoBlock
        title="איך חוסכים אלפי שקלים בביטוח המשכנתא?"
        subtitle="מומחה מסביר בקצרה למה ביטוח הבנק יקר, מה חשוב לבדוק בפוליסה עצמאית, ואיך עוברים בלי להישאר לרגע בלי כיסוי."
        points={['למה הבנק גובה יותר על אותו כיסוי', 'ההבדל בין ביטוח חיים למבנה', 'מעבר מסודר — כולל ההודעה לבנק']}
        href={whatsappHref()}
      />

      <ExpertTips title="טיפים לחיסכון בביטוח משכנתא" tips={EXPERT_TIPS.mortgage} />

      <SuccessCarousel title="לקוחות שחסכו אלפי שקלים" reviews={AGENCY_REVIEWS} />

      <PromoBanner
        eyebrow="אל תשלמו לבנק יותר מדי"
        title="לוקחים משכנתא? אל תחתמו על ביטוח הבנק לפני שתשוו"
        text="פוליסה עצמאית חוסכת אלפי שקלים לאורך המשכנתא — על אותו כיסוי בדיוק. נלווה אתכם גם בהודעה לבנק."
        ctaLabel="דברו איתנו"
        ctaHref={whatsappHref()}
        external
      />

      <ArticleGrid
        title="מדריכי ביטוח משכנתא"
        subtitle="איך משיגים את הכיסוי הנדרש בזול, ומתי כדאי לעבור מהבנק."
        articles={relatedArticles('/mortgage')}
      />

      <FaqSection
        title="שאלות ותשובות — ביטוח משכנתא"
        subtitle="האם חובה דרך הבנק, מה כלול, וכמה באמת אפשר לחסוך."
        items={MORTGAGE_FAQ}
      />
    </main>
  );
}
