import Image from 'next/image';
import { Plane, CalendarDays, Users, Sparkles } from 'lucide-react';
import type { Destination, TravelInput } from '@/lib/calculator';
import { DESTINATIONS } from '@/lib/calculator';
import { IMG, unsplash, type ImageKey } from '@/lib/images';
import { CountUp } from './ui';

const DEST_CODE: Record<Destination, string> = {
  europe: 'EUR',
  usa: 'USA',
  asia: 'ASIA',
  worldwide: 'WW',
};

const DEST_IMAGE: Record<Destination, ImageKey> = {
  europe: 'europe',
  usa: 'usa',
  asia: 'asia',
  worldwide: 'flight',
};

/**
 * Hero "boarding pass" — mirrors the calculator state (route, days, travelers)
 * and the recommendation, with a live destination photo band.
 */
export default function BoardingPass({
  input,
  providerName,
  glow,
}: {
  input: TravelInput;
  providerName: string;
  glow: string;
}) {
  const destLabel =
    DESTINATIONS.find((d) => d.id === input.destination)?.label ?? '';
  const imageId = IMG[DEST_IMAGE[input.destination]];

  return (
    <div className="glass-elevated relative overflow-hidden">
      {/* destination photo band */}
      <div className="relative h-28 w-full">
        <Image
          src={unsplash(imageId, 900, 60)}
          alt={destLabel}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 440px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1430] via-[#0b1430]/40 to-transparent" />
        <span className="num absolute end-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-gold-bright backdrop-blur-sm">
          NO. {DEST_CODE[input.destination]}-{input.durationDays}
        </span>
        <div className="absolute bottom-2 start-4 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-cta-fill text-navy-deep shadow">
            <Plane className="h-4 w-4 -rotate-45" aria-hidden />
          </span>
          <span className="text-[13px] font-bold text-white drop-shadow">
            FUTURE • כרטיס נסיעה
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        {/* route */}
        <div className="flex items-center justify-between">
          <div className="text-start">
            <div className="text-[12px] font-semibold text-muted">מוצא</div>
            <div className="text-2xl font-extrabold tracking-tight text-ink">TLV</div>
          </div>
          <div className="mx-3 flex flex-1 items-center gap-2 text-gold">
            <span className="h-px flex-1 bg-gradient-to-l from-gold/10 to-gold/50" />
            <Plane className="h-4 w-4 shrink-0 -rotate-45" aria-hidden />
            <span className="h-px flex-1 bg-gradient-to-l from-gold/50 to-gold/10" />
          </div>
          <div className="text-end">
            <div className="text-[12px] font-semibold text-muted">יעד</div>
            <div className="text-2xl font-extrabold tracking-tight text-ink">
              {DEST_CODE[input.destination]}
            </div>
          </div>
        </div>
        <div className="mt-1 text-center text-[13px] text-muted">{destLabel}</div>

        {/* stats */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="glass-chip flex items-center gap-2.5 px-3 py-2.5">
            <CalendarDays className="h-4 w-4 text-gold" aria-hidden />
            <div className="leading-tight">
              <div className="text-[11px] text-muted">משך הנסיעה</div>
              <div className="num text-[15px] font-bold text-ink">
                <CountUp value={input.durationDays} /> ימים
              </div>
            </div>
          </div>
          <div className="glass-chip flex items-center gap-2.5 px-3 py-2.5">
            <Users className="h-4 w-4 text-gold" aria-hidden />
            <div className="leading-tight">
              <div className="text-[11px] text-muted">מטיילים</div>
              <div className="num text-[15px] font-bold text-ink">
                <CountUp value={input.travelers} /> נוסעים
              </div>
            </div>
          </div>
        </div>

        {/* perforation + recommendation */}
        <div className="my-5 border-t border-dashed border-navy/15" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-muted">
            <Sparkles className="h-4 w-4 text-gold" aria-hidden />
            מומלץ עבורך
          </div>
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: glow }}
              aria-hidden
            />
            <span className="text-[15px] font-extrabold" style={{ color: glow }}>
              {providerName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
