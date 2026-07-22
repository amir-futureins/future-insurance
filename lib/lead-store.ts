import { promises as fs } from 'fs';
import path from 'path';

/**
 * Minimal local CRM store for /admin/leads.
 *
 * Persists to a gitignored JSON file (`.data/leads.json`) with an in-memory
 * cache as the working copy. On a read-only/serverless filesystem the file
 * write is skipped and the in-memory cache still serves the current instance —
 * swap this module for a real DB (Postgres/Supabase/etc.) for durable,
 * multi-instance persistence before scaling.
 */

export type LeadStatus = 'new' | 'progress' | 'closed';

export interface StoredLead {
  id: string;
  name: string;
  phone: string; // 05XXXXXXXX
  nid: string | null; // full national ID (masked at the view layer)
  topic: string;
  source: string; // display source derived from topic
  status: LeadStatus;
  createdAt: string; // ISO
}

const DATA_DIR = path.join(process.cwd(), '.data');
const FILE = path.join(DATA_DIR, 'leads.json');
const MAX = 1000;

// In-memory fallback for read-only/serverless filesystems (per-instance only).
let mem: StoredLead[] = [];

/** Read the whole store fresh — file is the source of truth; `mem` is fallback. */
async function readAll(): Promise<StoredLead[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8')) as StoredLead[];
  } catch {
    return mem;
  }
}

/** Map an internal topic/vertical to a customer-facing product source. */
export function sourceFromTopic(topic: string): string {
  const t = (topic || '').toLowerCase();
  if (/(travel|passportcard|harel|clal|migdal)/.test(t)) return 'חו״ל';
  if (/(har|gov|duplicate|car_claims)/.test(t)) return 'הר הביטוח';
  if (/health/.test(t)) return 'בריאות';
  if (/(mortgage|structure)/.test(t)) return 'משכנתא';
  if (/(finance|life|pension|gemel|hishtalmut)/.test(t)) return 'פנסיה';
  return 'כללי';
}

/** 05XXXXXXXX → 972XXXXXXXXX (Israeli international, digits only). */
export function toIntlPhone(phone: string): string {
  return '972' + phone.replace(/\D/g, '').replace(/^0/, '');
}

export async function saveLead(lead: StoredLead): Promise<void> {
  const list = [lead, ...(await readAll())].slice(0, MAX);
  mem = list;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch {
    // read-only FS (serverless): `mem` still serves this instance.
  }
}

export async function getLeads(): Promise<StoredLead[]> {
  return readAll();
}
