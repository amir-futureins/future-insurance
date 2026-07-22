'use client';

import { useEffect, useRef, useState } from 'react';
import { X, ShieldCheck, Loader2, CheckCircle2, ArrowLeft, Phone } from 'lucide-react';
import { trackEvent } from '@/lib/gtm';
import { WHATSAPP, SITE } from '@/lib/content';
import ConsentCheckbox from '@/components/ConsentCheckbox';
import { isValidIsraeliId, sanitizeId } from '@/lib/israeli-id';
import { submitLead } from '@/lib/submit-lead';

export interface LeadFormExtraField {
  label: string;
  name: string;
  options: string[];
}

type Phase = 'form' | 'submitting' | 'done';

/**
 * Generic, controlled lead-capture modal shared by the agency verticals.
 * Name + Israeli-mobile phone (+ optional dropdown, e.g. current insurer),
 * client-side validation, GTM generate_lead, then a success step that hands off
 * to WhatsApp / click-to-call. Focus-trapped, Esc-closable, scroll-locked.
 */
export default function LeadForm({
  open,
  onClose,
  vertical,
  title,
  subtitle,
  summary,
  extraField,
  idField = false,
}: {
  open: boolean;
  onClose: () => void;
  vertical: string;
  title: string;
  subtitle?: string;
  /** short recap of the calculator result, e.g. "כיסוי מומלץ ₪2M · ~₪96/חודש". */
  summary?: string;
  extraField?: LeadFormExtraField;
  /** show a validated Israeli-ID field (needed where we query in the user's name). */
  idField?: boolean;
}) {
  const [phase, setPhase] = useState<Phase>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [extra, setExtra] = useState('');
  const [idValue, setIdValue] = useState('');
  const [company, setCompany] = useState(''); // honeypot — stays empty for humans
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const submitTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement;
    setPhase('form');
    setName('');
    setPhone('');
    setExtra('');
    setIdValue('');
    setConsent(false);
    setError(null);
    trackEvent('lead_open', { vertical });
  }, [open, vertical]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        // If focus has escaped the dialog (e.g. dropped to <body> after the
        // form unmounted on the success step), pull it back in.
        if (!dialogRef.current.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
          return;
        }
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => nameRef.current?.focus(), 60);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
      if (submitTimer.current) window.clearTimeout(submitTimer.current);
      lastFocused.current?.focus?.();
    };
  }, [open, onClose]);

  // Keep focus inside the dialog when the form unmounts on the success step.
  useEffect(() => {
    if (open && phase === 'done') doneRef.current?.focus();
  }, [open, phase]);

  if (!open) return null;

  const waMsg = `היי אמיר, השארתי פרטים לגבי ${title} ואשמח להצעה.`;
  const waHref = `https://wa.me/${WHATSAPP.phone}?text=${encodeURIComponent(waMsg)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = phone.trim().replace(/[\s-]/g, '');
    if (name.trim().length < 2) {
      setError('נא להזין שם מלא');
      return;
    }
    if (!/^05\d{8}$/.test(normalized)) {
      setError('נא להזין מספר נייד תקין (05X-XXXXXXX)');
      return;
    }
    if (idField && !isValidIsraeliId(idValue)) {
      setError('נא להזין מספר תעודת זהות תקין (9 ספרות)');
      return;
    }
    if (!consent) {
      setError('יש לאשר את התקנון ומדיניות הפרטיות כדי להמשיך');
      return;
    }
    setError(null);
    setPhase('submitting');
    trackEvent('generate_lead', {
      vertical,
      ...(extraField ? { [extraField.name]: extra || 'לא צוין' } : {}),
    });
    // POST to the unified intake. Validation (422) / rate-limit (429) are shown
    // to the user; a transient network/5xx blip falls through to the success step
    // (the WhatsApp/call handoff is the real conversion, never block it).
    const payload = {
      name: name.trim(),
      phone: normalized,
      id: idField ? idValue : undefined,
      topic: vertical,
      consent,
      idRequired: idField,
      company, // honeypot
      ...(extraField ? { [extraField.name]: extra || undefined } : {}),
    };
    // Keep the "submitting" state smooth (min ~650ms) regardless of network speed.
    const minDelay = new Promise<void>((resolve) => {
      submitTimer.current = window.setTimeout(resolve, 650);
    });
    Promise.all([submitLead(payload), minDelay]).then(([result]) => {
      if (result.ok || result.kind === 'network') {
        setPhase('done');
      } else {
        setError(result.message);
        setPhase('form');
      }
    });
  };

  const field =
    'glass-chip w-full rounded-xl px-4 py-3 text-[15px] text-ink placeholder:text-faint focus:outline-none focus-visible:ring-2 focus-visible:ring-gold';

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leadform-title"
    >
      <button
        type="button"
        aria-label="סגירה"
        onClick={onClose}
        className="absolute inset-0 bg-navy-deep/45 backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        className="glass-elevated relative w-full max-w-md animate-toast-in overflow-hidden rounded-b-none rounded-t-glass-lg p-6 sm:rounded-glass-lg sm:p-7"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-recommend-highlight" />
        <button
          type="button"
          onClick={onClose}
          aria-label="סגירה"
          className="absolute end-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-navy/[0.05] text-muted transition-colors hover:bg-navy/10 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>

        {phase !== 'done' ? (
          <>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold" aria-hidden />
              <span className="eyebrow text-[13px]">קבלת הצעה</span>
            </div>
            <h2
              id="leadform-title"
              className="mt-2 text-[22px] font-extrabold leading-tight text-ink"
            >
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{subtitle}</p>
            ) : null}
            {summary ? (
              <div className="mt-3 rounded-xl bg-gold-tint px-3 py-2 text-[13px] font-bold text-navy ring-1 ring-gold/25">
                {summary}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-5 space-y-3" noValidate>
              {/* honeypot — off-screen; real users never fill it, bots do */}
              <div aria-hidden className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="lf-company">Company</label>
                <input
                  id="lf-company"
                  name="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <div>
                <label htmlFor="lf-name" className="mb-1 block text-[13px] font-semibold text-ink">
                  שם מלא
                </label>
                <input
                  id="lf-name"
                  ref={nameRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className={field}
                  placeholder="ישראל ישראלי"
                />
              </div>
              <div>
                <label htmlFor="lf-phone" className="mb-1 block text-[13px] font-semibold text-ink">
                  טלפון נייד
                </label>
                <input
                  id="lf-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  autoComplete="tel"
                  dir="ltr"
                  className={`${field} text-start`}
                  placeholder="050-0000000"
                />
              </div>
              {idField ? (
                <div>
                  <label htmlFor="lf-id" className="mb-1 block text-[13px] font-semibold text-ink">
                    מספר תעודת זהות
                  </label>
                  <input
                    id="lf-id"
                    value={idValue}
                    onChange={(e) => setIdValue(sanitizeId(e.target.value))}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={9}
                    autoComplete="off"
                    dir="ltr"
                    aria-invalid={idValue.length >= 5 && !isValidIsraeliId(idValue)}
                    aria-describedby="lf-id-hint"
                    className={`${field} text-start`}
                    placeholder="9 ספרות"
                  />
                  <p id="lf-id-hint" className="mt-1 text-[12px] font-semibold" aria-live="polite">
                    {idValue.length < 5 ? (
                      <span className="text-faint">לצורך שאילתא בהר הביטוח בשמכם</span>
                    ) : isValidIsraeliId(idValue) ? (
                      <span className="text-green-700">מספר ת.ז תקין ✓</span>
                    ) : (
                      <span className="text-pc-glow">מספר ת.ז אינו תקין</span>
                    )}
                  </p>
                </div>
              ) : null}
              {extraField ? (
                <div>
                  <label
                    htmlFor="lf-extra"
                    className="mb-1 block text-[13px] font-semibold text-ink"
                  >
                    {extraField.label}
                  </label>
                  <select
                    id="lf-extra"
                    value={extra}
                    onChange={(e) => setExtra(e.target.value)}
                    className={field}
                  >
                    <option value="">בחרו…</option>
                    {extraField.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <ConsentCheckbox checked={consent} onChange={setConsent} />

              {error ? (
                <p role="alert" className="text-[13px] font-medium text-pc-glow">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={phase === 'submitting' || !consent}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-cta-fill px-4 py-3.5 text-[16px] font-extrabold text-navy-deep shadow-lg shadow-gold/25 transition-transform duration-150 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright"
              >
                {phase === 'submitting' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    שולח…
                  </>
                ) : (
                  <>
                    שלחו — נחזור אליכם
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                  </>
                )}
              </button>
              <p className="pt-1 text-center text-[11px] leading-relaxed text-faint">
                השירות ניתן ללא עלות וללא התחייבות. הפרטים מאובטחים ומשמשים למתן השירות בכפוף לתקנון.
              </p>
            </form>
          </>
        ) : (
          <div ref={doneRef} tabIndex={-1} className="py-4 text-center outline-none">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-harel-green/15 text-harel-green">
              <CheckCircle2 className="h-7 w-7" aria-hidden />
            </div>
            <h2 id="leadform-title" className="mt-4 text-[20px] font-extrabold text-ink">
              קיבלנו את הפרטים!
            </h2>
            <p className="mx-auto mt-2 max-w-xs text-[14px] leading-relaxed text-muted">
              סוכן מורשה יחזור אליכם בהקדם עם הצעה מותאמת. מעדיפים כאן ועכשיו?
            </p>
            <div className="mt-5 flex flex-col items-center gap-2">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('click_whatsapp', { vertical, context: 'lead_done' })}
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-[14px] font-bold text-white shadow-md"
              >
                המשך בוואטסאפ
              </a>
              <a
                href={SITE.phoneHref}
                onClick={() => trackEvent('click_call', { vertical, context: 'lead_done' })}
                className="inline-flex items-center gap-2 rounded-xl bg-cta-fill px-5 py-2.5 text-[14px] font-bold text-navy-deep shadow-md"
              >
                <Phone className="h-4 w-4" aria-hidden />
                {SITE.phoneCta}
              </a>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-5 py-2 text-[13px] font-semibold text-muted transition-colors hover:text-ink"
              >
                סגירה
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
