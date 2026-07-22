/**
 * Shared client helper for posting a lead to /api/leads and classifying the
 * outcome so forms can react instead of silently swallowing failures:
 *  - 200 → ok
 *  - 422 → validation (surface the invalid fields to the user, let them fix)
 *  - 429 → rate_limit (ask the user to retry shortly)
 *  - network / 5xx → network (fall through to the WhatsApp/call handoff — the
 *    real conversion — so a transient blip never blocks a valid lead)
 */

export type LeadSubmitResult =
  | { ok: true }
  | { ok: false; kind: 'validation'; message: string }
  | { ok: false; kind: 'rate_limit'; message: string }
  | { ok: false; kind: 'network' };

const FIELD_HE: Record<string, string> = {
  name: 'שם מלא',
  phone: 'מספר טלפון',
  id: 'תעודת זהות',
  dob: 'תאריך לידה',
  issueDate: 'תאריך הנפקת ת.ז',
  consent: 'אישור התקנון',
};

export async function submitLead(payload: Record<string, unknown>): Promise<LeadSubmitResult> {
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) return { ok: true };

    if (res.status === 422) {
      const data = (await res.json().catch(() => null)) as { fields?: string[] } | null;
      const labels = (data?.fields ?? []).map((f) => FIELD_HE[f] ?? f);
      return {
        ok: false,
        kind: 'validation',
        message: labels.length
          ? `אנא בדקו ותקנו את הפרטים הבאים: ${labels.join(', ')}.`
          : 'חלק מהפרטים אינם תקינים. אנא בדקו ונסו שוב.',
      };
    }

    if (res.status === 429) {
      return { ok: false, kind: 'rate_limit', message: 'נשלחו יותר מדי בקשות. נסו שוב בעוד דקה.' };
    }

    return { ok: false, kind: 'network' };
  } catch {
    return { ok: false, kind: 'network' };
  }
}
