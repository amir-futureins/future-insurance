/**
 * Structured-data (JSON-LD) definitions for the licensed agency.
 *
 * Single source of truth for the regulatory identifiers so the footer, the meta
 * description and the schema graph can never drift apart. They did drift once:
 * an earlier revision published the company number 208678854 under the label
 * "מס׳ רישיון" across the landing page. LICENSE and TAX_ID are two different
 * identifiers and must never be swapped.
 *
 * Nothing here may be invented — every value is a real, supplied detail.
 */

/** Capital Market Authority agent licence. */
export const AGENCY_LICENSE = 'L-00139094';

/** Company / VAT number (ח.פ). NOT the licence. */
export const AGENCY_TAX_ID = '208678854';

/** Licensed branches (ענפי רישיון). */
export const AGENCY_BRANCHES = 'אלמנטרי';

/** Display name used in Hebrew body copy. */
export const AGENCY_NAME = "פיוצ'ר סוכנות לביטוח";

/** Full legal name used for structured data and formal disclosure. */
export const AGENCY_LEGAL_NAME = "Future Insurance — פיוצ'ר סוכנות לביטוח";

/** Licensed agent who manages the agency. */
export const AGENCY_MANAGER = 'אמיר שושני';
export const AGENCY_MANAGER_TITLE = 'סוכן ביטוח מורשה';

export const AGENCY_PHONE = '+972-52-842-2884';

/**
 * schema.org InsuranceAgency node.
 *
 * `name` is the AGENCY, never the person — the graph is the machine-readable
 * copy of the same disclosure the footer carries, and naming the individual
 * there would contradict the visible "this is an agency" statement.
 */
export function insuranceAgencySchema(siteUrl: string) {
  return {
    '@type': 'InsuranceAgency',
    '@id': `${siteUrl}/#agent`,
    name: AGENCY_LEGAL_NAME,
    legalName: AGENCY_LEGAL_NAME,
    alternateName: AGENCY_NAME,
    description:
      'סוכנות ביטוח מורשה המשווקת ביטוח נסיעות לחו״ל של פספורטכארד ברכישה דיגיטלית.',
    url: `${siteUrl}/`,
    telephone: AGENCY_PHONE,
    priceRange: '₪₪',
    areaServed: { '@type': 'Country', name: 'Israel' },
    address: { '@type': 'PostalAddress', addressCountry: 'IL' },
    inLanguage: 'he-IL',
    identifier: AGENCY_LICENSE,
    taxID: AGENCY_TAX_ID,
    knowsAbout: AGENCY_BRANCHES,
    employee: {
      '@type': 'Person',
      name: AGENCY_MANAGER,
      jobTitle: AGENCY_MANAGER_TITLE,
      identifier: AGENCY_LICENSE,
    },
  };
}
