import { SITE } from './content';

/**
 * Shared JSON-LD builders. Every page already ships its own page-specific graph
 * (FAQPage, Article, …); these add the site-wide entities Google needs to draw
 * rich results — the publisher, the breadcrumb trail above the blue link, and a
 * typed service entity for the insurance verticals.
 *
 * Everything is keyed by a stable @id so the graph nodes on different pages
 * refer to the SAME organisation rather than declaring a new one each time.
 */

export const ORG_ID = `${SITE.url}/#organization`;
export const SITE_ID = `${SITE.url}/#website`;

/** The publisher. InsuranceAgency is a subtype of Organization + LocalBusiness. */
export function organizationSchema() {
  return {
    '@type': 'InsuranceAgency',
    '@id': ORG_ID,
    name: SITE.name,
    alternateName: SITE.nameHe,
    url: SITE.url,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE.url}/new-logo.png`,
    },
    image: `${SITE.url}/opengraph-image`,
    telephone: '+972-52-842-2884',
    priceRange: '₪₪',
    areaServed: { '@type': 'Country', name: 'Israel' },
    address: { '@type': 'PostalAddress', addressCountry: 'IL' },
    inLanguage: 'he-IL',
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: SITE.url,
    name: SITE.name,
    inLanguage: 'he-IL',
    publisher: { '@id': ORG_ID },
  };
}

export interface Crumb {
  name: string;
  /** Site-relative path, e.g. '/travel-insurance'. */
  path: string;
}

/**
 * BreadcrumbList. "בית" is prepended automatically, so callers pass only the
 * trail below the home page, ending with the current page.
 */
export function breadcrumbSchema(trail: Crumb[]) {
  const full: Crumb[] = [{ name: 'בית', path: '/' }, ...trail];
  return {
    '@type': 'BreadcrumbList',
    itemListElement: full.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE.url}${c.path === '/' ? '' : c.path}`,
    })),
  };
}

export interface ServiceInfo {
  name: string;
  description: string;
  path: string;
  /** e.g. 'ביטוח נסיעות לחו״ל' — surfaced as serviceType in the graph. */
  serviceType: string;
}

/** FinancialService entity for an insurance vertical, provided by the agency. */
export function financialServiceSchema(s: ServiceInfo) {
  return {
    '@type': 'FinancialService',
    '@id': `${SITE.url}${s.path}#service`,
    name: s.name,
    description: s.description,
    url: `${SITE.url}${s.path}`,
    serviceType: s.serviceType,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Israel' },
    inLanguage: 'he-IL',
  };
}

/**
 * Assembles a single @graph document. Passing one script per page (rather than
 * several) keeps the nodes cross-referencable by @id.
 */
export function buildGraph(nodes: object[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes });
}
