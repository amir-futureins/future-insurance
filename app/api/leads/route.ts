import { NextResponse, type NextRequest } from 'next/server';
import { isValidIsraeliId } from '@/lib/israeli-id';

/**
 * Unified lead intake — POST /api/leads.
 * Receives a lead from any form (name, phone, optional Israeli ID, topic,
 * consent), validates server-side (never trust the client), logs it with PII
 * masked, and hands off to `dispatchLead()` — the single integration seam for
 * CRM / server-side GTM / webhook. No lead is accepted without consent.
 *
 * NOTE: this is the intake + dispatch skeleton. Wiring the front-end forms to
 * POST here (and adding rate-limiting + a persistence/CRM target) is the next
 * backend step.
 */

export const runtime = 'nodejs';

interface LeadPayload {
  name?: string;
  phone?: string;
  id?: string;
  topic?: string;
  consent?: boolean;
  /** flows that query in the user's name (e.g. Har-Habituach) require the ID. */
  idRequired?: boolean;
}

const PHONE_RE = /^05\d{8}$/;

/** Mask PII for logs — keep only the last `keep` digits. */
function mask(value: string, keep = 3): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= keep) return '*'.repeat(digits.length);
  return '*'.repeat(digits.length - keep) + digits.slice(-keep);
}

/**
 * Single integration seam. Today it optionally forwards to LEADS_WEBHOOK_URL;
 * swap/extend with your CRM (HubSpot/Salesforce/Priority), server-side GTM /
 * Meta CAPI, or a DB insert. Failures here must not fail the user's request.
 */
async function dispatchLead(lead: Record<string, unknown>): Promise<void> {
  const webhook = process.env.LEADS_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
    } catch (err) {
      console.error('[leads] webhook dispatch failed', err);
    }
  }
  // TODO: CRM upsert · server-side GTM/CAPI conversion · Slack/email notify.
}

export async function POST(req: NextRequest) {
  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const name = (body.name ?? '').trim();
  const phone = (body.phone ?? '').replace(/[\s-]/g, '');
  const id = (body.id ?? '').replace(/\D/g, '');
  const topic = (body.topic ?? 'general').toString().trim().slice(0, 40);
  const consent = body.consent === true;
  const idRequired = body.idRequired === true;

  const fields: string[] = [];
  if (name.length < 2) fields.push('name');
  if (!PHONE_RE.test(phone)) fields.push('phone');
  // ID must be valid when required, and when optionally supplied.
  if ((idRequired || id) && !isValidIsraeliId(id)) fields.push('id');
  if (!consent) fields.push('consent'); // hard requirement — no consent, no lead.

  if (fields.length > 0) {
    return NextResponse.json({ ok: false, error: 'validation_failed', fields }, { status: 422 });
  }

  const lead = {
    name,
    phone,
    id: id || null,
    topic,
    consent: true,
    source: 'website',
    createdAt: new Date().toISOString(),
    ip: (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || null,
    userAgent: req.headers.get('user-agent') ?? null,
  };

  // Secure log — PII masked so raw phone/ID never hit the log stream.
  console.info('[leads] new lead', {
    topic,
    name: name.charAt(0) + '…',
    phone: mask(phone, 3),
    id: id ? mask(id, 2) : null,
    consent: true,
  });

  await dispatchLead(lead);

  return NextResponse.json(
    { ok: true, message: 'קיבלנו את הפרטים — סוכן מורשה יחזור אליכם בהקדם.' },
    { status: 200 },
  );
}

export function GET() {
  return NextResponse.json({ ok: false, error: 'method_not_allowed' }, { status: 405 });
}
