'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { X, ShieldCheck, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import type { Provider } from '@/lib/providers';
import { trackEvent } from '@/lib/gtm';
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock';

interface LeadModalContextValue {
  open: (provider: Provider) => void;
}

const LeadModalContext = createContext<LeadModalContextValue | null>(null);

export function useLeadModal(): LeadModalContextValue {
  const ctx = useContext(LeadModalContext);
  if (!ctx) throw new Error('useLeadModal must be used within <LeadModalProvider>');
  return ctx;
}

/**
 * Provider CTA that routes correctly per provider: a `directAffiliate` provider
 * (PassportCard / Harel) renders an <a> that redirects straight to its affiliate
 * portal (fires GTM, opens in a new tab, rel=sponsored); every other provider
 * renders a <button> that opens the 1-step lead-capture modal. Consumers just
 * pass the visual className/children — the routing is decided here once.
 */
export function ProviderAction({
  provider,
  className,
  style,
  position = 'cta',
  'aria-label': ariaLabel,
  children,
}: {
  provider: Provider;
  className?: string;
  style?: CSSProperties;
  position?: string;
  'aria-label'?: string;
  children: ReactNode;
}) {
  const { open } = useLeadModal();

  if (provider.directAffiliate) {
    return (
      <a
        href={provider.href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() =>
          provider.gtmEvent &&
          trackEvent(provider.gtmEvent, { provider: provider.id, position })
        }
        className={className}
        style={style}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => open(provider)}
      className={className}
      style={style}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

type Phase = 'form' | 'submitting' | 'done';

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [phase, setPhase] = useState<Phase>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const submitTimer = useRef<number | null>(null);

  const isOpen = provider !== null;

  const open = useCallback((p: Provider) => {
    lastFocused.current = document.activeElement as HTMLElement;
    setProvider(p);
    setPhase('form');
    setName('');
    setPhone('');
    setError(null);
    // fire the provider's click event as soon as intent is shown
    if (p.gtmEvent) trackEvent(p.gtmEvent, { provider: p.id, position: 'lead_modal_open' });
  }, []);

  const close = useCallback(() => {
    if (submitTimer.current) {
      window.clearTimeout(submitTimer.current);
      submitTimer.current = null;
    }
    setProvider(null);
    lastFocused.current?.focus?.();
  }, []);

  // Esc to close, Tab focus-trap, body scroll lock, initial focus.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => nameRef.current?.focus(), 60);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
    };
  }, [isOpen, close]);

  useBodyScrollLock(isOpen);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider) return;
    // Israeli mobile: 05X + 8 digits. Strip any dash/space grouping first, so
    // 0528422884, 052-8422884 and 052-842-2884 are all accepted.
    const normalized = phone.trim().replace(/[\s-]/g, '');
    if (name.trim().length < 2) {
      setError('נא להזין שם מלא');
      return;
    }
    if (!/^05\d{8}$/.test(normalized)) {
      setError('נא להזין מספר נייד תקין (05X-XXXXXXX)');
      return;
    }
    setError(null);
    setPhase('submitting');

    trackEvent('generate_lead', {
      provider: provider.id,
      position: 'lead_modal',
    });

    // Open the provider portal synchronously — inside the click gesture — so
    // popup blockers don't suppress it; sever the opener for security.
    const win = window.open(provider.href, '_blank');
    if (win) win.opener = null;

    // Only the visual "done" transition is deferred; cleared if user cancels.
    submitTimer.current = window.setTimeout(() => {
      submitTimer.current = null;
      setPhase('done');
    }, 700);
  };

  return (
    <LeadModalContext.Provider value={{ open }}>
      {children}

      {isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-modal-title"
        >
          {/* backdrop */}
          <button
            type="button"
            aria-label="סגירה"
            onClick={close}
            className="fixed inset-0 bg-navy-deep/45 backdrop-blur-sm"
          />

          <div
            ref={dialogRef}
            className="glass-elevated relative my-auto max-h-[90vh] w-full max-w-md animate-toast-in overflow-y-auto rounded-glass-lg p-6 sm:p-7"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-recommend-highlight" />

            <button
              type="button"
              onClick={close}
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
                  id="lead-modal-title"
                  className="mt-2 text-[22px] font-extrabold leading-tight text-ink"
                >
                  קבלו הצעה מ{provider!.name}
                </h2>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
                  משאירים פרטים ונציג יחזור אליכם עם ההצעה המשתלמת — או שנעביר אתכם ישירות לפורטל המאובטח של החברה.
                </p>

                <form onSubmit={handleSubmit} className="mt-5 space-y-3" noValidate>
                  <div>
                    <label htmlFor="lead-name" className="mb-1 block text-[13px] font-semibold text-ink">
                      שם מלא
                    </label>
                    <input
                      id="lead-name"
                      ref={nameRef}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      className="glass-chip w-full px-4 py-3 text-[15px] text-ink placeholder:text-faint focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      placeholder="ישראל ישראלי"
                    />
                  </div>
                  <div>
                    <label htmlFor="lead-phone" className="mb-1 block text-[13px] font-semibold text-ink">
                      טלפון
                    </label>
                    <input
                      id="lead-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputMode="tel"
                      autoComplete="tel"
                      dir="ltr"
                      className="glass-chip w-full px-4 py-3 text-start text-[15px] text-ink placeholder:text-faint focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      placeholder="050-0000000"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="text-[13px] font-medium text-pc-glow">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={phase === 'submitting'}
                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-cta-fill px-4 py-3.5 text-[16px] font-bold text-navy-deep shadow-lg shadow-gold/20 transition-transform duration-150 hover:-translate-y-0.5 disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright"
                  >
                    {phase === 'submitting' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                        שולח…
                      </>
                    ) : (
                      <>
                        לקבלת ההצעה
                        <ArrowLeft className="h-4 w-4" aria-hidden />
                      </>
                    )}
                  </button>

                  <p className="pt-1 text-center text-[11px] leading-relaxed text-faint">
                    בשליחה אני מאשר/ת קבלת הצעה ופנייה שיווקית. הפרטים מאובטחים ומשמשים למתן השירות בכפוף לתקנון.
                  </p>
                </form>
              </>
            ) : (
              <div className="py-4 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-harel-green/15 text-harel-green">
                  <CheckCircle2 className="h-7 w-7" aria-hidden />
                </div>
                <h2 id="lead-modal-title" className="mt-4 text-[20px] font-extrabold text-ink">
                  קיבלנו את הפרטים!
                </h2>
                <p className="mx-auto mt-2 max-w-xs text-[14px] leading-relaxed text-muted">
                  פתחנו עבורכם את הפורטל המאובטח של {provider!.name} בכרטיסייה חדשה. נציג שלנו יחזור אליכם בהקדם.
                </p>
                <div className="mt-5 flex flex-col items-center gap-2">
                  {/* Fallback in case the popup was blocked. */}
                  <a
                    href={provider!.href}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="rounded-xl bg-cta-fill px-5 py-2.5 text-[14px] font-bold text-navy-deep shadow-md shadow-gold/20"
                  >
                    למעבר לפורטל {provider!.name}
                  </a>
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-xl px-5 py-2 text-[13px] font-semibold text-muted transition-colors hover:text-ink"
                  >
                    סגירה
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </LeadModalContext.Provider>
  );
}
