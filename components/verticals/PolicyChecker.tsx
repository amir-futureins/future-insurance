'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  HeartPulse,
  Activity,
  Home,
  Car,
  Building2,
  Search,
  ArrowLeft,
  AlertTriangle,
  Check,
} from 'lucide-react';
import LeadForm from '@/components/LeadForm';

const POLICIES: { id: string; label: string; icon: typeof ShieldCheck }[] = [
  { id: 'life', label: 'ביטוח חיים', icon: ShieldCheck },
  { id: 'health', label: 'ביטוח בריאות', icon: HeartPulse },
  { id: 'disability', label: 'אובדן כושר עבודה', icon: Activity },
  { id: 'mortgage', label: 'ביטוח משכנתא', icon: Home },
  { id: 'car', label: 'ביטוח רכב', icon: Car },
  { id: 'home', label: 'ביטוח דירה', icon: Building2 },
];

export default function PolicyChecker() {
  const [selected, setSelected] = useState<string[]>(['life', 'health', 'disability']);
  const [scanned, setScanned] = useState(false);
  const [open, setOpen] = useState(false);

  const toggle = (id: string) => {
    setScanned(false);
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const has = (id: string) => selected.includes(id);
  const overlaps: string[] = [];
  if (has('life') && has('disability')) overlaps.push('אובדן כושר עבודה — כיסוי כפול אפשרי');
  if (has('life') && has('mortgage')) overlaps.push('ביטוח חיים חופף (פרטי + משכנתא)');
  if (has('health')) overlaps.push('בריאות — כפילות אפשרית מול שב״ן הקופה');
  if (has('car') && has('home')) overlaps.push('כיסויי צד ג׳ חופפים');
  const potential = Math.min(600, selected.length * 45 + overlaps.length * 45);

  return (
    <section
      id="checker"
      className="glass-elevated relative z-10 mx-auto w-full max-w-container scroll-mt-24 p-6 sm:p-8 md:p-10"
    >
      <header className="mb-8 text-center">
        <span className="eyebrow inline-flex items-center gap-1.5 text-[13px]">
          <Search className="h-4 w-4" aria-hidden />
          סורק כפל פוליסות
        </span>
        <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
          אילו ביטוחים פעילים יש לכם?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-[15px] leading-relaxed text-muted">
          מסמנים מה שיש לכם — וקבלו בדיקה ראשונית לחפיפות. נאמת מולכם ומול הר הביטוח.
        </p>
      </header>

      {/* policy toggle tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {POLICIES.map((p) => {
          const Icon = p.icon;
          const active = has(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              aria-pressed={active}
              className={[
                'flex items-center gap-3 rounded-2xl border p-4 text-start transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
                active
                  ? 'border-gold/60 bg-gold-tint shadow-[0_0_0_1px_rgba(212,162,74,0.4),0_12px_30px_-12px_rgba(212,162,74,0.4)]'
                  : 'border-navy/10 bg-white hover:-translate-y-0.5 hover:shadow-md',
              ].join(' ')}
            >
              <span
                className={[
                  'grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors',
                  active ? 'bg-accent text-navy-deep' : 'bg-navy/[0.06] text-muted',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-[14px] font-bold text-ink">{p.label}</span>
              {active ? (
                <Check className="ms-auto h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setScanned(true)}
          disabled={selected.length === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-cta-fill px-6 py-3.5 text-[16px] font-extrabold text-navy-deep shadow-lg shadow-gold/30 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(212,162,74,0.6)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright"
        >
          <Search className="h-5 w-5" aria-hidden />
          בדקו כפילויות ({selected.length})
        </button>
      </div>

      {scanned ? (
        <div
          className="mt-8 animate-slide-in"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {overlaps.length > 0 ? (
            <div className="rounded-2xl border border-gold/40 bg-gold-tint p-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-gold-deep" aria-hidden />
                <h3 className="text-[17px] font-extrabold text-ink">
                  זיהינו {overlaps.length} נקודות לבדיקה
                </h3>
              </div>
              <ul className="mt-4 space-y-2">
                {overlaps.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-[14px] text-ink/90">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-deep" aria-hidden />
                    {o}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-col items-center gap-4 border-t border-gold/30 pt-5 sm:flex-row sm:justify-between">
                <div className="text-center sm:text-start">
                  <div className="text-[13px] font-semibold text-muted">חיסכון פוטנציאלי</div>
                  <div className="currency text-[26px] font-extrabold leading-none text-gold-deep">
                    עד ₪{potential} <span className="text-[14px] font-bold text-muted">/ חודש</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-cta-fill px-5 py-3 text-[15px] font-extrabold text-navy-deep shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  לאיחוד התיק — בדיקה חינם
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-navy/10 bg-white p-6 text-center">
              <p className="text-[15px] text-ink/90">
                לא זוהו חפיפות ברורות מהבחירה — אך בדיקה מעמיקה מול הר הביטוח לרוב חושפת פרטים
                נוספים.
              </p>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cta-fill px-5 py-3 text-[15px] font-extrabold text-navy-deep shadow-md"
              >
                לבדיקת תיק מלאה — חינם
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </button>
            </div>
          )}
        </div>
      ) : null}

      {open && (
        <LeadForm
          open
          onClose={() => setOpen(false)}
          vertical="har"
          idField
          title="איחוד תיק הביטוח — בדיקה חינם"
          subtitle="נסקור את כל הפוליסות שלכם מול הר הביטוח, נזהה כפילויות ונאחד לתיק אחד חכם."
          summary={`${selected.length} סוגי ביטוח נבחרו${overlaps.length ? ` · ${overlaps.length} נקודות לבדיקה` : ''}`}
          extraField={{
            label: 'בכמה חברות ביטוח אתם מבוטחים היום?',
            name: 'insurerCount',
            options: ['חברה אחת', '2 חברות', '3 חברות', '4 ומעלה', 'לא בטוח/ה'],
          }}
        />
      )}
    </section>
  );
}
