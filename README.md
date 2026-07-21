# Future Insurance — Travel Insurance Hub

High-end, fintech-style **travel insurance hub** for futureins.co.il. Hebrew UI,
full RTL, glassmorphism ("Aurora Trust" design system), an interactive
recommendation calculator, a branded provider comparison, and deep GTM
conversion tracking — built for Google PageSpeed 100 & clean SEO.

## Stack

Next.js 14 (App Router) · React 18 · TypeScript (strict) · Tailwind CSS 3 ·
Lucide React · self-hosted **Assistant** font via `next/font`.

## Run

```bash
npm install
cp .env.example .env.local   # optional: GTM id + WhatsApp number
npm run dev                  # http://localhost:3000  -> redirects to /travel-insurance
npm run build && npm start   # production
```

## Structure

```
app/
  layout.tsx                 RTL <html lang=he dir=rtl>, Assistant font, GTM container
  page.tsx                   redirects "/" -> /travel-insurance
  globals.css                Aurora Trust primitives: glass, RTL slider, print, reduced-motion
  travel-insurance/
    page.tsx                 SEO metadata + JSON-LD (WebPage + FAQPage) + section composition
    opengraph-image.tsx      build-time branded 1200×630 social card (next/og)
components/travel/            Hub, Calculator, RecommendationRail, ProviderCard/Grid,
                             BoardingPass, Sections, WhatsAppFloat, ui (Reveal/CountUp)
lib/
  calculator.ts              pure recommendation engine + indicative pricing
  providers.ts               provider data: exact brand hex, features, GTM events, hrefs
  gtm.ts                     dataLayer helper (trackEvent)
  content.ts                 FAQ (shared with JSON-LD), WhatsApp deep-link, trust copy
```

## Recommendation logic (`lib/calculator.ts`)

A deterministic **priority rule**, exactly per brief — verified across all 1600
input combinations:

- `USA` **or** `Extreme sports` **or** `Pre-existing condition` → **PassportCard**
- everything else (Europe / family / standard) → **Harel**

Clal is a placeholder card and is never auto-recommended. Winter-sports and
pregnancy are add-ons that adjust the **price** quote only, not the pick.

## Configuration points (wire real values before launch)

| What | Where |
|------|-------|
| GTM container id | `NEXT_PUBLIC_GTM_ID` |
| WhatsApp number | `NEXT_PUBLIC_WHATSAPP_PHONE` |
| Affiliate links | `href` fields in `lib/providers.ts` (Clal is a `#` placeholder) |
| Agent phone / license line | `lib/content.ts` (`SITE`, footer) |

## GTM events pushed to `dataLayer`

`click_passportcard`, `click_harel` (provider CTAs), `click_whatsapp` — each with
context params (`provider`, `position`, `price_per_day`, …).
