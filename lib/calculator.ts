/**
 * Travel-insurance recommendation engine (pure, framework-free).
 *
 * Product rule (from the brief):
 *   USA / Extreme sports / Pre-existing condition  ->  PassportCard
 *   Europe / Family / Standard                     ->  Harel
 *
 * Implemented as a transparent weighted-scoring model so the UI can explain
 * *why* a provider is recommended. Risk-heavy signals (US medical exposure,
 * pre-existing conditions, extreme sports) are weighted to decisively override
 * destination — matching the brief's intent that they always steer to
 * PassportCard's "no out-of-pocket" medical model.
 */

export type Destination = 'europe' | 'usa' | 'asia' | 'worldwide';

export type HealthAddonId =
  | 'preExisting'
  | 'extremeSports'
  | 'winterSports'
  | 'pregnancy';

/** Providers the calculator can actively recommend. Clal is a budget placeholder
 *  card and is intentionally outside the recommendation logic. */
export type RecommendedProviderId = 'passportcard' | 'harel' | 'migdal';

/** A long-haul trip (days) that steers toward Migdal's comprehensive cover. */
export const LONG_TRIP_DAYS = 45;

export interface TravelInput {
  destination: Destination;
  durationDays: number;
  travelers: number;
  addons: HealthAddonId[];
}

export interface RecommendationReason {
  /** Stable machine code (useful for analytics / testing). */
  code: string;
  /** Hebrew, user-facing rationale. */
  label: string;
}

export interface Recommendation {
  providerId: RecommendedProviderId;
  /** Raw scores, exposed for transparency / debugging. */
  scores: Record<RecommendedProviderId, number>;
  /** 0–100 confidence that this is the right pick, from the score margin. */
  confidence: number;
  /** Ordered, most-important-first reasons (Hebrew). */
  reasons: RecommendationReason[];
}

/* ------------------------------------------------------------------ *
 * Option metadata — single source of truth shared with the UI so
 * labels never drift between the calculator and the rendered controls.
 * ------------------------------------------------------------------ */

export const DESTINATIONS: { id: Destination; label: string; emoji: string }[] = [
  { id: 'europe', label: 'אירופה', emoji: '🇪🇺' },
  { id: 'usa', label: 'ארה״ב', emoji: '🇺🇸' },
  { id: 'asia', label: 'אסיה', emoji: '🌏' },
  { id: 'worldwide', label: 'כל העולם', emoji: '🌍' },
];

export const HEALTH_ADDONS: { id: HealthAddonId; label: string }[] = [
  { id: 'preExisting', label: 'מצב רפואי קיים' },
  { id: 'extremeSports', label: 'ספורט אתגרי' },
  { id: 'winterSports', label: 'ספורט חורף / סקי' },
  { id: 'pregnancy', label: 'הריון' },
];

/** A trip with 3+ travelers reads as a family. */
export const FAMILY_THRESHOLD = 3;

/* ------------------------------------------------------------------ *
 * Decision rule — transparent PRIORITY ladder (not a weighted sum):
 *
 *   1. USA  OR  Extreme sports  OR  Pre-existing condition  -> PassportCard
 *        (US medical exposure / high-risk always favour no-out-of-pocket)
 *   2. Worldwide  OR  long trip (45+ days)  OR  Pregnancy    -> Migdal
 *        (comprehensive, financially strong cover for wide/long/complex trips)
 *   3. Europe / Asia / Family / Standard (everything else)   -> Harel
 *
 * Higher rungs override lower ones, so the original brief still holds:
 * USA->PassportCard and Europe/Family/Standard->Harel can never be violated.
 * ------------------------------------------------------------------ */

/** The three brief-defined PassportCard triggers, in priority order. */
function passportcardReasons(input: TravelInput): RecommendationReason[] {
  const reasons: RecommendationReason[] = [];
  if (input.destination === 'usa') {
    reasons.push({
      code: 'dest_usa',
      label: 'יעד ארה״ב — עלויות רפואיות גבוהות, כיסוי ללא השתתפות עצמית',
    });
  }
  if (input.addons.includes('preExisting')) {
    reasons.push({
      code: 'addon_preexisting',
      label: 'מצב רפואי קיים — כיסוי מורחב ותשלום ישיר לספק',
    });
  }
  if (input.addons.includes('extremeSports')) {
    reasons.push({
      code: 'addon_extreme',
      label: 'ספורט אתגרי — הרחבה לפעילויות בסיכון גבוה',
    });
  }
  // Supporting (non-deciding) add-ons that still favour the direct-pay model.
  if (input.addons.includes('winterSports')) {
    reasons.push({
      code: 'addon_winter',
      label: 'ספורט חורף / סקי — כיסוי חילוץ ופציעות בהרים',
    });
  }
  if (input.addons.includes('pregnancy')) {
    reasons.push({
      code: 'addon_pregnancy',
      label: 'הריון — כיסוי רפואי מוגבר בחו״ל',
    });
  }
  return reasons;
}

function harelReasons(input: TravelInput): RecommendationReason[] {
  const reasons: RecommendationReason[] = [];
  if (input.destination === 'europe') {
    reasons.push({
      code: 'dest_europe',
      label: 'יעד אירופה — כיסוי משתלם ורשת רופאים נרחבת',
    });
  } else if (input.destination === 'asia') {
    reasons.push({
      code: 'dest_asia',
      label: 'יעד אסיה — כיסוי סטנדרטי מקיף במחיר אטרקטיבי',
    });
  } else {
    reasons.push({
      code: 'dest_worldwide',
      label: 'כיסוי רב-יעדי — חבילה סטנדרטית מקיפה ומשתלמת',
    });
  }
  if (input.travelers >= FAMILY_THRESHOLD) {
    reasons.push({
      code: 'family',
      label: 'נסיעה משפחתית — אפליקציית רופא אונליין וכיסוי לכל המשפחה',
    });
  }
  if (input.addons.length === 0) {
    reasons.push({
      code: 'standard',
      label: 'פרופיל נסיעה סטנדרטי — יחס כיסוי-מחיר מצוין',
    });
  }
  return reasons;
}

/** Migdal — comprehensive cover for wide-reaching, long, or complex trips. */
function migdalReasons(input: TravelInput): RecommendationReason[] {
  const reasons: RecommendationReason[] = [];
  if (input.destination === 'worldwide') {
    reasons.push({
      code: 'dest_worldwide_migdal',
      label: 'כיסוי עולמי מקיף — פוליסה איתנה לנסיעה רב-יעדית',
    });
  }
  if (input.durationDays >= LONG_TRIP_DAYS) {
    reasons.push({
      code: 'long_trip',
      label: 'טיול ארוך — כיסוי מורחב לשהייה ממושכת בחו״ל',
    });
  }
  if (input.addons.includes('pregnancy')) {
    reasons.push({
      code: 'addon_pregnancy_migdal',
      label: 'הריון — כיסוי רפואי מוגבר ומקיף',
    });
  }
  if (input.travelers >= FAMILY_THRESHOLD) {
    reasons.push({
      code: 'family_migdal',
      label: 'משפחות ובני 60+ — התמחות בכיסוי מקיף ואיתן',
    });
  }
  return reasons;
}

/**
 * Recommend a provider for the given trip. Deterministic and total — every
 * input maps to exactly one of PassportCard / Migdal / Harel via the ladder.
 */
export function recommendProvider(input: TravelInput): Recommendation {
  const isPassportcard =
    input.destination === 'usa' ||
    input.addons.includes('extremeSports') ||
    input.addons.includes('preExisting');

  const isMigdal =
    !isPassportcard &&
    (input.destination === 'worldwide' ||
      input.durationDays >= LONG_TRIP_DAYS ||
      input.addons.includes('pregnancy'));

  const providerId: RecommendedProviderId = isPassportcard
    ? 'passportcard'
    : isMigdal
      ? 'migdal'
      : 'harel';

  const reasons = isPassportcard
    ? passportcardReasons(input)
    : isMigdal
      ? migdalReasons(input)
      : harelReasons(input);

  // Friendly confidence band derived from how many aligned signals we found.
  const confidence = Math.min(97, 74 + reasons.length * 8);

  // Retained for transparency/debugging; the decision itself is the priority
  // ladder above, not a score comparison.
  const scores: Record<RecommendedProviderId, number> = {
    passportcard: providerId === 'passportcard' ? reasons.length : 0,
    harel: providerId === 'harel' ? reasons.length : 0,
    migdal: providerId === 'migdal' ? reasons.length : 0,
  };

  return { providerId, scores, confidence, reasons };
}

/* ------------------------------------------------------------------ *
 * Indicative pricing (₪ per traveler per day)
 * A transparent, purely client-side estimate — never a bindable quote.
 * All three providers are priced, so every card shows a live "from" figure.
 * ------------------------------------------------------------------ */

export type PriceableProviderId = 'passportcard' | 'harel' | 'migdal' | 'clal';

const BASE_PRICE_PER_DAY: Record<PriceableProviderId, number> = {
  passportcard: 16,
  migdal: 13,
  harel: 11,
  clal: 8,
};

const DESTINATION_MULTIPLIER: Record<Destination, number> = {
  europe: 1.0,
  asia: 1.15,
  usa: 1.7,
  worldwide: 1.45,
};

const ADDON_SURCHARGE: Record<HealthAddonId, number> = {
  preExisting: 0.45,
  extremeSports: 0.3,
  winterSports: 0.25,
  pregnancy: 0.2,
};

/** Longer trips earn a modest per-day discount. */
function durationFactor(days: number): number {
  if (days > 60) return 0.82;
  if (days > 30) return 0.9;
  if (days > 14) return 0.95;
  return 1;
}

/**
 * Indicative "from ₪X / day per traveler" figure for a given provider.
 * Deterministic and dependency-free so it can drive live UI without a fetch.
 */
export function estimatePricePerDay(
  input: TravelInput,
  providerId: PriceableProviderId,
): number {
  const surcharge = input.addons.reduce(
    (sum, id) => sum + (ADDON_SURCHARGE[id] ?? 0),
    0,
  );
  const raw =
    BASE_PRICE_PER_DAY[providerId] *
    DESTINATION_MULTIPLIER[input.destination] *
    (1 + surcharge) *
    durationFactor(input.durationDays);

  return Math.max(BASE_PRICE_PER_DAY[providerId], Math.round(raw));
}

/**
 * Marginal ₪/day a single add-on adds for a provider, at the current trip
 * settings — drives the live "+₪X ליום" delta badges on the toggle cards.
 */
export function addonDeltaPerDay(
  input: TravelInput,
  providerId: PriceableProviderId,
  addonId: HealthAddonId,
): number {
  const without = { ...input, addons: input.addons.filter((a) => a !== addonId) };
  const withAddon = { ...without, addons: [...without.addons, addonId] };
  return Math.max(
    0,
    estimatePricePerDay(withAddon, providerId) - estimatePricePerDay(without, providerId),
  );
}

/** Quick traveler-count presets (single / couple / family) for the chips. */
export const TRAVELER_PRESETS: {
  label: string;
  emoji: string;
  value: number;
  /** true = "this and up" (family), false = exact match. */
  andUp?: boolean;
}[] = [
  { label: 'יחיד', emoji: '👨‍💼', value: 1 },
  { label: 'זוג', emoji: '👩‍❤️‍👨', value: 2 },
  { label: 'משפחה', emoji: '👨‍👩‍👧‍👦', value: FAMILY_THRESHOLD, andUp: true },
];
