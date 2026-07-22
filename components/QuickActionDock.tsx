'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Phone,
  MessageCircle,
  Landmark,
  Car,
  Home,
  TrendingUp,
  Percent,
  Search,
  Zap,
  Plane,
  ArrowLeft,
  type LucideIcon,
} from 'lucide-react';
import { whatsappHref, SITE } from '@/lib/content';
import { BRANDS } from '@/lib/brands';
import BrandEmblem from '@/components/travel/BrandEmblem';

/**
 * QuickActionDock — a route-aware branded conversion dock pinned to the (RTL)
 * inline-start edge, desktop-only. Shows the actions that matter for the current
 * vertical: travel-carrier brands on travel sub-pages, Gov/car-claims on
 * Har-Habituach, bank-compare/structure on Mortgage, tracks on Finance, and a
 * WhatsApp/call fallback elsewhere. Each badge reveals a sliding tooltip on
 * hover/focus. The main /travel-insurance page keeps its own SideActionDock.
 */

interface Action {
  key: string;
  tooltip: string;
  href: string;
  bg: string;
  fg?: string;
  initials?: string;
  icon?: LucideIcon;
  /** travel-carrier slug — renders a white-circle BrandEmblem instead of an icon. */
  emblem?: string;
  external?: boolean;
}

const WA: Action = {
  key: 'wa',
  tooltip: 'ייעוץ מיידי בוואטסאפ ➔',
  href: whatsappHref(),
  bg: '#25D366',
  icon: MessageCircle,
  external: true,
};
const CALL: Action = {
  key: 'call',
  tooltip: `${SITE.phoneCta} ➔`,
  href: SITE.phoneHref,
  bg: '#8A6220',
  icon: Phone,
  external: true,
};

const TRAVEL: Action[] = [
  { key: 'pc', tooltip: 'רכישה מהירה בפספורטקארד ➔', href: '/travel-insurance/passportcard', bg: '#E10600', emblem: 'passportcard' },
  { key: 'harel', tooltip: 'רכישה מהירה בהראל ➔', href: '/travel-insurance/harel', bg: '#004B93', emblem: 'harel' },
  { key: 'clal', tooltip: 'רכישה מהירה בכלל ➔', href: '/travel-insurance/clal', bg: '#002D62', emblem: 'clal' },
  { key: 'migdal', tooltip: 'רכישה מהירה במגדל ➔', href: '/travel-insurance/migdal', bg: '#001E50', emblem: 'migdal' },
];

function actionsFor(pathname: string): Action[] {
  if (pathname.startsWith('/travel-insurance')) return [...TRAVEL, WA];
  if (pathname.startsWith('/har-habituach'))
    return [
      { key: 'dup', tooltip: 'בדיקת כפל ביטוח והוזלה ➔', href: '/har-habituach/duplicate-check', bg: '#0F2141', icon: Search },
      { key: 'car', tooltip: 'עבר ביטוחי לרכב ב-3 דקות ➔', href: '/har-habituach/car-claims', bg: '#8A6220', icon: Car },
      WA,
    ];
  if (pathname.startsWith('/mortgage'))
    return [
      { key: 'compare', tooltip: 'השוואה מול מחיר הבנק ➔', href: '/mortgage#compare', bg: '#0F2141', icon: Landmark },
      { key: 'structure', tooltip: 'ביטוח מבנה ודירה ➔', href: '/mortgage/structure', bg: '#8A6220', icon: Home },
      WA,
    ];
  if (pathname.startsWith('/finance'))
    return [
      { key: 'sp', tooltip: 'סימולטור צמיחה — S&P 500 ➔', href: '/finance#calculator', bg: '#047857', icon: TrendingUp },
      { key: 'fees', tooltip: 'בדיקת דמי ניהול ➔', href: '/finance#calculator', bg: '#8A6220', icon: Percent },
      WA,
    ];
  if (pathname.startsWith('/business-insurance'))
    return [{ key: 'quote', tooltip: 'הצעה לביטוח עסק ➔', href: '/business-insurance#calculator', bg: '#0F2141', icon: Landmark }, WA, CALL];
  return [WA, CALL];
}

function Badge({ a }: { a: Action }) {
  const isEmblem = Boolean(a.emblem);
  const inner = isEmblem ? (
    <BrandEmblem slug={a.emblem as string} />
  ) : a.icon ? (
    <a.icon className="h-5 w-5 text-white" aria-hidden />
  ) : a.initials ? (
    <span className="text-[13px] font-extrabold" style={{ color: a.fg ?? '#ffffff' }}>
      {a.initials}
    </span>
  ) : null;

  const cls = isEmblem
    ? 'group relative block rounded-full transition-transform duration-150 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep'
    : 'group relative grid h-12 w-12 place-items-center rounded-full shadow-md ring-1 ring-black/5 transition-transform duration-150 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep';
  const style = isEmblem ? undefined : ({ backgroundColor: a.bg } as CSSProperties);
  const tip = (
    <span className="pointer-events-none absolute right-full top-1/2 z-10 me-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-navy-deep px-3 py-1.5 text-[12px] font-bold text-white opacity-0 shadow-lg transition-all duration-200 group-hover:me-2 group-hover:opacity-100 group-focus-visible:opacity-100">
      {a.tooltip}
    </span>
  );

  return a.external ? (
    <a href={a.href} target="_blank" rel="noopener noreferrer" aria-label={a.tooltip} className={cls} style={style}>
      {inner}
      {tip}
    </a>
  ) : (
    <Link href={a.href} aria-label={a.tooltip} className={cls} style={style}>
      {inner}
      {tip}
    </Link>
  );
}

const TRAVEL_SLUGS = ['passportcard', 'harel', 'clal', 'migdal'] as const;

/** A dock button whose hover/focus reveals a glass flyout of the 4 travel brands. */
function TravelFlyout() {
  return (
    <div className="group/travel relative">
      <button
        type="button"
        aria-label="ביטוח נסיעות — רכישה מהירה"
        aria-haspopup="menu"
        className="relative grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#1e3a70] to-navy-deep text-white shadow-md ring-1 ring-black/5 transition-transform duration-150 hover:scale-110 group-focus-within/travel:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
      >
        <Plane className="h-5 w-5 -rotate-45" aria-hidden />
      </button>
      <div className="pointer-events-none absolute right-full top-1/2 z-20 -translate-y-1/2 pr-3 opacity-0 transition-all duration-200 group-hover/travel:pointer-events-auto group-hover/travel:opacity-100 group-focus-within/travel:pointer-events-auto group-focus-within/travel:opacity-100">
        <div className="w-60 overflow-hidden rounded-2xl border border-white/50 bg-white/90 p-2 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-1.5 px-2 pb-1.5 pt-1 text-[11px] font-bold text-faint">
            <Plane className="h-3.5 w-3.5 -rotate-45" aria-hidden />
            ביטוח נסיעות — רכישה מהירה
          </div>
          {TRAVEL_SLUGS.map((slug) => (
            <Link
              key={slug}
              href={`/travel-insurance/${slug}`}
              className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-slate-100 focus-visible:bg-slate-100 focus-visible:outline-none"
            >
              <BrandEmblem slug={slug} variant="sm" />
              <span className="flex-1 text-start text-[14px] font-bold text-ink">{BRANDS[slug].name}</span>
              <ArrowLeft className="h-4 w-4 text-faint" aria-hidden />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function QuickActionDock() {
  const pathname = usePathname() ?? '/';
  // The main travel hub ships its own purchase dock (SideActionDock).
  if (pathname === '/travel-insurance') return null;

  const actions = actionsFor(pathname);
  // Travel sub-pages already list the brand emblems; show the flyout elsewhere.
  const showTravelFlyout = !pathname.startsWith('/travel-insurance');

  return (
    <div className="no-print fixed top-1/2 z-40 hidden -translate-y-1/2 lg:block" style={{ insetInlineStart: '0.75rem' }}>
      <div className="flex flex-col items-center gap-2.5 rounded-3xl border border-navy/10 bg-white/70 p-2 shadow-[0_16px_40px_-18px_rgba(15,33,65,0.4)] backdrop-blur-xl">
        <span className="inline-flex animate-pulse-glow items-center gap-1 rounded-full bg-cta-fill px-2 py-1 text-[10px] font-extrabold text-navy-deep">
          <Zap className="h-3 w-3" aria-hidden />
          מהיר
        </span>
        {showTravelFlyout ? <TravelFlyout /> : null}
        {actions.map((a) => (
          <Badge key={a.key} a={a} />
        ))}
      </div>
    </div>
  );
}
