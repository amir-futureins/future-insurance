import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { SITE, AGENT_INFO, HOURS, TRAVEL_URL, whatsappHref } from '@/lib/content';
import MegaMenu from '@/components/MegaMenu';
import MobileNav from '@/components/MobileNav';
import SocialLinks from '@/components/SocialLinks';
import ContactButton from '@/components/ContactButton';

// Footer product links (fuller labels).
const FOOTER_LINKS = [
  { href: TRAVEL_URL, label: 'ביטוח נסיעות לחו״ל' },
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
      <div className="mx-auto flex w-full max-w-[1680px] items-center justify-between gap-4 px-3 py-2 md:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
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
            <span className="block whitespace-nowrap text-[18px] font-extrabold tracking-tight text-white">
              Future <span className="text-gold">Insurance</span>
            </span>
            <span className="block whitespace-nowrap text-[10px] font-medium text-white/60">
              סוכנות הביטוח החכמה
            </span>
          </span>
        </Link>

        <MegaMenu />

        <div className="flex items-center gap-2.5">
          {/* desktop action cluster — xl only (below xl the hamburger takes over) */}
          <div className="hidden items-center gap-2.5 xl:flex">
            {/* glowing gold CTA cluster */}
            <a
              href={SITE.phoneHref}
              aria-label={SITE.phoneCta}
              className="hidden h-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 px-3.5 py-2 text-[14px] font-bold text-navy-deep shadow-[0_0_15px_rgba(251,191,36,0.6)] ring-1 ring-amber-300/50 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_22px_rgba(251,191,36,0.85)] 2xl:inline-flex"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {SITE.phoneCta}
            </a>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block h-fit shrink-0 whitespace-nowrap rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 px-4 py-2 text-[14px] font-extrabold text-navy-deep shadow-[0_0_15px_rgba(251,191,36,0.6)] ring-1 ring-amber-300/50 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_22px_rgba(251,191,36,0.85)]"
            >
              ייעוץ חינם
            </a>
            <ContactButton />
          </div>

          {/* mobile/tablet hamburger — full nav (incl. sub-categories) + actions */}
          <MobileNav />
        </div>
      </div>
    </header>
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
              זמינים {HOURS.short}.
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
            {AGENT_INFO.name}, {AGENT_INFO.title} · רישיון{' '}
            <span dir="ltr">{AGENT_INFO.license}</span>. אין באמור ייעוץ או המלצה אישית.
          </p>
        </div>
        <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2 border-t border-navy/10 pt-6 text-[13px] text-muted sm:grid-cols-2 lg:grid-cols-4">
          <li className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
            <a href={SITE.phoneHref} dir="ltr" className="font-semibold hover:text-gold-deep">
              {SITE.phoneDisplay}
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
            <a href={`mailto:${SITE.email}`} dir="ltr" className="font-semibold hover:text-gold-deep">
              {SITE.email}
            </a>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
            {SITE.address}
          </li>
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
            {HOURS.full}
          </li>
        </ul>
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
        <div className="mt-6 flex flex-col gap-4 border-t border-navy/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-faint">© {SITE.name} · futureins.co.il · כל הזכויות שמורות</p>
          <SocialLinks variant="footer" />
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
            <button
              type="button"
              data-cookie-settings
              className="text-[12px] font-semibold text-muted transition-colors hover:text-gold-deep"
            >
              הגדרות עוגיות
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
