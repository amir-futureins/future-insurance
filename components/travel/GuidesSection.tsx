import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowLeft, BookOpen } from 'lucide-react';
import { GUIDES } from '@/lib/content';
import { IMG, unsplash } from '@/lib/images';
import { Reveal } from './ui';

export default function GuidesSection() {
  return (
    <section id="guides" className="mx-auto w-full max-w-container scroll-mt-24 px-6 py-14 md:px-10 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow inline-flex items-center gap-1.5 text-[13px]">
          <BookOpen className="h-4 w-4" aria-hidden />
          מרכז הידע
        </span>
        <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
          מדריכים וכתבות ביטוח
        </h2>
        <p className="mt-3 text-[16px] leading-relaxed text-muted">
          כל מה שצריך לדעת לפני שיוצאים לדרך — מדריכי יעד, הרחבות וטיפים לתביעה חכמה.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g, i) => (
          <Reveal key={g.slug} delay={(i % 3) * 80}>
            <Link
              href={`/guides/${g.slug}`}
              className="group flex h-full flex-col overflow-hidden glass transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={unsplash(IMG[g.image], 800, 60)}
                  alt={g.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base via-base/30 to-transparent" />
                <span className="absolute end-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-gold-bright backdrop-blur-sm">
                  {g.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="num flex items-center gap-1.5 text-[12px] text-muted">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {g.readMin} דק׳ קריאה
                </div>
                <h3 className="mt-2 text-[17px] font-bold leading-snug text-ink transition-colors group-hover:text-gold-deep">
                  {g.title}
                </h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted">
                  {g.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[14px] font-bold text-gold-deep">
                  קראו עוד
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
