'use client';

import { useState } from 'react';
import { ArrowLeft, Radar, ShieldCheck, Zap } from 'lucide-react';
import GovDataModal from '@/components/GovDataModal';

/**
 * GovDataCta — a high-impact section with a rotating "בדיקה מול הר הביטוח" badge,
 * a huge breathing/glowing CTA, and no-cost marketing copy. Opens GovDataModal.
 */
export default function GovDataCta({
  heading = 'רוצים לדעת בדיוק מה יש לכם בהר הביטוח?',
  buttonLabel = 'הפקת דוח עבר ביטוחי ב-2 דקות',
  topic = 'car_claims_gov',
  modalTitle = 'הפקת דוח הר הביטוח',
}: {
  heading?: string;
  buttonLabel?: string;
  topic?: string;
  modalTitle?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="mx-auto w-full max-w-container px-6 py-14 md:px-10 md:py-16">
      <div className="glass-elevated relative overflow-hidden p-8 text-center sm:p-10">
        <div aria-hidden className="pointer-events-none absolute -top-16 start-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-glow-gold opacity-50 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[12.5px] font-bold text-emerald-800 ring-1 ring-emerald-200">
            <Radar className="h-4 w-4 animate-spin text-emerald-600" style={{ animationDuration: '3s' }} aria-hidden />
            בדיקה מול הר הביטוח
          </span>

          <h2 className="mx-auto mt-4 max-w-xl text-[clamp(24px,5vw,32px)] font-extrabold leading-tight text-ink">
            {heading}
          </h2>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mx-auto mt-6 inline-flex animate-breathe items-center gap-2.5 rounded-2xl bg-cta-fill px-7 py-4 text-[clamp(16px,3.5vw,20px)] font-extrabold text-navy-deep shadow-2xl shadow-gold/40 ring-2 ring-white/50 transition-transform duration-150 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright"
            style={{ boxShadow: '0 0 44px rgba(212,162,74,0.55), 0 18px 40px -12px rgba(20,43,85,0.4)' }}
          >
            <Zap className="h-6 w-6" aria-hidden />
            {buttonLabel}
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </button>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[14px] font-bold">
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              ללא עלות וללא התחייבות!
            </span>
            <span className="inline-flex items-center gap-1.5 text-gold-deep">
              <Zap className="h-4 w-4" aria-hidden />
              2 דקות והדוח אצלך
            </span>
          </div>
        </div>
      </div>

      {open && <GovDataModal open onClose={() => setOpen(false)} topic={topic} title={modalTitle} />}
    </section>
  );
}
