import {
  breadcrumbSchema,
  organizationSchema,
  websiteSchema,
  financialServiceSchema,
  buildGraph,
  type Crumb,
  type ServiceInfo,
} from '@/lib/seo';

/**
 * Drops one JSON-LD @graph on a page: the publisher + website (so every route
 * declares who owns it), the breadcrumb trail, and optionally a FinancialService
 * entity for insurance verticals.
 *
 * Purely additive — renders a <script type="application/ld+json"> and no markup,
 * so it can be dropped into any page without touching its layout. Pages that
 * already emit their own FAQPage/Article graph keep it; the nodes here reference
 * the same @id, so crawlers merge rather than duplicate.
 */
export default function SeoSchema({
  crumbs,
  service,
}: {
  crumbs: Crumb[];
  service?: ServiceInfo;
}) {
  const nodes: object[] = [organizationSchema(), websiteSchema(), breadcrumbSchema(crumbs)];
  if (service) nodes.push(financialServiceSchema(service));

  return (
    <script
      type="application/ld+json"
      // Server-generated from typed literals — no user input reaches this.
      dangerouslySetInnerHTML={{ __html: buildGraph(nodes) }}
    />
  );
}
