import type { LucideIcon } from 'lucide-react';
import {
  CreditCard,
  Zap,
  Stethoscope,
  Luggage,
  ShieldCheck,
  ShieldPlus,
  Globe2,
  Plane,
  HeartPulse,
  PiggyBank,
  Clock,
  Users,
  Landmark,
} from 'lucide-react';
import type { PriceableProviderId } from './calculator';

export interface ProviderFeature {
  icon: LucideIcon;
  text: string;
}

export interface Provider {
  id: PriceableProviderId;
  /** Display name (kept Latin for PassportCard — a registered brand name). */
  name: string;
  /** Hebrew one-liner shown under the logo. */
  tagline: string;
  /** Exact brand hex — drives the accent bar & CTA via --brand. */
  brand: string;
  /** Brand hex tuned legible for names/ticks on the light surfaces. */
  glow: string;
  /** Colour for the benefit check ticks. */
  check: string;
  /** Optional Harel-only tri-colour signature (blue / yellow / green). */
  signature?: string[];
  /** "Best for" chip copy. */
  bestFor: string;
  features: ProviderFeature[];
  ctaLabel: string;
  /** GTM dataLayer event name fired on CTA click. */
  gtmEvent?: string;
  /** Native redirect route (app/api/go/[provider]); '#' marks a placeholder. */
  href: string;
  /** When true, the CTA redirects straight to the affiliate portal (no lead
   *  modal). When false/undefined, the CTA opens the 1-step lead capture. */
  directAffiliate?: boolean;
}

export const PROVIDERS: Provider[] = [
  {
    id: 'passportcard',
    name: 'PassportCard',
    tagline: 'ביטוח נסיעות ללא הוצאות מהכיס',
    brand: '#E11933',
    glow: '#E11933',
    check: '#E11933',
    bestFor: 'ארה״ב • ספורט אתגרי • מצב רפואי',
    features: [
      { icon: CreditCard, text: 'ללא השתתפות עצמית — תשלום ישיר לספק' },
      { icon: Zap, text: 'כרטיס דיגיטלי מיידי לתשלום בחו״ל' },
      { icon: HeartPulse, text: 'כיסוי רפואי מורחב למצבים קיימים' },
      { icon: ShieldCheck, text: 'מוקד רפואי בעברית 24/7' },
    ],
    ctaLabel: 'קבלו הצעה מ-PassportCard',
    gtmEvent: 'click_passportcard',
    href: '/api/go/passportcard',
    directAffiliate: true,
  },
  {
    id: 'harel',
    name: 'הראל',
    tagline: 'ביטוח נסיעות לכל המשפחה',
    brand: '#0057B8',
    glow: '#0057B8',
    check: '#16A34A',
    signature: ['#0057B8', '#FFC20E', '#22C55E'],
    bestFor: 'משפחות • אירופה • כיסוי סטנדרטי',
    features: [
      { icon: Stethoscope, text: 'רופא אונליין באפליקציה בכל שעה' },
      { icon: Luggage, text: 'תביעת כבודה מהירה ופשוטה' },
      { icon: Globe2, text: 'רשת שירות רפואי רחבה באירופה' },
      { icon: Clock, text: 'הפקת פוליסה מיידית אונליין' },
    ],
    ctaLabel: 'קבלו הצעה מהראל',
    gtmEvent: 'click_harel',
    href: '/api/go/harel',
    directAffiliate: true,
  },
  {
    id: 'migdal',
    name: 'מגדל',
    tagline: 'ביטוח נסיעות מקיף ואיתן',
    brand: '#003399',
    glow: '#003399',
    check: '#16A34A',
    signature: ['#003399', '#F5821F'],
    bestFor: 'כל העולם • טיולים ארוכים • משפחות',
    features: [
      { icon: ShieldPlus, text: 'כיסוי רפואי מקיף עם תקרות גבוהות' },
      { icon: Users, text: 'התמחות בכיסוי משפחות ובני 60+' },
      { icon: Globe2, text: 'רשת בתי חולים וספקים גלובלית' },
      { icon: Landmark, text: 'איתנות פיננסית של מותג ותיק' },
    ],
    ctaLabel: 'קבלו הצעה ממגדל',
    gtmEvent: 'click_migdal',
    href: '/api/go/migdal',
  },
  {
    id: 'clal',
    name: 'כלל',
    tagline: 'ביטוח נסיעות משתלם',
    brand: '#00A0DF',
    glow: '#0086BC',
    check: '#0086BC',
    bestFor: 'תקציבי • איזון מחיר-כיסוי',
    features: [
      { icon: PiggyBank, text: 'מחיר אטרקטיבי לנסיעות סטנדרטיות' },
      { icon: Plane, text: 'כיסוי ביטול והפסקת נסיעה' },
      { icon: ShieldCheck, text: 'כיסוי רפואי בסיסי מקיף' },
    ],
    ctaLabel: 'קבלו הצעה מכלל',
    gtmEvent: 'click_clal',
    href: '/api/go/clal',
  },
];

export function getProvider(id: PriceableProviderId): Provider {
  const p = PROVIDERS.find((provider) => provider.id === id);
  if (!p) throw new Error(`Unknown provider: ${id}`);
  return p;
}
