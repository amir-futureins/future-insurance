import Image from 'next/image';
import Link from 'next/link';
import { Phone, Scale, Zap, Headset, ChevronDown, Sparkles } from 'lucide-react';
import { FAQ_ITEMS, SITE, whatsappHref } from '@/lib/content';
import { Reveal } from './ui';
import MegaMenu from '@/components/MegaMenu';
import ClientPortalButton from '@/components/ClientPortalButton';
import ContactButton from '@/components/ContactButton';

// Agency-wide navigation across all verticals (mobile strip).
const NAV_LINKS = [
  { href: '/', label: 'בית' },
  { href: '/travel-insurance', label: 'חו״ל' },
  { href: '/har-habituach', label: 'הר הביטוח' },
  { href: '/finance', label: 'פנסיה וגמל' },
  { href: '/health', label: 'בריאות' },
  { href: '/life', label: 'חיים' },
  { href: '/mortgage', label: 'משכנתא' },
  { href: '/business-insurance', label: 'עסק' },
];

// Footer product links (fuller labels).
const FOOTER_LINKS = [
  { href: '/travel-insurance', label: 'ביטוח חו״ל' },
  { href: '/har-habituach', label: 'הר הביטוח / עבר ביטוחי' },
  { href: '/finance', label: 'פנסיה, גמל והשתלמות' },
  { href: '/health', label: 'ביטוח בריאות' },
  { href: '/life', label: 'ביטוח חיים' },
  { href: '/mortgage', label: 'ביטוח משכנתא' },
  { href: '/business-insurance', label: 'ביטוח לעסק' },
];

/* ---- Sticky glass navbar with the brand logo -------------------- */

export function TrustBar() {
  return (
    <header className="no-print sticky top-0 z-40 border-b-2 border-gold bg-gradient-to-b from-navy to-navy-deep shadow-lg shadow-navy/30">
      <div className="mx-auto flex max-w-container items-center justify-between px-5 py-2.5 md:px-10">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="Future Insurance — סוכנות הביטוח החכמה"
        >
          <span className="grid place-items-center rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-gold/30">
            <Image
              src="/new-logo.png"
              alt=""
              width={40}
              height={40}
              priority
              className="h-8 w-8 md:h-9 md:w-9"
            />
          </span>
          <span className="leading-tight">
            <span className="block text-[18px] font-extrabold tracking-tight text-white">
              Future <span className="text-gold">Insurance</span>
            </span>
            <span className="block text-[10px] font-medium text-white/60">
              סוכנות הביטוח החכמה
            </span>
          </span>
        </Link>

        <MegaMenu />

        <div className="flex items-center gap-2.5">
          {/* glowing gold CTA cluster */}
          <a
            href={SITE.phoneHref}
            aria-label={SITE.phoneCta}
            className="hidden h-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-cta-fill px-3.5 py-2 text-[14px] font-bold text-navy-deep shadow-md shadow-black/25 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(212,162,74,0.65)] sm:inline-flex"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {SITE.phoneCta}
          </a>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-fit shrink-0 animate-pulse-glow whitespace-nowrap rounded-xl bg-cta-fill px-4 py-2 text-[14px] font-extrabold text-navy-deep shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(212,162,74,0.8)] md:inline-block"
          >
            ייעוץ חינם
          </a>
          <ContactButton />
          {/* divider then "אזור אישי" pinned to the far-left of the action bar */}
          <span className="mx-0.5 hidden h-6 w-px bg-white/15 sm:block" aria-hidden />
          <ClientPortalButton />
        </div>
      </div>

      {/* mobile/tablet nav — the desktop nav is xl-only, so surface the
          vertical links here as a horizontal scroll strip below xl */}
      <nav
        className="hide-scroll flex gap-2 overflow-x-auto border-t border-white/10 px-4 pb-2.5 pt-1 xl:hidden"
        aria-label="ניווט מהיר"
      >
        {NAV_LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="shrink-0 rounded-lg bg-white/5 px-3 py-1.5 text-[13px] font-bold text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright"
          >
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

/* ---- Why us ------------------------------------------------------ */

const WHY = [
  {
    icon: Scale,
    title: 'השוואה שקופה',
    text: 'השוואה אובייקטיבית בין החברות המובילות — בלי אותיות קטנות ובלי אינטרסים נסתרים.',
  },
  {
    icon: Zap,
    title: 'הפקה מיידית',
    text: 'פוליסה דיגיטלית תוך דקות, ישירות לנייד שלכם, עוד לפני שהגעתם לשדה התעופה.',
  },
  {
    icon: Headset,
    title: 'ליווי אישי',
    text: 'אמיר וצוות המומחים זמינים לכל שאלה לפני, במהלך ואחרי הנסיעה — בכל שעה.',
  },
];

export function WhyUs() {
  return (
    <section className="mx-auto w-full max-w-container px-6 py-14 md:px-10 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow inline-flex items-center gap-1.5 text-[13px]">
          <Sparkles className="h-4 w-4" aria-hidden />
          למה Future
        </span>
        <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
          חנות ביטוח אחת, שקט נפשי מלא
        </h2>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {WHY.map((item, i) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.title} className="glass p-6" delay={i * 80}>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-tint text-gold-deep ring-1 ring-gold/30">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-4 text-[18px] font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.text}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ---- FAQ (native details, CSS-only, crawlable) ------------------- */

export function Faq() {
  return (
    <section className="mx-auto w-full max-w-container px-6 py-14 md:px-10 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow text-[13px]">שאלות נפוצות</span>
        <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
          כל מה שרציתם לדעת
        </h2>
      </div>
      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {FAQ_ITEMS.map((item) => (
          <details key={item.q} className="glass px-1">
            <summary className="flex items-center justify-between gap-4 p-5 text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
              <span className="text-[16px] font-bold text-ink">{item.q}</span>
              <ChevronDown
                className="faq-chevron h-5 w-5 shrink-0 text-gold transition-transform"
                aria-hidden
              />
            </summary>
            <div className="faq-body">
              <div>
                <p className="px-5 pb-5 text-[15px] leading-relaxed text-muted">
                  {item.a}
                </p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ---- Footer ------------------------------------------------------ */

export function SiteFooter() {
  return (
    <footer className="border-t border-navy/10 bg-navy/[0.02]">
      <div className="mx-auto max-w-container px-6 pb-28 pt-10 md:px-10 lg:pb-10">
        {/* contact CTA banner — click-to-call dialer, no raw number on screen */}
        <div className="mb-8 flex flex-col items-center gap-4 rounded-2xl border border-gold/30 bg-gold-tint p-5 text-center sm:flex-row sm:justify-between sm:text-start">
          <div>
            <div className="text-[16px] font-extrabold text-ink">מעדיפים לדבר עם מומחה?</div>
            <div className="mt-0.5 text-[13px] text-muted">
              צוות Future Insurance זמין לכל שאלה — בלי טפסים, בלי המתנה.
            </div>
          </div>
          <a
            href={SITE.phoneHref}
            aria-label={SITE.phoneCta}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-cta-fill px-5 py-3 text-[15px] font-extrabold text-navy-deep shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_22px_rgba(212,162,74,0.6)]"
          >
            <Phone className="h-5 w-5" aria-hidden />
            {SITE.phoneCta}
          </a>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <Image src="/new-logo.png" alt="" width={36} height={36} className="h-9 w-9" />
            <span className="leading-tight">
              <span className="block text-[15px] font-extrabold text-ink">
                Future <span className="text-gold-deep">Insurance</span>
              </span>
              <span className="block text-[11px] font-medium text-muted">
                סוכנות הביטוח החכמה · futureins.co.il
              </span>
            </span>
          </div>
          <p className="max-w-md text-[13px] leading-relaxed text-muted">
            סוכנות הביטוח פועלת ברישיון רשות שוק ההון, ביטוח וחיסכון. אין באמור ייעוץ או
            המלצה אישית.
          </p>
        </div>
        <nav
          className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-navy/10 pt-6 sm:justify-start"
          aria-label="ניווט תחתון — תחומי ביטוח"
        >
          {FOOTER_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-muted transition-colors hover:text-gold-deep"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="mt-6 flex flex-col gap-3 border-t border-navy/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-faint">© {SITE.name} · futureins.co.il · כל הזכויות שמורות</p>
          <nav className="flex flex-wrap gap-x-4 gap-y-1.5" aria-label="קישורים משפטיים">
            <a href="/terms" className="text-[12px] font-semibold text-muted transition-colors hover:text-gold-deep">
              תקנון ותנאי שימוש
            </a>
            <a href="/terms" className="text-[12px] font-semibold text-muted transition-colors hover:text-gold-deep">
              מדיניות פרטיות
            </a>
            <a href="/accessibility" className="text-[12px] font-semibold text-muted transition-colors hover:text-gold-deep">
              הצהרת נגישות
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
