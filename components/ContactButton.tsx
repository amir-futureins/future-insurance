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
        className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 px-4 py-2 text-[14px] font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all duration-150 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright sm:inline-flex"
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
