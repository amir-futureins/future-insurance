'use client';

import { useState } from 'react';
import { Plane, Car, TrendingDown, Layers, ArrowLeft } from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import { trackEvent } from '@/lib/gtm';

/**
 * HomeActionHub — "מה תרצה לעשות היום?" interactive quick-action launcher at the
 * top of the home hero (mobile + desktop). Deep-navy + gold, floating icon
 * circles with a gentle micro-animation. Every action fires a GTM/dataLayer
 * event. Travel → the PassportCard affiliate link (/api/go → AFFILIATE_*); the
 * other three open a quick lead-capture form.
 */
type FormCfg = { vertical: string; title: string; subtitle: string; idField?: boolean };

interface Action {
  key: string;
  label: string;
  sub: string;
  Icon: typeof Plane;
  accent: string;
  href?: string;
  form?: FormCfg;
}

const ACTIONS: Action[] = [
  {
    key: 'travel',
    label: 'רכישת ביטוח חו״ל',
    sub: 'PassportCard — רכישה מיידית',
    Icon: Plane,
    accent: '#0057B8',
    href: '/api/go/passportcard',
  },
  {
    key: 'car',
    label: 'עבר ביטוחי לרכב',
    sub: 'הפקת דוח מהיר',
    Icon: Car,
    accent: '#8A6220',
    form: {
      vertical: 'car_claims_home',
      title: 'הפקת דוח עבר ביטוחי לרכב',
      subtitle: 'השאירו שם וטלפון וסוכן מורשה יפיק עבורכם את דוח העבר הביטוחי לרכב — ללא עלות.',
    },
  },
  {
    key: 'reduce',
    label: 'הוזלת ביטוחים',
    sub: 'בדיקת פוליסות קיימות',
    Icon: TrendingDown,
    accent: '#16A34A',
    form: {
      vertical: 'price_reduction_home',
      title: 'הוזלת הביטוחים שלכם',
      subtitle: 'השאירו פרטים ונשווה את הפוליסות הקיימות — לרוב חוסכים מאות שקלים בחודש.',
    },
  },
  {
    key: 'duplicate',
    label: 'בדיקת כפל ביטוח',
    sub: 'זיהוי כפילויות מיותרות',
    Icon: Layers,
    accent: '#7C3AED',
    form: {
      vertical: 'duplicate_check_home',
      title: 'בדיקת כפל ביטוח',
      subtitle: 'השאירו פרטים ונזהה עבורכם כיסויים כפולים מיותרים — ונבטל אותם בליווי מלא.',
    },
  },
];

const CARD =
  'group flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-4 text-center transition-all duration-200 hover:-translate-y-1 hover:bg-white/10 hover:ring-1 hover:ring-gold/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright md:items-start md:p-5 md:text-start';

export default function HomeActionHub() {
  const [form, setForm] = useState<FormCfg | null>(null);

  return (
    <section className="mx-auto w-full max-w-container px-4 pt-6 md:px-10 md:pt-10">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-navy to-navy-deep p-5 shadow-xl md:p-8">
        {/* decorative floating orbs */}
        <div aria-hidden className="pointer-events-none absolute -top-10 end-[-3rem] h-40 w-40 rounded-full bg-glow-gold opacity-40 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-[-4rem] start-[-3rem] h-48 w-48 rounded-full bg-glow-navy opacity-40 blur-3xl" />

        <div className="relative">
          <div className="text-center md:text-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-bold text-gold-bright ring-1 ring-white/15">
              ⚡ מרכז פעולה מהיר
            </span>
            <h2 className="mt-3 text-[clamp(22px,5.5vw,30px)] font-extrabold leading-tight text-white">
              מה תרצה לעשות היום?
            </h2>
            <p className="mt-1.5 text-[14px] leading-snug text-white/65">בחרו פעולה — ונטפל בזה עבורכם תוך דקות.</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {ACTIONS.map((a, i) => {
              const inner = (
                <>
                  <span
                    className="grid h-14 w-14 shrink-0 animate-float place-items-center rounded-2xl text-white ring-1 ring-white/20"
                    style={{ backgroundColor: a.accent, animationDelay: `${i * 0.45}s`, boxShadow: `0 10px 24px -8px ${a.accent}` }}
                  >
                    <a.Icon className="h-7 w-7" aria-hidden />
                  </span>
                  <span className="mt-3 block text-[15px] font-extrabold leading-tight text-white">{a.label}</span>
                  <span className="mt-1 block text-[12.5px] leading-snug text-white/60">{a.sub}</span>
                  <span className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-bold text-gold-bright">
                    {a.href ? 'לרכישה מיידית' : 'להשארת פרטים'}
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
                  </span>
                </>
              );
              return a.href ? (
                <a
                  key={a.key}
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={() =>
                    trackEvent('purchase_click', { provider: 'passportcard', location: 'home_action_hub' })
                  }
                  className={CARD}
                >
                  {inner}
                </a>
              ) : (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => {
                    trackEvent('action_hub_click', { action: a.key });
                    setForm(a.form ?? null);
                  }}
                  className={CARD}
                >
                  {inner}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {form && (
        <LeadForm
          open
          onClose={() => setForm(null)}
          vertical={form.vertical}
          title={form.title}
          subtitle={form.subtitle}
          idField={form.idField}
        />
      )}
    </section>
  );
}
