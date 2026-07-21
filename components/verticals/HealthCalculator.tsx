'use client';

import { useState } from 'react';
import { Check, ShieldPlus, ArrowLeft, Info } from 'lucide-react';
import {
  HEALTH_COVERAGES,
  estimateHealth,
  type HealthCoverageId,
} from '@/lib/estimators';
import { CountUp } from '@/components/travel/ui';
import LeadForm from '@/components/LeadForm';

const INSURERS = [
  'אין ביטוח בריאות',
  'הראל',
  'מגדל',
  'כלל',
  'מנורה מבטחים',
  'הפניקס',
  'איילון',
  'רק שב״ן של הקופה',
  'אחר',
];

export default function HealthCalculator() {
  const [selected, setSelected] = useState<HealthCoverageId[]>(['surgeries', 'drugs']);
  const [open, setOpen] = useState(false);
  const total = estimateHealth(selected);

  const toggle = (id: HealthCoverageId) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <section
      id="calculator"
      className="glass-elevated relative z-10 mx-auto w-full max-w-container scroll-mt-24 p-6 sm:p-8 md:p-10"
    >
      <header className="mb-8 text-center">
        <span className="eyebrow inline-flex items-center gap-1.5 text-[13px]">
          <ShieldPlus className="h-4 w-4" aria-hidden />
          בונים כיסוי חכם
        </span>
        <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
          אילו כיסויים חשובים לכם?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-[15px] leading-relaxed text-muted">
          בוחרים מה שמתאים — והעלות המשוערת מתעדכנת בזמן אמת. בלי כפילויות, בלי מיותר.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* coverage toggle cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {HEALTH_COVERAGES.map((c) => {
            const active = selected.includes(c.id);
            return (
              <label
                key={c.id}
                className="group relative flex cursor-pointer items-start gap-3 rounded-2xl border border-navy/10 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md has-[:checked]:-translate-y-0.5 has-[:checked]:border-gold/60 has-[:checked]:bg-gold-tint has-[:checked]:shadow-[0_0_0_1px_rgba(212,162,74,0.45),0_14px_34px_-12px_rgba(212,162,74,0.5)] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold"
              >
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={active}
                  onChange={() => toggle(c.id)}
                />
                <span
                  className="text-[26px] leading-none transition-transform duration-200 group-has-[:checked]:scale-110"
                  aria-hidden
                >
                  {c.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[15px] font-bold text-ink">{c.label}</span>
                    <span className="num text-[12px] font-extrabold text-gold-deep">
                      +₪{c.monthly}
                    </span>
                  </span>
                  <span className="mt-1 block text-[12.5px] leading-snug text-muted">
                    {c.desc}
                  </span>
                </span>
                <span
                  className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-navy/25 transition-all group-has-[:checked]:border-gold group-has-[:checked]:bg-gold"
                  aria-hidden
                >
                  <Check className="h-3 w-3 scale-50 text-navy-deep opacity-0 transition-all group-has-[:checked]:scale-100 group-has-[:checked]:opacity-100" />
                </span>
              </label>
            );
          })}
        </div>

        {/* summary rail */}
        <aside className="glass-elevated glass-recommended relative overflow-hidden p-6 lg:sticky lg:top-24 lg:self-start">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-recommend-highlight" />
          <div className="relative">
            <span className="eyebrow text-[13px]">העלות המשוערת שלכם</span>
            <div className="mt-3 flex items-end gap-1.5">
              <span className="currency text-[clamp(34px,6vw,44px)] font-extrabold leading-none text-ink">
                ₪<CountUp value={total} />
              </span>
              <span className="pb-1.5 text-[14px] font-semibold text-muted">/ לחודש</span>
            </div>
            <p className="mt-2 text-[13px] leading-snug text-muted">
              {selected.length} כיסויים נבחרו · הערכה להמחשה, המחיר הסופי לפי גיל ומצב בריאות.
            </p>

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-navy/[0.04] p-3 text-[12.5px] leading-snug text-ink/80">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
              נבדוק גם כפילויות מול הביטוחים הקיימים שלכם — ונבטל את מה שמיותר.
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              disabled={selected.length === 0}
              className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-cta-fill px-4 py-3.5 text-[16px] font-extrabold text-navy-deep shadow-lg shadow-gold/40 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_26px_rgba(212,162,74,0.65)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright"
            >
              קבלו הצעה מותאמת
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </aside>
      </div>

      {open && (
        <LeadForm
          open
          onClose={() => setOpen(false)}
          vertical="health"
          title="קבלת הצעה לביטוח בריאות"
          subtitle="נבנה עבורכם כיסוי חכם ונבדוק כפילויות מול הביטוחים הקיימים."
          summary={`${selected.length} כיסויים · הערכה ~₪${total} לחודש`}
          extraField={{
            label: 'חברת הביטוח הנוכחית',
            name: 'currentInsurer',
            options: INSURERS,
          }}
        />
      )}
    </section>
  );
}
