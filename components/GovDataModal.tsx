'use client';

import { useEffect, useRef, useState } from 'react';
import { X, ShieldCheck, Loader2, CheckCircle2, Radar, Phone, ArrowLeft } from 'lucide-react';
import { trackEvent } from '@/lib/gtm';
import { WHATSAPP, SITE } from '@/lib/content';
import { isValidIsraeliId, sanitizeId } from '@/lib/israeli-id';
import { submitLead } from '@/lib/submit-lead';
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock';
import ConsentCheckbox from '@/components/ConsentCheckbox';

/**
 * GovDataModal — identity form for a Har-Habituach / gov-data query performed by
 * a licensed agent on the user's behalf (consent required). Fields: full name,
 * Israeli-ID (checksum), date of birth (valid past date, 18+), ID issue date
 * (past date), Israeli mobile. Submits to /api/leads with masked server logging.
 */
type Phase = 'form' | 'submitting' | 'done';

const PHONE_RE = /^05\d{8}$/;
const MS_YEAR = 365.25 * 24 * 3600 * 1000;

function ageFrom(dob: string): number {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return -1;
  return (Date.now() - d.getTime()) / MS_YEAR;
}
function isPastDate(v: string): boolean {
  const d = new Date(v);
  return !Number.isNaN(d.getTime()) && d.getTime() <= Date.now();
}

export default function GovDataModal({
  open,
  onClose,
  topic = 'gov_data',
  title = 'הפקת דוח הר הביטוח',
  subtitle = 'נאמת את זהותכם ונבצע בשמכם שאילתא בהר הביטוח — התהליך אורך כ-2 דקות.',
}: {
  open: boolean;
  onClose: () => void;
  topic?: string;
  title?: string;
  subtitle?: string;
}) {
  const [phase, setPhase] = useState<Phase>('form');
  const [name, setName] = useState('');
  const [idVal, setIdVal] = useState('');
  const [dob, setDob] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState(''); // honeypot — stays empty for humans
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setPhase('form');
    setName(''); setIdVal(''); setDob(''); setIssueDate(''); setPhone(''); setConsent(false); setError(null);
    trackEvent('gov_data_open', { topic });
  }, [open, topic]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (!dialogRef.current.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => firstRef.current?.focus(), 60);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [open, onClose]);

  useBodyScrollLock(open);

  if (!open) return null;

  const idValid = isValidIsraeliId(idVal);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const normPhone = phone.trim().replace(/[\s-]/g, '');
    if (name.trim().length < 2) return setError('נא להזין שם פרטי ומשפחה');
    if (!idValid) return setError('נא להזין מספר תעודת זהות תקין (9 ספרות)');
    const age = ageFrom(dob);
    if (age < 0) return setError('נא להזין תאריך לידה תקין');
    if (age < 18) return setError('השירות מיועד לבני 18 ומעלה');
    if (age > 120) return setError('נא לבדוק את תאריך הלידה');
    if (!isPastDate(issueDate)) return setError('נא להזין תאריך הנפקה תקין (בעבר)');
    if (new Date(issueDate).getTime() <= new Date(dob).getTime()) return setError('תאריך ההנפקה חייב להיות אחרי תאריך הלידה');
    if (!PHONE_RE.test(normPhone)) return setError('נא להזין מספר נייד תקין (05X-XXXXXXX)');
    if (!consent) return setError('יש לאשר את התקנון ומדיניות הפרטיות כדי להמשיך');

    setError(null);
    setPhase('submitting');
    trackEvent('generate_lead', { vertical: topic });
    const payload = { name: name.trim(), phone: normPhone, id: idVal, dob, issueDate, topic, consent, idRequired: true, company };
    const minDelay = new Promise<void>((r) => { timer.current = window.setTimeout(r, 900); });
    Promise.all([submitLead(payload), minDelay]).then(([result]) => {
      if (result.ok || result.kind === 'network') {
        setPhase('done'); // success — or transient blip; WhatsApp handoff still works
      } else {
        setError(result.message); // 422 / 429 — let the user fix and retry
        setPhase('form');
      }
    });
  };

  const field = 'glass-chip w-full rounded-xl px-4 py-3 text-[15px] text-ink placeholder:text-faint focus:outline-none focus-visible:ring-2 focus-visible:ring-gold';
  const today = new Date().toISOString().slice(0, 10);
  const waHref = `https://wa.me/${WHATSAPP.phone}?text=${encodeURIComponent('היי, השארתי פרטים לבדיקת הר הביטוח.')}`;

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center overflow-y-auto p-4" role="dialog" aria-modal="true" aria-labelledby="gov-title">
      <button type="button" aria-label="סגירה" onClick={onClose} className="fixed inset-0 bg-navy-deep/50 backdrop-blur-sm" />
      <div ref={dialogRef} className="glass-elevated relative my-auto flex max-h-[90vh] w-full max-w-md animate-toast-in flex-col overflow-hidden rounded-glass-lg">
        <button type="button" onClick={onClose} aria-label="סגירה" className="absolute end-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-navy/[0.05] text-muted transition-colors hover:bg-navy/10 hover:text-ink">
          <X className="h-4 w-4" aria-hidden />
        </button>

        {phase !== 'done' ? (
          <div className="overflow-y-auto p-6 sm:p-7">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy text-emerald-300 ring-1 ring-emerald-400/30">
                <Radar className="h-5 w-5 animate-spin" style={{ animationDuration: '3.2s' }} aria-hidden />
              </span>
              <div className="leading-tight">
                <h2 id="gov-title" className="text-[19px] font-extrabold text-ink">{title}</h2>
                <p className="text-[12.5px] text-muted">בדיקה מול הר הביטוח · מאובטח</p>
              </div>
            </div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{subtitle}</p>

            <form onSubmit={submit} className="mt-5 space-y-3" noValidate>
              {/* honeypot — off-screen; real users never fill it, bots do */}
              <div aria-hidden className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="gd-company">Company</label>
                <input id="gd-company" name="company" value={company} onChange={(e) => setCompany(e.target.value)} tabIndex={-1} autoComplete="off" />
              </div>
              <div>
                <label htmlFor="gd-name" className="mb-1 block text-[13px] font-semibold text-ink">שם פרטי ומשפחה</label>
                <input id="gd-name" ref={firstRef} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} placeholder="ישראל ישראלי" />
              </div>

              <div>
                <label htmlFor="gd-id" className="mb-1 block text-[13px] font-semibold text-ink">מספר תעודת זהות</label>
                <input id="gd-id" value={idVal} onChange={(e) => setIdVal(sanitizeId(e.target.value))} inputMode="numeric" pattern="[0-9]*" maxLength={9} autoComplete="off" dir="ltr" aria-invalid={idVal.length >= 5 && !idValid} className={`${field} text-start`} placeholder="9 ספרות" />
                <p className="mt-1 text-[12px] font-semibold" aria-live="polite">
                  {idVal.length < 5 ? <span className="text-faint">לצורך שאילתא בהר הביטוח בשמכם</span> : idValid ? <span className="text-green-700">מספר ת.ז תקין ✓</span> : <span className="text-pc-glow">מספר ת.ז אינו תקין</span>}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="gd-dob" className="mb-1 block text-[13px] font-semibold text-ink">תאריך לידה</label>
                  <input id="gd-dob" type="date" value={dob} max={today} onChange={(e) => setDob(e.target.value)} className={`${field} text-start`} />
                </div>
                <div>
                  <label htmlFor="gd-issue" className="mb-1 block text-[13px] font-semibold text-ink">תאריך הנפקת ת.ז</label>
                  <input id="gd-issue" type="date" value={issueDate} max={today} onChange={(e) => setIssueDate(e.target.value)} className={`${field} text-start`} />
                </div>
              </div>

              <div>
                <label htmlFor="gd-phone" className="mb-1 block text-[13px] font-semibold text-ink">מספר נייד</label>
                <input id="gd-phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" dir="ltr" className={`${field} text-start`} placeholder="050-0000000" />
              </div>

              <ConsentCheckbox id="gov-consent" checked={consent} onChange={setConsent} />

              {error ? <p role="alert" className="text-[13px] font-medium text-pc-glow">{error}</p> : null}

              <button type="submit" disabled={phase === 'submitting' || !consent} className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-cta-fill px-4 py-3.5 text-[16px] font-extrabold text-navy-deep shadow-lg shadow-gold/25 transition-transform duration-150 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright">
                {phase === 'submitting' ? (<><Loader2 className="h-5 w-5 animate-spin" aria-hidden />בודקים…</>) : (<><ShieldCheck className="h-4 w-4" aria-hidden />הפקת הדוח — חינם</>)}
              </button>
              <p className="pt-1 text-center text-[11px] leading-relaxed text-faint">ללא עלות וללא התחייבות · הפרטים מאובטחים ומשמשים לביצוע השאילתא בכפוף לתקנון.</p>
            </form>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto grid h-16 w-16 animate-badge-drop place-items-center rounded-full bg-harel-green/15 text-harel-green">
              <CheckCircle2 className="h-9 w-9" aria-hidden />
            </div>
            <h2 id="gov-title" className="mt-4 text-[21px] font-extrabold text-ink">הנתונים בבדיקה!</h2>
            <p className="mx-auto mt-2 max-w-xs text-[14px] leading-relaxed text-muted">נציג יחזור אליך תוך 2 דקות עם דוח הר הביטוח וההמלצות לחיסכון.</p>
            <div className="mt-5 flex flex-col items-center gap-2">
              <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('click_whatsapp', { topic, context: 'gov_done' })} className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-[14px] font-bold text-white shadow-md">
                המשך בוואטסאפ <ArrowLeft className="h-4 w-4" aria-hidden />
              </a>
              <a href={SITE.phoneHref} className="inline-flex items-center gap-2 rounded-xl bg-cta-fill px-5 py-2.5 text-[14px] font-bold text-navy-deep shadow-md">
                <Phone className="h-4 w-4" aria-hidden />{SITE.phoneCta}
              </a>
              <button type="button" onClick={onClose} className="rounded-xl px-5 py-2 text-[13px] font-semibold text-muted transition-colors hover:text-ink">סגירה</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
