'use client';

import { usePathname } from 'next/navigation';

/**
 * Mandatory legal clarification for the Har-Habituach routes: this is a private
 * licensed agency, NOT the official government site (har.mof.gov.il). Rendered
 * just above the global footer on /har-habituach and every sub-route, so users
 * are never misled into thinking they are on a Ministry of Finance property.
 */
export default function HarDisclaimer() {
  const pathname = usePathname();
  if (!pathname?.startsWith('/har-habituach')) return null;

  return (
    <div className="border-t border-b border-slate-200 bg-slate-100 px-4 py-4 text-center">
      <div className="mx-auto max-w-4xl text-[12px] leading-relaxed text-slate-600">
        <p className="mb-1 font-semibold text-slate-700">⚠️ הבהרה משפטית חשובה:</p>
        <p>
          אתר זה מופעל על ידי סוכנות ביטוח מורשה ופרטית (״Future Insurance״) ואינו האתר הממשלתי
          הרשמי של ״הר הביטוח״ (har.mof.gov.il) או משרד האוצר. השירות באתר מסופק במסגרת ליווי וייעוץ
          ביטוחי מקצועי בכפוף להסכמת המשתמש ולתקנון האתר.
        </p>
      </div>
    </div>
  );
}
