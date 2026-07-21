'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, X, Send, ArrowLeft, Sparkles } from 'lucide-react';
import { trackEvent } from '@/lib/gtm';
import LeadForm from '@/components/LeadForm';

/**
 * Floating "Future AI" assistant — a guided, rule-based advisor (NOT a live
 * LLM): it matches the question to an intent, replies with a curated answer,
 * links to the right calculator/page, and converts to a hot lead via the shared
 * LeadForm. Honest by design — no claim of real-time AI, no fabricated advice.
 */

interface Intent {
  chip?: string;
  keywords: string[];
  answer: string;
  ctaLabel: string;
  ctaHref: string;
}

const INTENTS: Intent[] = [
  {
    chip: 'כמה עולה ביטוח חו״ל?',
    keywords: ['חו״ל', 'חול', 'נסיע', 'טיס', 'טראבל', 'passport', 'ארה', 'אירופ'],
    answer:
      'ביטוח נסיעות מתחיל בכ-₪8–16 ליום לנוסע, תלוי ביעד ובהרחבות (ספורט, מצב רפואי). המחשבון שלנו משווה בין 4 חברות וממליץ על המשתלמת עבורכם תוך שניות.',
    ctaLabel: 'למחשבון ביטוח חו״ל',
    ctaHref: '/travel-insurance#calculator',
  },
  {
    chip: 'רוצה בדיקת כפילויות',
    keywords: ['כפיל', 'הר הביטוח', 'כפל', 'תיק', 'איחוד', 'חופף'],
    answer:
      'רבים משלמים על כיסוי כפול בלי לדעת. נסרוק את הר הביטוח, נזהה חפיפות (למשל אובדן כושר עבודה כפול) ונאחד לתיק אחד חכם — לרוב חיסכון של מאות שקלים בחודש.',
    ctaLabel: 'לסורק הכפילויות',
    ctaHref: '/har-habituach#checker',
  },
  {
    chip: 'איך משיגים עבר ביטוחי?',
    keywords: ['עבר ביטוחי', 'רכב', 'אישור', 'היסטוריה', 'תביעות'],
    answer:
      'אישור עבר ביטוחי לרכב מונפק ב-3 צעדים פשוטים והוא משפיע ישירות על המחיר — עבר נקי מזכה בהנחה משמעותית. נעזור לכם להוציא ולוודא שהוא מדויק.',
    ctaLabel: 'למדריך עבר ביטוחי',
    ctaHref: '/har-habituach#claims',
  },
  {
    keywords: ['פנסי', 'גמל', 'השתלמות', 'חיסכון', 'תשואה', 'דמי ניהול', 'פרישה'],
    answer:
      'ריבית דריבית ודמי ניהול נמוכים הם ההבדל בין חיסכון בינוני להון משמעותי בפרישה. הסימולטור שלנו ממחיש בדיוק כמה תצברו — וכמה עולים לכם דמי הניהול.',
    ctaLabel: 'לסימולטור צמיחת הון',
    ctaHref: '/finance#calculator',
  },
  {
    keywords: ['בריאות', 'ניתוח', 'תרופ', 'השתל', 'מחלה'],
    answer:
      'ביטוח בריאות פרטי מכסה ניתוחים פרטיים, השתלות ותרופות מחוץ לסל. נבנה כיסוי חכם ונבדוק כפילויות מול הביטוחים הקיימים שלכם.',
    ctaLabel: 'לביטוח בריאות',
    ctaHref: '/health#calculator',
  },
  {
    keywords: ['חיים', 'ריסק', 'משפח', 'מוות', 'הגנה'],
    answer:
      'ביטוח חיים מגן על המשפחה כלכלית. המחשבון מתרגם את ההכנסה החודשית הרצויה לסכום כיסוי מומלץ, עם אומדן פרמיה מיידי.',
    ctaLabel: 'למחשבון ביטוח חיים',
    ctaHref: '/life#calculator',
  },
  {
    keywords: ['משכנת', 'בנק', 'דירה', 'מבנה', 'הלווא'],
    answer:
      'ביטוח משכנתא דרך סוכן עצמאי זול בעשרות אחוזים ממחיר הבנק — על אותו כיסוי בדיוק. המחשבון מראה כמה תחסכו, ואנחנו מלווים גם במעבר מהבנק.',
    ctaLabel: 'למחשבון משכנתא',
    ctaHref: '/mortgage#calculator',
  },
];

const CHIPS = INTENTS.filter((i) => i.chip);

const FALLBACK: Omit<Intent, 'keywords'> = {
  answer:
    'שאלה מצוינת! כדי לתת לכם תשובה מדויקת, נשמח שסוכן מורשה יחזור אליכם — בלי עלות ובלי התחייבות. אפשר גם לבחור אחד מהנושאים למעלה.',
  ctaLabel: 'השאירו פרטים — נחזור אליכם',
  ctaHref: '',
};

type Msg = { role: 'bot' | 'user'; text: string; cta?: { label: string; href: string } };

function matchIntent(text: string): Intent | null {
  const t = text.trim();
  if (!t) return null;
  let best: Intent | null = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    const score = intent.keywords.reduce((s, k) => (t.includes(k) ? s + 1 : s), 0);
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }
  return bestScore > 0 ? best : null;
}

export default function AiAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [bubble, setBubble] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // gentle nudge bubble — shows once per session, ~3.5s after load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (sessionStorage.getItem('futureins-ai-bubble')) return;
    } catch {
      /* private mode — just show it */
    }
    const t = setTimeout(() => setBubble(true), 3500);
    return () => clearTimeout(t);
  }, []);

  const dismissBubble = () => {
    setBubble(false);
    try {
      sessionStorage.setItem('futureins-ai-bubble', '1');
    } catch {
      /* ignore */
    }
  };

  // greeting on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: 'bot',
          text: 'היי! אני Future AI, היועץ החכם שלכם 🤖 שאלו אותי כל דבר על ביטוח — או בחרו נושא:',
        },
      ]);
      trackEvent('ai_open', {});
    }
  }, [open, messages.length]);

  // scroll to newest message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Esc closes the panel — but only when the lead form isn't the top layer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (leadOpen) return; // let LeadForm handle its own Esc first
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, leadOpen]);

  const respond = (userText: string, intent: Intent | null) => {
    const answer = intent ?? FALLBACK;
    setMessages((m) => [
      ...m,
      { role: 'user', text: userText },
      {
        role: 'bot',
        text: answer.answer,
        cta: answer.ctaLabel ? { label: answer.ctaLabel, href: answer.ctaHref } : undefined,
      },
    ]);
    trackEvent('ai_message', { intent: intent ? intent.ctaHref : 'fallback' });
  };

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    respond(t, matchIntent(t));
    setInput('');
  };

  return (
    <div className="no-print">
      {/* trigger + nudge bubble */}
      <div className="fixed bottom-36 start-4 z-[55] lg:bottom-24 lg:start-5">
        {!open && bubble ? (
          <div className="absolute bottom-full mb-3 start-0 animate-bubble-in">
            <button
              type="button"
              onClick={() => {
                setOpen(true);
                dismissBubble();
              }}
              className="relative block w-max max-w-[230px] rounded-2xl bg-white px-3.5 py-2.5 text-start text-[13px] font-semibold text-ink shadow-2xl ring-1 ring-navy/10 transition-colors hover:bg-gold-tint"
            >
              💬 צריכים עזרה בבחירת ביטוח?
              <span
                aria-hidden
                className="absolute -bottom-1.5 start-7 h-3 w-3 rotate-45 bg-white ring-1 ring-navy/10"
              />
            </button>
            <button
              type="button"
              onClick={dismissBubble}
              aria-label="סגירת ההודעה"
              className="absolute -top-2 -end-2 grid h-5 w-5 place-items-center rounded-full bg-navy text-white shadow ring-2 ring-white"
            >
              <X className="h-3 w-3" aria-hidden />
            </button>
          </div>
        ) : null}

        <button
          ref={btnRef}
          type="button"
          onClick={() => {
            setOpen((v) => !v);
            dismissBubble();
          }}
          aria-expanded={open}
          aria-label="Future AI — היועץ החכם שלך"
          className="group relative grid h-16 w-16 animate-pulse-glow place-items-center rounded-full bg-gradient-to-br from-[#2a4a8c] via-[#1e3a70] to-navy-deep text-white shadow-2xl ring-2 ring-gold/50 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright"
        >
          <span
            aria-hidden
            className="absolute inset-0 -z-10 rounded-full bg-gold/40 blur-xl animate-orb-pulse"
          />
          <span className="grid h-11 w-11 place-items-center rounded-full bg-cta-fill text-navy-deep shadow-inner">
            <Bot className="h-6 w-6" aria-hidden />
          </span>
          <span
            aria-hidden
            className="absolute -top-0.5 -end-0.5 h-3.5 w-3.5 rounded-full border-2 border-navy-deep bg-harel-green"
          />
        </button>
      </div>

      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="Future AI — היועץ החכם"
          dir="rtl"
          className="glass-elevated fixed bottom-4 start-2 end-2 z-[75] flex max-h-[75vh] flex-col overflow-hidden rounded-glass-lg sm:bottom-24 sm:end-auto sm:start-5 sm:w-[380px]"
        >
          {/* header */}
          <div className="flex items-center justify-between gap-2 border-b border-navy/10 bg-gradient-to-br from-[#1e3a70] to-navy-deep p-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-cta-fill text-navy-deep">
                <Bot className="h-5 w-5" aria-hidden />
              </span>
              <div className="leading-tight">
                <div className="text-[14px] font-extrabold text-white">Future AI</div>
                <div className="text-[11px] text-white/60">היועץ החכם שלך · תמיד זמין</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="סגירה"
              className="grid h-8 w-8 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          {/* messages */}
          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            className="flex-1 space-y-3 overflow-y-auto p-4"
          >
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-start' : 'flex justify-end'}>
                <div
                  className={[
                    'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed',
                    m.role === 'user'
                      ? 'bg-cta-fill font-semibold text-navy-deep'
                      : 'bg-navy/[0.05] text-ink',
                  ].join(' ')}
                >
                  {m.text}
                  {m.cta ? (
                    m.cta.href ? (
                      <a
                        href={m.cta.href}
                        onClick={() => setOpen(false)}
                        className="mt-2 inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-[12.5px] font-bold text-navy-deep shadow-sm ring-1 ring-navy/10 transition-colors hover:bg-gold-tint"
                      >
                        {m.cta.label}
                        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setLeadOpen(true)}
                        className="mt-2 inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-[12.5px] font-bold text-navy-deep shadow-sm ring-1 ring-navy/10 transition-colors hover:bg-gold-tint"
                      >
                        {m.cta.label}
                        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    )
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/* quick chips */}
          <div className="hide-scroll flex gap-2 overflow-x-auto border-t border-navy/10 px-3 py-2">
            {CHIPS.map((c) => (
              <button
                key={c.chip}
                type="button"
                onClick={() => respond(c.chip as string, c)}
                className="shrink-0 rounded-full border border-navy/10 bg-white px-3 py-1.5 text-[12px] font-semibold text-ink transition-colors hover:bg-gold-tint hover:text-gold-deep"
              >
                {c.chip}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setLeadOpen(true)}
              className="shrink-0 rounded-full bg-cta-fill px-3 py-1.5 text-[12px] font-bold text-navy-deep"
            >
              <Sparkles className="me-1 inline h-3 w-3" aria-hidden />
              דברו עם מומחה
            </button>
          </div>

          {/* input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-navy/10 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="שאלו את Future AI"
              placeholder="כתבו שאלה…"
              className="glass-chip w-full rounded-xl px-3 py-2.5 text-[14px] text-ink placeholder:text-faint focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            />
            <button
              type="submit"
              aria-label="שליחה"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cta-fill text-navy-deep shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <Send className="h-4 w-4 -scale-x-100" aria-hidden />
            </button>
          </form>
        </div>
      ) : null}

      {leadOpen ? (
        <LeadForm
          open
          onClose={() => setLeadOpen(false)}
          vertical="ai_assistant"
          title="נשמח לחזור אליכם"
          subtitle="סוכן מורשה יענה על כל שאלה ויתאים לכם את הביטוח הנכון — בלי עלות."
        />
      ) : null}
    </div>
  );
}
