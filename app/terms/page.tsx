import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, AlertTriangle } from 'lucide-react';
import { SITE } from '@/lib/content';

export const metadata: Metadata = {
  title: 'תקנון ותנאי שימוש ומדיניות פרטיות',
  description:
    'תקנון האתר, תנאי השימוש ומדיניות הפרטיות של Future Insurance — הרשאה לשאילתא בהר הביטוח, מסירת מידע לחברות ביטוח מורשות, דיוור שיווקי ופטור מאחריות.',
  alternates: { canonical: '/terms' },
};

const UPDATED = '22 ביולי 2026';

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="flex items-baseline gap-2 text-[19px] font-extrabold text-ink">
        <span className="num text-gold-deep">{n}.</span>
        {title}
      </h2>
      <div className="mt-2 space-y-3 text-[15px] leading-relaxed text-ink/85">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-14 md:px-10 md:py-16">
      <span className="eyebrow inline-flex items-center gap-1.5 text-[13px]">
        <ShieldCheck className="h-4 w-4" aria-hidden />
        משפטי
      </span>
      <h1 className="mt-2 text-[clamp(26px,5vw,36px)] font-extrabold leading-tight text-ink">
        תקנון, תנאי שימוש ומדיניות פרטיות
      </h1>
      <p className="mt-2 text-[14px] text-muted">עודכן לאחרונה: {UPDATED}</p>

      {/* Draft / legal-review banner */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
        <p className="text-[13.5px] leading-relaxed text-amber-900">
          <strong>טיוטה לבדיקה משפטית.</strong> מסמך זה הוא תבנית ראשונית ואינו מהווה ייעוץ משפטי.
          יש להעביר אותו לעורך/ת דין מורשה בישראל להתאמה ואישור סופי (כולל התאמה לחוק הגנת הפרטיות,
          חוק התקשורת (בזק ושידורים) והוראות רשות שוק ההון) לפני עלייה לאוויר.
        </p>
      </div>

      <div className="mt-8 space-y-3 text-[15px] leading-relaxed text-ink/85">
        <p>
          ברוכים הבאים ל-Future Insurance (״האתר״, ״אנחנו״), הפועל בכתובת {SITE.url ? 'futureins.co.il' : 'futureins.co.il'}.
          השימוש באתר, לרבות מילוי טפסים ומסירת פרטים, כפוף לתנאים המפורטים להלן. אנא קראו אותם בעיון.
          מסירת פרטים באתר ואישור תיבת ההסכמה מהווים הסכמה מלאה לתנאים אלה.
        </p>
      </div>

      <Section n="1" title="הרשאה לביצוע שאילתא (הר הביטוח / מסלקה פנסיונית)">
        <p>
          בסימון תיבת ההסכמה ובמסירת פרטיכם, אתם מייפים את כוחו של סוכן הביטוח המורשה מטעם האתר
          לבצע בשמכם שאילתא ואיסוף מידע ממאגרי המידע הרלוונטיים, לרבות ״הר הביטוח״ של רשות שוק ההון,
          ביטוח וחיסכון, המסלקה הפנסיונית, וכן מול חברות הביטוח והגופים המוסדיים בהם מתנהלים ביטוחים,
          פוליסות או חסכונות על שמכם.
        </p>
        <p>
          מטרת השאילתא היא מיפוי הכיסויים הקיימים, איתור כפילויות, השוואת עלויות והתאמת המלצה. הרשאה זו
          ניתנת מרצונכם החופשי וניתן לבטלה בכל עת בפנייה אלינו, בכפוף להוראות הדין ולתהליכים שכבר החלו.
        </p>
      </Section>

      <Section n="2" title="מסירת מידע לצד שלישי">
        <p>
          אתם מאשרים כי הפרטים שתמסרו (לרבות שם, טלפון, ומספר תעודת זהות ככל שנמסר) יועברו ויעובדו על ידי
          האתר ומי מטעמו, וכן יימסרו לחברות ביטוח מורשות, סוכנויות ושותפים עסקיים רלוונטיים, לצורך גיבוש
          הצעה, ביצוע השוואה ומתן שירות. אנו נעביר את המידע ההכרחי בלבד ולמטרות אלו בלבד.
        </p>
        <p>
          האתר נוקט אמצעים סבירים לאבטחת המידע, אך אינו יכול להתחייב לחסינות מוחלטת מפני חדירה או שימוש
          לרעה. מסירת המידע אינה חובה חוקית, אך היא תנאי לקבלת השירות המבוקש.
        </p>
      </Section>

      <Section n="3" title="דיוור, שיווק והסכמה לפי חוק התקשורת">
        <p>
          בסימון ההסכמה אתם מאשרים לקבל מאיתנו פניות ותכני שיווק בכל אמצעי — שיחת טלפון, מסרון (SMS),
          דוא״ל ו-WhatsApp — בהתאם להוראות חוק התקשורת (בזק ושידורים), התשמ״ב-1982 (״חוק הספאם״).
        </p>
        <p>
          תוכלו להסיר את הסכמתכם ולהפסיק לקבל דיוור בכל עת, ללא עלות, באמצעות מענה ״הסר״ להודעה, לחיצה על
          קישור ההסרה, או פנייה אלינו בטלפון או בדוא״ל.
        </p>
      </Section>

      <Section n="4" title="פטור מאחריות והיעדר ייעוץ מחייב">
        <p>
          כל המחשבונים, ההערכות, הסכומים, אחוזי החיסכון ותרחישי התשואה המוצגים באתר הם{' '}
          <strong>להמחשה בלבד</strong>. הם מבוססים על הנחות כלליות, אינם מהווים הצעה מחייבת, אינם תחליף
          לחיתום, ואינם ייעוץ ביטוחי, פנסיוני, מס או משפטי אישי. הנתונים בפועל ייקבעו על ידי חברות הביטוח
          בהתאם לנתוניכם המלאים ולתנאי הפוליסה.
        </p>
        <p>
          תשואות עבר אינן מבטיחות תשואות עתידיות. אין באמור באתר משום המלצה לרכוש, לבטל או לשנות מוצר
          פיננסי או ביטוחי כלשהו. האחריות לכל החלטה היא על המשתמש/ת, ומומלץ להיוועץ בבעל רישיון מתאים
          טרם קבלת החלטה.
        </p>
      </Section>

      <Section n="5" title="פרטיות, עוגיות וזכויות המשתמש">
        <p>
          האתר עושה שימוש בכלי ניתוח ובעוגיות (Cookies) לצורך תפעול, מדידה ושיפור השירות. אתם זכאים לעיין
          במידע שנאסף עליכם, לבקש את תיקונו או מחיקתו, ולחזור בכם מהסכמתכם, בכפוף להוראות חוק הגנת הפרטיות,
          התשמ״א-1981.
        </p>
      </Section>

      <Section n="6" title="יצירת קשר">
        <p>
          בכל שאלה או בקשה בנוגע לתקנון, למידע שלכם או להסרה מרשימת הדיוור, ניתן לפנות אלינו בטלפון{' '}
          <a href={SITE.phoneHref} className="font-semibold text-gold-deep underline underline-offset-2">
            {SITE.phoneCta}
          </a>{' '}
          או בערוצי הפנייה המופיעים באתר.
        </p>
      </Section>

      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 rounded-xl border border-navy/15 bg-white px-5 py-3 text-[15px] font-bold text-ink shadow-sm transition-colors hover:bg-navy/[0.04]"
      >
        חזרה לעמוד הבית
        <ArrowLeft className="h-4 w-4" aria-hidden />
      </Link>
    </main>
  );
}
