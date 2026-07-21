import { Lightbulb } from 'lucide-react';

/** Three-up "expert tips" block for a vertical page. */
export default function ExpertTips({
  title,
  tips,
}: {
  title: string;
  tips: { title: string; text: string }[];
}) {
  return (
    <section className="mx-auto w-full max-w-container px-6 py-14 md:px-10 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow inline-flex items-center gap-1.5 text-[13px]">
          <Lightbulb className="h-4 w-4" aria-hidden />
          טיפים ממומחה
        </span>
        <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">{title}</h2>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {tips.map((t) => (
          <div key={t.title} className="glass p-6">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-tint text-gold-deep ring-1 ring-gold/25">
              <Lightbulb className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="mt-3 text-[16px] font-bold text-ink">{t.title}</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
