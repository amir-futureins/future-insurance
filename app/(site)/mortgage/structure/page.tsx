import type { Metadata } from 'next';
import { Home, ArrowLeft, ShieldCheck } from 'lucide-react';
import { whatsappHref } from '@/lib/content';
import PageHero from '@/components/PageHero';
import { HeroMortgageCard } from '@/components/verticals/HeroCards';
import VideoBlock from '@/components/VideoBlock';
import FaqSection from '@/components/FaqSection';

export const metadata: Metadata = {
  title: 'ביטוח מבנה ודירה למשכנתא — כיסוי מלא בזול מהבנק',
  description:
    'ביטוח מבנה (נזקי טבע, אש, צנרת, רעידת אדמה) הנדרש למשכנתא — עצמאי וזול בעשרות אחוזים ממחיר הבנק, על אותו כיסוי בדיוק. מחשבון וליווי מלא במעבר.',
  keywords: ['ביטוח מבנה', 'ביטוח דירה למשכנתא', 'ביטוח מבנה למשכנתא', 'ביטוח נזקי טבע', 'ביטוח רעידת אדמה'],
  alternates: { canonical: '/mortgage/structure' },
};

const COVERS = [
  { emoji: '🔥', title: 'אש ונזקי מים', text: 'שריפה, פיצוץ, נזקי צנרת והצפה — הסיכונים הנפוצים ביותר למבנה.' },
  { emoji: '🌪️', title: 'נזקי טבע', text: 'סערה, שיטפון, שלג וברד — כיסוי לנזקים שהטבע גורם למבנה.' },
  { emoji: '🌍', title: 'רעידת אדמה', text: 'הרחבה חיונית באזור סיכון — כיסוי לנזקי רעידת אדמה למבנה.' },
  { emoji: '🏚️', title: 'נזקי צד ג׳', text: 'נזק שנגרם לשכן או לרכוש אחר כתוצאה מהמבנה שלכם.' },
];

const FAQ = [
  { q: 'האם ביטוח מבנה חובה למשכנתא?', a: 'כן. הבנק מחייב ביטוח מבנה כתנאי למשכנתא — אך אינכם חייבים לרכוש אותו דרך הבנק. פוליסה עצמאית לרוב זולה משמעותית על אותו כיסוי.' },
  { q: 'מה ההבדל בין ביטוח מבנה לביטוח תכולה?', a: 'ביטוח מבנה מכסה את הנכס עצמו (קירות, גג, צנרת). ביטוח תכולה מכסה את מה שבתוך הדירה (ריהוט, מכשירים). לרוב כדאי לשלב את שניהם.' },
  { q: 'כמה אפשר לחסוך מול הבנק?', a: 'בנקים לרוב מייקרים את ביטוח המבנה. פוליסה עצמאית באותו כיסוי חוסכת בדרך כלל עשרות אחוזים לאורך המשכנתא.' },
  { q: 'האם רעידת אדמה כלולה?', a: 'לא תמיד. זו הרחבה נפרדת אך חשובה מאוד בישראל. אנחנו נוודא שהכיסוי שלכם כולל אותה בהתאם לאזור.' },
  { q: 'איך עוברים מביטוח הבנק?', a: 'אנחנו מלווים את כל התהליך — כולל ההודעה לבנק והבטחת רצף כיסוי — כך שלא נשארים לרגע ללא הגנה.' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function StructurePage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        icon={Home}
        eyebrow="ביטוח משכנתא · מבנה ודירה"
        title={
          <>
            ביטוח מבנה למשכנתא — <span className="text-gold-deep">זול בעשרות אחוזים</span> מהבנק
          </>
        }
        subtitle="הבנק מחייב ביטוח מבנה — אבל לא חייבים לקנות דרכו. פוליסה עצמאית מכסה אש, נזקי טבע ורעידת אדמה, וחוסכת אלפי שקלים לאורך המשכנתא."
        badges={['🏠 כיסוי מלא למבנה', '🌍 רעידת אדמה', '💰 זול ממחיר הבנק']}
        primary={{ href: '/mortgage#calculator', label: 'לחישוב החיסכון' }}
        secondary={{ href: whatsappHref(), label: 'ייעוץ מהיר', external: true }}
        visual={<HeroMortgageCard />}
      />

      <section className="mx-auto w-full max-w-container px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow inline-flex items-center gap-1.5 text-[13px]">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            מה מכסה ביטוח מבנה?
          </span>
          <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
            הכיסויים החשובים למבנה שלכם
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {COVERS.map((c) => (
            <div key={c.title} className="glass flex items-start gap-3 p-5">
              <span className="text-[28px] leading-none" aria-hidden>{c.emoji}</span>
              <div>
                <h3 className="text-[16px] font-bold text-ink">{c.title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-muted">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <VideoBlock
        title="ביטוח מבנה למשכנתא — למה לא דרך הבנק?"
        subtitle="מומחה מסביר מה חייב להיות בפוליסת מבנה, למה ביטוח הבנק יקר, ואיך עוברים לפוליסה עצמאית בלי בירוקרטיה."
        points={['אילו כיסויים חובה למשכנתא', 'החיסכון מול מחיר הבנק', 'מעבר מסודר כולל ההודעה לבנק']}
        href={whatsappHref()}
      />

      <FaqSection
        title="שאלות ותשובות — ביטוח מבנה ודירה"
        subtitle="חובה למשכנתא? מה כלול, וכמה חוסכים מול הבנק."
        items={FAQ}
      />
    </main>
  );
}
