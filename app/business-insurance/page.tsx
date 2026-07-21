import type { Metadata } from 'next';
import { Briefcase, ShieldCheck, ArrowLeft, Phone } from 'lucide-react';
import { whatsappHref, SITE } from '@/lib/content';
import PageHero from '@/components/PageHero';
import VideoBlock from '@/components/VideoBlock';
import FaqSection from '@/components/FaqSection';

export const metadata: Metadata = {
  title: 'ביטוח לעסק — אחריות, תכולה ומבנה עסקי | הגנה מלאה 360°',
  description:
    'ביטוח עסק מקיף: אחריות מקצועית וצד ג׳, ביטוח תכולה ומלאי, ביטוח מבנה עסקי ואובדן הכנסה. התאמת כיסוי לפי סוג העסק, השוואת חברות וליווי סוכן מורשה.',
  keywords: ['ביטוח עסק', 'ביטוח אחריות מקצועית', 'ביטוח צד שלישי לעסק', 'ביטוח תכולת עסק', 'ביטוח מבנה עסקי'],
  alternates: { canonical: '/business-insurance' },
};

const SHIELD = [
  { emoji: '⚖️', label: 'אחריות מקצועית וצד ג׳', color: '#0F2141' },
  { emoji: '📦', label: 'תכולה, מלאי וציוד', color: '#8A6220' },
  { emoji: '🏢', label: 'מבנה עסקי', color: '#0057B8' },
  { emoji: '📉', label: 'אובדן הכנסה', color: '#16A34A' },
];

const COVERS = [
  { emoji: '⚖️', title: 'אחריות מקצועית וצד ג׳', text: 'הגנה מפני תביעות של לקוחות או צד שלישי בגין נזק, טעות או רשלנות מקצועית.' },
  { emoji: '📦', title: 'תכולה, מלאי וציוד', text: 'כיסוי לרכוש העסק — מלאי, ציוד, מחשבים וריהוט — מפני גניבה, אש ונזקי מים.' },
  { emoji: '🏢', title: 'מבנה עסקי', text: 'ביטוח המבנה שבו פועל העסק מפני אש, נזקי טבע ורעידת אדמה.' },
  { emoji: '📉', title: 'אובדן הכנסה', text: 'פיצוי על אובדן רווחים בתקופה שבה העסק מושבת עקב נזק מכוסה.' },
  { emoji: '👥', title: 'חבות מעבידים', text: 'הגנה מפני תביעות עובדים בגין תאונות ונזקים במסגרת העבודה.' },
  { emoji: '💻', title: 'סייבר ודליפת מידע', text: 'כיסוי לאירועי סייבר, כופרה ודליפת מידע — קריטי לעסקים דיגיטליים.' },
];

const FAQ = [
  { q: 'איזה ביטוח חייב עסק?', a: 'זה תלוי בסוג העסק, אך רוב העסקים זקוקים לאחריות מקצועית / צד ג׳, ביטוח תכולה, וחבות מעבידים אם יש עובדים. נבנה חבילה מותאמת בדיוק לפעילות שלכם.' },
  { q: 'מה ההבדל בין אחריות מקצועית לצד ג׳?', a: 'אחריות מקצועית מכסה נזק שנגרם מטעות או רשלנות מקצועית בשירות. צד ג׳ מכסה נזק גופני או רכושי שנגרם לאדם או לרכוש חיצוני במהלך הפעילות.' },
  { q: 'האם עסק קטן / עוסק פטור צריך ביטוח?', a: 'כן. גם עסק קטן חשוף לתביעות ולנזקי רכוש. קיימות חבילות משתלמות המותאמות לעצמאים ולעסקים קטנים.' },
  { q: 'האם כדאי לבטח אובדן הכנסה?', a: 'מאוד. אם העסק מושבת עקב נזק (למשל שריפה), ביטוח אובדן הכנסה מפצה על הרווחים שנמנעו — לעיתים ההבדל בין התאוששות לסגירה.' },
  { q: 'איך מקבלים הצעה לביטוח עסק?', a: 'משאירים פרטים או פונים אלינו בוואטסאפ. סוכן מורשה יאפיין את העסק, ישווה בין החברות המובילות ויתאים לכם כיסוי מלא במחיר הטוב ביותר.' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

function ShieldCard() {
  return (
    <div className="glass-elevated relative mx-auto w-full max-w-md overflow-hidden">
      <div className="flex items-center justify-between bg-gradient-to-l from-navy-deep to-[#22366A] px-5 py-3 text-white">
        <span className="flex items-center gap-2 text-[14px] font-extrabold">
          <ShieldCheck className="h-4 w-4 text-gold-bright" aria-hidden />
          מגן עסקי 360°
        </span>
        <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[12px] font-bold text-emerald-200">כיסוי מלא</span>
      </div>
      <div className="p-5 sm:p-6">
        <div className="relative mx-auto grid h-20 w-20 place-items-center">
          <span className="absolute inset-0 animate-pulse-glow rounded-full bg-gold-tint" aria-hidden />
          <Briefcase className="relative h-10 w-10 text-navy" aria-hidden />
        </div>
        <p className="mt-3 text-center text-[13px] font-semibold text-muted">הגנה מקצה לקצה לעסק שלכם</p>
        <ul className="mt-4 grid grid-cols-2 gap-2.5">
          {SHIELD.map((s) => (
            <li key={s.label} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200/70">
              <span className="text-[16px]" aria-hidden>{s.emoji}</span>
              <span className="text-[12px] font-semibold leading-tight text-ink">{s.label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-center text-[11px] text-faint">הכיסוי מותאם לפי סוג העסק והפעילות</p>
      </div>
    </div>
  );
}

export default function BusinessInsurancePage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        icon={Briefcase}
        eyebrow="ביטוח לעסק"
        title={
          <>
            ביטוח לעסק — <span className="text-gold-deep">הגנה מלאה 360°</span>
          </>
        }
        subtitle="אחריות מקצועית וצד ג׳, תכולה ומלאי, מבנה עסקי ואובדן הכנסה — בונים לעסק שלכם חבילת כיסוי מדויקת, משווים בין החברות המובילות ובליווי סוכן מורשה."
        badges={['⚖️ אחריות וצד ג׳', '📦 תכולה ומלאי', '🏢 מבנה עסקי', '📉 אובדן הכנסה']}
        primary={{ href: whatsappHref(), label: 'לקבלת הצעה לעסק', external: true }}
        secondary={{ href: SITE.phoneHref, label: SITE.phoneCta, external: true, icon: Phone }}
        visual={<ShieldCard />}
      />

      <section className="mx-auto w-full max-w-container px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-[13px]">כיסויים לעסק</span>
          <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
            מה חשוב לבטח בעסק שלכם?
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-muted">
            כל עסק חשוף לסיכונים אחרים. נבנה חבילה שמכסה בדיוק את מה שרלוונטי לפעילות שלכם — בלי לשלם על מיותר.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COVERS.map((c) => (
            <div key={c.title} className="glass p-6">
              <span className="text-[30px] leading-none" aria-hidden>{c.emoji}</span>
              <h3 className="mt-3 text-[16px] font-bold text-ink">{c.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <VideoBlock
        title="בונים ביטוח עסק חכם — בלי חורים בכיסוי"
        subtitle="מומחה מסביר אילו סיכונים כל עסק חייב לכסות, איך מתאימים את החבילה לסוג הפעילות, ואיך משיגים את המחיר הטוב ביותר."
        points={['אפיון הסיכונים של העסק', 'השוואה בין החברות המובילות', 'התאמת כיסוי לתקציב']}
        href={whatsappHref()}
      />

      <FaqSection
        title="שאלות ותשובות — ביטוח לעסק"
        subtitle="מה חייב לבטח, ההבדלים בין הכיסויים ואיך מקבלים הצעה."
        items={FAQ}
      />
    </main>
  );
}
