'use client';

import { usePathname } from 'next/navigation';
import { Phone } from 'lucide-react';
import { SITE, whatsappHref, WHATSAPP } from '@/lib/content';
import { trackEvent } from '@/lib/gtm';

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.173.198-.297.298-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

/**
 * Bottom sticky action bar for mobile — compact WhatsApp + click-to-call icons
 * and a prominent primary CTA that smooth-scrolls to the provider comparison.
 */
export default function MobileStickyBar() {
  const pathname = usePathname();
  const isTravel = pathname === '/travel-insurance';
  const ctaHref = isTravel ? `${SITE.travelPath}#providers` : whatsappHref();
  const ctaLabel = isTravel ? 'להשוואה ורכישה מהירה 🚀' : 'ייעוץ חינם בוואטסאפ 🚀';

  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-navy/10 bg-base/90 shadow-[0_-8px_24px_-16px_rgba(15,33,65,0.35)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-container items-stretch gap-2 px-3 py-2.5">
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('click_whatsapp', { context: 'mobile_bar' })}
          aria-label={`וואטסאפ: ${WHATSAPP.message}`}
          className="grid w-12 shrink-0 place-items-center rounded-xl bg-[#25D366] text-white shadow-sm"
        >
          <WhatsAppGlyph className="h-5 w-5" />
        </a>
        <a
          href={SITE.phoneHref}
          onClick={() => trackEvent('click_call', { context: 'mobile_bar' })}
          aria-label={SITE.phoneCta}
          className="grid w-12 shrink-0 place-items-center rounded-xl bg-navy/[0.06] text-ink shadow-sm"
        >
          <Phone className="h-5 w-5 text-gold-deep" aria-hidden />
        </a>
        <a
          href={ctaHref}
          {...(isTravel ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
          onClick={() => trackEvent('click_mobilebar_cta', { context: pathname })}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-cta-fill py-2.5 text-[14px] font-extrabold text-navy-deep shadow-md"
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}
