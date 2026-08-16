import type { Metadata } from 'next';
import Script from 'next/script';
import { ShieldCheck } from 'lucide-react';
import { AGENT } from '@/lib/agency';
import {
  AGENCY_BRANCHES,
  AGENCY_LICENSE,
  AGENCY_NAME,
  AGENCY_TAX_ID,
  insuranceAgencySchema,
} from '@/lib/schema';
import AccessibilityMenu from '@/components/travel/AccessibilityMenu';
import CookieConsent from '@/components/fly/CookieConsent';
import FlyAffiliateTracker from '@/components/fly/FlyAffiliateTracker';
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
 * Regulatory identifiers now live in lib/schema.ts so the footer, the meta
 * description and the JSON-LD graph read the same values. They are TWO
 * DIFFERENT numbers and must never be conflated: 208678854 is the company
 * number, and an earlier revision published it under the label "מס׳ רישיון" in
 * four places — a wrong regulatory identifier on a licensed-agent page.
 *
 * lib/agency.ts still carries a placeholder in AGENT.license which is rendered
 * across the main site — deliberately left alone here so futureins.co.il is not
 * touched, but it should be corrected separately.
 */
const LICENSE = AGENCY_LICENSE;
const COMPANY_ID = AGENCY_TAX_ID;
const DISCLOSURE = `משווק מורשה של פספורטכארד | מס׳ רישיון: ${LICENSE}`;

/**
 * Issuance-speed claim, stated ONCE and reused everywhere it appears.
 *
 * Three different figures used to run on this page at the same time — "2 דקות"
 * in the top bar, "3 דקות" in the sub-headline and "2 דקות" in the metrics tile
 * — for a process the FAQ itself says underwriting can extend. A single hedged
 * phrase plus a footnote replaces all three.
 */
const ISSUANCE_CLAIM = 'הנפקה דיגיטלית תוך דקות ספורות';
const ISSUANCE_FOOTNOTE = '*בכפוף לתהליך החיתום הרפואי';

/** Qualifier for the "0 ₪" figure, rendered adjacent to it rather than elsewhere. */
const ZERO_COST_FOOTNOTE = '*בטיפול רפואי בחו״ל בכפוף לתנאי הפוליסה';

/**
 * Mandatory independent-agent notice. Rendered TWICE — once directly under the
 * top bar (above the fold on mobile) and once in the footer — because the
 * PassportCard partner policy requires the "not the official site" statement to
 * be visible without scrolling as well as on the page's legal block.
 *
 * Carries AGENCY_NAME rather than a second hard-coded name: the notice and the
 * footer identity block previously named two different entities, which defeats
 * the point of a disclosure meant to prevent confusion about who runs the site.
 */
const COMPLIANCE_NOTICE =
  `${AGENCY_NAME} (בהנהלת ${AGENT.name} — סוכן ביטוח מורשה). אתר זה מופעל ע״י סוכן עצמאי ואינו האתר הרשמי של חברת PassportCard.`;

/**
 * Formal footer identity line and agency statement.
 *
 * Competitor insurers (כלל, הראל, הפניקס, מגדל) were REMOVED: this is a
 * PassportCard affiliate landing page whose every CTA sells one product, so
 * naming rival carriers here both risks the partner agreement and misdescribes
 * what the page actually markets.
 */
const FOOTER_IDENTITY =
  `${AGENCY_NAME} (בהנהלת ${AGENT.name} — ${AGENT.title}, מס׳ רישיון ${AGENCY_LICENSE}, ח.פ ${AGENCY_TAX_ID}, ענפים: ${AGENCY_BRANCHES}).`;

const AGENCY_STATEMENT =
  'הסוכנות הינה סוכנות ביטוח מורשת המשווקת את ביטוח הנסיעות לחו״ל של פספורטכארד. הרכישה והנפקת הפוליסה מבוצעות ישירות בשרתי חברת הביטוח ובכפוף לתנאי החיתום והפוליסה.';

/**
 * Statutory footer links.
 *
 * ABSOLUTE on purpose. middleware.ts redirects every non-root path on
 * fly.amirs.co.il back to "/", so a relative "/terms" would bounce the visitor
 * to this landing page instead of the document.
 *
 * /privacy has no page of its own — next.config.mjs redirects it to /terms,
 * whose title is "תקנון ותנאי שימוש ומדיניות פרטיות" and whose section 5 is the
 * privacy policy. Without that redirect this link would 404.
 */
const SITE_URL = 'https://futureins.co.il';
const LEGAL_LINKS = [
  { label: 'תקנון ותנאי שימוש', href: `${SITE_URL}/terms` },
  { label: 'מדיניות פרטיות', href: `${SITE_URL}/privacy` },
  { label: 'הצהרת נגישות', href: `${SITE_URL}/accessibility` },
] as const;

/**
 * Regulatory identity block for the footer.
 *
 * Every value here must be a real, verified detail — a fabricated licence or
 * company number is a regulatory offence, so nothing in this list is guessed.
 */
const AGENCY_DETAILS = [
  { k: 'שם הסוכנות', v: AGENCY_NAME, ltr: false },
  { k: 'סוכן ביטוח מורשה', v: AGENT.name, ltr: false },
  { k: 'מס׳ רישיון סוכן', v: LICENSE, ltr: true },
  { k: 'ח.פ', v: COMPANY_ID, ltr: true },
  { k: 'ענפי רישיון', v: AGENCY_BRANCHES, ltr: false },
  { k: 'גורם מפקח', v: 'רשות שוק ההון, ביטוח וחיסכון', ltr: false },
  { k: 'המוצר המשווק', v: 'ביטוח נסיעות לחו״ל של PassportCard', ltr: false },
  { k: 'זיקה למבטח', v: 'הסוכן מקבל עמלה מהמבטח בגין שיווק המוצר', ltr: false },
  { k: 'טלפון', v: '052-842-2884', ltr: true },
] as const;

/* Compliance 5.2.1 — the agent name must render at a font size greater than or
   equal to the H1. Both are clamps whose min, slope AND max satisfy that, so the
   relationship holds at every viewport width, not only at tested breakpoints.
   Both were stepped down from their previous values so that the notice, the H1,
   the sub-headline and the primary CTA all clear a 375x560 mobile fold. */
const FS_AGENT = 'text-[clamp(1.3rem,4.2vw,2.2rem)]';
const FS_H1 = 'text-[clamp(1.25rem,4vw,2.1rem)]';

const H2 = 'text-[clamp(1.2rem,3.6vw,1.75rem)] font-extrabold tracking-tight text-ink';
const RAIL =
  '-mx-4 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pb-0';
const RAIL_ITEM = 'min-w-[260px] shrink-0 snap-center md:min-w-0 md:shrink';

/* Compliance 5.2.3 — the brand keyword ("פספורטכארד" / "PassportCard") must not
   appear in the <title>, the meta description, or the <h1>.
   NOTE: the <h1> now carries "PassportCard" by explicit instruction of the
   agency owner, so this route currently satisfies 5.2.3 for the title and the
   description ONLY. The independent-agent notice rendered above the fold
   (COMPLIANCE_NOTICE) is the stated mitigation. Revisit if the partner
   confirms the H1 restriction still binds. */
export const metadata: Metadata = {
  // `absolute` bypasses the root layout's "%s | Future Insurance" template —
  // this host is the agent's landing page, not an Future Insurance sub-page, and
  // the suffix also pushed the title past the SERP truncation length.
  title: {
    absolute:
      'ביטוח נסיעות לחו״ל ברכישה דיגיטלית מהירה | אמיר שושני, סוכן ביטוח מורשה',
  },
  description:
    `ביטוח נסיעות לחו״ל מותאם ליעד, לגיל ולמצב רפואי קיים: צירוף דיגיטלי מאובטח, תשלום ישיר על הוצאות רפואיות בחו״ל וליווי אישי 24/7 של ${AGENT.name}, סוכן ביטוח מורשה. מס׳ רישיון ${LICENSE}.`,
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

/* The "לקוחות ממליצים" section was REMOVED, not commented out: its three quotes
   were illustrative placeholders, and publishing invented testimonials breaches
   Israeli consumer-protection law. To bring it back, add real reviews that the
   named customers have consented to publish — and keep the "אין באמור התחייבות
   לתוצאה" qualifier that sat under the rail, since a testimonial must not read
   as a promise of cover or of payout. */

const LEGAL = [
  `${ISSUANCE_FOOTNOTE}. ${ZERO_COST_FOOTNOTE.replace('*', '')}.`,
  'האמור באתר זה הינו מידע שיווקי כללי בלבד, אינו מהווה ייעוץ ביטוחי, רפואי או משפטי ואינו תחליף לעיון בתנאי הפוליסה המלאים.',
  'לסוכן זיקה למבטח בשל קבלת עמלה ממנו בגין שיווק המוצר.',
  'הכיסוי, גבולות האחריות, ההחרגות וההשתתפות העצמית הם כמפורט בפוליסה ובדף פרטי הביטוח בלבד. בכל מקרה של סתירה — יגברו תנאי הפוליסה.',
  'הקבלה לביטוח, המחיר והתנאים כפופים לחיתום, להצהרת בריאות ולשיקול דעת המבטח. מצב רפואי קיים, ספורט אתגרי ומדינות מסוימות עשויים להיות מוחרגים או להצריך הרחבה בתוספת פרמיה.',
  'הקישורים לרכישה מפנים לאתר הרכישה של המבטח. השימוש באתר בהתאם לתנאי השימוש ולמדיניות הפרטיות. ט.ל.ח.',
] as const;

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    insuranceAgencySchema(FLY_URL),
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
          ✈️ טסים לחו״ל? {ISSUANCE_CLAIM}*
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

/**
 * Mandated independent-agent notice.
 *
 * `variant="top"` is the above-the-fold band; `variant="footer"` repeats it in
 * the legal block. Amber rather than the page's red/navy so it reads as a legal
 * notice and not as another marketing strip, and role="note" keeps that
 * distinction for screen readers too.
 */
function ComplianceNotice({ variant }: { variant: 'top' | 'footer' }) {
  const top = variant === 'top';
  return (
    <div
      role="note"
      className={
        top
          ? 'border-b border-amber-300/70 bg-amber-50'
          : 'rounded-2xl border border-amber-300/70 bg-amber-50 px-3.5 py-2.5'
      }
    >
      <p
        className={`${
          top ? 'mx-auto max-w-container px-4 py-2 sm:px-6' : ''
        } flex items-start gap-2 text-[11.5px] font-semibold leading-snug text-[#78350F]`}
      >
        <span aria-hidden className="shrink-0 leading-none">
          ⚠️
        </span>
        <span>{COMPLIANCE_NOTICE}</span>
      </p>
    </div>
  );
}

/** Agent identity + mandatory disclosure badge (compliance 5.2.1 / 5.2.3). */
function AgentIdentity() {
  return (
    <header className="border-b border-navy/10 bg-white">
      {/* One compact row: the identity block has to leave the fold's remaining
          height to the H1, the sub-headline and the primary CTA. */}
      <div className="mx-auto flex max-w-container items-center gap-2.5 px-4 py-2.5 sm:px-6">
        <span
          aria-hidden
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-deep text-[15px] font-black text-white"
        >
          {AGENT.initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className={`${FS_AGENT} font-black leading-[1.1] tracking-tight text-ink`}>
            {AGENT.name}
          </p>
          <p className="text-[12.5px] font-bold leading-tight text-muted">
            {AGENT.title} · מס׳ רישיון <span dir="ltr">{LICENSE}</span>
          </p>
        </div>
      </div>
    </header>
  );
}

/**
 * Hero — ordered for the mobile fold.
 *
 * The primary CTA sits directly under the sub-headline, ABOVE the charged-card
 * graphic, so that the headline, the legal notice and the purchase button are
 * all reachable without scrolling; the 206px card would otherwise push the
 * button off a 375x560 screen. The card keeps its own pill CTA for visitors who
 * scroll back to it.
 */
function Hero() {
  return (
    <section className="mx-auto max-w-container px-4 pb-8 pt-4 sm:px-6 md:pb-12 md:pt-10">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className={`${FS_H1} font-extrabold leading-[1.25] tracking-tight text-ink`}>
          ביטוח נסיעות לחו״ל ברכישה דיגיטלית מהירה
        </h1>
        <p className="mx-auto mt-2.5 max-w-xl text-[14.5px] leading-relaxed text-muted md:text-[17px]">
          תשלום ישיר לספק הרפואי בחו״ל, מענה 24/7 ב-WhatsApp ו{ISSUANCE_CLAIM}.*
        </p>
        <p className="mx-auto mt-1.5 text-[11px] leading-relaxed text-faint">
          {ISSUANCE_FOOTNOTE}
        </p>

        {/* Primary purchase CTA — glowing red, above the fold. */}
        <a
          href={BUY}
          target="_blank"
          rel="noopener nofollow sponsored"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-pc px-5 py-4 text-[clamp(0.95rem,3.9vw,1.15rem)] font-black leading-tight text-white shadow-lg shadow-red-500/50 transition-all duration-200 hover:bg-[#C10510] hover:shadow-red-500/80 md:mx-auto md:max-w-md"
        >
          ⚡ לרכישת הפוליסה אונליין 👈
        </a>

        {/* Marketing disclosure, kept adjacent to the purchase action. */}
        <p className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-navy/10 bg-base px-3 py-1.5 text-[11px] font-bold leading-tight text-muted">
          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-pc" />
          {DISCLOSURE}
        </p>

        {/* Benefit panel — deliberately NOT a look-alike payment card.
            The previous version rendered PassportCard's brand red (#E11933) as a
            gradient, a gold EMV chip and masked "•••• ••••" digits: the three
            signatures that made an agent page read as the insurer's own asset.
            All three are gone. What remains is the agency's navy/gold palette, a
            shield mark instead of a chip, and the agency's own name on the panel
            so the graphic identifies its actual publisher. */}
        <figure className="mt-6">
          <div className="relative mx-auto flex min-h-[206px] max-w-[380px] flex-col justify-between gap-3.5 overflow-hidden rounded-[18px] bg-gradient-to-br from-navy-light via-navy to-navy-deep p-[18px] text-start shadow-[0_14px_30px_rgba(20,43,85,0.32)]">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-[60px] -right-10 h-[190px] w-[190px] rounded-full bg-gold/10"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-[90px] -right-[70px] h-[200px] w-[200px] rounded-full bg-gold/[0.07]"
            />

            <div className="relative flex items-start justify-between gap-3">
              <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                {/* Deliberately NOT the sub-headline's wording — that line now
                    opens with "תשלום ישיר לספק הרפואי בחו״ל" a few rows above. */}
                <span className="text-[17px] font-black leading-tight tracking-tight text-white">
                  ההוצאה הרפואית משולמת במקום
                </span>
                <span className="text-[13px] font-bold text-white/85">
                  בלי מקדמה מהכיס, בלי מסלול החזרים
                </span>
              </span>
              <span
                aria-hidden
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gold/40 bg-gold/15 text-gold-bright"
              >
                <ShieldCheck className="h-5 w-5" />
              </span>
            </div>

            <div className="relative flex flex-wrap items-center justify-between gap-2.5">
              <span className="inline-flex items-center rounded-full border border-gold/45 bg-gold/15 px-3 py-1.5 text-[12px] font-extrabold text-gold-bright">
                ללא מקדמות
              </span>
              {/* Replaces the masked card digits: the panel now names the agency
                  that publishes it rather than mimicking a card face. */}
              <span className="text-[11px] font-bold tracking-tight text-white/60">
                {AGENCY_NAME}
              </span>
            </div>

            <a
              href={BUY}
              target="_blank"
              rel="noopener nofollow sponsored"
              className="relative z-[1] flex animate-pulse-glow items-center justify-center rounded-xl bg-cta-fill px-3.5 py-3.5 text-[15px] font-black leading-tight text-navy-deep motion-reduce:animate-none"
            >
              ⚡ לחצו לרכישה מהירה אונליין 👈
            </a>
          </div>
          <figcaption className="mt-2 text-center text-[12px] font-semibold text-muted">
            * הדמיה גרפית להמחשה בלבד. אינה כרטיס תשלום ואינה מונפקת על ידי הסוכנות.
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
  /* Each headline figure carries its own qualifier IN THE TILE. The "0 ₪" and
     the issuance time are absolute claims, and a caveat parked elsewhere on the
     page does not travel with the number a visitor actually reads. */
  const items = [
    { k: '0 ₪', v: 'הוצאות מהכיס במקרה רפואי*', note: ZERO_COST_FOOTNOTE, ltr: true },
    { k: 'דקות ספורות', v: 'הנפקה דיגיטלית*', note: ISSUANCE_FOOTNOTE, ltr: false },
    { k: '24/7', v: 'ליווי אישי של אמיר', note: null, ltr: true },
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
              className="text-[clamp(0.95rem,4vw,1.6rem)] font-black leading-tight tracking-tight text-pc"
            >
              {m.k}
            </span>
            <span className="text-[clamp(0.68rem,2.1vw,0.82rem)] font-bold leading-snug text-ink">
              {m.v}
            </span>
            {m.note && (
              <span className="mt-auto pt-1 text-[9.5px] leading-snug text-faint">
                {m.note}
              </span>
            )}
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

/**
 * Native details/summary — the accordion still works with JavaScript off.
 *
 * Carries the tinted full-bleed band that the removed testimonials section used
 * to provide, so the page keeps alternating base/white and Steps does not run
 * straight into the FAQ on one flat surface.
 */
function Faq() {
  return (
    <section
      aria-labelledby="faq-title"
      className="border-y border-navy/10 bg-base py-10 md:py-14"
    >
      <div className="mx-auto max-w-container px-4 sm:px-6">
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
        <p className="text-[1.1rem] font-black tracking-tight text-ink">{AGENCY_NAME}</p>
        <p className="mt-1.5 text-[13px] font-bold leading-relaxed text-muted">
          {FOOTER_IDENTITY}
        </p>
        <p className="mt-1 text-[14px] leading-relaxed text-muted">
          <a dir="ltr" href="tel:+972528422884" className="font-bold text-pc hover:underline">
            052-842-2884
          </a>
        </p>

        <p className="mt-3 text-[12.5px] leading-relaxed text-muted">{AGENCY_STATEMENT}</p>

        <p className="mt-3 inline-flex rounded-full border border-pc/25 bg-pc/[0.06] px-3.5 py-1.5 text-[11.5px] font-bold text-[#C10510]">
          {DISCLOSURE}
        </p>

        {/* Second, mandated placement of the independent-agent notice. */}
        <div className="mt-3">
          <ComplianceNotice variant="footer" />
        </div>

        {/* Regulatory identity block. <dl> so each label stays associated with
            its value for assistive technology. */}
        <dl className="mt-4 grid gap-x-4 gap-y-1.5 border-t border-navy/10 pt-3 text-[12px] leading-relaxed sm:grid-cols-2">
          {AGENCY_DETAILS.map((d) => (
            <div key={d.k} className="flex flex-wrap gap-x-1.5">
              <dt className="font-bold text-ink">{d.k}:</dt>
              <dd dir={d.ltr ? 'ltr' : undefined} className="text-muted">
                {d.v}
              </dd>
            </div>
          ))}
        </dl>

        {/* Statutory documents. Absolute URLs — see LEGAL_LINKS. */}
        <nav
          aria-label="מסמכים משפטיים"
          className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5 border-t border-navy/10 pt-3 text-[12.5px]"
        >
          {LEGAL_LINKS.map((l, i) => (
            <span key={l.label} className="flex items-center gap-x-2">
              {i > 0 && (
                <span aria-hidden className="text-navy/25">
                  |
                </span>
              )}
              <a
                href={l.href}
                target="_blank"
                rel="noopener"
                className="font-bold text-pc underline underline-offset-2 hover:text-[#C10510]"
              >
                {l.label}
              </a>
            </span>
          ))}
        </nav>

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

      {/* id="a11y-content" is the element the shared AccessibilityMenu applies
          its contrast/grayscale/invert filters and link-emphasis classes to.
          SiteChrome normally provides it, but /fly sits outside the (site) route
          group, so without this the toolbar would silently do nothing here.
          The widgets below are deliberately OUTSIDE it, so the toolbar never
          inverts or greys out its own controls. */}
      <div id="a11y-content" className="relative z-0 min-h-screen bg-white">
        <TopBar />
        <ComplianceNotice variant="top" />
        <AgentIdentity />
        <main>
          <Hero />
          <Metrics />
          <WhatToCheck />
          <Steps />
          <Faq />
        </main>
        <FlyFooter />
      </div>

      <FlyWidgets buyHref={BUY} />
      {/* Delegated dataLayer tracking for every /api/go/passportcard CTA. */}
      <FlyAffiliateTracker />
      <CookieConsent />
      <AccessibilityMenu />
    </>
  );
}
