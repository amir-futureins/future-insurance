'use client';

import { useState } from 'react';
import { MessageSquareText } from 'lucide-react';
import LeadForm from '@/components/LeadForm';

/**
 * "צור קשר" header CTA — glowing metallic-gold button that opens the shared
 * quick-contact lead modal (name + Israeli mobile → WhatsApp / call handoff).
 * Sits alongside "ייעוץ חינם" and the click-to-call button in the header group.
 */
export default function ContactButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 px-4 py-2 text-[14px] font-extrabold text-navy-deep shadow-[0_0_15px_rgba(251,191,36,0.6)] ring-1 ring-amber-300/50 transition-all duration-150 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_0_22px_rgba(251,191,36,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright sm:inline-flex"
      >
        <MessageSquareText className="h-4 w-4" aria-hidden />
        צור קשר
      </button>
      <LeadForm
        open={open}
        onClose={() => setOpen(false)}
        vertical="contact_navbar"
        title="צור קשר — ונחזור אליכם תוך דקות"
        subtitle="השאירו שם וטלפון ונציג מומחה יחזור אליכם עם המענה המהיר ביותר, ללא עלות."
      />
    </>
  );
}
