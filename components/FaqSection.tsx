import { ChevronDown } from 'lucide-react';
import type { FaqItem } from '@/lib/content';

/** Generic, crawlable FAQ accordion (CSS-only, CLS-safe) for any vertical. */
export default function FaqSection({
  title,
  subtitle,
  items,
  id = 'faq',
}: {
  title: string;
  subtitle?: string;
  items: FaqItem[];
  id?: string;
}) {
  return (
    <section
      id={id}
      className="mx-auto w-full max-w-container scroll-mt-24 px-6 py-14 md:px-10 md:py-16"
    >
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow text-[13px]">שאלות נפוצות</span>
        <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3 text-[16px] leading-relaxed text-muted">{subtitle}</p>
        ) : null}
      </div>
      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {items.map((item) => (
          <details key={item.q} className="glass px-1">
            <summary className="flex items-center justify-between gap-4 p-5 text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
              <span className="text-[16px] font-bold text-ink">{item.q}</span>
              <ChevronDown
                className="faq-chevron h-5 w-5 shrink-0 text-gold transition-transform"
                aria-hidden
              />
            </summary>
            <div className="faq-body">
              <div>
                <p className="px-5 pb-5 text-[15px] leading-relaxed text-muted">{item.a}</p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
