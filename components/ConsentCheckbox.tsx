'use client';

import Link from 'next/link';

/**
 * Mandatory consent checkbox for every lead-capture form. Gates submission
 * (the parent disables submit until `checked`). Covers the four legally
 * required approvals — Har-Habituach / clearinghouse query in the user's name,
 * sharing data with licensed carriers/partners, marketing contact (חוק
 * התקשורת), and reference to the full תקנון. See /terms for the full text.
 */
export default function ConsentCheckbox({
  checked,
  onChange,
  id = 'lead-consent',
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id?: string;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5 rounded-xl bg-navy/[0.03] p-3 ring-1 ring-navy/10">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required
        aria-required="true"
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#8A6220] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      />
      <span className="text-[11.5px] leading-relaxed text-muted">
        אני מאשר/ת את{' '}
        <Link href="/terms" target="_blank" className="font-semibold text-gold-deep underline underline-offset-2">
          תקנון האתר ומדיניות הפרטיות
        </Link>
        , ומסכים/ה לביצוע שאילתא באזור האישי / בהר הביטוח בשמי, לקבלת פניות ב-WhatsApp / טלפון,
        ולמסירת המידע לצד ג׳ (חברות ביטוח מורשות ושותפים).
      </span>
    </label>
  );
}
