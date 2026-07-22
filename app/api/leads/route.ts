import { NextResponse, type NextRequest } from 'next/server';
import { isValidIsraeliId } from '@/lib/israeli-id';

/**
 * Unified lead intake — POST /api/leads.
 * Receives a lead from any form (name, phone, optional Israeli ID, topic,
 * consent), validates + sanitizes server-side (never trust the client), traps
 * bots (honeypot + per-IP rate limit), logs with PII masked, and hands off to
 * `dispatchLead()` — the single integration seam for CRM / server-side GTM /
 * webhook. No lead is accepted without consent.
 */

export const runtime = 'nodejs';

interface LeadPayload {
  name?: unknown;
  phone?: unknown;
  id?: unknown;
  topic?: unknown;
  consent?: unknown;
  idRequired?: unknown;
  dob?: unknown;
  issueDate?: unknown;
  /** honeypot — a hidden field real users never fill; bots do. Must stay empty. */
  company?: unknown;
}

const PHONE_RE = /^05\d{8}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Safe string coercion with a hard length cap — non-strings become ''. */
function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.slice(0, max) : '';
}

/** Mask PII for logs — keep only the last `keep` digits. */
function mask(value: string, keep = 3): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= keep) return '*'.repeat(digits.length);
  return '*'.repeat(digits.length - keep) + digits.slice(-keep);
}

/** Parse a strict YYYY-MM-DD into a UTC Date, or null if not a real date. */
function parseDate(s: string): Date | null {
  if (!DATE_RE.test(s)) return null;
  const d = new Date(`${s}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function yearsBetween(from: Date, to: Date): number {
  return (to.getTime() - from.getTime()) / (365.25 * 24 * 3600 * 1000);
}

/* --- Naive in-memory per-IP rate limiter. Per-instance only; swap for a shared
   store (Upstash/Redis) behind multiple instances. Good enough to blunt spam. -- */
const RATE_LIMIT = 6; // requests
const RATE_WINDOW_MS = 60_000; // per minute
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    // opportunistic cleanup so the map can't grow unbounded
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > RATE_LIMIT;
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

const SUCCESS = 'קיבלנו את הפרטים — סוכן מורשה יחזור אליכם בהקדם.';

export async function POST(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';

  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  // Honeypot: pretend success so the bot moves on, but drop the lead silently.
  if (str(body.company, 100).trim() !== '') {
    console.info('[leads] honeypot triggered', { ip: ip === 'unknown' ? null : mask(ip, 0) });
    return NextResponse.json({ ok: true, message: SUCCESS }, { status: 200 });
  }

  // Coerce every field through `str` — a non-string payload can never throw now.
  const name = str(body.name, 80).trim();
  const phone = str(body.phone, 20).replace(/[\s-]/g, '');
  const id = str(body.id, 20).replace(/\D/g, '');
  const topic = str(body.topic, 40).trim() || 'general';
  const consent = body.consent === true;
  const idRequired = body.idRequired === true;
  const dobStr = str(body.dob, 10).trim();
  const issueStr = str(body.issueDate, 10).trim();

  const fields = new Set<string>();
  if (name.length < 2) fields.add('name');
  if (!PHONE_RE.test(phone)) fields.add('phone');
  // ID must be valid when required, and when optionally supplied.
  if ((idRequired || id) && !isValidIsraeliId(id)) fields.add('id');
  if (!consent) fields.add('consent'); // hard requirement — no consent, no lead.

  // Date-of-birth: validated when supplied or when the flow requires the ID
  // (gov-data flows). Must be a real, past date with a plausible adult age.
  const now = new Date();
  let dob: string | null = null;
  if (dobStr || idRequired) {
    const d = parseDate(dobStr);
    if (!d || d > now || yearsBetween(d, now) < 18 || yearsBetween(d, now) > 120) {
      fields.add('dob');
    } else {
      dob = dobStr;
    }
  }

  // ID issue date: a real, past date that is strictly after the date of birth.
  let issueDate: string | null = null;
  if (issueStr || idRequired) {
    const iss = parseDate(issueStr);
    const d = parseDate(dobStr);
    if (!iss || iss > now || (d && iss <= d)) {
      fields.add('issueDate');
    } else {
      issueDate = issueStr;
    }
  }

  if (fields.size > 0) {
    return NextResponse.json(
      { ok: false, error: 'validation_failed', fields: [...fields] },
      { status: 422 },
    );
  }

  const lead = {
    name,
    phone,
    id: id || null,
    dob,
    issueDate,
    topic,
    consent: true,
    source: 'website',
    createdAt: now.toISOString(),
    ip: ip === 'unknown' ? null : ip,
    userAgent: str(req.headers.get('user-agent'), 300) || null,
  };

  // Secure log — PII masked (raw phone/ID/dates never hit the log stream).
  console.info('[leads] new lead', {
    topic,
    name: name.charAt(0) + '…',
    phone: mask(phone, 3),
    id: id ? mask(id, 2) : null,
    dob: dob ? 'provided' : null,
    issueDate: issueDate ? 'provided' : null,
    consent: true,
  });

  await dispatchLead(lead);

  return NextResponse.json({ ok: true, message: SUCCESS }, { status: 200 });
}

export function GET() {
  return NextResponse.json({ ok: false, error: 'method_not_allowed' }, { status: 405 });
}
