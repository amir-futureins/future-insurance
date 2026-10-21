import { BadgeCheck, Clock, MapPin, MessageCircle, Phone } from 'lucide-react';
import { SITE, AGENT_INFO, HOURS, whatsappHref } from '@/lib/content';

/**
 * HeroControlCenter — the homepage hero's agent card: who you are talking to
 * (name, license), when they are reachable, and the two direct contact
 * channels. Only real, verifiable details — no figures, no simulated activity.
 */
export default function HeroControlCenter() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="relative overflow-hidden rounded-3xl border border-amber-300/40 bg-gradient-to-br from-white/95 to-slate-100/90 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <span
            className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-[20px] font-extrabold text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #142B55, #22366A)' }}
            aria-hidden
          >
            א״ש
          </span>
          <div className="min-w-0">
            <div className="text-[20px] font-extrabold text-ink">{AGENT_INFO.name}</div>
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-gold-tint px-2.5 py-1 text-[12px] font-bold text-gold-deep ring-1 ring-gold/25">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
              {AGENT_INFO.title} · רישיון <span dir="ltr">{AGENT_INFO.license}</span>
            </div>
          </div>
        </div>

        <ul className="mt-5 space-y-2.5 text-[14px] text-ink/85">
          <li className="flex items-start gap-2">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
            {HOURS.full}
          </li>
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
            {SITE.address}
          </li>
        </ul>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-3 text-[15px] font-extrabold text-white shadow-md"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            וואטסאפ
          </a>
          <a
            href={SITE.phoneHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cta-fill px-3 py-3 text-[15px] font-extrabold text-navy-deep shadow-md"
          >
            <Phone className="h-4 w-4" aria-hidden />
            <span dir="ltr">{SITE.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
