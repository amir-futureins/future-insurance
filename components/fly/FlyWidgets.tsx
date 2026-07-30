'use client';

import { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/gtm';

/**
 * Floating conversion widgets for the /fly landing page.
 *
 * /fly gets a bare canvas from SiteChrome (no TrustBar / SiteFooter / site
 * floats), so this supplies the two it needs: a WhatsApp button and a persistent
 * purchase bar. The accessibility toolbar is NOT re-implemented here — the page
 * renders the shared components/travel/AccessibilityMenu, which already meets
 * IS 5568 and is pinned bottom-20 left-4, so WhatsApp sits on the opposite side
 * to avoid overlapping it.
 */

const WA_PHONE = '972528422884';
const WA_TEXT = 'היי אמיר, אשמח לייעוץ לגבי ביטוח נסיעות לחו״ל';
const WA_HREF = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(WA_TEXT)}`;

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden>
      <path d="M16.04 3.2c-7.08 0-12.83 5.74-12.83 12.82 0 2.26.59 4.47 1.72 6.42L3.2 28.8l6.53-1.7a12.8 12.8 0 0 0 6.3 1.64h.01c7.07 0 12.82-5.75 12.82-12.83 0-3.42-1.33-6.64-3.75-9.06a12.72 12.72 0 0 0-9.07-3.76Zm0 23.05h-.01a10.65 10.65 0 0 1-5.42-1.48l-.39-.23-4.03 1.05 1.08-3.93-.25-.4a10.62 10.62 0 0 1-1.63-5.67c0-5.88 4.79-10.66 10.67-10.66 2.85 0 5.52 1.11 7.53 3.13a10.57 10.57 0 0 1 3.12 7.54c0 5.88-4.79 10.65-10.67 10.65Zm5.85-7.98c-.32-.16-1.9-.94-2.19-1.04-.3-.11-.51-.16-.73.16-.21.32-.84.98-1.03 1.18-.19.2-.38.22-.7.06-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.5.14-.66.14-.14.32-.38.48-.57.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.56-.08-.16-.73-1.75-1-2.39-.26-.63-.53-.55-.73-.56h-.62c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.64 0 1.56 1.14 3.07 1.3 3.28.16.21 2.2 3.37 5.33 4.72.75.32 1.33.52 1.78.66.75.24 1.44.2 1.98.13.6-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.14-.29-.22-.6-.38Z" />
    </svg>
  );
}

export default function FlyWidgets({ buyHref }: { buyHref: string }) {
  /* The WhatsApp button fades in once the hero has scrolled past, so it never
     competes with the card CTA above the fold. The purchase bar is permanent. */
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById('fly-hero-end');
    if (!sentinel || !('IntersectionObserver' in window)) {
      setPastHero(true); // no sentinel/IO: reveal rather than strand the button
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) =>
        setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <a
        href={WA_HREF}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('click_whatsapp', { context: 'fly_landing' })}
        aria-label={`שיחת וואטסאפ: ${WA_TEXT}`}
        className={`no-print fixed bottom-20 right-4 z-[60] grid h-[54px] w-[54px] place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_24px_rgba(37,211,102,0.40)] ring-[6px] ring-white/85 transition-all duration-300 hover:scale-105 ${
          pastHero
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none translate-y-3 scale-90 opacity-0'
        }`}
      >
        <WhatsAppGlyph />
      </a>

      <div className="no-print fixed inset-x-3 bottom-3 z-40 pb-[env(safe-area-inset-bottom)]">
        <a
          href={buyHref}
          target="_blank"
          rel="noopener nofollow sponsored"
          className="mx-auto flex max-w-[540px] animate-red-pulse items-center justify-center gap-2 rounded-2xl bg-pc px-4 py-4 text-center text-[clamp(0.95rem,3.6vw,1.05rem)] font-extrabold leading-tight text-white transition-colors hover:bg-[#C10510] motion-reduce:animate-none"
        >
          🚀 לרכישת ביטוח נסיעות אונליין עכשיו 👈
        </a>
      </div>
    </>
  );
}
