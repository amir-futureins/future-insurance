/**
 * Single source of truth for the primary site navigation — shared by the
 * desktop MegaMenu (xl+) and the mobile drawer (below xl) so both always show
 * the same categories AND sub-categories.
 */

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
  {
    href: '/travel-insurance',
    label: 'חו״ל',
    children: [
      { href: '/travel-insurance', label: 'השוואת חברות ומחשבון' },
      { href: '/travel-insurance/passportcard', label: 'PassportCard' },
      { href: '/travel-insurance/harel', label: 'הראל' },
      { href: '/travel-insurance/clal', label: 'כלל' },
      { href: '/travel-insurance/migdal', label: 'מגדל' },
    ],
  },
  {
    href: '/har-habituach',
    label: 'הר הביטוח',
    children: [
      { href: '/har-habituach', label: 'סריקת תיק הביטוח' },
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
