/**
 * Single source of truth for the primary site navigation — shared by the
 * desktop MegaMenu (xl+) and the mobile drawer (below xl) so both always show
 * the same categories AND sub-categories.
 */

import { TRAVEL_URL } from './content';

export interface NavChild {
  href: string;
  label: string;
}

export interface NavItem {
  href: string;
  label: string;
  children?: NavChild[];
}

export const NAV_MENU: NavItem[] = [
  { href: '/', label: 'בית' },
  { href: TRAVEL_URL, label: 'ביטוח נסיעות' },
  {
    href: '/har-habituach',
    label: 'הר הביטוח',
    children: [
      { href: '/har-habituach', label: 'בדיקת תיק הביטוח' },
      { href: '/har-habituach/duplicate-check', label: 'בדיקת כפל ביטוח והוזלה' },
      { href: '/har-habituach/car-claims', label: 'עבר ביטוחי לרכב' },
    ],
  },
  { href: '/finance', label: 'פנסיה וגמל' },
  { href: '/health', label: 'בריאות' },
  { href: '/life', label: 'חיים' },
  {
    href: '/mortgage',
    label: 'משכנתא',
    children: [
      { href: '/mortgage', label: 'ביטוח משכנתא (חיים + מבנה)' },
      { href: '/mortgage/structure', label: 'ביטוח מבנה ודירה' },
    ],
  },
  { href: '/business-insurance', label: 'עסק' },
];
