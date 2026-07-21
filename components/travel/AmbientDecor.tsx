import { Plane } from 'lucide-react';

/**
 * Delicate, slow-moving background accents that give the light canvas depth and
 * motion without competing with content. Purely decorative: fixed behind
 * everything (-z-10), aria-hidden, non-interactive, hidden in print, and — via
 * the global prefers-reduced-motion rule — perfectly still for motion-sensitive
 * users. Kept to transform/opacity animations so it never triggers layout.
 */

const SPARKLES = [
  { top: '18%', left: '8%', size: 7, delay: '0s' },
  { top: '32%', left: '90%', size: 5, delay: '1.2s' },
  { top: '55%', left: '5%', size: 6, delay: '2.1s' },
  { top: '68%', left: '94%', size: 8, delay: '0.6s' },
  { top: '82%', left: '12%', size: 5, delay: '1.7s' },
  { top: '12%', left: '55%', size: 4, delay: '2.6s' },
];

function FlightPath({
  className,
  d,
  planeAt,
}: {
  className: string;
  d: string;
  planeAt: { top: string; left: string; rotate: number };
}) {
  return (
    <div className={`absolute ${className}`}>
      <svg
        width="360"
        height="200"
        viewBox="0 0 360 200"
        fill="none"
        className="overflow-visible"
      >
        <path
          d={d}
          stroke="#D4A24A"
          strokeWidth="1.5"
          strokeDasharray="5 9"
          strokeLinecap="round"
          className="animate-dash-flow"
          opacity="0.5"
        />
      </svg>
      <span
        className="absolute grid h-6 w-6 place-items-center rounded-full bg-white/70 text-gold-deep shadow-sm ring-1 ring-gold/20"
        style={{ top: planeAt.top, left: planeAt.left, transform: `rotate(${planeAt.rotate}deg)` }}
      >
        <Plane className="h-3.5 w-3.5" />
      </span>
    </div>
  );
}

export default function AmbientDecor() {
  return (
    <div
      aria-hidden
      className="no-print pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* faint mesh dot-grid for high-tech depth */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(20,43,85,0.05) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage:
            'radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 85%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 85%)',
        }}
      />

      {/* soft-glowing ambient orbs (navy & gold) drifting slowly */}
      <div className="absolute -top-24 end-[8%] h-[360px] w-[360px] rounded-full bg-glow-gold blur-3xl animate-orb-pulse" />
      <div
        className="absolute top-[38%] start-[-6%] h-[420px] w-[420px] rounded-full bg-glow-navy blur-3xl animate-float-y"
        style={{ animationDuration: '13s' }}
      />
      <div
        className="absolute bottom-[6%] end-[12%] h-[320px] w-[320px] rounded-full bg-glow-royal blur-3xl animate-orb-pulse"
        style={{ animationDelay: '3s' }}
      />

      {/* dashed flight trajectories, top-end and bottom-start margins */}
      <FlightPath
        className="top-[8%] end-[-2%] opacity-70"
        d="M8 180 C 90 120, 180 90, 350 20"
        planeAt={{ top: '10px', left: '338px', rotate: -32 }}
      />
      <FlightPath
        className="bottom-[6%] start-[-3%] opacity-60 rotate-180"
        d="M8 180 C 110 130, 210 100, 350 30"
        planeAt={{ top: '20px', left: '338px', rotate: -28 }}
      />

      {/* soft gold sparkles */}
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-gold animate-twinkle"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            boxShadow: '0 0 8px rgba(212,162,74,0.55)',
          }}
        />
      ))}

      {/* faint destination badges floating in the margins */}
      <span className="absolute top-[24%] start-[3%] animate-float-y rounded-full border border-navy/10 bg-white/60 px-2.5 py-1 text-[11px] font-semibold text-navy/50 shadow-sm backdrop-blur-sm">
        ✈ TLV → EUR
      </span>
      <span
        className="absolute bottom-[22%] end-[4%] animate-float-x rounded-full border border-navy/10 bg-white/60 px-2.5 py-1 text-[11px] font-semibold text-navy/50 shadow-sm backdrop-blur-sm"
        style={{ animationDelay: '1.5s' }}
      >
        ✈ TLV → NYC
      </span>
    </div>
  );
}
