import { NextResponse, type NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { isValidIsraeliId } from '@/lib/israeli-id';
import { saveLead, sourceFromTopic, toIntlPhone, type StoredLead } from '@/lib/lead-store';

/**
 * Unified lead intake — POST /api/leads.
 * Receives a lead from any form (name, phone, optional Israeli ID, topic,
 * consent), validates + sanitizes server-side (never trust the client), traps
 * bots (honeypot + per-IP rate limit), logs with PII masked, then fans the lead
 * out to every channel — CRM store, admin e-mail, Google Sheets — via
 * `dispatchLead()`, with isolated per-channel error handling. No lead is
 * accepted without consent.
 */

export const runtime = 'nodejs';

interface LeadPayload {
  name?: unknown;
  fullName?: unknown; // alias for name
  phone?: unknown;
  phoneNumber?: unknown; // alias for phone
  id?: unknown;
  idNumber?: unknown; // alias for id
  topic?: unknown;
  consent?: unknown;
  idRequired?: unknown;
  dob?: unknown;
  dateOfBirth?: unknown; // alias for dob
  issueDate?: unknown;
  idIssueDate?: unknown; // alias for issueDate
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

interface LeadRecord {
  recordId: string;
  name: string;
  phone: string; // 05XXXXXXXX
  id: string | null;
  dob: string | null;
  issueDate: string | null;
  source: string; // customer-facing product source (e.g. הר הביטוח)
  topic: string; // raw internal topic/vertical
  createdAt: string;
}

/** HTML-escape user-supplied values before embedding them in the e-mail body. */
function esc(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  );
}

/** YYYY-MM-DD → DD/MM/YYYY (or "—" when absent). */
function displayDate(iso: string | null): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

/** Rich RTL HTML notification with one-click WhatsApp + call buttons. */
function buildEmailHtml(l: LeadRecord): string {
  const wa = `https://wa.me/${toIntlPhone(l.phone)}?text=${encodeURIComponent(
    `היי ${l.name}, פנית אלינו באתר Future Insurance בנושא ${l.source}. אשמח לספק לך את כל המידע וההצעה המשתלמת ביותר! 😃`,
  )}`;
  const tel = `tel:${l.phone.replace(/\D/g, '')}`;
  const row = (k: string, v: string) =>
    `<tr><td style="padding:10px 14px;background:#f5f7fb;font-weight:700;color:#0F2141;white-space:nowrap">${k}</td><td style="padding:10px 14px;color:#142B55">${v}</td></tr>`;
  return `<div dir="rtl" style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#ffffff">
  <h2 style="margin:0 0 4px;color:#142B55">🚨 ליד חדש נכנס באתר</h2>
  <p style="margin:0 0 18px;color:#4E5D7A">Future Insurance · ${esc(l.source)}</p>
  <table style="width:100%;border-collapse:separate;border-spacing:0 6px">
    ${row('שם מלא', esc(l.name))}
    ${row('תעודת זהות', l.id ? esc(l.id) : '—')}
    ${row('תאריך לידה', esc(displayDate(l.dob)))}
    ${row('תאריך הנפקת ת.ז', esc(displayDate(l.issueDate)))}
    ${row('טלפון', `<span dir="ltr">${esc(l.phone)}</span>`)}
    ${row('מקור הפנייה', esc(l.source))}
    ${row('התקבל בתאריך', esc(new Date(l.createdAt).toLocaleString('he-IL')))}
  </table>
  <div style="margin-top:22px;text-align:center">
    <a href="${wa}" style="display:inline-block;margin:4px;padding:12px 22px;background:#25D366;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:700">📱 שלח וואטסאפ ללקוח</a>
    <a href="${tel}" style="display:inline-block;margin:4px;padding:12px 22px;background:#142B55;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:700">📞 חייג ללקוח</a>
  </div>
</div>`;
}

/** fetch with a hard timeout so a slow/hung webhook can never block forever. */
async function fetchWithTimeout(
  url: string,
  opts: RequestInit,
  ms = 8000,
): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

/** Channel 1 — admin e-mail via the Resend REST API (no SDK dependency). */
async function sendEmail(l: LeadRecord): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn('[leads] email: SKIPPED — RESEND_API_KEY is not set in process.env');
    return;
  }
  const from = process.env.LEADS_FROM_EMAIL || 'Future Insurance <leads@futureins.co.il>';
  const to = process.env.ADMIN_EMAIL || process.env.LEADS_TO_EMAIL || 'amir@il-ins.co.il';
  console.info(`[leads] email: POST → Resend (to=${to})`);
  const res = await fetchWithTimeout('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to,
      subject: `🚨 ליד חדש נכנס באתר: ${l.name} - ${l.source}`,
      html: buildEmailHtml(l),
    }),
  });
  const bodyText = await res.text().catch(() => '');
  console.info(`[leads] email: response ${res.status} · ${bodyText.slice(0, 100)}`);
  if (!res.ok) throw new Error(`resend_${res.status}`);
}

/**
 * Channel 2 — Google Sheets (Apps Script web-app webhook).
 * Sends the canonical 8-field lead schema. Each aliased field is sent under BOTH
 * names so the Apps Script matches whichever header it uses (a header-driven
 * script simply ignores the unused alias).
 */
async function sendToSheets(l: LeadRecord): Promise<void> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) {
    console.warn('[leads] sheets: SKIPPED — GOOGLE_SHEETS_WEBHOOK_URL is not set in process.env');
    return;
  }
  // Optional fields fall back to "-" so empty cells read cleanly in the sheet.
  const id = l.id || '-';
  const dob = l.dob || '-';
  const issueDate = l.issueDate || '-';
  const payload = {
    timestamp: l.createdAt,
    name: l.name,
    fullName: l.name,
    id,
    idNumber: id,
    dob,
    dateOfBirth: dob,
    issueDate,
    idIssueDate: issueDate,
    phone: l.phone,
    source: l.source,
    status: 'חדש',
  };
  console.info(`[leads] sheets: POST → ${url.slice(0, 52)}… (source=${l.source})`);
  const res = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    redirect: 'follow', // Apps Script exec URLs 302 to googleusercontent.com
  });
  const bodyText = await res.text().catch(() => '');
  console.info(`[leads] sheets: response ${res.status} · ${bodyText.slice(0, 100)}`);
  if (!res.ok) throw new Error(`sheets_${res.status}`);
}

/** Channel 3 — local CRM store powering the /admin/leads dashboard. */
async function saveToCrm(l: LeadRecord): Promise<void> {
  const record: StoredLead = {
    id: l.recordId,
    name: l.name,
    phone: l.phone,
    nid: l.id,
    dob: l.dob,
    issueDate: l.issueDate,
    topic: l.topic,
    source: l.source,
    status: 'new',
    createdAt: l.createdAt,
  };
  await saveLead(record);
}

/** Optional legacy generic webhook (CRM / server-side CAPI integrations). */
async function forwardWebhook(l: LeadRecord): Promise<void> {
  const url = process.env.LEADS_WEBHOOK_URL;
  if (!url) return;
  const res = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(l),
  });
  if (!res.ok) throw new Error(`webhook_${res.status}`);
}

/**
 * Notify the EXTERNAL channels (email / Sheets / webhook) with strict, isolated
 * error handling: one failing never affects the others. Each fetch is
 * timeout-bounded. Runs in the background so the user's response is immediate.
 */
async function dispatchExternal(l: LeadRecord): Promise<void> {
  const channels: Array<[string, () => Promise<void>]> = [
    ['email', () => sendEmail(l)],
    ['sheets', () => sendToSheets(l)],
    ['webhook', () => forwardWebhook(l)],
  ];
  const results = await Promise.allSettled(channels.map(([, run]) => run()));
  const summary = results
    .map((r, i) => `${channels[i][0]}:${r.status === 'fulfilled' ? 'ok' : 'FAIL'}`)
    .join(' ');
  console.info(`[leads] external dispatch → ${summary}`);
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      const reason = r.reason instanceof Error ? r.reason.message : String(r.reason);
      console.error(`[leads] ✗ channel "${channels[i][0]}" failed:`, reason);
    }
  });
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
    console.error('[leads] ✗ invalid JSON body');
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  // Log incoming payload KEYS only (never PII values) for field-name debugging.
  console.info('[leads] ← incoming payload keys:', Object.keys(body ?? {}).join(', ') || '(none)');

  // Honeypot: pretend success so the bot moves on, but drop the lead silently.
  if (str(body.company, 100).trim() !== '') {
    console.info('[leads] honeypot triggered', { ip: ip === 'unknown' ? null : mask(ip, 0) });
    return NextResponse.json({ ok: true, message: SUCCESS }, { status: 200 });
  }

  // Coerce every field through `str` — a non-string payload can never throw now.
  // Accept common field-name aliases so a form never fails on naming alone.
  const name = str(body.name ?? body.fullName, 80).trim();
  const phone = str(body.phone ?? body.phoneNumber, 20).replace(/[\s-]/g, '');
  const id = str(body.id ?? body.idNumber, 20).replace(/\D/g, '');
  const topic = str(body.topic, 40).trim() || 'general';
  const consent = body.consent === true;
  const idRequired = body.idRequired === true;
  const dobStr = str(body.dob ?? body.dateOfBirth, 10).trim();
  const issueStr = str(body.issueDate ?? body.idIssueDate, 10).trim();

  const fields = new Set<string>();
  if (name.length < 2) fields.add('name');
  if (!PHONE_RE.test(phone)) fields.add('phone');
  // ID must be valid when required, and when optionally supplied.
  if ((idRequired || id) && !isValidIsraeliId(id)) fields.add('id');
  if (!consent) fields.add('consent'); // hard requirement — no consent, no lead.

  // dob / issueDate are OPTIONAL at the API level — only the form that actually
  // renders these inputs (GovDataModal) enforces them client-side. Here we only
  // validate their FORMAT when a value is present, so a form without date fields
  // (e.g. LeadForm with idField) never 422s on dates it doesn't collect.
  const now = new Date();
  let dob: string | null = null;
  if (dobStr) {
    const d = parseDate(dobStr);
    if (!d || d > now || yearsBetween(d, now) < 18 || yearsBetween(d, now) > 120) {
      fields.add('dob');
    } else {
      dob = dobStr;
    }
  }

  // ID issue date: a real, past date that is strictly after the date of birth.
  let issueDate: string | null = null;
  if (issueStr) {
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

  const record: LeadRecord = {
    recordId: randomUUID(),
    name,
    phone,
    id: id || null,
    dob,
    issueDate,
    source: sourceFromTopic(topic),
    topic,
    createdAt: now.toISOString(),
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

  // Durable channel first (fast, local) — the lead is stored before we respond,
  // so it is never lost even if the external channels are slow or fail.
  try {
    await saveToCrm(record);
    console.info('[leads] crm: ok');
  } catch (e) {
    console.error('[leads] ✗ crm failed:', e instanceof Error ? e.message : e);
  }

  // External channels (email / Sheets / webhook) fire in the background with
  // bounded timeouts, so the user gets an immediate success response while
  // dispatch happens in parallel. (No next/after in 14.2 → in-process.)
  void dispatchExternal(record).catch((e) => console.error('[leads] dispatch error', e));

  return NextResponse.json({ ok: true, message: SUCCESS }, { status: 200 });
}

export function GET() {
  return NextResponse.json({ ok: false, error: 'method_not_allowed' }, { status: 405 });
}
