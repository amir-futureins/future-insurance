/**
 * Slim live-rates ticker strip that sits directly under the navbar — a
 * continuous marquee of provider "from" rates and trust points. Pure CSS
 * animation (pauses on hover; the global reduced-motion rule freezes it), so it
 * can stay a lightweight server component. Two equal-width copies + a -50%
 * translate give a seamless loop; the second copy is aria-hidden to avoid
 * double-reading.
 */

const ITEMS: { txt: string; color?: string }[] = [
  { txt: 'PassportCard · מ־₪16 ליום', color: '#FF556B' },
  { txt: 'מגדל · מ־₪13 ליום', color: '#5C8AF0' },
  { txt: 'הראל · מ־₪11 ליום', color: '#5AA0F5' },
  { txt: 'כלל · מ־₪8 ליום', color: '#38C6F7' },
  { txt: '⚡ הפקה מיידית אונליין' },
  { txt: '🛡️ ללא השתתפות עצמית' },
  { txt: '🌍 כיסוי עולמי · מוקד 24/7' },
];

function Copy({ hidden }: { hidden?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center gap-8 pe-8"
      aria-hidden={hidden || undefined}
    >
      {ITEMS.map((it, i) => (
        <li
          key={i}
          dir="rtl"
          className="flex items-center gap-2 whitespace-nowrap text-[13px] font-semibold text-white/85"
        >
          {it.color ? (
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: it.color }}
              aria-hidden
            />
          ) : null}
          {it.txt}
        </li>
      ))}
    </ul>
  );
}

export default function RatesTicker() {
  return (
    <div className="no-print overflow-hidden border-b border-white/10 bg-navy-deep">
      <div className="mx-auto flex max-w-[1600px] items-center">
        <span className="z-10 hidden shrink-0 items-center gap-1.5 bg-cta-fill px-4 py-2 text-[12px] font-extrabold text-navy-deep sm:inline-flex">
          מחירים חיים
        </span>
        {/* dir=ltr so the over-wide w-max track left-anchors → the -50%
            marquee is seamless in RTL (each item keeps dir=rtl for Hebrew). */}
        <div dir="ltr" className="relative flex-1 overflow-hidden ps-8">
          <div className="flex w-max animate-marquee py-2 hover:[animation-play-state:paused]">
            <Copy />
            <Copy hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
