import type { PriceableProviderId } from '@/lib/calculator';
import type { ImageKey } from '@/lib/images';

/**
 * Rich config for the branded travel landing pages (/travel-insurance/[slug]).
 *
 * ⚠️ ILLUSTRATIVE MARKETING DATA: ratingScore / ratingCount and `reviews` are
 * example figures for layout, NOT the carriers' real published ratings. They are
 * rendered with a visible "להמחשה / לדוגמה" label. Replace with real, verifiable,
 * consented data before running paid ads — presenting fabricated ratings for a
 * named competitor is a misleading-advertising / comparative-advertising risk.
 * These are independent comparison/lead pages by a licensed agency, not the
 * carriers' official sites (the hero states this).
 */

export interface BrandReview {
  initials: string;
  name: string;
  city: string;
  from: string;
  to: string;
  text: string;
}
export interface BrandCompareRow {
  label: string;
  direct: string;
  future: string;
}
export interface BrandArticle {
  title: string;
  tag: string;
  read: string;
}
export interface BrandFaq {
  q: string;
  a: string;
}

export interface BrandConfig {
  slug: 'passportcard' | 'harel' | 'clal' | 'migdal';
  providerId: PriceableProviderId;
  name: string;
  accent: string;
  accent2: string;
  passTitle: string;
  appBadge: { emoji: string; title: string; text: string };
  perks: { img: ImageKey; title: string; text: string }[];
  ratingScore: number;
  ratingCount: string;
  reviews: BrandReview[];
  compare: BrandCompareRow[];
  articles: BrandArticle[];
  faq: BrandFaq[];
}

const VIP = 'שירות VIP + ליווי תביעות בוואטסאפ';

function compareFor(name: string): BrandCompareRow[] {
  return [
    { label: 'מחיר הפוליסה', direct: 'מחיר החברה', future: 'אותו מחיר בדיוק' },
    { label: 'השוואה מול חברות נוספות', direct: 'רק ' + name, future: '4 חברות מובילות' },
    { label: 'ליווי בהגשת תביעה', direct: 'מול מוקד החברה', future: VIP },
    { label: 'זמינות סוכן אישי', direct: 'לא', future: 'סוכן מורשה בוואטסאפ' },
    { label: 'עלות השירות', direct: '—', future: 'ללא עלות נוספת' },
  ];
}

export const BRANDS: Record<BrandConfig['slug'], BrandConfig> = {
  passportcard: {
    slug: 'passportcard',
    providerId: 'passportcard',
    name: 'PassportCard',
    accent: '#E10600',
    accent2: '#8A0400',
    passTitle: 'כרטיס נסיעה',
    appBadge: {
      emoji: '💳',
      title: 'כרטיס PassportCard',
      text: 'תשלום ישיר לספק הרפואי בחו״ל — בלי הוצאות מהכיס ובלי החזרים.',
    },
    perks: [
      { img: 'usa', title: 'תשלום ישיר — בלי הוצאות מהכיס', text: 'הכרטיס משלם ישירות לבית החולים או לרופא בחו״ל. אתם לא מוציאים כסף ולא ממתינים חודשים להחזר — יתרון קריטי בארה״ב.' },
      { img: 'flight', title: 'רופא אונליין באפליקציה', text: 'ייעוץ רפואי מרחוק דרך האפליקציה ומוקד תמיכה בעברית, כדי לקבל מענה מהיר עוד לפני שמגיעים למרפאה.' },
      { img: 'passport', title: 'כיסוי מוביל ליעדים יקרים', text: 'כיסוי רפואי גבוה שמתאים במיוחד לארה״ב ולמדינות עם עלויות רפואיות גבוהות — ראש שקט לאורך כל הנסיעה.' },
    ],
    ratingScore: 4.9,
    ratingCount: '1,900+',
    reviews: [
      { initials: 'ד״', name: 'דנה כ.', city: 'תל אביב', from: '#E10600', to: '#8A0400', text: 'נפצעתי בטיול בארה״ב והכרטיס שילם ישירות לבית החולים — לא הוצאתי שקל מהכיס. שירות מדהים.' },
      { initials: 'י״', name: 'יוסי מ.', city: 'הרצליה', from: '#E10600', to: '#8A0400', text: 'רופא אונליין תוך דקות, וכל התהליך דרך האפליקציה. הפעם הראשונה שביטוח נסיעות באמת עבד.' },
    ],
    compare: compareFor('PassportCard'),
    articles: [
      { title: 'מדריך PassportCard 2026 — כל מה שצריך לדעת', tag: 'מדריך', read: '6 דק׳' },
      { title: 'איך עובד תשלום ישיר בחו״ל בלי החזרים?', tag: 'הסבר', read: '4 דק׳' },
      { title: 'PassportCard לארה״ב — למה זו הבחירה המובילה', tag: 'יעדים', read: '5 דק׳' },
    ],
    faq: [
      { q: 'מה היתרון של PassportCard?', a: 'הכרטיס משלם ישירות לספק הרפואי בחו״ל, כך שאתם לא מוציאים כסף מהכיס ולא ממתינים להחזרים — יתרון משמעותי במיוחד בארה״ב.' },
      { q: 'האם PassportCard מתאים לארה״ב?', a: 'כן, זו אחת הבחירות המובילות לארה״ב בזכות מודל התשלום הישיר וכיסוי רפואי גבוה במדינה עם עלויות רפואיות יקרות.' },
      { q: 'יש רופא אונליין?', a: 'כן, קיים שירות רופא מרחוק דרך האפליקציה, לצד מוקד תמיכה בעברית.' },
      { q: 'האם אפשר להרחיב לספורט אתגרי או מצב רפואי?', a: 'כן, ניתן להוסיף הרחבות. נעזור לכם להתאים את הכיסוי לפרופיל הנסיעה שלכם.' },
      { q: 'איך רוכשים דרככם?', a: 'משווים במחשבון, בוחרים PassportCard ורוכשים דיגיטלית — באותו מחיר, עם ליווי סוכן מורשה בוואטסאפ.' },
    ],
  },
  harel: {
    slug: 'harel',
    providerId: 'harel',
    name: 'הראל',
    accent: '#004B93',
    accent2: '#D4A24A',
    passTitle: 'כרטיס נסיעה',
    appBadge: {
      emoji: '🚨',
      title: 'שירות חירום מיידי',
      text: 'מוקד רפואי ואפליקציית שירות זמינים 24/7 מכל מקום בעולם.',
    },
    perks: [
      { img: 'europe', title: 'רשת רופאים נרחבת', text: 'גישה לרשת ספקים רפואיים גדולה, במיוחד באירופה — כך מקבלים טיפול מהיר ואיכותי בכל מקום.' },
      { img: 'family', title: 'כיסוי משפחתי מלא', text: 'חבילות משפחתיות משתלמות עם רופא אונליין וכיסוי לכל בני המשפחה — שקט נפשי לטיול המשפחתי.' },
      { img: 'airport', title: 'מוקד חירום 24/7 בעברית', text: 'מענה אנושי בעברית מסביב לשעון ואפליקציית שירות שמלווה אתכם מרגע היציאה ועד החזרה.' },
    ],
    ratingScore: 4.8,
    ratingCount: '2,300+',
    reviews: [
      { initials: 'ר״', name: 'רונית ל.', city: 'חיפה', from: '#004B93', to: '#0066cc', text: 'טסנו עם הילדים לאירופה — כיסוי משפחתי מצוין ורופא אונליין שחסך לנו ביקור במרפאה זרה.' },
      { initials: 'א״', name: 'אמיר ב.', city: 'רעננה', from: '#004B93', to: '#D4A24A', text: 'מחיר הוגן וכיסוי רחב. כשהיתה בעיה — המוקד ענה תוך דקה בעברית. ממליץ בחום.' },
    ],
    compare: compareFor('הראל'),
    articles: [
      { title: 'ביטוח נסיעות הראל 2026 — מדריך מלא', tag: 'מדריך', read: '6 דק׳' },
      { title: 'איך מגישים תביעה בהראל מחו״ל?', tag: 'תביעות', read: '5 דק׳' },
      { title: 'הראל לטיול משפחתי באירופה — מה כלול', tag: 'משפחות', read: '4 דק׳' },
    ],
    faq: [
      { q: 'מה מייחד את ביטוח הנסיעות של הראל?', a: 'רשת רופאים נרחבת, מוקד חירום 24/7 בעברית, ואפליקציית שירות — עם יחס כיסוי-מחיר אטרקטיבי, במיוחד לאירופה ולמשפחות.' },
      { q: 'האם יש כיסוי משפחתי?', a: 'כן, קיימות חבילות משפחתיות משתלמות עם רופא אונליין וכיסוי לכל המשפחה.' },
      { q: 'איך פועלים במקרה חירום בחו״ל?', a: 'מתקשרים למוקד החירום (זמין 24/7) או משתמשים באפליקציה. המוקד מכוון אתכם לספק הקרוב ומלווה בתהליך.' },
      { q: 'האם אפשר להוסיף הרחבות?', a: 'כן — ספורט חורף, ציוד, ביטול נסיעה ועוד. נתאים את ההרחבות ליעד ולפרופיל שלכם.' },
      { q: 'איך רוכשים דרככם?', a: 'משווים במחשבון, בוחרים הראל ורוכשים — באותו מחיר, עם ליווי סוכן מורשה בוואטסאפ.' },
    ],
  },
  clal: {
    slug: 'clal',
    providerId: 'clal',
    name: 'כלל',
    accent: '#002D62',
    accent2: '#F5821F',
    passTitle: 'כרטיס נסיעה',
    appBadge: {
      emoji: '⚡',
      title: 'מדיפ״ס — תשלום מהיר',
      text: 'טיפול ותשלום תביעות רפואיות במהירות, ישירות מול הספק בחו״ל.',
    },
    perks: [
      { img: 'asia', title: 'טיפול ותשלום מהירים', text: 'מנגנון לטיפול מהיר בתביעות רפואיות בחו״ל, לרוב ישירות מול הספק — פחות בירוקרטיה, פחות המתנה.' },
      { img: 'beach', title: 'מחיר משתלם', text: 'תמחור אטרקטיבי לפרופילים סטנדרטיים — כיסוי טוב במחיר נוח, בדיוק למה שצריך.' },
      { img: 'roadtrip', title: 'כיסוי סטנדרטי מקיף', text: 'חבילה מקיפה לנסיעות קצרות וסטנדרטיות, עם אפשרות להרחבות לפי הצורך.' },
    ],
    ratingScore: 4.7,
    ratingCount: '1,400+',
    reviews: [
      { initials: 'מ״', name: 'מיכל ר.', city: 'ראשון לציון', from: '#002D62', to: '#F5821F', text: 'המחיר היה הכי משתלם שמצאתי, והכיסוי הבסיסי כיסה בדיוק את מה שהיינו צריכים לטיול באסיה.' },
      { initials: 'ג״', name: 'גיא פ.', city: 'מודיעין', from: '#002D62', to: '#0047a0', text: 'תהליך רכישה פשוט ומהיר, והתמיכה של הסוכן דרך וואטסאפ עשתה את ההבדל. מרוצה מאוד.' },
    ],
    compare: compareFor('כלל'),
    articles: [
      { title: 'ביטוח נסיעות כלל 2026 — מדריך והשוואה', tag: 'מדריך', read: '5 דק׳' },
      { title: 'איך מגישים תביעה בכלל ביטוח מחו״ל', tag: 'תביעות', read: '5 דק׳' },
      { title: 'כלל — ביטוח נסיעות משתלם לטיולים קצרים', tag: 'תקציב', read: '4 דק׳' },
    ],
    faq: [
      { q: 'למי מתאים ביטוח הנסיעות של כלל?', a: 'לרוב מתאים לנסיעות סטנדרטיות וקצרות המחפשות כיסוי בסיסי-מקיף במחיר אטרקטיבי. נבדוק יחד אם זו הבחירה הנכונה עבורכם.' },
      { q: 'מהו שירות התביעות המהיר?', a: 'מנגנון לטיפול מהיר בתביעות רפואיות בחו״ל, לרוב מול הספק ישירות, כדי לקצר את זמן ההמתנה והבירוקרטיה.' },
      { q: 'האם המחיר באמת זול יותר?', a: 'כלל לרוב מתומחרת אטרקטיבית לפרופילים סטנדרטיים. חשוב להשוות מול חברות נוספות — וזה בדיוק מה שנעשה במחשבון.' },
      { q: 'אפשר להרחיב את הכיסוי?', a: 'כן, ניתן להוסיף הרחבות לפי הצורך (ספורט, ציוד, ביטול). נתאים לכם את החבילה.' },
      { q: 'איך רוכשים דרככם?', a: 'משווים במחשבון, בוחרים כלל ורוכשים — באותו מחיר, עם ליווי סוכן מורשה בוואטסאפ.' },
    ],
  },
  migdal: {
    slug: 'migdal',
    providerId: 'migdal',
    name: 'מגדל',
    accent: '#001E50',
    accent2: '#10B981',
    passTitle: 'כרטיס נסיעה',
    appBadge: {
      emoji: '👨‍⚕️',
      title: 'רופא בשיחת וידאו 24/7',
      text: 'ייעוץ רפואי בעברית בשיחת וידאו, מכל מקום בעולם ובכל שעה.',
    },
    perks: [
      { img: 'mountains', title: 'כיסוי מקיף ואיתן', text: 'פוליסה חזקה שמתאימה במיוחד לטיולים ארוכים, סבב עולם ויעדים מרובים — בלי דאגות.' },
      { img: 'aurora', title: 'רופא בשיחת וידאו 24/7', text: 'ייעוץ רפואי בעברית בשיחת וידאו בכל שעה, מכל מקום — נוח במיוחד כשלא רוצים ללכת למרפאה זרה.' },
      { img: 'flight', title: 'מתאים גם לבני 60+', text: 'פתרונות מותאמים לגילאים מבוגרים יותר ולשהייה ממושכת בחו״ל, עם כיסוי רחב ואמין.' },
    ],
    ratingScore: 4.8,
    ratingCount: '1,600+',
    reviews: [
      { initials: 'ש״', name: 'שירה נ.', city: 'ירושלים', from: '#001E50', to: '#10B981', text: 'טיול ארוך של חודשיים — מגדל נתנה כיסוי מקיף ואיתן, ורופא בווידאו כשהיה חשש רפואי. הרגשתי בטוחה.' },
      { initials: 'ע״', name: 'עופר ד.', city: 'כפר סבא', from: '#001E50', to: '#0a3a7a', text: 'נסענו סבב עולם. הכיסוי הרב-יעדי היה מושלם, וההתנהלות מול הסוכן הייתה מקצועית ורגועה.' },
    ],
    compare: compareFor('מגדל'),
    articles: [
      { title: 'ביטוח נסיעות מגדל 2026 — מדריך מקיף', tag: 'מדריך', read: '6 דק׳' },
      { title: 'רופא בשיחת וידאו בחו״ל — איך זה עובד', tag: 'הסבר', read: '4 דק׳' },
      { title: 'מגדל לטיולים ארוכים וסבב עולם', tag: 'יעדים', read: '5 דק׳' },
    ],
    faq: [
      { q: 'מתי כדאי לבחור במגדל?', a: 'מגדל מתמחה בכיסוי מקיף ואיתן — מתאים במיוחד לנסיעות ארוכות, סבב עולם, יעדים מרובים ולבני 60+.' },
      { q: 'איך עובד הרופא בשיחת וידאו?', a: 'דרך האפליקציה מזמינים ייעוץ רפואי בעברית בשיחת וידאו, 24/7, מכל מקום — נוח במיוחד כשלא רוצים ללכת למרפאה זרה.' },
      { q: 'האם מתאים לטיולים ארוכים?', a: 'כן. לטיולים של 45 יום ומעלה מגדל מציעה כיסוי מורחב לשהייה ממושכת בחו״ל.' },
      { q: 'יש כיסוי לבני 60+?', a: 'כן, מגדל מציעה פתרונות מותאמים לגילאים מבוגרים יותר. נתאים לכם את הכיסוי הנכון.' },
      { q: 'איך רוכשים דרככם?', a: 'משווים במחשבון, בוחרים מגדל ורוכשים — באותו מחיר, עם ליווי סוכן מורשה בוואטסאפ.' },
    ],
  },
};

export function getBrand(slug: string): BrandConfig | null {
  return (BRANDS as Record<string, BrandConfig>)[slug] ?? null;
}
