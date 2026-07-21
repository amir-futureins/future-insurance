import { Play, Check } from 'lucide-react';

/**
 * "Watch the Expert" teaser — a glass card with a navy video-poster panel and a
 * glowing, pulsing play button. There is no recorded video yet, so the play
 * button books a live walkthrough on WhatsApp (a real action, not a dead
 * placeholder); swap in a real <video>/embed when available.
 */
export default function VideoBlock({
  eyebrow = 'שיחת הסבר אישית',
  title,
  subtitle,
  points,
  href,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  points: string[];
  href: string;
}) {
  return (
    <section className="mx-auto w-full max-w-container px-6 py-14 md:px-10 md:py-16">
      <div className="glass-elevated grid overflow-hidden md:grid-cols-2">
        {/* poster */}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="לתיאום שיחת הסבר עם מומחה"
          className="group relative grid min-h-[240px] place-items-center overflow-hidden bg-gradient-to-br from-navy-deep via-navy to-[#0b1a38] p-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
          <div aria-hidden className="pointer-events-none absolute -top-10 end-[-3rem] h-48 w-48 rounded-full bg-glow-gold opacity-40 blur-3xl" />
          <span className="relative grid h-20 w-20 place-items-center rounded-full bg-cta-fill text-navy-deep shadow-2xl transition-transform group-hover:scale-105">
            <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-gold/50" />
            <span aria-hidden className="absolute inset-[-6px] rounded-full ring-2 ring-gold/40" />
            <Play className="relative ms-0.5 h-8 w-8 fill-current" aria-hidden />
          </span>
          <span className="absolute bottom-4 inset-x-0 text-center text-[12.5px] font-semibold text-white/70">
            ▶ הסבר אישי עם מומחה מורשה
          </span>
        </a>

        {/* content */}
        <div className="p-7 sm:p-9">
          <span className="eyebrow text-[13px]">{eyebrow}</span>
          <h2 className="mt-2 text-[clamp(20px,4vw,26px)] font-bold leading-tight text-ink">{title}</h2>
          <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{subtitle}</p>
          <ul className="mt-4 space-y-2">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-2 text-[14px] font-medium text-ink/85">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cta-fill px-6 py-3 text-[15px] font-extrabold text-navy-deep shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_26px_rgba(212,162,74,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <Play className="h-4 w-4 fill-current" aria-hidden />
            לתיאום שיחת הסבר
          </a>
        </div>
      </div>
    </section>
  );
}
