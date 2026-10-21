import type { Metadata, Viewport } from 'next';
import { Assistant } from 'next/font/google';
import { CONSENT_BOOTSTRAP } from '@/lib/consent';
import './globals.css';

const assistant = Assistant({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  variable: '--font-assistant',
});

const SITE_URL = 'https://futureins.co.il';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Future Insurance — ביטוח לעתיד שלך',
    template: '%s | Future Insurance',
  },
  description:
    'חנות ביטוח אחת לכל הצרכים — ביטוח נסיעות לחו״ל, בריאות ופיננסים במקום אחד, עם מחשבונים חכמים והשוואת חברות.',
  applicationName: 'Future Insurance',
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  icons: { icon: '/new-logo.png', apple: '/new-logo.png' },
  // Sitewide OG/Twitter defaults. The share image is supplied by the
  // app/opengraph-image.tsx file convention (overridable per-route).
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: SITE_URL,
    siteName: 'Future Insurance',
    title: 'Future Insurance — ביטוח לעתיד שלך',
    description:
      'חנות ביטוח אחת לכל הצרכים — ביטוח נסיעות לחו״ל, בריאות, פיננסים והר הביטוח במקום אחד, עם מחשבונים חכמים והשוואת חברות.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Future Insurance — ביטוח לעתיד שלך',
    description:
      'כל הביטוחים במקום אחד — השוואה שקופה, מחשבונים חכמים וליווי סוכן מורשה.',
  },
};

export const viewport: Viewport = {
  // Navy to blend the mobile status bar with the sticky navbar.
  themeColor: '#142B55',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={assistant.variable}>
      <head>
        {/* Consent Mode v2 defaults (all denied) + opt-in GTM loader. Must run
            before anything else, so it is a plain inline script in <head>. */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_BOOTSTRAP }} />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="font-sans antialiased">

        {/* No chrome here on purpose: the marketing navbar / footer, the
            floating widgets and the aurora glows live in app/(site)/layout.tsx. */}
        {children}
      </body>
    </html>
  );
}
