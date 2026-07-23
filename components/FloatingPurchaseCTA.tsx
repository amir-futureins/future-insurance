'use client';

import { useState } from 'react';
import { Zap, ArrowLeft } from 'lucide-react';
import LeadForm from '@/components/LeadForm';

/**
 * FloatingPurchaseCTA — a scroll-persistent, pulsing brand-coloured "buy now"
 * button for the brand sub-pages. Bottom-centre so it never collides with the
 * corner floats (WhatsApp / AI / accessibility / QuickActionDock). Opens the
 * brand's quick purchase/lead modal.
 */
export default function FloatingPurchaseCTA({
  slug,
  name,
  accent,
}: {
  slug: string;
  name: string;
  accent: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="no-print fixed bottom-8 left-1/2 z-[60] hidden -translate-x-1/2 lg:block">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`רכישה מהירה אונליין ב${name}`}
        className="relative inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-extrabold text-white shadow-2xl ring-2 ring-white/50 transition-transform duration-150 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright"
        style={{ backgroundColor: accent, boxShadow: `0 14px 34px -10px ${accent}` }}
      >
        <span
          aria-hidden
          className="absolute inset-0 -z-10 animate-ping rounded-full"
          style={{ backgroundColor: accent, opacity: 0.35 }}
        />
        <Zap className="h-5 w-5" aria-hidden />
        לרכישה מהירה ב{name}
        <ArrowLeft className="h-4 w-4" aria-hidden />
      </button>

      {open && (
        <LeadForm
          open
          onClose={() => setOpen(false)}
          vertical={`travel_${slug}_buy`}
          title={`רכישה מהירה — ${name}`}
          subtitle={`השאירו טלפון וסוכן מורשה ישלים עבורכם את רכישת ביטוח הנסיעות ב${name} — באותו מחיר, בליווי מלא.`}
        />
      )}
    </div>
  );
}
