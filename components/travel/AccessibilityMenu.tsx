'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Accessibility,
  X,
  ZoomIn,
  ZoomOut,
  Contrast,
  Moon,
  Droplet,
  Link as LinkIcon,
  Type,
  Pause,
  MousePointer2,
  RotateCcw,
  type LucideIcon,
} from 'lucide-react';

interface Settings {
  fontStep: number; // 0..3
  contrast: boolean;
  negative: boolean;
  grayscale: boolean;
  links: boolean;
  readable: boolean;
  noAnim: boolean;
  bigCursor: boolean;
}

const DEFAULTS: Settings = {
  fontStep: 0,
  contrast: false,
  negative: false,
  grayscale: false,
  links: false,
  readable: false,
  noAnim: false,
  bigCursor: false,
};

const ZOOMS = ['1', '1.1', '1.25', '1.4'];
const STORAGE_KEY = 'futureins-a11y';

function apply(s: Settings) {
  if (typeof document === 'undefined') return;
  const content = document.getElementById('a11y-content');
  // Font zoom on the whole document (behaves like browser zoom).
  document.documentElement.style.zoom = ZOOMS[s.fontStep] ?? '1';
  if (!content) return;

  const filters: string[] = [];
  if (s.contrast) filters.push('contrast(1.35)');
  if (s.negative) filters.push('invert(1) hue-rotate(180deg)');
  if (s.grayscale) filters.push('grayscale(1)');
  content.style.filter = filters.join(' ');

  content.classList.toggle('a11y-links', s.links);
  content.classList.toggle('a11y-readable', s.readable);
  content.classList.toggle('a11y-noanim', s.noAnim);
  content.classList.toggle('a11y-bigcursor', s.bigCursor);
}

export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState<Settings>(DEFAULTS);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Load persisted settings once, on the client.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = { ...DEFAULTS, ...JSON.parse(raw) } as Settings;
        setS(parsed);
        apply(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setS((prev) => {
      const next = { ...prev, ...patch };
      apply(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setS(DEFAULTS);
    apply(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // Esc closes; focus the panel when it opens.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => panelRef.current?.focus(), 40);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
    };
  }, [open]);

  return (
    <div className="no-print">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={open ? 'a11y-panel' : undefined}
        aria-label="תפריט נגישות"
        className="fixed bottom-20 start-4 z-[70] grid h-[52px] w-[52px] place-items-center rounded-full bg-cta-fill text-navy-deep shadow-xl shadow-navy/25 ring-2 ring-white/60 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep lg:bottom-24 lg:start-5"
      >
        <Accessibility className="h-6 w-6" aria-hidden />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="סגירת תפריט נגישות"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] bg-black/40 lg:hidden"
          />
          <div
            id="a11y-panel"
            ref={panelRef}
            tabIndex={-1}
            role="region"
            aria-label="הגדרות נגישות"
            className="glass-elevated fixed bottom-20 start-4 z-[71] max-h-[70vh] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto p-4 outline-none lg:bottom-24 lg:start-5"
            dir="rtl"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Accessibility className="h-5 w-5 text-gold" aria-hidden />
                <h2 className="text-[16px] font-extrabold text-ink">תפריט נגישות</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="סגירה"
                className="grid h-8 w-8 place-items-center rounded-full bg-navy/[0.05] text-muted hover:bg-navy/10 hover:text-ink"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            {/* font size */}
            <div className="glass-chip mb-3 flex items-center justify-between p-2">
              <span className="ps-1 text-[13px] font-semibold text-ink">גודל טקסט</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="הקטנת טקסט"
                  onClick={() => update({ fontStep: Math.max(0, s.fontStep - 1) })}
                  disabled={s.fontStep <= 0}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-navy/[0.06] text-ink hover:bg-navy/10 disabled:opacity-40"
                >
                  <ZoomOut className="h-4 w-4" aria-hidden />
                </button>
                <span className="num w-5 text-center text-[13px] font-bold text-gold-deep">
                  {s.fontStep}
                </span>
                <button
                  type="button"
                  aria-label="הגדלת טקסט"
                  onClick={() => update({ fontStep: Math.min(3, s.fontStep + 1) })}
                  disabled={s.fontStep >= 3}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-navy/[0.06] text-ink hover:bg-navy/10 disabled:opacity-40"
                >
                  <ZoomIn className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>

            {/* toggles */}
            <div className="grid grid-cols-2 gap-2">
              <Toggle icon={Contrast} label="ניגודיות גבוהה" on={s.contrast} onClick={() => update({ contrast: !s.contrast })} />
              <Toggle icon={Moon} label="ניגודיות הפוכה" on={s.negative} onClick={() => update({ negative: !s.negative })} />
              <Toggle icon={Droplet} label="גווני אפור" on={s.grayscale} onClick={() => update({ grayscale: !s.grayscale })} />
              <Toggle icon={LinkIcon} label="הדגשת קישורים" on={s.links} onClick={() => update({ links: !s.links })} />
              <Toggle icon={Type} label="גופן קריא" on={s.readable} onClick={() => update({ readable: !s.readable })} />
              <Toggle icon={Pause} label="עצירת אנימציות" on={s.noAnim} onClick={() => update({ noAnim: !s.noAnim })} />
              <Toggle icon={MousePointer2} label="סמן גדול" on={s.bigCursor} onClick={() => update({ bigCursor: !s.bigCursor })} />
              <button
                type="button"
                onClick={reset}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-navy/10 bg-navy/[0.03] p-3 text-center text-[12px] font-semibold text-muted transition-colors hover:bg-navy/[0.06] hover:text-ink"
              >
                <RotateCcw className="h-5 w-5" aria-hidden />
                איפוס
              </button>
            </div>

            <a
              href="/accessibility"
              className="mt-3 block rounded-lg py-2 text-center text-[12px] font-semibold text-gold-deep underline underline-offset-2 hover:text-gold"
            >
              הצהרת נגישות
            </a>
          </div>
        </>
      )}
    </div>
  );
}

function Toggle({
  icon: Icon,
  label,
  on,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={[
        'flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-center text-[12px] font-semibold transition-colors',
        on
          ? 'border-gold/60 bg-gold-tint text-gold-deep'
          : 'border-navy/10 bg-navy/[0.03] text-muted hover:bg-navy/[0.06] hover:text-ink',
      ].join(' ')}
    >
      <Icon className="h-5 w-5" aria-hidden />
      {label}
    </button>
  );
}
