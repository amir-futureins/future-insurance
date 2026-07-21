import { Check, X } from 'lucide-react';
import type { CompareRow } from '@/lib/agency';

/** Transparent "bank vs. independent agent" comparison table (mobile-scrollable). */
export default function ComparisonTable({
  title,
  subtitle,
  rows,
  leftLabel = 'דרך הבנק',
  rightLabel = 'דרך Future Insurance',
  id = 'compare',
}: {
  title: string;
  subtitle?: string;
  rows: CompareRow[];
  leftLabel?: string;
  rightLabel?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="mx-auto w-full max-w-container scroll-mt-24 px-6 py-14 md:px-10 md:py-16"
    >
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow text-[13px]">השוואה שקופה</span>
        <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">{title}</h2>
        {subtitle ? <p className="mt-3 text-[16px] leading-relaxed text-muted">{subtitle}</p> : null}
      </div>

      <div className="mt-10 glass overflow-hidden p-1.5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-center">
            <thead>
              <tr className="border-b border-navy/10">
                <th scope="col" className="p-4 text-start text-[13px] font-semibold text-muted">
                  מה בודקים
                </th>
                <th scope="col" className="p-4 text-[15px] font-extrabold text-ink">
                  {leftLabel}
                </th>
                <th scope="col" className="rounded-t-xl bg-gold-tint p-4 text-[15px] font-extrabold text-gold-deep">
                  {rightLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.feature}>
                  <th scope="row" className="p-4 text-start text-[14px] font-semibold text-ink">
                    {r.feature}
                  </th>
                  <td className="p-4 text-[13px] text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <X className="h-4 w-4 shrink-0 text-pc-glow" aria-hidden />
                      {r.bank}
                    </span>
                  </td>
                  <td className="bg-gold-tint p-4 text-[13px] font-medium text-ink/90">
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="h-4 w-4 shrink-0 text-harel-green" aria-hidden />
                      {r.agency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
