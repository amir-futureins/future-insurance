/**
 * Shared, framework-neutral site & contact details. Every phone / WhatsApp /
 * license string on the site comes from here, so a correction is a one-line
 * change. Travel insurance is handled on il-ins.co.il (see TRAVEL_URL).
 */

export const SITE = {
  name: 'Future Insurance',
  nameHe: 'פיוצ׳ר אינשורנס',
  url: 'https://futureins.co.il',
  phoneDisplay: '052-842-2884',
  phoneHref: 'tel:+972528422884',
  phoneCta: 'חייגו לייעוץ',
  phoneCtaAlt: 'שיחה עם סוכן',
  email: 'amir@il-ins.co.il',
  address: 'אור יהודה',
} as const;

/** Licensed agent — the only identity details shown on the site. */
export const AGENT_INFO = {
  name: 'אמיר שושני',
  title: 'סוכן ביטוח מורשה',
  license: 'L-00139094',
} as const;

/** Real opening hours, shown wherever availability is mentioned. */
export const HOURS = {
  short: 'א׳–ה׳ 9:00–20:00, ו׳ 9:00–14:00',
  full: 'א׳–ה׳ 9:00–20:00 · ו׳ 9:00–14:00 · שבת סגור',
} as const;

/** Travel insurance lives on a dedicated site; every travel link points here. */
export const TRAVEL_URL = 'https://il-ins.co.il/';

/**
 * WhatsApp deep-link. Deliberately NOT env-overridable: a stale
 * NEXT_PUBLIC_WHATSAPP_PHONE once shipped a placeholder number site-wide.
 */
export const WHATSAPP = {
  phone: '972528422884',
  message: 'היי אמיר, אשמח להתייעץ לגבי ביטוח',
} as const;

export function whatsappHref(): string {
  return `https://wa.me/${WHATSAPP.phone}?text=${encodeURIComponent(WHATSAPP.message)}`;
}

export interface FaqItem {
  q: string;
  a: string;
}
