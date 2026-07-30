import type { Metadata } from 'next';
import Script from 'next/script';
import { AGENT } from '@/lib/agency';
import AccessibilityMenu from '@/components/travel/AccessibilityMenu';
import FlyWidgets from '@/components/fly/FlyWidgets';

/**
 * /fly — standalone licensed-agent travel-insurance landing page.
 *
 * Served at the ROOT of fly.amirs.co.il: middleware.ts rewrites "/" on that host
 * to this route, so futureins.co.il keeps its own homepage untouched.
 *
 * SiteChrome gives /fly a bare canvas (no TrustBar / MarketTicker / SiteFooter
 * and none of the site's floating widgets), so this page carries its own header,
 * footer and widgets. The one piece it reuses is the shared AccessibilityMenu,
 * which already satisfies IS 5568.
 *
 * Purchase CTAs point at /api/go/passportcard rather than the raw partner URL:
 * that route 302s to the EXACT affiliate deep-link (no re-serialization, so the
 * encoded %3D%3D survives), stays rotatable through the AFFILIATE_PASSPORTCARD
 * env var, and is the only href shape components/AffiliateClickTracker watches.
 */

const BUY = '/api/go/passportcard';
const FLY_URL = 'https://fly.amirs.co.il';

/**
 * Real Capital Market Authority licence number, kept local to this route.
 * lib/agency.ts still carries a placeholder in AGENT.license which is rendered
 * across the main site — deliberately left alone here so futureins.co.il is not
 * touched, but it should be corrected separately.
 */
const LICENSE = '208678854';
const DISCLOSURE = `משווק מורשה של פספורטכארד | מס׳ רישיון: ${LICENSE}`;

/* Compliance 5.2.1 — the agent name must render at a font size greater than or
   equal to the H1. Both are clamps whose min, slope AND max satisfy that, so the
   relationship holds at every viewport width, not only at tested breakpoints. */
const FS_AGENT = 'text-[clamp(1.5rem,4.9vw,2.55rem)]';
const FS_H1 = 'text-[clamp(1.45rem,4.6vw,2.4rem)]';

const H2 = 'text-[clamp(1.2rem,3.6vw,1.75rem)] font-extrabold tracking-tight text-ink';
const RAIL =
  '-mx-4 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pb-0';
const RAIL_ITEM = 'min-w-[260px] shrink-0 snap-center md:min-w-0 md:shrink';

/* Compliance 5.2.3 — the brand keyword ("פספורטכארד" / "PassportCard") must not
   appear in the <title>, the meta description, or the <h1>. */
export const metadata: Metadata = {
  // `absolute` bypasses the root layout's "%s | Future Insurance" template —
  // this host is the agent's landing page, not an Future Insurance sub-page, and
  // the suffix also pushed the title past the SERP truncation length.
  title: {
    absolute:
      'ביטוח נסיעות לחו״ל ברכישה דיגיטלית מהירה | אמיר שושני, סוכן ביטוח מורשה',
  },
  description:
    'ביטוח נסיעות לחו״ל מותאם ליעד, לגיל ולמצב רפואי קיים: צירוף דיגיטלי מאובטח, תשלום ישיר על הוצאות רפואיות בחו״ל וליווי אישי 24/7 של אמיר שושני, סוכן ביטוח מורשה. מס׳ רישיון 208678854.',
  // Canonical points at the fly host, so the copy reachable at
  // futureins.co.il/fly does not compete with it as duplicate content.
  alternates: { canonical: `${FLY_URL}/` },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: `${FLY_URL}/`,
    siteName: `${AGENT.name} – ${AGENT.title}`,
    title: 'ביטוח נסיעות לחו״ל ברכישה דיגיטלית מהירה ובליווי אישי',
    description:
      'כיסוי שמותאם ליעד, לגיל ולמצב רפואי קיים, צירוף דיגיטלי מאובטח באתר המבטח, עם סוכן שאפשר לדבר איתו.',
  },
};

const FAQS = [
  {
    q: 'איך עובד הכרטיס הנטען?',
    a: 'במקרה רפואי מכוסה בחו״ל הכרטיס נטען ומשמש לתשלום ישיר לספק הרפואי, ללא מקדמה מהכיס — בהתאם לתנאי הפוליסה ולגבולות האחריות.',
  },
  {
    q: 'האם יש אישור מיידי?',
    a: 'בחלק מהמקרים הצירוף הדיגיטלי מסתיים תוך דקות והפוליסה נשלחת לדוא״ל. מקרים הדורשים חיתום או הצהרת בריאות מורחבת עשויים להימשך זמן נוסף.',
  },
  {
    q: 'יש לי מצב רפואי קיים — אפשר לבטח?',
    a: 'לעיתים כן, באמצעות הרחבה מתאימה ובכפוף להצהרת בריאות ולחיתום המבטח. אין בכך התחייבות לקבלה לביטוח.',
  },
  {
    q: 'המחיר דרך סוכן גבוה יותר?',
    a: 'לא. הרכישה מתבצעת מול המבטח בתעריפיו, והעמלה משולמת לסוכן על ידי המבטח — אינה תוספת לפרמיה.',
  },
] as const;

const CHECKS = [
  {
    icon: '💳',
    title: 'תשלום ישיר במקום',
    body: 'במקרה רפואי מכוסה בחו״ל ההוצאה משולמת ישירות לספק — בלי מקדמות מהכיס ובלי מסלול החזרים ארוך.',
    note: 'בהתאם לגבולות האחריות שבפוליסה',
  },
  {
    icon: '⛷️',
    title: 'כיסויים וספורט אתגרי',
    body: 'כבודה, ביטול או קיצור נסיעה, ספורט אתגרי ומצב רפואי קיים — נבדוק אילו הרחבות נדרשות עבורכם.',
    note: 'בכפוף לחיתום ולתוספת פרמיה',
  },
  {
    icon: '📞',
    title: 'ליווי אישי 24/7',
    body: `${AGENT.name} זמין בווטסאפ לשאלות לפני הרכישה ולסיוע בהתנהלות מול חברת הביטוח בעת אירוע.`,
    note: 'ללא עלות נוספת מעבר לפרמיה',
  },
] as const;

const STEPS = [
  { n: '1', t: 'אומרים לאן טסים', d: 'יעד, תאריכים, גילאים ומצב רפואי — בהודעה קצרה, בלי טפסים.' },
  { n: '2', t: 'מקבלים התאמה', d: 'המסלול המתאים, ההחרגות המרכזיות והעלות — בשקיפות, לפני שמשלמים.' },
  { n: '3', t: 'רוכשים אונליין', d: 'השלמת הרכישה באתר המאובטח של המבטח וקבלת הפוליסה לדוא״ל.' },
] as const;

/* TODO(before launch): replace with real, consented customer reviews.
   Publishing fabricated testimonials breaches Israeli consumer-protection law. */
const REVIEWS = [
  {
    q: 'הנפקה קלה תוך 2 דקות. כשהזדקקתי לרופא בתאילנד, הכרטיס שילם הכל במקום ואמיר עזר לי בווטסאפ!',
    n: 'דניאל כ.',
  },
  {
    q: 'טסים רגועים רק עם פספורטכארד ועם הליווי של אמיר. שירות מקצועי, מהיר וללא פשרות.',
    n: 'משפחת לוי',
  },
  { q: 'הצירוף הכי מהיר שהיה לי בחיים. חסך לי המון זמן לפני הטיסה.', n: 'עומר ש.' },
] as const;

const LEGAL = [
  'האמור באתר זה הינו מידע שיווקי כללי בלבד, אינו מהווה ייעוץ ביטוחי, רפואי או משפטי ואינו תחליף לעיון בתנאי הפוליסה המלאים.',
  'לסוכן זיקה למבטח בשל קבלת עמלה ממנו בגין שיווק המוצר.',
  'הכיסוי, גבולות האחריות, ההחרגות וההשתתפות העצמית הם כמפורט בפוליסה ובדף פרטי הביטוח בלבד. בכל מקרה של סתירה — יגברו תנאי הפוליסה.',
  'הקבלה לביטוח, המחיר והתנאים כפופים לחיתום, להצהרת בריאות ולשיקול דעת המבטח. מצב רפואי קיים, ספורט אתגרי ומדינות מסוימות עשויים להיות מוחרגים או להצריך הרחבה בתוספת פרמיה.',
  'הקישורים לרכישה מפנים לאתר הרכישה של המבטח. השימוש באתר בהתאם לתנאי השימוש ולמדיניות הפרטיות. ט.ל.ח.',
] as const;

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'InsuranceAgency',
      '@id': `${FLY_URL}/#agent`,
      name: `${AGENT.name} - ${AGENT.title}`,
      description:
        'סוכן ביטוח מורשה המתמחה בביטוח נסיעות לחו״ל מותאם אישית וברכישה דיגיטלית.',
      url: `${FLY_URL}/`,
      telephone: '+972-52-842-2884',
      priceRange: '₪₪',
      areaServed: { '@type': 'Country', name: 'Israel' },
      address: { '@type': 'PostalAddress', addressCountry: 'IL' },
      inLanguage: 'he-IL',
      identifier: LICENSE,
      founder: {
        '@type': 'Person',
        name: AGENT.name,
        jobTitle: AGENT.title,
        identifier: LICENSE,
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${FLY_URL}/#faq`,
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

/* ------------------------------ sections ------------------------------ */

/** sticky (not fixed) so it reserves its own space — no body-padding hack. */
function TopBar() {
  return (
    <div className="sticky top-0 z-50 bg-pc shadow-[0_1px_6px_rgba(15,23,42,0.14)]">
      <div className="mx-auto flex max-w-container items-center gap-2.5 px-4 py-2 sm:px-6">
        <span className="min-w-0 flex-1 text-[12px] font-bold leading-tight text-white md:text-[14px]">
          ✈️ טסים לחו״ל? ביטוח אונליין תוך 2 דקות
        </span>
        <a
          href={BUY}
          target="_blank"
          rel="noopener nofollow sponsored"
          className="shrink-0 whitespace-nowrap rounded-full bg-white px-3 py-2 text-[12px] font-black leading-none text-[#C10510] shadow-sm transition-colors hover:bg-[#FFE9EB]"
        >
          ⚡ לרכישה מהירה
        </a>
      </div>
    </div>
  );
}

/** Agent identity + mandatory disclosure badge (compliance 5.2.1 / 5.2.3). */
function AgentIdentity() {
  return (
    <header className="border-b border-navy/10 bg-white">
      <div className="mx-auto max-w-container px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy-deep text-lg font-black text-white"
          >
            {AGENT.initials}
          </span>
          <div className="min-w-0">
            <p className={`${FS_AGENT} font-black leading-[1.08] tracking-tight text-ink`}>
              {AGENT.name}
            </p>
            <p className="text-[15px] font-bold leading-tight text-muted">{AGENT.title}</p>
          </div>
        </div>

        <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-navy/10 bg-base px-3.5 py-1.5 text-[11px] font-bold leading-tight text-muted">
          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-pc" />
          {DISCLOSURE}
        </p>
      </div>
    </header>
  );
}

/** Hero — the red charged card carries the primary action. */
function Hero() {
  return (
    <section className="mx-auto max-w-container px-4 pb-8 pt-6 sm:px-6 md:pb-12 md:pt-10">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className={`${FS_H1} font-extrabold leading-[1.28] tracking-tight text-ink`}>
          ביטוח נסיעות לחו״ל ברכישה דיגיטלית מהירה ובליווי אישי
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[17px] leading-relaxed text-muted">
          כיסוי שמותאם ליעד, לגיל ולמצב רפואי קיים — ואחריו צירוף דיגיטלי מאובטח באתר
          המבטח, עם סוכן שאפשר לדבר איתו.
        </p>

        <figure className="mt-6">
          <div className="relative mx-auto flex min-h-[206px] max-w-[380px] flex-col justify-between gap-3.5 overflow-hidden rounded-[18px] bg-gradient-to-br from-[#FF2A38] via-pc to-[#A5030D] p-[18px] text-start shadow-[0_14px_30px_rgba(227,6,19,0.30)]">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-[60px] -right-10 h-[190px] w-[190px] rounded-full bg-white/10"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-[90px] -right-[70px] h-[200px] w-[200px] rounded-full bg-white/[0.07]"
            />

            <div className="relative flex items-start justify-between gap-3">
              <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="text-[17px] font-black leading-tight tracking-tight text-white">
                  🔥 הכרטיס הנטען שלכם לחו״ל
                </span>
                <span className="text-[13px] font-bold text-white/90">תשלום ישיר בחו״ל</span>
              </span>
              <span
                aria-hidden
                className="grid h-8 w-[42px] shrink-0 grid-cols-2 gap-[3px] rounded-[7px] bg-gradient-to-br from-[#FFE9A8] to-[#E0B457] p-[5px]"
              >
                <i className="rounded-[2px] bg-[#A06E14]/45" />
                <i className="rounded-[2px] bg-[#A06E14]/45" />
                <i className="rounded-[2px] bg-[#A06E14]/45" />
                <i className="rounded-[2px] bg-[#A06E14]/45" />
              </span>
            </div>

            <div className="relative flex items-center justify-between gap-2.5">
              <span className="inline-flex items-center rounded-full border border-white/40 bg-white/[0.18] px-3 py-1.5 text-[12px] font-extrabold text-white">
                ללא מקדמות
              </span>
              <span aria-hidden className="text-[12px] font-bold tracking-[2px] text-white/70">
                •••• ••••
              </span>
            </div>

            <a
              href={BUY}
              target="_blank"
              rel="noopener nofollow sponsored"
              className="relative z-[1] flex animate-pill-pulse items-center justify-center rounded-xl bg-white px-3.5 py-3.5 text-[15px] font-black leading-tight text-[#C10510] motion-reduce:animate-none"
            >
              ⚡ לחצו לרכישה מהירה אונליין 👈
            </a>
          </div>
          <figcaption className="mt-2 text-center text-[11px] font-semibold text-faint">
            * הדמיה גרפית להמחשה בלבד
          </figcaption>
        </figure>

        <p className="mx-auto mt-4 max-w-lg text-[12px] leading-relaxed text-faint">
          הקישור מוביל לאתר הרכישה המאובטח של המבטח. הכיסוי, גבולות האחריות וההחרגות
          כפופים לתנאי הפוליסה, להצהרת בריאות ולחיתום.
        </p>
      </div>
    </section>
  );
}

function Metrics() {
  const items = [
    { k: '0 ₪', v: 'הוצאות מהכיס במקרה רפואי', ltr: true },
    { k: '2 דקות', v: 'זמן צירוף דיגיטלי', ltr: false },
    { k: '24/7', v: 'ליווי אישי של אמיר', ltr: true },
  ];
  return (
    <section className="mx-auto max-w-container px-4 pb-8 sm:px-6">
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {items.map((m) => (
          <div
            key={m.v}
            className="flex flex-col gap-1 rounded-2xl border border-navy/10 bg-white px-2.5 py-3.5 text-center md:px-4 md:py-5"
          >
            {/* dir=ltr keeps the shekel sign and the 24/7 slash on the correct
                side of the digits inside an RTL document. */}
            <span
              dir={m.ltr ? 'ltr' : undefined}
              className="whitespace-nowrap text-[clamp(1.1rem,4.4vw,1.6rem)] font-black leading-tight tracking-tight text-pc"
            >
              {m.k}
            </span>
            <span className="text-[clamp(0.68rem,2.1vw,0.82rem)] font-bold leading-snug text-ink">
              {m.v}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Horizontal scroll-snap rail on mobile, static 3-up grid from md up. */
function WhatToCheck() {
  return (
    <section
      aria-labelledby="checks-title"
      className="border-y border-navy/10 bg-base py-10 md:py-14"
    >
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 id="checks-title" className={H2}>
            מה בודקים לפני רכישה
          </h2>
          <span className="whitespace-nowrap text-[12px] font-bold text-faint md:hidden">
            החליקו ←
          </span>
        </div>

        <ul className={RAIL} style={{ overscrollBehaviorX: 'contain' }}>
          {CHECKS.map((c) => (
            <li
              key={c.title}
              className={`${RAIL_ITEM} flex flex-col gap-2.5 rounded-2xl border border-navy/10 bg-white p-5 shadow-sm`}
            >
              <span
                aria-hidden
                className="grid h-11 w-11 place-items-center rounded-xl border border-navy/10 bg-base text-xl"
              >
                {c.icon}
              </span>
              <h3 className="text-[17px] font-extrabold tracking-tight text-ink">{c.title}</h3>
              <p className="text-[14px] leading-relaxed text-muted">{c.body}</p>
              <span className="mt-auto pt-1 text-[12px] font-bold text-faint">{c.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section
      aria-labelledby="steps-title"
      className="mx-auto max-w-container px-4 py-10 sm:px-6 md:py-14"
    >
      <h2 id="steps-title" className={`mb-4 ${H2}`}>
        שלושה שלבים ואתם מכוסים
      </h2>
      <ol className="grid gap-3.5 md:grid-cols-3">
        {STEPS.map((s) => (
          <li
            key={s.n}
            className="flex items-start gap-3 rounded-2xl border border-navy/10 bg-white p-4"
          >
            <span
              aria-hidden
              className="grid h-7 w-7 shrink-0 place-items-center rounded-[9px] bg-pc text-[13px] font-black text-white"
            >
              {s.n}
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[15px] font-extrabold text-ink">{s.t}</span>
              <span className="text-[13.5px] leading-relaxed text-muted">{s.d}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Reviews() {
  return (
    <section
      aria-labelledby="reviews-title"
      className="border-y border-navy/10 bg-base py-10 md:py-14"
    >
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 id="reviews-title" className={H2}>
            לקוחות ממליצים
          </h2>
          <span className="whitespace-nowrap text-[12px] font-bold text-faint md:hidden">
            החליקו ←
          </span>
        </div>

        <ul className={RAIL} style={{ overscrollBehaviorX: 'contain' }}>
          {REVIEWS.map((r) => (
            <li key={r.n} className={RAIL_ITEM}>
              <figure className="flex h-full flex-col gap-2.5 rounded-2xl border border-navy/10 bg-white p-4 shadow-sm">
                <span
                  className="text-[13px] tracking-[2px] text-pc"
                  role="img"
                  aria-label="דירוג 5 מתוך 5"
                >
                  ★★★★★
                </span>
                <blockquote className="text-[14px] font-medium leading-relaxed text-ink">
                  ״{r.q}״
                </blockquote>
                <figcaption className="mt-auto text-[12.5px] font-extrabold text-muted">
                  {r.n}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-[11.5px] leading-relaxed text-faint">
          חוויות אישיות של לקוחות. אין באמור התחייבות לתוצאה, לכיסוי או לתשלום תגמולי ביטוח
          במקרה מסוים.
        </p>
      </div>
    </section>
  );
}

/** Native details/summary — the accordion still works with JavaScript off. */
function Faq() {
  return (
    <section
      aria-labelledby="faq-title"
      className="mx-auto max-w-container px-4 py-10 sm:px-6 md:py-14"
    >
      <h2 id="faq-title" className={`mb-4 ${H2}`}>
        שאלות ותשובות
      </h2>
      <div className="mx-auto max-w-3xl">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group mb-2.5 overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm"
          >
            <summary className="flex cursor-pointer list-none items-center gap-2.5 p-4 text-[15px] font-extrabold leading-snug text-ink [&::-webkit-details-marker]:hidden">
              <span className="flex-1">{f.q}</span>
              <span
                aria-hidden
                className="grid h-6 w-6 shrink-0 place-items-center rounded-lg border border-navy/10 bg-base text-[13px] font-black text-pc"
              >
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </summary>
            <p className="px-4 pb-4 text-[13.5px] leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/** Own footer — /fly is a bare canvas, so SiteFooter is not rendered here. */
function FlyFooter() {
  return (
    <footer className="border-t border-navy/10 bg-base">
      {/* pb clears the persistent purchase bar + the floating widgets above it */}
      <div className="mx-auto max-w-container px-4 pb-40 pt-8 sm:px-6">
        <p className="text-[1.1rem] font-black tracking-tight text-ink">
          {AGENT.name} · {AGENT.title}
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">
          מס׳ רישיון {LICENSE} ·{' '}
          <a dir="ltr" href="tel:+972528422884" className="font-bold text-pc hover:underline">
            052-842-2884
          </a>
        </p>

        <p className="mt-3 inline-flex rounded-full border border-pc/25 bg-pc/[0.06] px-3.5 py-1.5 text-[11.5px] font-bold text-[#C10510]">
          {DISCLOSURE}
        </p>

        <p className="mt-4 border-t border-navy/10 pt-3 text-[12px] font-bold leading-relaxed text-muted">
          השירות והתיווך מבוצעים על ידי {AGENT.name}, {AGENT.title} (מס׳ רישיון {LICENSE}).
          הפרסום הינו בכפוף לתנאי הפוליסה והחברה המבטחת פספורטכארד.
        </p>

        <div className="mt-3 grid gap-2 text-[11px] leading-relaxed text-faint">
          {LEGAL.map((l) => (
            <p key={l.slice(0, 24)}>{l}</p>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function FlyLandingPage() {
  return (
    <>
      {/* Google Ads conversion tag, scoped to this route so futureins.co.il is
          unaffected. GA4 is intentionally absent: it already loads through the
          GTM-MLJZ6T87 container in app/layout.tsx, and a second direct config
          would double-count. */}
      <Script
        id="gtag-ads-src"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-18295158593"
      />
      <Script id="gtag-ads-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','AW-18295158593');`}
      </Script>

      <script
        type="application/ld+json"
        // JSON-LD is trusted, server-generated content.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Opaque background so the layout's ambient gold/navy glows (fixed,
          -z-10) do not tint this standalone page. */}
      <div className="relative z-0 min-h-screen bg-white">
        <TopBar />
        <AgentIdentity />
        <main>
          <Hero />
          {/* sentinel: FlyWidgets reveals the WhatsApp button past this point */}
          <div id="fly-hero-end" aria-hidden className="h-px" />
          <Metrics />
          <WhatToCheck />
          <Steps />
          <Reviews />
          <Faq />
        </main>
        <FlyFooter />
      </div>

      <FlyWidgets buyHref={BUY} />
      <AccessibilityMenu />
    </>
  );
}
