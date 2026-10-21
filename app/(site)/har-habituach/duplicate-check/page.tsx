import type { Metadata } from 'next';
import { Search } from 'lucide-react';
import { whatsappHref } from '@/lib/content';
import PageHero from '@/components/PageHero';
import { HeroHarCard } from '@/components/verticals/HeroCards';
import PolicyChecker from '@/components/verticals/PolicyChecker';
import VideoBlock from '@/components/VideoBlock';
import FaqSection from '@/components/FaqSection';

export const metadata: Metadata = {
  title: 'בדיקת כפל ביטוח והוזלה — ללא עלות',
  description:
    'משלמים על כיסוי כפול בלי לדעת? עוברים יחד על דוח הר הביטוח, מזהים כפל ביטוחים ומאחדים לתיק אחד מסודר. בדיקה ללא עלות וללא התחייבות.',
  keywords: ['כפל ביטוח', 'בדיקת כפל ביטוחים', 'הוזלת ביטוח', 'איחוד פוליסות', 'בדיקת פוליסות'],
  alternates: { canonical: '/har-habituach/duplicate-check' },
};

const FAQ = [
  { q: 'איך נוצר כפל ביטוח?', a: 'רוב האנשים צוברים פוליסות לאורך השנים דרך מקום העבודה, הבנק וסוכנים שונים — כך נוצר מצב שאותו כיסוי (למשל אובדן כושר עבודה) קיים בכמה מקומות במקביל.' },
  { q: 'האם מקבלים כפל פיצוי על כיסוי כפול?', a: 'על רוב הכיסויים — לא. משלמים פעמיים אך מקבלים פעם אחת. לכן זיהוי כפילויות ואיחודן חוסך כסף בלי לפגוע בהגנה.' },
  { q: 'איך מזהים כפילויות?', a: 'עוברים על דוח הר הביטוח, ממפים את כל הכיסויים, ומשווים ביניהם. אנחנו עושים זאת יחד אתכם ומסמנים בדיוק היכן משתלם לבטל ולאחד.' },
  { q: 'האם ביטול כיסוי כפול מסוכן?', a: 'לפני כל ביטול אנחנו מוודאים שלא נוצר ״חור״ בכיסוי, ומתזמנים את המעבר כך שתהיו מכוסים ברצף.' },
  { q: 'כמה אפשר לחסוך?', a: 'זה תלוי לגמרי בתיק שלכם, ואין דרך לדעת מראש. הבדיקה עצמה ללא עלות וללא התחייבות.' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function DuplicateCheckPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        icon={Search}
        eyebrow="הר הביטוח · בדיקת כפל"
        title={
          <>
            בדיקת <span className="text-gold-deep">כפל ביטוח</span> והוזלה
          </>
        }
        subtitle="רבים משלמים שנים על פוליסות חופפות בלי לדעת. עוברים יחד על דוח הר הביטוח, מזהים כפילויות ומאחדים לתיק אחד מסודר."
        badges={['🔍 בדיקת כפילויות', '🤝 ליווי אישי', '🆓 ללא עלות']}
        primary={{ href: '#checker', label: 'לבדיקת כפילויות', icon: Search }}
        secondary={{ href: whatsappHref(), label: 'איחוד תיק חינם', external: true }}
        visual={<HeroHarCard />}
      />

      <div className="px-6 pt-4 md:px-10">
        <PolicyChecker />
      </div>

      <VideoBlock
        title="כמה אתם משלמים על כיסוי כפול?"
        subtitle="מומחה מדגים איך קוראים את הר הביטוח, מזהים חפיפות מיותרות ומאחדים לתיק אחד — בלי ליצור חור בכיסוי."
        points={['זיהוי כיסויים כפולים', 'איחוד חכם בלי חור בכיסוי', 'חיסכון חודשי קבוע']}
        href={whatsappHref()}
      />

      <FaqSection
        title="שאלות ותשובות — כפל ביטוח והוזלה"
        subtitle="כל מה שצריך לדעת על זיהוי כפילויות ואיחוד התיק."
        items={FAQ}
      />
    </main>
  );
}
