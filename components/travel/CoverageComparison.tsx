import { Check, X, Minus } from 'lucide-react';
import { COVERAGE_ROWS, type CoverageRow } from '@/lib/content';
import { getProvider } from '@/lib/providers';

const COLS: { id: 'passportcard' | 'harel' | 'migdal' | 'clal' }[] = [
  { id: 'passportcard' },
  { id: 'harel' },
  { id: 'migdal' },
  { id: 'clal' },
];

function Cell({ cell }: { cell: CoverageRow['passportcard'] }) {
  const Icon = cell.tier === 'none' ? X : cell.tier === 'best' ? Check : Minus;
  const color =
    cell.tier === 'best'
      ? 'text-harel-green'
      : cell.tier === 'none'
        ? 'text-pc-glow'
        : 'text-muted';
  return (
    <div className="flex items-center justify-center gap-1.5">
      <Icon className={`h-4 w-4 shrink-0 ${color}`} aria-hidden />
      <span
        className={
          cell.tier === 'none' ? 'text-[13px] text-faint' : 'text-[13px] font-medium text-ink/90'
        }
      >
        {cell.label}
      </span>
    </div>
  );
}

export default function CoverageComparison() {
  return (
    <section id="coverage" className="mx-auto w-full max-w-container scroll-mt-24 px-6 py-14 md:px-10 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow text-[13px]">השוואת כיסויים</span>
        <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
          מה בדיוק מכוסה בכל פוליסה?
        </h2>
        <p className="mt-3 text-[16px] leading-relaxed text-muted">
          טבלת השוואה מלאה — כיסוי רפואי, כבודה, ביטול טיסה, ספורט אתגרי ועוד.
        </p>
      </div>

      <div className="mt-10 glass overflow-hidden p-1.5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-center">
            <thead>
              <tr className="border-b border-navy/10">
                <th scope="col" className="p-4 text-start text-[13px] font-semibold text-muted">
                  סוג הכיסוי
                </th>
                {COLS.map((c) => {
                  const p = getProvider(c.id);
                  return (
                    <th key={c.id} scope="col" className="p-4">
                      <span className="text-[15px] font-extrabold" style={{ color: p.glow }}>
                        {p.name}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {COVERAGE_ROWS.map((row, i) => (
                <tr
                  key={row.feature}
                  className={i % 2 === 1 ? 'bg-navy/[0.025]' : undefined}
                >
                  <th
                    scope="row"
                    className="p-4 text-start text-[14px] font-semibold text-ink"
                  >
                    {row.feature}
                  </th>
                  {COLS.map((c) => (
                    <td key={c.id} className="p-4">
                      <Cell cell={row[c.id]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-4 text-center text-[12px] text-faint">
        * הכיסויים להמחשה בלבד וכפופים לתנאי הפוליסה המלאים של כל חברה.
      </p>
    </section>
  );
}
