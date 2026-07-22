'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Lock, ArrowLeft, Loader2, CheckCircle2, Phone } from 'lucide-react';
import { whatsappHref, SITE } from '@/lib/content';
import { submitLead } from '@/lib/submit-lead';
import ConsentCheckbox from '@/components/ConsentCheckbox';

/**
 * Secure "אזור אישי" (client portal) entry modal. The personal area is still in
 * setup, so rather than fake a password login, this requests secure access with
 * the customer's mobile number (phone-based auth is the modern secure pattern) —
 * a licensed agent then provisions access. Honest by design: no credential
 * harvesting, no "link sent" claim for a link that isn't wired yet.
 */
type Phase = 'form' | 'sending' | 'sent';

export default function ClientPortalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>('form');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setPhase('form');
    setPhone('');
    setConsent(false);
    setError(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (!dialogRef.current.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      window.clearTimeout(t);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [open, onClose]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = phone.trim().replace(/[\s-]/g, '');
    if (!/^05\d{8}$/.test(p)) {
      setError('נא להזין מספר נייד תקין (05X-XXXXXXX)');
      return;
    }
    if (!consent) {
      setError('יש לאשר את התקנון ומדיניות הפרטיות כדי להמשיך');
      return;
    }
    setError(null);
    setPhase('sending');
    const minDelay = new Promise<void>((r) => { timer.current = window.setTimeout(r, 700); });
    Promise.all([
      submitLead({ name: 'בקשת אזור אישי', phone: p, topic: 'client_portal', consent }),
      minDelay,
    ]).then(([result]) => {
      if (result.ok || result.kind === 'network') {
        setPhase('sent');
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
      className="fixed inset-0 z-[85] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="portal-title"
    >
      <button type="button" aria-label="סגירה" onClick={onClose} className="absolute inset-0 bg-navy-deep/45 backdrop-blur-sm" />
      <div
        ref={dialogRef}
        className="glass-elevated relative w-full max-w-sm animate-toast-in overflow-hidden rounded-b-none rounded-t-glass-lg p-6 sm:rounded-glass-lg"
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

        {phase !== 'sent' ? (
          <>
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy text-amber-400 ring-1 ring-gold/30">
                <Lock className="h-5 w-5 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" aria-hidden />
              </span>
              <div className="leading-tight">
                <h2 id="portal-title" className="text-[19px] font-extrabold text-ink">
                  כניסה לאזור האישי
                </h2>
                <p className="text-[12.5px] text-muted">התחברות מאובטחת עם מספר הנייד</p>
              </div>
            </div>

            <form onSubmit={submit} className="mt-5 space-y-3" noValidate>
              <div>
                <label htmlFor="portal-phone" className="mb-1 block text-[13px] font-semibold text-ink">
                  מספר נייד
                </label>
                <input
                  id="portal-phone"
                  ref={inputRef}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  autoComplete="tel"
                  dir="ltr"
                  className={`${field} text-start`}
                  placeholder="050-0000000"
                />
              </div>

              <ConsentCheckbox id="portal-consent" checked={consent} onChange={setConsent} />

              {error ? (
                <p role="alert" className="text-[13px] font-medium text-pc-glow">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={phase === 'sending' || !consent}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cta-fill px-4 py-3.5 text-[16px] font-extrabold text-navy-deep shadow-lg shadow-gold/25 transition-transform duration-150 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright"
              >
                {phase === 'sending' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    מתחברים…
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" aria-hidden />
                    כניסה מאובטחת
                  </>
                )}
              </button>
              <p className="pt-1 text-center text-[11px] leading-relaxed text-faint">
                האזור האישי בהשקה. נאמת את זהותכם וניצור קשר עם גישה מאובטחת — ללא שמירת סיסמאות.
              </p>
            </form>
          </>
        ) : (
          <div className="py-4 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-harel-green/15 text-harel-green">
              <CheckCircle2 className="h-7 w-7" aria-hidden />
            </div>
            <h2 id="portal-title" className="mt-4 text-[20px] font-extrabold text-ink">
              קיבלנו את הבקשה!
            </h2>
            <p className="mx-auto mt-2 max-w-xs text-[14px] leading-relaxed text-muted">
              האזור האישי בהשקה — סוכן מורשה יחזור אליכם ויסדיר גישה מאובטחת לתיק הביטוח שלכם.
            </p>
            <div className="mt-5 flex flex-col items-center gap-2">
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-[14px] font-bold text-white shadow-md"
              >
                המשך בוואטסאפ
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </a>
              <a href={SITE.phoneHref} className="inline-flex items-center gap-2 rounded-xl bg-cta-fill px-5 py-2.5 text-[14px] font-bold text-navy-deep shadow-md">
                <Phone className="h-4 w-4" aria-hidden />
                {SITE.phoneCta}
              </a>
              <button type="button" onClick={onClose} className="rounded-xl px-5 py-2 text-[13px] font-semibold text-muted transition-colors hover:text-ink">
                סגירה
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
