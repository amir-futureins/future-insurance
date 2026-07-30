import type { Metadata } from 'next';
import { Car, FileText, ShieldCheck, ArrowLeft } from 'lucide-react';
import { whatsappHref } from '@/lib/content';
import PageHero from '@/components/PageHero';
import { HeroCarHistoryCard } from '@/components/verticals/HeroCards';
import GovDataCta from '@/components/GovDataCta';
import VideoBlock from '@/components/VideoBlock';
import FaqSection from '@/components/FaqSection';

export const metadata: Metadata = {
  title: 'הוצאת אישור עבר ביטוחי לרכב ב-3 דקות — מדריך',
  description:
    'איך מוציאים אישור עבר ביטוחי (היסטוריית תביעות) לרכב מהר הביטוח ב-3 צעדים פשוטים, ואיך עבר נקי מזכה בהנחה משמעותית בביטוח הרכב. בדיקה וליווי חינם.',
  keywords: ['עבר ביטוחי לרכב', 'אישור היסטוריית תביעות', 'הר הביטוח רכב', 'הנחה בביטוח רכב', 'ותק ביטוחי'],
  alternates: { canonical: '/har-habituach/car-claims' },
};

const STEPS = [
  { n: '1', title: 'מזדהים באתר משרד האוצר', text: 'נכנסים ל״הר הביטוח״ ומזדהים בהזדהות מאובטחת (אשראי / אפליקציה / SMS).', color: '#0057B8' },
  { n: '2', title: 'מפיקים את דוח העבר', text: 'בוחרים ברכב ומורידים את אישור היסטוריית התביעות והפוליסות.', color: '#8A6220' },
  { n: '3', title: 'שולחים אלינו', text: 'נבדוק שהעבר מדויק ונשתמש בו כדי להשיג לכם את ההנחה שמגיעה.', color: '#16A34A' },
];

const FAQ = [
  { q: 'מהו אישור עבר ביטוחי לרכב?', a: 'מסמך רשמי מהר הביטוח המרכז את היסטוריית הפוליסות והתביעות שלכם ברכב. חברות הביטוח משתמשות בו כדי לתמחר את הפוליסה — עבר נקי מזכה בהנחה.' },
  { q: 'כמה זמן לוקח להוציא את האישור?', a: 'ההזדהות והפקת הדוח בהר הביטוח אורכות בדרך כלל מספר דקות. לאחר מכן נבדוק אותו יחד אתכם.' },
  { q: 'האם עבר נקי באמת מוזיל את הביטוח?', a: 'כן. היעדר תביעות וותק ביטוחי רציף הם מהגורמים המשמעותיים ביותר בתמחור ביטוח רכב, ויכולים לחסוך מאות שקלים בשנה.' },
  { q: 'מה אם עברתי בין חברות ביטוח?', a: 'הר הביטוח מרכז את המידע מכלל החברות, כך שהוותק שלכם נשמר גם אם החלפתם מבטח. חשוב לוודא שהמידע מלא ומדויק.' },
  { q: 'האם השירות בתשלום?', a: 'לא. בדיקת העבר הביטוחי והליווי מולנו הם ללא עלות וללא התחייבות — אנחנו מתוגמלים על ידי חברת הביטוח בעת המעבר.' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function CarClaimsPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        icon={Car}
        eyebrow="הר הביטוח · עבר ביטוחי לרכב"
        title={
          <>
            אישור עבר ביטוחי לרכב <span className="text-gold-deep">ב-3 דקות</span>
          </>
        }
        subtitle="עבר נקי מזכה בהנחה משמעותית בביטוח הרכב. כך מפיקים את האישור מהר הביטוח בשלושה צעדים — ואנחנו נשיג לכם את המחיר הטוב ביותר."
        badges={['🚗 היסטוריית תביעות', '💸 הנחה על עבר נקי', '🆓 בדיקה חינם']}
        primary={{ href: '#steps', label: 'למדריך המלא' }}
        secondary={{ href: whatsappHref(), label: 'נעזור לכם בהוצאה', external: true }}
        visual={<HeroCarHistoryCard />}
      />

      <GovDataCta
        heading="רוצים את דוח העבר הביטוחי שלכם? נפיק אותו ב-2 דקות"
        buttonLabel="הפקת דוח עבר ביטוחי ב-2 דקות"
        topic="car_claims_gov"
        modalTitle="הפקת דוח עבר ביטוחי לרכב"
      />

      <section id="steps" className="mx-auto w-full max-w-container scroll-mt-24 px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-[13px]">שלושה צעדים פשוטים</span>
          <h2 className="mt-2 text-[clamp(22px,5vw,28px)] font-bold leading-tight text-ink">
            איך מוציאים את האישור מהר הביטוח
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="glass relative p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl text-[18px] font-extrabold text-white shadow" style={{ backgroundColor: s.color }}>
                {s.n}
              </span>
              <h3 className="mt-3 text-[16px] font-bold text-ink">{s.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-cta-fill px-6 py-3.5 text-[16px] font-extrabold text-navy-deep shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(212,162,74,0.6)]"
          >
            <FileText className="h-5 w-5" aria-hidden />
            נעזור לכם עם העבר הביטוחי
          </a>
        </div>
      </section>

      <VideoBlock
        title="עבר ביטוחי נקי = ביטוח רכב זול יותר"
        subtitle="מומחה מסביר איך היסטוריית התביעות משפיעה על המחיר, איך מוודאים שהאישור מדויק, ואיך ממנפים ותק נקי להנחה."
        points={['מה בודקות חברות הביטוח', 'איך שומרים על רצף ביטוחי', 'מתי כדאי להחליף מבטח']}
        href={whatsappHref()}
      />

      <FaqSection
        title="שאלות ותשובות — עבר ביטוחי לרכב"
        subtitle="הכול על אישור היסטוריית התביעות וההנחה שמגיעה לכם."
        items={FAQ}
      />
    </main>
  );
}
