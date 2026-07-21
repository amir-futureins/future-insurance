import type { Metadata } from 'next';
import { HeartHandshake, Shield } from 'lucide-react';
import { whatsappHref } from '@/lib/content';
import { LIFE_FAQ, relatedArticles, EXPERT_TIPS, AGENCY_REVIEWS } from '@/lib/agency';
import LifeCalculator from '@/components/verticals/LifeCalculator';
import PageHero from '@/components/PageHero';
import { HeroLifeCard } from '@/components/verticals/HeroCards';
import VideoBlock from '@/components/VideoBlock';
import FaqSection from '@/components/FaqSection';
import ArticleGrid from '@/components/ArticleGrid';
import ExpertTips from '@/components/ExpertTips';
import SuccessCarousel from '@/components/SuccessCarousel';

export const metadata: Metadata = {
  title: 'ביטוח חיים והגנה משפחתית — חישוב כיסוי מותאם',
  description:
    'ביטוח חיים (ריסק) שמגן על המשפחה כלכלית. מחשבון הגנה משפחתית שמתרגם הכנסה חודשית רצויה לכיסוי מומלץ, עם אומדן פרמיה מיידי וליווי סוכן מורשה.',
  keywords: ['ביטוח חיים', 'ביטוח ריסק', 'הגנה משפחתית', 'מחשבון ביטוח חיים'],
  alternates: { canonical: '/life' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: LIFE_FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function LifePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        icon={HeartHandshake}
        eyebrow="ביטוח חיים והגנה משפחתית"
        title={
          <>
            שהמשפחה תהיה <span className="text-gold-deep">מוגנת</span>, קורה מה שיקרה
          </>
        }
        subtitle="ביטוח חיים בגובה הנכון נותן ביטחון כלכלי למשפחה. חשבו כמה כיסוי אתם צריכים — וקבלו אומדן פרמיה מיידי."
        badges={['🛡️ הגנה משפחתית 2026', '👨‍👩‍👧 כיסוי מותאם אישית', '⚡ אומדן פרמיה מיידי']}
        primary={{ href: '#calculator', label: 'לחישוב הכיסוי' }}
        secondary={{ href: whatsappHref(), label: 'ייעוץ עם סוכן מורשה', external: true, icon: Shield }}
        visual={<HeroLifeCard />}
      />

      <div className="px-6 md:px-10">
        <LifeCalculator />
      </div>

      <VideoBlock
        title="כמה ביטוח חיים המשפחה שלכם באמת צריכה?"
        subtitle="מומחה מסביר איך מחשבים את סכום הכיסוי הנכון, מה ההבדל בין ריסק לחיסכון, ואיך בונים הגנה כלכלית שמחזיקה לאורך שנים."
        points={['כמה כיסוי מתאים להכנסה שלכם', 'ריסק מול פוליסת חיסכון', 'איך שומרים על פרמיה נמוכה']}
        href={whatsappHref()}
      />

      <ExpertTips title="טיפים לבחירת ביטוח חיים" tips={EXPERT_TIPS.life} />

      <SuccessCarousel title="משפחות שבחרו להגן על עצמן" reviews={AGENCY_REVIEWS} />

      <ArticleGrid
        title="מדריכי ביטוח חיים והגנה"
        subtitle="כמה כיסוי צריך, ואיך בונים הגנה כלכלית נכונה למשפחה."
        articles={relatedArticles('/life')}
      />

      <FaqSection
        title="שאלות ותשובות — ביטוח חיים"
        subtitle="כמה כיסוי צריך, מה ההבדל בין ריסק לחיסכון ואיך זה עובד."
        items={LIFE_FAQ}
      />
    </main>
  );
}
