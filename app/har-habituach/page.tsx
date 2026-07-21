import type { Metadata } from 'next';
import { Mountain, ArrowLeft, Car, Search, FileSearch, Fingerprint, PiggyBank } from 'lucide-react';
import { whatsappHref } from '@/lib/content';
import { HAR_FAQ, AGENCY_ARTICLES } from '@/lib/agency';
import PolicyChecker from '@/components/verticals/PolicyChecker';
import PageHero from '@/components/PageHero';
import { HeroHarCard } from '@/components/verticals/HeroCards';
import VideoBlock from '@/components/VideoBlock';
import FaqSection from '@/components/FaqSection';
import ArticleGrid from '@/components/ArticleGrid';

export const metadata: Metadata = {
  title: 'הר הביטוח ועבר ביטוחי לרכב — סורק כפל פוליסות ואיחוד תיק',
  description:
    'בודקים את הר הביטוח, מזהים כפל פוליסות ומאחדים את תיק הביטוח לחיסכון של מאות שקלים בחודש. בדיקת עבר ביטוחי לרכב להשגת המחיר הטוב ביותר — בדיקה חינם.',
  keywords: ['הר הביטוח', 'עבר ביטוחי לרכב', 'כפל ביטוחים', 'איחוד תיק ביטוח', 'סריקת פוליסות'],
  alternates: { canonical: '/har-habituach' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: HAR_FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const HERO_STEPS = [
  { n: '1', title: 'הזנת ת.ז', text: 'מזדהים בהזדהות מאובטחת מול הר הביטוח.', Icon: Fingerprint, color: '#0057B8' },
  { n: '2', title: 'איתור פוליסות', text: 'סורקים ומאתרים את כל הפוליסות והכפילויות.', Icon: FileSearch, color: '#A97C34' },
  { n: '3', title: 'איחוד וחיסכון', text: 'מאחדים לתיק אחד חכם — מאות ₪ חיסכון בחודש.', Icon: PiggyBank, color: '#16A34A' },
];

export default function HarHabituachPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        icon={Mountain}
        eyebrow="הר הביטוח / עבר ביטוחי"
        title={
          <>
            כמה אתם משלמים על <span className="text-gold-deep">כיסוי כפול</span>?
          </>
        }
        subtitle="רבים משלמים שנים על פוליסות חופפות בלי לדעת. סורקים את הר הביטוח, מזהים כפילויות ומאחדים לתיק אחד חכם — לרוב בחיסכון של מאות שקלים בחודש."
        badges={['🔍 סריקת כפילויות בלייב', '🚗 עבר ביטוחי לרכב', '💸 חיסכון מאות ₪ בחודש']}
        primary={{ href: '#checker', label: 'לסריקת כפילויות', icon: Search }}
        secondary={{ href: whatsappHref(), label: 'איחוד תיק חינם', external: true }}
        visual={<HeroHarCard />}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {HERO_STEPS.map((s) => (
            <a
              key={s.n}
              href="#checker"
              className="group relative flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-lg transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <span
                className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white shadow-md"
                style={{ backgroundColor: s.color }}
              >
                <s.Icon className="h-6 w-6" aria-hidden />
              </span>
              <div className="min-w-0">
                <div className="text-[12px] font-extrabold" style={{ color: s.color }}>
                  שלב {s.n}
                </div>
                <p className="text-[15.5px] font-bold text-ink">{s.title}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-muted">{s.text}</p>
              </div>
            </a>
          ))}
        </div>
      </PageHero>

      <div className="px-6 pt-8 md:px-10">
        <PolicyChecker />
      </div>

      {/* rich educational content */}
      <section className="mx-auto w-full max-w-container px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-3xl">
          <span className="eyebrow text-[13px]">מדריך מקיף</span>
          <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
            איך עובד ״הר הביטוח״ של משרד האוצר?
          </h2>
          <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-ink/90">
            <p>
              ״הר הביטוח״ הוא שירות דיגיטלי של רשות שוק ההון, ביטוח וחיסכון, שמרכז במקום אחד
              את כל פוליסות הביטוח הפעילות של אזרח — חיים, בריאות, אובדן כושר עבודה, רכב, דירה
              ועוד. הכניסה מתבצעת בהזדהות מאובטחת, ובתוך דקות מקבלים תמונה מלאה של מה שיש לכם,
              בכמה חברות ובאיזה עלות.
            </p>
            <h3 className="pt-2 text-[19px] font-bold text-ink">למה בכלל נוצרות כפילויות?</h3>
            <p>
              רוב האנשים צוברים פוליסות לאורך השנים — דרך מקום העבודה, הבנק, סוכנים שונים או
              רכישות עבר — בלי לבחון את התמונה הכוללת. כך נוצר מצב שבו אותו כיסוי (למשל אובדן
              כושר עבודה או ביטוח חיים) קיים בכמה מקומות במקביל. הבעיה: על רוב הכיסויים לעולם
              לא תקבלו כפל פיצוי — כלומר אתם משלמים פעמיים, אבל מקבלים פעם אחת.
            </p>
            <h3 className="pt-2 text-[19px] font-bold text-ink">
              איך Future Insurance מטפלת באיחוד?
            </h3>
            <p>
              אנחנו סוקרים איתכם את הר הביטוח, ממפים את כל הכיסויים, מזהים חפיפות ומחשבים היכן
              משתלם לבטל ולאחד. לפני כל ביטול אנחנו מוודאים שלא נוצר ״חור״ בכיסוי, ומתזמנים את
              המעבר כך שתהיו מכוסים ברצף. התוצאה: תיק ביטוח אחד, חכם ומסודר — לרוב בחיסכון של
              מאות שקלים בחודש.
            </p>
          </div>
        </div>
      </section>

      {/* car claims — 3-step infographic */}
      <section
        id="claims"
        className="mx-auto w-full max-w-container scroll-mt-24 px-6 py-14 md:px-10 md:py-16"
      >
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow inline-flex items-center gap-1.5 text-[13px]">
            <Car className="h-4 w-4" aria-hidden />
            עבר ביטוחי לרכב
          </span>
          <h2 className="mt-2 text-[clamp(22px,5vw,28px)] font-bold leading-tight text-ink">
            איך מוציאים אישור עבר ביטוחי לרכב ב-3 צעדים פשוטים
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            עבר נקי מזכה בהנחה משמעותית. כך מפיקים את האישור — ואנחנו נשיג לכם את המחיר.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[
            { n: '1', title: 'מזדהים באתר משרד האוצר', text: 'נכנסים ל״הר הביטוח״ ומזדהים בהזדהות מאובטחת (אשראי / אפליקציה / SMS).' },
            { n: '2', title: 'מפיקים את דוח העבר', text: 'בוחרים ברכב ומורידים את אישור היסטוריית התביעות והפוליסות.' },
            { n: '3', title: 'שולחים אלינו', text: 'נבדוק שהעבר מדויק ונשתמש בו כדי להשיג לכם את ההנחה שמגיעה.' },
          ].map((s) => (
            <div key={s.n} className="glass relative p-6">
              <span
                className="grid h-11 w-11 place-items-center rounded-xl bg-navy text-[18px] font-extrabold text-gold-bright shadow"
                aria-hidden
              >
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
            נעזור לכם עם העבר הביטוחי
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </a>
        </div>
      </section>

      <VideoBlock
        title="איך מזהים כפל ביטוחים בהר הביטוח?"
        subtitle="מומחה מדגים איך נכנסים להר הביטוח, קוראים את הפוליסות, מזהים חפיפות מיותרות ומאחדים לתיק אחד חכם — בלי ליצור חור בכיסוי."
        points={['כניסה והזדהות בהר הביטוח', 'זיהוי כיסויים כפולים', 'איחוד חכם וחיסכון חודשי']}
        href={whatsappHref()}
      />

      <ArticleGrid
        title="מדריכים — הר הביטוח וכפל פוליסות"
        subtitle="איך קוראים את הר הביטוח ומזהים על מה משלמים מיותר."
        articles={AGENCY_ARTICLES.filter((a) => a.href === '/har-habituach' || a.href === '/health').slice(0, 3)}
      />

      <FaqSection
        title="שאלות ותשובות — הר הביטוח ועבר ביטוחי"
        subtitle="כל מה שצריך לדעת על סריקת פוליסות, כפילויות ואיחוד תיק."
        items={HAR_FAQ}
      />
    </main>
  );
}
