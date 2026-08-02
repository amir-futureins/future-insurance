import type { Metadata } from 'next';
import TravelInsuranceHub from '@/components/travel/TravelInsuranceHub';
import { WhyUs, Faq } from '@/components/travel/Sections';
import CoverageComparison from '@/components/travel/CoverageComparison';
import GuidesSection from '@/components/travel/GuidesSection';
import StatsBar from '@/components/travel/StatsBar';
import FeatureBadges from '@/components/travel/FeatureBadges';
import Testimonials from '@/components/travel/Testimonials';
import AmbientDecor from '@/components/travel/AmbientDecor';
import { FAQ_ITEMS, SITE } from '@/lib/content';
import SeoSchema from '@/components/SeoSchema';

export const metadata: Metadata = {
  title: 'ביטוח נסיעות לחו״ל — השוואה ורכישה',
  description:
    'השוואת ביטוח נסיעות לחו״ל בין PassportCard, הראל, מגדל וכלל — מחשבון חכם, פוליסה מיידית ורכישה אונליין בליווי סוכן מורשה.',
  keywords: [
    'ביטוח נסיעות',
    'ביטוח נסיעות לחול',
    'PassportCard',
    'הראל ביטוח נסיעות',
    'ביטוח נסיעות ארהב',
    'ביטוח נסיעות משפחתי',
  ],
  alternates: { canonical: SITE.travelPath },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: `${SITE.url}${SITE.travelPath}`,
    siteName: SITE.name,
    title: 'ביטוח נסיעות לחו״ל — מחשבון והמלצה חכמה | Future Insurance',
    description:
      'בוחרים יעד, משך נסיעה והרחבות — והמערכת ממליצה על חברת הביטוח המשתלמת עבורכם. השוואה שקופה בין PassportCard, הראל, מגדל וכלל.',
    // og:image is supplied automatically by app/travel-insurance/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ביטוח נסיעות לחו״ל — מחשבון והמלצה חכמה',
    description:
      'מחשבון חכם שממליץ על חברת ביטוח הנסיעות המשתלמת עבורכם — PassportCard, הראל, מגדל וכלל.',
  },
};

// Structured data — WebPage + FAQPage — rendered server-side for crawlers.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'ביטוח נסיעות לחו״ל — Future Insurance',
      url: `${SITE.url}${SITE.travelPath}`,
      inLanguage: 'he-IL',
      isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.url },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ],
};

export default function TravelInsurancePage() {
  return (
    <>
      <SeoSchema
        crumbs={[{ name: 'ביטוח נסיעות לחו״ל', path: '/travel-insurance' }]}
        service={{ name: 'ביטוח נסיעות לחו״ל', description: 'השוואת ביטוח נסיעות לחו״ל בין PassportCard, הראל, כלל ומגדל — ורכישה אונליין.', path: '/travel-insurance', serviceType: 'ביטוח נסיעות לחו״ל' }}
      />
      <script
        type="application/ld+json"
        // JSON-LD is trusted, server-generated content.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AmbientDecor />
      <TravelInsuranceHub />
      <StatsBar />
      <WhyUs />
      <FeatureBadges />
      <CoverageComparison />
      <GuidesSection />
      <Testimonials />
      <Faq />
    </>
  );
}
