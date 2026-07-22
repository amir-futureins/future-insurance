'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import LeadForm from '@/components/LeadForm';

/**
 * BounceLeadCta — a vibrant gradient banner with a bouncing "pop" button that
 * opens the shared LeadForm for the given vertical. Reduced-motion disables the
 * bounce via the global CSS rule.
 */
export default function BounceLeadCta({
  label,
  heading,
  sub,
  vertical,
  title,
  subtitle,
  gradient = 'linear-gradient(135deg, #142B55, #22366A)',
  idField = false,
}: {
  label: string;
  heading: string;
  sub?: string;
  vertical: string;
  title: string;
  subtitle?: string;
  gradient?: string;
  idField?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="mx-auto w-full max-w-container px-6 py-10 md:px-10">
      <div className="relative overflow-hidden rounded-3xl p-8 text-center text-white shadow-2xl sm:p-10" style={{ background: gradient }}>
        <div aria-hidden className="pointer-events-none absolute -top-16 end-[-3rem] h-48 w-48 rounded-full bg-glow-gold opacity-30 blur-3xl" />
        <div className="relative">
          <h2 className="mx-auto max-w-xl text-[clamp(22px,5vw,30px)] font-extrabold leading-tight">{heading}</h2>
          {sub ? <p className="mx-auto mt-2 max-w-lg text-[15px] leading-relaxed text-white/80">{sub}</p> : null}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-6 inline-flex animate-bounce items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[16px] font-extrabold text-navy-deep shadow-2xl ring-2 ring-gold/40 transition-transform duration-150 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright"
          >
            {label}
            <ArrowLeft className="h-5 w-5 text-gold-deep" aria-hidden />
          </button>
        </div>
      </div>

      {open && (
        <LeadForm open onClose={() => setOpen(false)} vertical={vertical} title={title} subtitle={subtitle} idField={idField} />
      )}
    </section>
  );
}
