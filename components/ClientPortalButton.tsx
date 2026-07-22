'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import ClientPortalModal from '@/components/ClientPortalModal';

/**
 * "אזור אישי" header button — a glass-outline secondary that pairs with the solid
 * gold "ייעוץ חינם" CTA in the header action group. Opens the secure ClientPortalModal.
 */
export default function ClientPortalButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-amber-400/50 bg-[#142B55] px-3.5 py-2 text-[14px] font-bold text-white shadow-sm ring-1 ring-amber-400/15 transition-colors hover:bg-[#1c3a70] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright sm:inline-flex"
      >
        <Lock className="h-4 w-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" aria-hidden />
        אזור אישי
      </button>
      <ClientPortalModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
