'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  MessageCircle,
  LogIn,
  Home,
  Plane,
  Mountain,
  PiggyBank,
  HeartPulse,
  HeartHandshake,
  Building2,
  Briefcase,
  type LucideIcon,
} from 'lucide-react';
import { NAV_MENU } from '@/lib/nav';
import SocialLinks from '@/components/SocialLinks';

/** Elegant per-category icons for the mobile drawer. */
const NAV_ICON: Record<string, LucideIcon> = {
  '/': Home,
  '/travel-insurance': Plane,
  '/har-habituach': Mountain,
  '/finance': PiggyBank,
  '/health': HeartPulse,
  '/life': HeartHandshake,
  '/mortgage': Building2,
  '/business-insurance': Briefcase,
};
import { SITE, whatsappHref } from '@/lib/content';
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock';

/**
 * MobileNav — hamburger + slide-in drawer for below-xl (phones, tablets, small
 * laptops), where the desktop MegaMenu is hidden. Exposes the FULL nav incl.
 * sub-categories (travel brands, har/mortgage sub-routes) plus the primary
 * call/WhatsApp actions — all of which were previously unreachable on mobile.
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  useBodyScrollLock(open);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    setExpanded(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="פתיחת תפריט הניווט"
        aria-expanded={open}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-white ring-1 ring-white/15 transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright xl:hidden"
      >
        <Menu className="h-6 w-6" aria-hidden />
      </button>

      {open &&
        mounted &&
        createPortal(
        <div className="fixed inset-0 z-[110]" role="dialog" aria-modal="true" aria-label="תפריט ניווט">
          <button
            type="button"
            aria-label="סגירת התפריט"
            onClick={close}
            className="fixed inset-0 animate-fade-in bg-navy-deep/60 backdrop-blur-md"
          />
          <div className="absolute inset-y-0 right-0 flex w-[87%] max-w-sm animate-drawer-in flex-col overflow-y-auto border-l border-white/10 bg-navy-deep/85 shadow-2xl backdrop-blur-2xl">
            {/* subtle gold glow for depth */}
            <div aria-hidden className="pointer-events-none absolute -top-16 end-[-4rem] h-48 w-48 rounded-full bg-glow-gold opacity-30 blur-3xl" />
            <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
              <span className="text-[17px] font-extrabold tracking-tight text-white">
                Future <span className="text-gold">Insurance</span>
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="סגירה"
                className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white ring-1 ring-white/10 transition-colors hover:bg-white/20"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <nav className="relative flex-1 space-y-1 px-3 py-4" aria-label="ניווט ראשי">
              {NAV_MENU.map((item) => {
                const Icon = NAV_ICON[item.href] ?? Home;
                return item.children ? (
                  <div key={item.href}>
                    <button
                      type="button"
                      onClick={() => setExpanded(expanded === item.href ? null : item.href)}
                      aria-expanded={expanded === item.href}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-[16px] font-bold text-white transition-colors hover:bg-white/10"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-gold-bright ring-1 ring-white/10">
                        <Icon className="h-[18px] w-[18px]" aria-hidden />
                      </span>
                      <span className="flex-1 text-start">{item.label}</span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-white/60 transition-transform ${expanded === item.href ? 'rotate-180' : ''}`}
                        aria-hidden
                      />
                    </button>
                    {expanded === item.href && (
                      <div className="mt-0.5 space-y-0.5 ps-12">
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            onClick={close}
                            className="block rounded-xl px-3 py-2.5 text-[14.5px] font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 text-[16px] font-bold text-white transition-colors hover:bg-white/10"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-gold-bright ring-1 ring-white/10">
                      <Icon className="h-[18px] w-[18px]" aria-hidden />
                    </span>
                    <span className="flex-1 text-start">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="grid grid-cols-2 gap-2.5 border-t border-white/10 p-4">
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-3 text-[14px] font-extrabold text-white shadow-md"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                וואטסאפ
              </a>
              <a
                href={SITE.phoneHref}
                onClick={close}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 px-3 py-3 text-[14px] font-extrabold text-navy-deep shadow-md"
              >
                <Phone className="h-4 w-4" aria-hidden />
                חייגו
              </a>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3.5">
              <a
                href="/admin/leads"
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="inline-flex items-center gap-2 text-[13.5px] font-bold text-white/70 transition-colors hover:text-white"
              >
                <LogIn className="h-4 w-4" aria-hidden />
                כניסת סוכנים
              </a>
              <SocialLinks variant="drawer" />
            </div>
          </div>
        </div>,
          document.body,
        )}
    </>
  );
}
