import { ChevronDown } from 'lucide-react';

/**
 * Desktop hover/focus MegaMenu (xl+). Pure CSS (group-hover + group-focus-within)
 * so it needs no client JS: hovering or keyboard-focusing a parent nav item
 * reveals a light-luxury white dropdown of its sub-routes. Mobile keeps the flat
 * scroll strip in TrustBar.
 */

interface Child {
  href: string;
  label: string;
}
interface Item {
  href: string;
  label: string;
  children?: Child[];
}

const MENU: Item[] = [
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

const PILL =
  'whitespace-nowrap rounded-lg bg-white/5 px-2.5 py-1.5 text-[13.5px] font-bold text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright';

export default function MegaMenu() {
  return (
    <nav className="hidden items-center justify-center gap-0.5 xl:flex xl:flex-1" aria-label="ניווט ראשי">
      {MENU.map((item) =>
        item.children ? (
          <div key={item.href} className="group relative">
            <a href={item.href} className={`${PILL} inline-flex items-center gap-1`}>
              {item.label}
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" aria-hidden />
            </a>
            <div className="invisible absolute start-0 top-full z-50 min-w-[248px] translate-y-1 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
                {item.children.map((c) => (
                  <a
                    key={c.href}
                    href={c.href}
                    className="block rounded-xl px-3 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:bg-gold-tint hover:text-gold-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    {c.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <a key={item.href} href={item.href} className={PILL}>
            {item.label}
          </a>
        ),
      )}
    </nav>
  );
}
