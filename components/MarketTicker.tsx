import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MARKET_ITEMS } from '@/lib/market';

/**
 * Global running market/forex ticker under the navbar. Illustrative snapshot
 * values (see lib/market.ts) — wire to a live quotes feed for real-time data.
 * Seamless RTL marquee: dir=ltr on the clip container so the w-max track
 * left-anchors, each item keeps dir=rtl for Hebrew.
 */
function Item({ item }: { item: (typeof MARKET_ITEMS)[number] }) {
  const color =
    item.dir === 'up' ? '#22C55E' : item.dir === 'down' ? '#F87171' : '#9BA7C6';
  const Icon = item.dir === 'up' ? TrendingUp : item.dir === 'down' ? TrendingDown : Minus;
  return (
    <span
      dir="rtl"
      className="flex items-center gap-1.5 whitespace-nowrap text-[12.5px] font-semibold"
    >
      <span className="text-white/55">{item.label}</span>
      <span className="num font-bold text-white">{item.value}</span>
      {item.change ? (
        <span
          className="num inline-flex items-center gap-0.5 text-[11px] font-bold"
          style={{ color }}
        >
          <Icon className="h-3 w-3" aria-hidden />
          {item.change}
        </span>
      ) : null}
    </span>
  );
}

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-6 pe-6" aria-hidden={hidden || undefined}>
      {MARKET_ITEMS.map((item) => (
        <li key={item.label}>
          <Item item={item} />
        </li>
      ))}
    </ul>
  );
}

export default function MarketTicker() {
  return (
    <div className="no-print overflow-hidden border-b border-white/10 bg-navy-deep">
      <div className="mx-auto flex max-w-[1600px] items-center">
        <span className="z-10 hidden shrink-0 items-center gap-1.5 bg-cta-fill px-4 py-1.5 text-[11px] font-extrabold text-navy-deep sm:inline-flex">
          מדדי שוק
        </span>
        <div dir="ltr" className="relative flex-1 overflow-hidden ps-6">
          <div className="flex w-max animate-marquee py-1.5 hover:[animation-play-state:paused]">
            <Row />
            <Row hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
