# Future Insurance — Project Status

**Last checkpoint:** 22 July 2026
**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · RTL Hebrew · Light-Luxury Fintech design system
**Build:** ✅ `npx next build` green — 31 routes, 0 type errors, 0px horizontal overflow (verified desktop + mobile).

---

## ✅ Completed today

### Sub-category routing & branded pages (8 new routes)
- Travel carrier pages via one dynamic route `/travel-insurance/[provider]` → **PassportCard, Harel, Clal, Migdal** (brand-accented hero + brand card + features + FAQ; purchase via `/api/go/{slug}`).
- **`/har-habituach/car-claims`** — "אישור עבר ביטוחי לרכב ב-3 דקות" (3-step guide + car-history hero card).
- **`/har-habituach/duplicate-check`** — "בדיקת כפל ביטוח והוזלה" (reuses the PolicyChecker scanner).
- **`/mortgage/structure`** — "ביטוח מבנה ודירה למשכנתא".
- **`/business-insurance`** — new "ביטוח לעסק" vertical with a "מגן עסקי 360°" shield card.
- **MegaMenu** (`components/MegaMenu.tsx`): CSS hover/focus dropdowns in the header for חו״ל / הר הביטוח / משכנתא; `עסק` added to nav + footer.

### Form UX, Israeli-ID validation & legal compliance
- **`lib/israeli-id.ts`** — official Teudat-Zehut check-digit algorithm (rejects all-zeros); wired into `LeadForm` with `inputMode="numeric"`, `pattern="[0-9]*"`, `maxLength={9}` (mobile numeric keypad) + live "מספר ת.ז תקין ✓" feedback (ID field enabled on the Har-Habituach flow).
- **`components/ConsentCheckbox.tsx`** — mandatory consent (Har-Habituach query in the user's name + third-party sharing + WhatsApp/phone marketing), links to `/terms`; **submit disabled until checked** — now on all lead forms.
- **`/terms`** (`app/terms/page.tsx`) — Hebrew ToS **DRAFT TEMPLATE** (banner: "טיוטה לבדיקה משפטית") covering: הרשאה לשאילתא בהר הביטוח · מסירת מידע לצד ג׳ · חוק התקשורת/דיוור · פטור מאחריות. Linked from footer.
- **Har-Habituach legal disclaimer** (`components/HarDisclaimer.tsx`) — anti-impersonation banner ("private licensed agency, NOT the official har.mof.gov.il"), auto-shows above the footer on `/har-habituach` + all sub-routes.
- Removed stale "won't share data with 3rd party" claims (FeatureBadges + LeadModal) that contradicted the new consent.

### Dynamic floating action dock
- **`components/QuickActionDock.tsx`** — route-aware branded dock (gold "מהיר ⚡" header) with real brand badges: PassportCard/Harel/Clal/Migdal on travel, 🔍 duplicate-check + 🚗 car-claims on har, bank-compare + structure on mortgage, tracks on finance, business on business, WhatsApp/call elsewhere; hover/focus tooltips. (Travel main page keeps its own `SideActionDock`.)

### Homepage hero visual overhaul
- **`components/HeroControlCenter.tsx`** — "כרטיס הפינטק הדיגיטלי": glass pass with an animated gold **scan line**, a metallic **live-savings counter** (₪3,840), an interactive **tab selector** (הר הביטוח/פנסיה/משכנתא/חו״ל), and 3 **floating peripheral badges**.
- `HomeHero`: shimmer gold↔navy headline highlight; "🚀 טכנולוגיית הביטוח המתקדמת בישראל 2026" pill; live quick-quote launchpad; trust tags.

### Header "אזור אישי" secure button
- **`components/ClientPortalButton.tsx` + `ClientPortalModal.tsx`** — navy button (`#142B55` + gold border) with a glowing gold lock, placed exactly next to "ייעוץ חינם". Opens an honest secure-access modal (phone + consent → agent provisions access; **no fake password login**).

---

## 🔜 Next steps for tomorrow
- Review overall visual polish across mobile and desktop (esp. the new sub-routes at 360–414px).
- Fine-tune lead-form **backend integrations** (real submission endpoint / CRM, WhatsApp handoff, GTM `generate_lead`).
- Fold in the pending adversarial review of `HeroControlCenter` (a workflow was running at checkpoint) + any contrast/RTL nits.
- (Deferred) Real `<video>` embeds for the "Watch the Expert" blocks; wire a real Client Portal auth/OTP.

---

## ⚠️ Pre-launch checklist (must-do before go-live)
- **`/terms` is a DRAFT** — have a licensed Israeli attorney review/approve (Privacy Law, Communications/Spam Law, רשות שוק ההון).
- **Replace all illustrative data** (labelled "נתוני המחשה"): SocialProofToast customer stories, market ticker figures, insurer/track returns, and hero counters — with real, consented content. Presenting fabricated live activity as genuine is a consumer-protection risk.
- Confirm real affiliate URLs in `.env.local` (git-ignored) are current.
- Replace placeholder video CTAs with real explainer videos.

---

## Key conventions
- Design tokens (`tailwind.config.ts`): navy `#142B55`, gold `#D4A24A`, **gold-deep `#8A6220`** & **faint `#5B6885`** (AA-tuned), ink `#142B55`, muted `#4E5D7A`.
- Every hero uses `PageHero` (light travel-style) except the homepage (`HomeHero`) and travel main hub.
- Verify UI via Chrome DevTools Protocol (Node global `WebSocket`); **never run `npx next build` while the dev server is live** (clobbers `.next` — restart + `rm -rf .next` after).
- Dev: `nohup env HOST=127.0.0.1 npx next dev >/tmp/nextdevN.log 2>&1 & disown`.
