import type { TravelInput, RecommendedProviderId } from '@/lib/calculator';
import { estimatePricePerDay } from '@/lib/calculator';
import { PROVIDERS } from '@/lib/providers';
import ProviderCard from './ProviderCard';

/**
 * Renders the four provider cards. The recommended provider is moved to the
 * front of the DOM order — in RTL the first grid cell sits at the reading-start
 * (right), so "recommended" reads first for both sighted and AT users.
 */
export default function ProviderGrid({
  input,
  recommendedId,
}: {
  input: TravelInput;
  recommendedId: RecommendedProviderId;
}) {
  const recommended = PROVIDERS.find((p) => p.id === recommendedId);
  const rest = PROVIDERS.filter((p) => p.id !== recommendedId);
  const ordered = recommended ? [recommended, ...rest] : PROVIDERS;

  return (
    <section id="providers" className="mx-auto w-full max-w-container scroll-mt-24 px-6 py-14 md:px-10 md:py-16">
      <header className="mx-auto max-w-2xl text-center">
        <span className="eyebrow text-[13px]">השוואת חברות</span>
        <h2 className="mt-2 text-[clamp(24px,5vw,30px)] font-bold leading-tight text-ink">
          ארבע חברות מובילות, בחירה אחת נכונה
        </h2>
        <p className="mt-3 text-[16px] leading-relaxed text-muted">
          המחירים מתעדכנים לפי המחשבון. הכרטיס המסומן הותאם אישית לפרופיל הנסיעה שלכם.
        </p>
      </header>

      {/* mobile (<md): horizontal swipeable snap-carousel · md+: aligned grid.
          The md:contents wrapper lets the grid treat each <article> as its own
          cell (so auto-rows-fr equal-height + CTA pinning still work). */}
      <div className="provider-grid hide-scroll mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 pt-6 md:grid md:auto-rows-fr md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 md:pt-0 xl:grid-cols-4">
        {ordered.map((provider) => (
          <div
            key={provider.id}
            className="min-w-[82%] shrink-0 snap-center sm:min-w-[48%] md:contents print:contents"
          >
            <ProviderCard
              provider={provider}
              pricePerDay={estimatePricePerDay(input, provider.id)}
              isRecommended={provider.id === recommendedId}
            />
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-[12px] text-muted md:hidden" aria-hidden>
        ← החליקו לצפייה בכל החברות →
      </p>

      <p className="mt-6 text-center text-[13px] text-muted">
        * המחירים להמחשה בלבד ואינם מהווים הצעה מחייבת.
      </p>
    </section>
  );
}
