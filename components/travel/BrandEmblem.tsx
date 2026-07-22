/**
 * BrandEmblem — a clean, brand-colored name badge for each travel carrier.
 *
 * ⚠️ NOT the carriers' official trademarked logos (we don't hold those assets,
 * and reproducing/faking them on a sales page is a trademark/impersonation
 * risk). This is a stylized nominative wordmark. To use the REAL logos, obtain
 * licensed SVGs, drop them in /public/logos/{slug}.svg, and render an <Image>
 * here instead of the monogram span.
 */

const EMBLEM: Record<string, { label: string; color: string; accent2?: string }> = {
  passportcard: { label: 'PC', color: '#E10600' },
  harel: { label: 'הראל', color: '#004B93', accent2: '#D4A24A' },
  clal: { label: 'כלל', color: '#002D62', accent2: '#F5821F' },
  migdal: { label: 'מגדל', color: '#001E50', accent2: '#10B981' },
};

export default function BrandEmblem({
  slug,
  variant = 'dock',
  className = '',
}: {
  slug: string;
  variant?: 'dock' | 'lg';
  className?: string;
}) {
  const e = EMBLEM[slug];
  if (!e) return null;
  const dims = variant === 'lg' ? 'h-16 w-16 text-[15px]' : 'h-12 w-12 text-[12px]';
  return (
    <span
      className={`relative grid shrink-0 place-items-center rounded-full bg-white ${dims} ${className}`}
      style={{ boxShadow: `inset 0 0 0 2px ${e.color}, 0 6px 16px -6px ${e.color}` }}
      aria-hidden
    >
      <span className="font-black leading-none tracking-tight" style={{ color: e.color }}>
        {e.label}
      </span>
      {e.accent2 ? (
        <span
          className={`absolute rounded-full ${variant === 'lg' ? 'bottom-2 h-1.5 w-6' : 'bottom-1.5 h-1 w-4'}`}
          style={{ backgroundColor: e.accent2 }}
        />
      ) : null}
    </span>
  );
}
