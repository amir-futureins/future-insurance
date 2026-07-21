/**
 * Indicative, purely client-side premium estimators for the agency verticals.
 * Deterministic and dependency-free (safe for live UI, no fetch) — these are
 * illustrative "from" figures for engagement, never a binding quote.
 */

/* ---------------- Life / family protection ---------------- */

export interface LifeInput {
  /** desired monthly income for the family (₪). */
  monthlyIncome: number;
  age: number;
  smoker: boolean;
}

export function estimateLife(input: LifeInput): {
  coverageSum: number;
  monthlyPremium: number;
} {
  // ~200 months (≈ to retirement) of the desired income, rounded to ₪10k.
  const coverageSum = Math.round((input.monthlyIncome * 200) / 10000) * 10000;
  const ageFactor = 1 + Math.max(0, input.age - 30) * 0.045;
  const smokerFactor = input.smoker ? 1.55 : 1;
  const base = (input.monthlyIncome / 1000) * 7.5; // ₪7.5 per ₪1,000 income
  const monthlyPremium = Math.max(29, Math.round(base * ageFactor * smokerFactor));
  return { coverageSum, monthlyPremium };
}

/* ---------------- Mortgage (life + structure) ---------------- */

export interface MortgageInput {
  loanAmount: number;
  years: number;
  life: boolean;
  structure: boolean;
}

export function estimateMortgage(input: MortgageInput): {
  monthlyPremium: number;
  bankPremium: number;
  savingPct: number;
  yearlySaving: number;
} {
  const per100k = input.loanAmount / 100000;
  const yearsFactor = 1 + Math.max(0, input.years - 15) * 0.012;
  const lifePart = input.life ? per100k * 5.5 * yearsFactor : 0;
  const structurePart = input.structure ? per100k * 2.2 : 0;
  const monthlyPremium = Math.max(0, Math.round(lifePart + structurePart));
  // Banks typically load mortgage insurance ~40% over an independent agent.
  const bankPremium = Math.round(monthlyPremium * 1.42);
  const savingPct =
    bankPremium > 0 ? Math.round((1 - monthlyPremium / bankPremium) * 100) : 0;
  const yearlySaving = Math.max(0, (bankPremium - monthlyPremium) * 12);
  return { monthlyPremium, bankPremium, savingPct, yearlySaving };
}

/* ---------------- Health (coverage selection) ---------------- */

export type HealthCoverageId = 'surgeries' | 'transplants' | 'drugs' | 'critical';

export const HEALTH_COVERAGES: {
  id: HealthCoverageId;
  label: string;
  desc: string;
  monthly: number;
  emoji: string;
}[] = [
  {
    id: 'surgeries',
    label: 'ניתוחים פרטיים',
    desc: 'בחירת מנתח ובית חולים פרטי, ללא תורים ארוכים',
    monthly: 79,
    emoji: '🏥',
  },
  {
    id: 'transplants',
    label: 'השתלות וטיפולים בחו״ל',
    desc: 'כיסוי להשתלות וטיפולים מיוחדים שאינם בארץ',
    monthly: 45,
    emoji: '🌍',
  },
  {
    id: 'drugs',
    label: 'תרופות מחוץ לסל',
    desc: 'מימון תרופות מצילות חיים שאינן בסל הבריאות',
    monthly: 69,
    emoji: '💊',
  },
  {
    id: 'critical',
    label: 'מחלות קשות',
    desc: 'פיצוי כספי חד-פעמי מיד עם אבחון מחלה קשה',
    monthly: 39,
    emoji: '🎗️',
  },
];

export function estimateHealth(selected: HealthCoverageId[]): number {
  return HEALTH_COVERAGES.filter((c) => selected.includes(c.id)).reduce(
    (sum, c) => sum + c.monthly,
    0,
  );
}

/* ---------------- Finance: compound-growth simulator ---------------- */

export interface GrowthInput {
  /** monthly deposit (₪). */
  monthly: number;
  years: number;
  /** annual return, in percent (e.g. 6 for 6%). */
  annualRatePct: number;
}

export interface GrowthPoint {
  year: number;
  value: number;
  deposited: number;
}

export function estimateGrowth(input: GrowthInput): {
  points: GrowthPoint[];
  finalValue: number;
  totalDeposited: number;
  totalGain: number;
} {
  const r = input.annualRatePct / 100 / 12; // monthly rate
  const months = Math.max(0, Math.round(input.years * 12));
  let value = 0;
  let deposited = 0;
  const points: GrowthPoint[] = [{ year: 0, value: 0, deposited: 0 }];
  for (let m = 1; m <= months; m++) {
    value = value * (1 + r) + input.monthly;
    deposited += input.monthly;
    if (m % 12 === 0 || m === months) {
      points.push({ year: m / 12, value: Math.round(value), deposited });
    }
  }
  const finalValue = Math.round(value);
  return {
    points,
    finalValue,
    totalDeposited: deposited,
    totalGain: Math.max(0, finalValue - deposited),
  };
}
