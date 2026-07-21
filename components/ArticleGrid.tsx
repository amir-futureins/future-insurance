import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowLeft, BookOpen } from 'lucide-react';
import { AGENT, type Article } from '@/lib/agency';
import { IMG, unsplash } from '@/lib/images';
import { Reveal } from '@/components/travel/ui';

/** Visual article/guide grid with cover imagery, author badge and read-time. */
export default function ArticleGrid({
  title,
  subtitle,
  articles,
  id = 'articles',
}: {
  title: string;
  subtitle?: string;
  articles: Article[];
  id?: string;
}) {
  return (
    <section
      id={id}
      className="mx-auto w-full max-w-container scroll-mt-24 px-6 py-14 md:px-10 md:py-16"
    >
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow inline-flex items-center gap-1.5 text-[13px]">
          <BookOpen className="h-4 w-4" aria-hidden />
          מרכז הידע
        </span>
        <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3 text-[16px] leading-relaxed text-muted">{subtitle}</p>
        ) : null}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a, i) => (
          <Reveal key={a.title} delay={(i % 3) * 80} className="h-full">
            <Link
              href={a.href}
              className="group flex h-full flex-col overflow-hidden glass transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={unsplash(IMG[a.image], 800, 60)}
                  alt={a.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base via-base/30 to-transparent" />
                <span className="absolute end-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-gold-bright backdrop-blur-sm">
                  {a.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="num flex items-center gap-1.5 text-[12px] text-muted">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {a.readMin} דק׳ קריאה
                </div>
                <h3 className="mt-2 text-[17px] font-bold leading-snug text-ink transition-colors group-hover:text-gold-deep">
                  {a.title}
                </h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted">{a.excerpt}</p>
                <div className="mt-4 flex items-center gap-2 border-t border-navy/10 pt-4">
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-extrabold text-white"
                    style={{ background: 'linear-gradient(135deg, #142B55, #22366A)' }}
                    aria-hidden
                  >
                    {AGENT.initials}
                  </span>
                  <span className="text-[12px] font-semibold text-ink">{AGENT.name}</span>
                  <ArrowLeft
                    className="ms-auto h-4 w-4 text-gold-deep transition-transform group-hover:-translate-x-1"
                    aria-hidden
                  />
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
