import type { Metadata, Viewport } from 'next';
import { Assistant } from 'next/font/google';
import Script from 'next/script';
import { GTM_ID } from '@/lib/gtm';
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
  // Navy to blend the mobile status bar with the sticky "Future Fly" navbar.
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
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="font-sans antialiased">
        {GTM_ID ? (
          <>
            <Script id="gtm-init" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
            </Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
                title="gtm"
              />
            </noscript>
          </>
        ) : null}

        {/* No chrome here on purpose. The marketing navbar / ticker / footer,
            the floating widgets and the aurora glows live in
            app/(site)/layout.tsx, so routes outside that route group — /fly,
            the standalone landing page for fly.amirs.co.il — render on a bare
            canvas without needing to detect their own pathname or hostname. */}
        {children}
      </body>
    </html>
  );
}
