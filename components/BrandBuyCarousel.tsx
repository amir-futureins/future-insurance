import { ExternalLink, ChevronsLeft } from 'lucide-react';
import BrandEmblem from '@/components/travel/BrandEmblem';

/**
 * BrandBuyCarousel — mobile-only (md:hidden) swipeable rail of carrier cards,
 * each a DIRECT deep-link into that company's own online buy flow via
 * /api/go/[slug]. Shared by the home page and the travel hero so the two never
 * drift apart.
 *
 * No hooks and no interactivity: the swipe is native overflow scrolling with CSS
 * scroll-snap, which is smoother on touch than any JS carousel and costs zero
 * client JS. That also lets it render inside a server component (home) and a
 * client component (TravelInsuranceHub) alike.
 *
 * Cards are sized at 72% so the next one is always cut off at the container
 * edge — the peek IS the affordance that tells users the rail scrolls.
 *
 * Clicks need no handler: AffiliateClickTracker (mounted in SiteChrome) pushes a
 * `purchase_click` GTM event for every `a[href^="/api/go/"]` on the site.
 *
 * `from`/`to` build each carrier's gradient and `strip` is the hairline on top,
 * carrying the second brand colour (PassportCard gold, Harel gold, Clal cyan,
 * Migdal emerald). The CTA is a white pill with brand-coloured text — every
 * combination clears AA on white (#E11933 4.79:1, #0057B8 6.8:1, #002D62 15:1,
 * #0F766E 5.55:1). Accent colours only: the mark stays BrandEmblem's nominative
 * wordmark, never a reproduction of a carrier's trademarked logo.
 */
const BRANDS = [
  {
    slug: 'passportcard',
    name: 'PassportCard',
    tagline: 'ללא השתתפות עצמית · תשלום ישיר',
    from: '#E11933',
    to: '#A5101F',
    strip: '#D4A24A',
  },
  {
    slug: 'harel',
    name: 'הראל',
    tagline: 'רופא אונליין · פופולרי למשפחות',
    from: '#0057B8',
    to: '#003B7E',
    strip: '#D4A24A',
  },
  {
    slug: 'clal',
    name: 'כלל',
    tagline: 'מחיר משתלם · כיסוי ביטול נסיעה',
    from: '#002D62',
    to: '#0086BC',
    strip: '#00A0DF',
  },
  {
    slug: 'migdal',
    name: 'מגדל',
    tagline: 'כיסוי מקיף · תקרות גבוהות',
    from: '#0F766E',
    to: '#047857',
    strip: '#10B981',
  },
];

export default function BrandBuyCarousel({ className = '' }: { className?: string }) {
  return (
    <div className={`md:hidden ${className}`}>
      <h2 className="text-[17px] font-extrabold leading-tight text-ink">
        רכישה מהירה אונליין — בחרו חברה לרכישה מיידית:
      </h2>
      <p className="mt-1 flex items-center gap-1 text-[12px] font-semibold text-faint">
        <ChevronsLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
        החליקו הצידה לכל החברות
      </p>

      {/* hide-scroll is this codebase's scrollbar-hiding utility (globals.css) —
          the same one the destinations carousel uses. */}
      <ul className="hide-scroll mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-4">
        {BRANDS.map((b) => (
          <li key={b.slug} className="flex w-[72%] shrink-0 snap-start">
            <a
              href={`/api/go/${b.slug}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              aria-label={`לרכישת ביטוח נסיעות אונליין ב${b.name} — נפתח באתר החברה`}
              className="flex w-full flex-col overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/10 transition-transform active:scale-[0.98]"
              style={{ backgroundImage: `linear-gradient(150deg, ${b.from} 0%, ${b.to} 100%)` }}
            >
              <span
                aria-hidden
                className="block h-1.5 w-full"
                style={{ backgroundColor: b.strip }}
              />
              <span className="flex flex-1 flex-col items-center gap-2 p-4 text-center">
                <BrandEmblem slug={b.slug} variant="dock" />
                <span className="text-[15px] font-extrabold leading-tight text-white">
                  {b.name}
                </span>
                <span className="text-[12px] leading-snug text-white/90">{b.tagline}</span>
                <span
                  className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2.5 text-[13px] font-extrabold shadow-sm"
                  style={{ color: b.from }}
                >
                  לרכישה אונליין
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
