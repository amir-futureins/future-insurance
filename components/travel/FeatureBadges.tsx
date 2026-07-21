import { Headset, MessageCircle, Landmark, Lock, type LucideIcon } from 'lucide-react';
import { Reveal } from './ui';

const BADGES: { icon: LucideIcon; title: string; note: string }[] = [
  { icon: Headset, title: 'מוקד חירום 24/7', note: 'תמיכה בעברית בכל שעה, מכל מקום בעולם' },
  { icon: MessageCircle, title: 'אישור מיידי ב-WhatsApp', note: 'פוליסה וכרטיס דיגיטלי ישירות לנייד' },
  { icon: Landmark, title: 'רישיון רשות שוק ההון', note: 'פעילות מפוקחת ומאושרת כחוק' },
  { icon: Lock, title: 'הפרטים מאובטחים', note: 'הצפנה מלאה — שיתוף רק עם חברות ביטוח מורשות לצורך השירות' },
];

export default function FeatureBadges() {
  return (
    <section className="mx-auto w-full max-w-container px-6 py-14 md:px-10 md:py-16">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {BADGES.map((b, i) => {
          const Icon = b.icon;
          return (
            <Reveal
              key={b.title}
              delay={(i % 4) * 70}
              className="glass flex flex-col items-center p-5 text-center transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-tint text-gold-deep ring-1 ring-gold/30">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-3 text-[15px] font-bold text-ink">{b.title}</h3>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{b.note}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
