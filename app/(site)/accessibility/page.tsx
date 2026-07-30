import type { Metadata } from 'next';
import { SITE } from '@/lib/content';

export const metadata: Metadata = {
  title: 'הצהרת נגישות',
  description: 'הצהרת הנגישות של Future Insurance בהתאם לתקן הישראלי ולתקנות הנגישות.',
  alternates: { canonical: '/accessibility' },
  robots: { index: false, follow: true },
};

export default function AccessibilityStatement() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24">
      <span className="eyebrow text-[13px]">נגישות</span>
      <h1 className="mt-2 text-[clamp(28px,6vw,40px)] font-extrabold leading-tight text-ink">
        הצהרת נגישות
      </h1>
      <div className="mt-8 space-y-6 text-[16px] leading-relaxed text-muted">
        <p>
          ב-{SITE.name} אנו רואים חשיבות רבה במתן שירות שוויוני לכלל הגולשים, ופועלים
          להנגשת האתר בהתאם לתקן הישראלי (ת״י 5568) ולהנחיות ה-WCAG 2.1 ברמה AA.
        </p>
        <div>
          <h2 className="mb-2 text-[18px] font-bold text-ink">תפריט הנגישות</h2>
          <p>
            באתר מוטמע תפריט נגישות צף (סמל הנגישות בפינת המסך) המאפשר, בין היתר: הגדלת
            והקטנת טקסט, ניגודיות גבוהה, ניגודיות הפוכה, מצב גווני אפור, הדגשת קישורים,
            גופן קריא, עצירת אנימציות וסמן מוגדל.
          </p>
        </div>
        <div>
          <h2 className="mb-2 text-[18px] font-bold text-ink">אמצעים נוספים</h2>
          <p>
            האתר נבנה בתמיכה מלאה בניווט מקלדת, בקורא מסך, במבנה כותרות סמנטי ובכיווניות
            RTL מלאה. שדות הטופס מתויגים והרכיבים כוללים חיווי מיקוד ברור.
          </p>
        </div>
        <div>
          <h2 className="mb-2 text-[18px] font-bold text-ink">יצירת קשר בנושא נגישות</h2>
          <p>
            נתקלתם בקושי? נשמח לסייע. ניתן{' '}
            <a href={SITE.phoneHref} className="font-semibold text-gold-deep underline underline-offset-2">
              לחייג אלינו לייעוץ
            </a>{' '}
            ונטפל בפנייה בהקדם.
          </p>
        </div>
      </div>

      <a
        href="/travel-insurance"
        className="mt-10 inline-block rounded-xl bg-cta-fill px-5 py-3 text-[15px] font-bold text-navy-deep shadow-md shadow-gold/20"
      >
        חזרה לאתר
      </a>
    </main>
  );
}
