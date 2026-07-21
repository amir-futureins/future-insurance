'use client';

import type { CSSProperties } from 'react';
import { usePathname } from 'next/navigation';
import { CreditCard, ShieldCheck, Building2, Umbrella, SlidersHorizontal, type LucideIcon } from 'lucide-react';
import type { PriceableProviderId } from '@/lib/calculator';
import { getProvider } from '@/lib/providers';
import { SITE } from '@/lib/content';
import { ProviderAction } from './LeadModal';

/** `ring` = optional multi-colour brand halo (Harel tri-colour, Migdal blue+orange). */
const DOCK: { id: PriceableProviderId; icon: LucideIcon; ring?: string }[] = [
  { id: 'passportcard', icon: CreditCard },
  { id: 'harel', icon: ShieldCheck, ring: 'conic-gradient(from 210deg, #0057B8, #FFC20E, #16A34A, #0057B8)' },
  { id: 'migdal', icon: Building2, ring: 'conic-gradient(from 210deg, #003399, #F5821F, #003399)' },
  { id: 'clal', icon: Umbrella },
];

/** Tooltip label that pops out to the left (into the page) on hover/focus. */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-[13px] font-bold text-ink opacity-0 shadow-lg ring-1 ring-navy/10 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
      {children}
    </span>
  );
}

/**
 * Persistent side action dock — quick-purchase CTAs per provider (each opens
 * the lead modal pre-selected) plus a quick-compare button that jumps to the
 * calculator. Desktop only; the mobile sticky bar covers small screens.
 */
export default function SideActionDock() {
  // Travel-only: the purchase dock is provider-specific.
  const pathname = usePathname();
  if (pathname !== '/travel-insurance') return null;

  return (
    <div className="no-print fixed top-1/2 z-40 hidden -translate-y-1/2 lg:block" style={{ insetInlineStart: '0.75rem' }}>
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-navy/10 bg-white/70 p-2 shadow-[0_16px_40px_-18px_rgba(15,33,65,0.4)] backdrop-blur-xl">
        <span className="px-1 pt-1 text-center text-[10px] font-bold uppercase tracking-wide text-faint">
          רכישה
          <br />
          מהירה
        </span>

        {DOCK.map(({ id, icon: Icon, ring }) => {
          const p = getProvider(id);
          return (
            <ProviderAction
              key={id}
              provider={p}
              position="side_dock"
              aria-label={`רכישת ${p.name}`}
              className="group relative grid h-12 w-12 place-items-center rounded-full shadow-md transition-transform duration-150 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
              style={ring ? undefined : ({ backgroundColor: p.brand } as CSSProperties)}
            >
              {ring ? (
                <span
                  className="grid h-full w-full place-items-center rounded-full p-[2.5px]"
                  style={{ background: ring }}
                >
                  <span className="grid h-full w-full place-items-center rounded-full text-white" style={{ backgroundColor: p.brand }}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                </span>
              ) : (
                <Icon className="h-5 w-5 text-white" aria-hidden />
              )}
              <Label>רכישת {p.name}</Label>
            </ProviderAction>
          );
        })}

        <span className="my-0.5 h-px w-8 bg-navy/10" aria-hidden />

        <a
          href={`${SITE.travelPath}#calculator`}
          aria-label="השוואה מהירה — מעבר למחשבון"
          className="group relative grid h-12 w-12 place-items-center rounded-full bg-cta-fill text-navy-deep shadow-md ring-1 ring-gold/30 transition-transform duration-150 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
        >
          <SlidersHorizontal className="h-5 w-5" aria-hidden />
          <Label>השוואה מהירה</Label>
        </a>
      </div>
    </div>
  );
}
