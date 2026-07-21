/**
 * Shared, framework-neutral copy for the Travel Insurance Hub.
 * The FAQ lives here once so the rendered accordion and the FAQPage JSON-LD
 * are guaranteed to match (good for SEO, zero drift).
 */

import type { ImageKey } from './images';

export const SITE = {
  name: 'Future Insurance',
  nameHe: 'פיוצ׳ר אינשורנס',
  url: 'https://futureins.co.il',
  travelPath: '/travel-insurance',
  // Click-to-call only — the raw number is never rendered on screen.
  phoneHref: 'tel:0528422884',
  phoneCta: 'חייגו לייעוץ מיידי',
  phoneCtaAlt: 'שיחה עם מומחה',
} as const;

/** WhatsApp deep-link config. Phone overridable via env for real deployments. */
export const WHATSAPP = {
  phone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? '972501234567',
  message: 'היי אמיר, אשמח להתייעץ לגבי ביטוח חו״ל',
} as const;

export function whatsappHref(): string {
  return `https://wa.me/${WHATSAPP.phone}?text=${encodeURIComponent(WHATSAPP.message)}`;
}

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'מתי כדאי לבחור ב-PassportCard על פני הראל?',
    a: 'PassportCard מתאימה במיוחד לנסיעות לארה״ב, לספורט אתגרי או כשקיים מצב רפואי קודם — בזכות מודל התשלום הישיר לספק ללא השתתפות עצמית. הראל משתלמת יותר לנסיעות משפחתיות באירופה ולכיסוי סטנדרטי.',
  },
  {
    q: 'האם הביטוח מכסה מצב רפואי קיים?',
    a: 'כן, ניתן להוסיף הרחבה למצב רפואי קיים. במחשבון סמנו את ההרחבה המתאימה וההמלצה תתעדכן אוטומטית לחברה עם הכיסוי הרפואי המורחב.',
  },
  {
    q: 'תוך כמה זמן מקבלים את הפוליסה?',
    a: 'הפקת הפוליסה מיידית ואונליין. לאחר בחירת החברה והשלמת הפרטים מקבלים אישור וכרטיס דיגיטלי עוד באותו היום.',
  },
  {
    q: 'האם אפשר לבטח את כל המשפחה בפוליסה אחת?',
    a: 'בהחלט. הזינו את מספר המטיילים במחשבון — מ-3 נוסעים ומעלה המערכת מזהה פרופיל משפחתי ומתאימה כיסוי משפחתי עם יחס מחיר-כיסוי אטרקטיבי.',
  },
  {
    q: 'מתי כדאי לבחור בביטוח הנסיעות של מגדל?',
    a: 'מגדל בולטת בכיסוי מקיף לנסיעות רב-יעדיות (כל העולם), לטיולים ארוכים ולמשפחות ובני 60+, לצד איתנות פיננסית של מותג ותיק. המחשבון ממליץ על מגדל אוטומטית כשבוחרים יעד "כל העולם", טיול ארוך (45 ימים ומעלה) או הרחבת הריון.',
  },
  {
    q: 'מה ההבדל בין פספורטכארד, הראל ומגדל?',
    a: 'פספורטכארד מצטיינת בתשלום ישיר לספק ללא השתתפות עצמית — אידיאלית לארה״ב ולספורט אתגרי. הראל משתלמת למשפחות ולאירופה עם רופא אונליין. מגדל מציעה כיסוי מקיף ואיתן לנסיעות ארוכות ורב-יעדיות. השוו את שלושתן בטבלת הכיסויים ובמחשבון.',
  },
  {
    q: 'המחיר במחשבון הוא סופי ומחייב?',
    a: 'המחיר הוא הערכה ראשונית להמחשה בלבד ואינו מהווה הצעה מחייבת. המחיר הסופי נקבע מול חברת הביטוח בהתאם לפרטי הנסיעה והמבוטחים.',
  },
];

/** Hero trust badges. */
export const TRUST_BADGES = [
  'מפוקח ע״י רשות שוק ההון',
  'פוליסה מיידית אונליין',
  'זמינות 24/7',
] as const;

/* ------------------------------------------------------------------ *
 * Guides & articles ("מדריכים וכתבות ביטוח")
 * Each has a real body so /guides/[slug] is a genuine content page.
 * ------------------------------------------------------------------ */

export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMin: number;
  image: ImageKey;
  body: string[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'how-to-choose',
    title: 'איך לבחור ביטוח נסיעות ב-2026',
    excerpt: 'המדריך המלא להשוואת פוליסות: מה באמת חשוב, ואיפה מסתתרות האותיות הקטנות.',
    category: 'מדריך',
    readMin: 6,
    image: 'passport',
    body: [
      'בחירת ביטוח נסיעות מתחילה בהתאמת הכיסוי לפרופיל הנסיעה: יעד, משך, גיל המבוטחים ופעילויות מתוכננות. פוליסה זולה שאינה מכסה את מה שאתם צריכים עלולה לעלות ביוקר בדיוק ברגע הקריטי.',
      'שימו לב במיוחד לתקרת הכיסוי הרפואי, לגובה ההשתתפות העצמית, ולשאלה האם החברה משלמת ישירות לספק או מחזירה לכם בדיעבד. במחשבון שלנו תוכלו לראות איזו חברה מתאימה לכם — ולמה.',
    ],
  },
  {
    slug: 'usa-insurance',
    title: 'ביטוח נסיעות לארה״ב: כל מה שחשוב לדעת',
    excerpt: 'עלויות רפואיות בארה״ב הן מהגבוהות בעולם. כך מוודאים שאתם מכוסים באמת.',
    category: 'מדריך יעד',
    readMin: 7,
    image: 'usa',
    body: [
      'טיפול רפואי בארה״ב יכול להגיע לעשרות ואף מאות אלפי דולרים. לכן לנסיעה לארה״ב מומלצת פוליסה עם תקרה רפואית גבוהה ומודל תשלום ישיר לספק, שחוסך מכם להוציא סכומים אדירים מהכיס.',
      'PassportCard בולטת ביעד הזה בזכות הכרטיס הדיגיטלי והתשלום הישיר ללא השתתפות עצמית — ולכן המחשבון ממליץ עליה אוטומטית כשבוחרים ארה״ב.',
    ],
  },
  {
    slug: 'europe-trip',
    title: 'טיול באירופה — הכיסוי שאסור לוותר עליו',
    excerpt: 'רשת רופאים רחבה, כיסוי כבודה וביטול טיסה: המדריך לנוסע האירופאי.',
    category: 'מדריך יעד',
    readMin: 5,
    image: 'europe',
    body: [
      'אירופה נחשבת יעד ידידותי מבחינת עלויות רפואיות, אך עדיין חשוב כיסוי לביטול טיסה, איחור והחזר הוצאות. למשפחות, כיסוי סטנדרטי איכותי במחיר משתלם הוא לרוב הבחירה הנכונה.',
      'הראל מציעה רשת שירות רפואי נרחבת ואפליקציית רופא אונליין — יתרון משמעותי בטיול משפחתי באירופה.',
    ],
  },
  {
    slug: 'extreme-ski',
    title: 'ספורט אתגרי וסקי: הרחבות חובה',
    excerpt: 'גלישת סקי, צלילה וטרקים דורשים הרחבה ייעודית. אל תצאו בלעדיה.',
    category: 'הרחבות',
    readMin: 6,
    image: 'ski',
    body: [
      'פוליסות בסיס רבות אינן מכסות פעילויות בסיכון גבוה כמו סקי, סנובורד, צלילה או טיפוס. הרחבת ספורט אתגרי מכסה פציעות, חילוץ ופינוי — הוצאות שעלולות להיות עצומות באזורים מרוחקים.',
      'סמנו את ההרחבה המתאימה במחשבון וההמלצה תתעדכן אוטומטית לחברה עם הכיסוי החזק ביותר לפעילות שלכם.',
    ],
  },
  {
    slug: 'family-travel',
    title: 'ביטוח נסיעות למשפחות — טיפים לחיסכון',
    excerpt: 'איך מבטחים את כל המשפחה בפוליסה אחת, ומה עושים עם ילדים קטנים.',
    category: 'משפחה',
    readMin: 5,
    image: 'family',
    body: [
      'פוליסה משפחתית אחת חוסכת כסף וכאב ראש. מ-3 נוסעים ומעלה המערכת מזהה פרופיל משפחתי ומתאימה כיסוי לכל בני המשפחה, כולל ילדים.',
      'בדקו כיסוי לביטול נסיעה עקב מחלת ילד, וכן זמינות מוקד רפואי בעברית — קריטי כשנוסעים עם ילדים קטנים.',
    ],
  },
  {
    slug: 'baggage-cancellation',
    title: 'כבודה וביטול טיסה: איך תובעים נכון',
    excerpt: 'מזוודה שאבדה או טיסה שבוטלה? כך ממקסמים את הפיצוי בלי כאב ראש.',
    category: 'תביעות',
    readMin: 4,
    image: 'airport',
    body: [
      'שמרו קבלות, צלמו את תכולת המזוודה לפני הנסיעה, ודווחו על אובדן כבודה מיד בשדה התעופה. תיעוד מסודר מקצר משמעותית את זמן הטיפול בתביעה.',
      'בפוליסות עם תביעת כבודה מהירה, כמו של הראל, ניתן לפתוח תביעה דיגיטלית ולקבל מענה מהיר — בלי טפסים אינסופיים.',
    ],
  },
  {
    slug: 'compare-2026',
    title: 'השוואת ביטוח נסיעות לחו״ל 2026 — המדריך המלא',
    excerpt: 'PassportCard, הראל, מגדל וכלל בהשוואה מלאה לשנת 2026: כיסויים, מחירים ולמי כל חברה מתאימה.',
    category: 'השוואה',
    readMin: 8,
    image: 'airport',
    body: [
      'השוואת ביטוח חו״ל ל-2026 חייבת להתחיל בפרופיל הנסיעה: יעד, משך, מספר מטיילים והרחבות. ארבע החברות המובילות — PassportCard, הראל, מגדל וכלל — נבדלות בעיקר בתקרת הכיסוי הרפואי, במודל התשלום (ישיר לספק מול החזר) ובגובה ההשתתפות העצמית.',
      'PassportCard מובילה בתשלום ישיר ללא השתתפות עצמית, הראל משתלמת למשפחות באירופה, מגדל מציעה כיסוי מקיף ואיתן לנסיעות ארוכות ורב-יעדיות, וכלל מתאימה לתקציב מוגבל. המחשבון שלנו משווה את כולן בזמן אמת וממליץ על החברה המתאימה לכם ביותר.',
    ],
  },
  {
    slug: 'passportcard-harel-migdal',
    title: 'פספורטכארד מול הראל ומגדל: מי מנצח?',
    excerpt: 'ההשוואה הישירה בין שלוש חברות הביטוח המובילות — יתרונות, חסרונות ולמי כל אחת מתאימה.',
    category: 'השוואה',
    readMin: 7,
    image: 'flight',
    body: [
      'פספורטכארד מול הראל ומגדל היא אחת ההשוואות המבוקשות ביותר. פספורטכארד בולטת בכרטיס הדיגיטלי ובתשלום הישיר לספק — יתרון עצום בארה״ב ובמצבי חירום. הראל מציעה רשת רופאים נרחבת באירופה ואפליקציית רופא אונליין נוחה למשפחות.',
      'מגדל נכנסת כשחקנית מובילה עם כיסוי רפואי מקיף, תקרות גבוהות והתמחות בנסיעות ארוכות, משפחות ובני 60+. אין "מנצחת" אחת — הבחירה תלויה ביעד ובפרופיל שלכם, ולכן המחשבון מזהה את הטריגרים ומכוון לחברה הנכונה עבורכם.',
    ],
  },
  {
    slug: 'pre-existing-condition',
    title: 'ביטוח נסיעות עם כיסוי למצב רפואי קיים — כל מה שצריך לדעת',
    excerpt: 'סוכרת, לב, לחץ דם או כל מצב קיים? כך מוודאים שהפוליסה באמת מכסה אתכם בחו״ל.',
    category: 'מצב רפואי',
    readMin: 6,
    image: 'family',
    body: [
      'כיסוי למצב רפואי קיים הוא אחד הסעיפים החשובים ביותר — ופוליסת בסיס לרוב לא כוללת אותו. מצב רפואי קיים (כמו סוכרת, מחלת לב או לחץ דם) מחייב הרחבה ייעודית, ולעיתים חיתום רפואי מקדים.',
      'PassportCard ומגדל מציעות כיסוי מורחב למצבים קיימים עם תקרות גבוהות. סמנו את ההרחבה "מצב רפואי קיים" במחשבון וההמלצה תתעדכן אוטומטית לחברה עם הכיסוי החזק ביותר — כדי שלא תופתעו ברגע הקריטי.',
    ],
  },
  {
    slug: 'extreme-sports-addon',
    title: 'הרחבת ספורט אתגרי בביטוח נסיעות — מדריך 2026',
    excerpt: 'סקי, צלילה, טרקים ורכיבה: מתי חובה הרחבת ספורט אתגרי ואיך בוחרים אותה נכון.',
    category: 'הרחבות',
    readMin: 5,
    image: 'mountains',
    body: [
      'הרחבת ספורט אתגרי מכסה פעילויות בסיכון גבוה שאינן נכללות בפוליסת הבסיס: סקי וסנובורד, צלילה, טיפוס, רכיבת שטח וטרקים. בלעדיה, פציעה בזמן פעילות אתגרית עלולה להשאיר אתכם ללא כיסוי — כולל חילוץ ופינוי יקרים.',
      'PassportCard כוללת ספורט אתגרי בהרחבה עם תשלום ישיר, בעוד הראל ומגדל מציעות אותו בתוספת. סמנו "ספורט אתגרי" במחשבון וההמלצה תכוון אתכם לפוליסה עם הכיסוי המתאים לפעילות שלכם.',
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/* ------------------------------------------------------------------ *
 * Real-time social proof (simulated) — recent-purchase toasts.
 * ------------------------------------------------------------------ */

export interface SocialProofItem {
  name: string;
  city: string;
  provider: string;
  minutesAgo: number;
}

export const SOCIAL_PROOF: SocialProofItem[] = [
  { name: 'רועי', city: 'תל אביב', provider: 'PassportCard', minutesAgo: 2 },
  { name: 'מיכל', city: 'חיפה', provider: 'הראל', minutesAgo: 4 },
  { name: 'דניאל', city: 'ירושלים', provider: 'PassportCard', minutesAgo: 6 },
  { name: 'נועה', city: 'רמת גן', provider: 'הראל', minutesAgo: 9 },
  { name: 'איתי', city: 'באר שבע', provider: 'כלל', minutesAgo: 12 },
  { name: 'שירה', city: 'הרצליה', provider: 'PassportCard', minutesAgo: 15 },
  { name: 'עומר', city: 'נתניה', provider: 'הראל', minutesAgo: 18 },
  { name: 'טל', city: 'ראשון לציון', provider: 'PassportCard', minutesAgo: 23 },
];

/* ------------------------------------------------------------------ *
 * Trust statistics (count-up band). Illustrative launch figures.
 * ------------------------------------------------------------------ */

export interface StatItem {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export const STATS: StatItem[] = [
  { value: 45000, suffix: '+', label: 'פוליסות שהושוו' },
  { value: 24, suffix: '%', label: 'חיסכון ממוצע בפרמיה' },
  { value: 100, suffix: '%', label: 'דיגיטלי — ללא טפסים' },
];

/* ------------------------------------------------------------------ *
 * Customer testimonials (קרוסלת לקוחות ממליצים).
 * NOTE: illustrative sample content for launch — replace with real,
 * consented customer reviews (and optional real photos) before go-live.
 * Avatars are initials-in-gradient placeholders, not photos of real people.
 * ------------------------------------------------------------------ */

export interface Testimonial {
  name: string;
  city: string;
  initials: string;
  /** avatar gradient endpoints */
  from: string;
  to: string;
  rating: number;
  /** traveler-type tag, e.g. "חופשת סקי באוסטריה" */
  tag: string;
  quote: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'משפחת לוי',
    city: 'מודיעין',
    initials: 'מל',
    from: '#0057B8',
    to: '#16A34A',
    rating: 5,
    tag: 'טיול משפחתי באירופה',
    quote:
      'טסנו חמישה לאיטליה והבת שלנו חלתה בפירנצה. הראל שלחו רופא אונליין תוך דקות והכול טופל בלי הוצאה מהכיס. שקט נפשי אמיתי לכל המשפחה.',
  },
  {
    name: 'דנה כהן',
    city: 'תל אביב',
    initials: 'דכ',
    from: '#E11933',
    to: '#FF7A45',
    rating: 5,
    tag: 'חופשת סקי באוסטריה',
    quote:
      'שברתי יד בזמן גלישה. PassportCard שילמו ישירות לבית החולים באוסטריה — לא הוצאתי שקל וקיבלתי טיפול מיידי. ממליצה בחום על הכיסוי לספורט חורף.',
  },
  {
    name: 'עומר פרץ',
    city: 'חיפה',
    initials: 'עפ',
    from: '#0086BC',
    to: '#38C6F7',
    rating: 5,
    tag: 'נסיעת עסקים לארה״ב',
    quote:
      'המחשבון המליץ לי בדיוק על הפוליסה הנכונה לניו יורק תוך 30 שניות. הכול דיגיטלי — קיבלתי כרטיס ביטוח לנייד עוד לפני שהמראתי.',
  },
  {
    name: 'נועה ואורי',
    city: 'רעננה',
    initials: 'נא',
    from: '#D4A24A',
    to: '#B98C42',
    rating: 5,
    tag: 'ירח דבש במלדיביים',
    quote:
      'רצינו כיסוי לצלילה ולביטול טיסה. תוך כמה קליקים השווינו בין החברות ובחרנו את המשתלמת. שירות אישי ומקצועי לאורך כל הדרך.',
  },
  {
    name: 'יעל שטרן',
    city: 'ירושלים',
    initials: 'יש',
    from: '#142B55',
    to: '#22366A',
    rating: 5,
    tag: 'טיול תרמילאים בתאילנד',
    quote:
      'שלושה חודשים בדרום-מזרח אסיה עם כיסוי מלא לספורט אתגרי. המחיר היה הטוב ביותר שמצאתי, וההרשמה לקחה דקות ספורות.',
  },
];

/* ------------------------------------------------------------------ *
 * Coverage comparison matrix
 * ------------------------------------------------------------------ */

export interface CoverageCell {
  label: string;
  tier: 'best' | 'good' | 'none';
}

export interface CoverageRow {
  feature: string;
  /** value + tier per provider. tier: 'best' | 'good' | 'none' colours the cell. */
  passportcard: CoverageCell;
  harel: CoverageCell;
  migdal: CoverageCell;
  clal: CoverageCell;
}

export const COVERAGE_ROWS: CoverageRow[] = [
  {
    feature: 'תקרת כיסוי רפואי',
    passportcard: { label: 'עד 10 מ׳ $', tier: 'best' },
    harel: { label: 'עד 5 מ׳ $', tier: 'good' },
    migdal: { label: 'עד 7.5 מ׳ $', tier: 'best' },
    clal: { label: 'עד 2.5 מ׳ $', tier: 'good' },
  },
  {
    feature: 'השתתפות עצמית',
    passportcard: { label: 'ללא', tier: 'best' },
    harel: { label: 'נמוכה', tier: 'good' },
    migdal: { label: 'נמוכה', tier: 'good' },
    clal: { label: 'רגילה', tier: 'good' },
  },
  {
    feature: 'תשלום ישיר לספק',
    passportcard: { label: 'כן — כרטיס דיגיטלי', tier: 'best' },
    harel: { label: 'החזר מהיר', tier: 'good' },
    migdal: { label: 'רשת גלובלית', tier: 'best' },
    clal: { label: 'החזר', tier: 'good' },
  },
  {
    feature: 'כיסוי כבודה',
    passportcard: { label: 'עד ₪12,000', tier: 'best' },
    harel: { label: 'תביעה מהירה', tier: 'best' },
    migdal: { label: 'עד ₪10,000', tier: 'good' },
    clal: { label: 'עד ₪7,500', tier: 'good' },
  },
  {
    feature: 'ביטול / קיצור נסיעה',
    passportcard: { label: 'עד ₪15,000', tier: 'best' },
    harel: { label: 'עד ₪12,000', tier: 'good' },
    migdal: { label: 'עד ₪14,000', tier: 'best' },
    clal: { label: 'עד ₪8,000', tier: 'good' },
  },
  {
    feature: 'ספורט אתגרי',
    passportcard: { label: 'כלול בהרחבה', tier: 'best' },
    harel: { label: 'בתוספת', tier: 'good' },
    migdal: { label: 'בתוספת', tier: 'good' },
    clal: { label: 'לא כלול', tier: 'none' },
  },
  {
    feature: 'ספורט חורף / סקי',
    passportcard: { label: 'כלול', tier: 'best' },
    harel: { label: 'בתוספת', tier: 'good' },
    migdal: { label: 'בתוספת', tier: 'good' },
    clal: { label: 'לא כלול', tier: 'none' },
  },
  {
    feature: 'מצב רפואי קיים',
    passportcard: { label: 'כיסוי מורחב', tier: 'best' },
    harel: { label: 'בכפוף לחיתום', tier: 'good' },
    migdal: { label: 'כיסוי מורחב', tier: 'best' },
    clal: { label: 'מוגבל', tier: 'none' },
  },
  {
    feature: 'רופא אונליין',
    passportcard: { label: 'מוקד 24/7', tier: 'best' },
    harel: { label: 'אפליקציה', tier: 'best' },
    migdal: { label: 'מוקד 24/7', tier: 'best' },
    clal: { label: 'טלפוני', tier: 'good' },
  },
];
