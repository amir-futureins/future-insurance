import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight, Calculator } from 'lucide-react';
import { GUIDES, getGuide, SITE } from '@/lib/content';
import { IMG, unsplash } from '@/lib/images';

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const guide = getGuide(params.slug);
  if (!guide) return { title: 'מדריך לא נמצא' };
  return {
    title: guide.title,
    description: guide.excerpt,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      type: 'article',
      title: guide.title,
      description: guide.excerpt,
      url: `${SITE.url}/guides/${guide.slug}`,
    },
  };
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.excerpt,
    inLanguage: 'he-IL',
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name },
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:px-10 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/travel-insurance#guides"
        className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-muted transition-colors hover:text-ink"
      >
        <ArrowRight className="h-4 w-4" aria-hidden />
        כל המדריכים
      </Link>

      <div className="mt-5 flex items-center gap-3">
        <span className="rounded-full bg-gold-tint px-3 py-1 text-[12px] font-semibold text-gold-deep ring-1 ring-gold/30">
          {guide.category}
        </span>
        <span className="num flex items-center gap-1.5 text-[13px] text-muted">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {guide.readMin} דק׳ קריאה
        </span>
      </div>

      <h1 className="mt-4 text-[clamp(28px,6vw,40px)] font-extrabold leading-[1.15] text-ink">
        {guide.title}
      </h1>

      <div className="relative mt-6 h-56 w-full overflow-hidden rounded-glass-lg sm:h-72">
        <Image
          src={unsplash(IMG[guide.image], 1200, 65)}
          alt={guide.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base/50 to-transparent" />
      </div>

      <article className="mt-8 space-y-5 text-[17px] leading-relaxed text-ink/90">
        <p className="text-[19px] font-medium text-ink">{guide.excerpt}</p>
        {guide.body.map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
      </article>

      {/* CTA */}
      <div className="glass mt-10 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[18px] font-bold text-ink">מוכנים לחשב את הביטוח שלכם?</h2>
          <p className="mt-1 text-[14px] text-muted">
            קבלו המלצה מותאמת אישית תוך 30 שניות.
          </p>
        </div>
        <a
          href="/travel-insurance#calculator"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-cta-fill px-5 py-3 text-[15px] font-bold text-navy-deep shadow-md shadow-gold/20 transition-transform hover:-translate-y-0.5"
        >
          <Calculator className="h-5 w-5" aria-hidden />
          למחשבון
        </a>
      </div>
    </main>
  );
}
