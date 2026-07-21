/**
 * Israeli ID (תעודת זהות) validation — the official check-digit algorithm used
 * by the Ministry of Interior. Each of the 9 digits is multiplied by 1 or 2
 * (alternating, first digit ×1); products > 9 have their digits summed
 * (equivalently, subtract 9); a valid ID's total is divisible by 10.
 * Numbers shorter than 9 digits are zero-padded on the left (real IDs are 9
 * digits, often written without leading zeros).
 */

/** Strip to digits only and cap at 9 — for controlled numeric inputs. */
export function sanitizeId(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 9);
}

export function isValidIsraeliId(raw: string): boolean {
  const digits = sanitizeId(raw);
  if (digits.length < 5 || digits.length > 9) return false;
  const padded = digits.padStart(9, '0');
  if (/^0+$/.test(padded)) return false; // all-zeros passes the raw checksum but isn't a real ID
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let step = Number(padded[i]) * ((i % 2) + 1);
    if (step > 9) step -= 9;
    sum += step;
  }
  return sum % 10 === 0;
}
