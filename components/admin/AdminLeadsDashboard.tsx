'use client';

import { useMemo, useState } from 'react';
import {
  Users,
  Sparkles,
  Clock,
  TrendingUp,
  Search,
  Download,
  CalendarRange,
  Phone,
  MessageCircle,
  Eye,
  ShieldAlert,
  Plane,
  ShieldCheck,
  HeartPulse,
  Home,
  type LucideIcon,
} from 'lucide-react';

/* ------------------------------------------------------------------ *
 * DEMO DATA — illustrative only. There is no lead persistence yet;
 * /api/leads currently logs + dispatches. Wire this table to the real
 * store (CRM/DB) before go-live. Names are fabricated; phone numbers use
 * the fictional 555 range on purpose so they can't reach a real person.
 * IDs stay masked (not needed for any list-view action).
 * ------------------------------------------------------------------ */
type Status = 'new' | 'progress' | 'closed';
interface Lead {
  id: string | number;
  name: string;
  nid: string; // masked national ID
  phone: string; // full (fabricated) Israeli mobile — needed for outreach
  date: string; // ISO
  source: string;
  status: Status;
}

const SAMPLE: Lead[] = [
  { id: 1, name: 'דנה כהן', nid: '•••••4821', phone: '052-555-4417', date: '2026-07-22', source: 'הר הביטוח', status: 'new' },
  { id: 2, name: 'אורי לוי', nid: '•••••1093', phone: '054-555-8820', date: '2026-07-22', source: 'חו״ל', status: 'new' },
  { id: 3, name: 'מיכל ברק', nid: '•••••7756', phone: '050-555-2231', date: '2026-07-21', source: 'בריאות', status: 'progress' },
  { id: 4, name: 'יוסי אברהם', nid: '•••••3388', phone: '053-555-9910', date: '2026-07-21', source: 'משכנתא', status: 'progress' },
  { id: 5, name: 'נועה שמש', nid: '•••••6642', phone: '052-555-7003', date: '2026-07-20', source: 'פנסיה', status: 'closed' },
  { id: 6, name: 'איתי רון', nid: '•••••2215', phone: '058-555-4456', date: '2026-07-20', source: 'חו״ל', status: 'new' },
  { id: 7, name: 'שירה פלד', nid: '•••••9081', phone: '050-555-1198', date: '2026-07-19', source: 'הר הביטוח', status: 'progress' },
  { id: 8, name: 'עומר גל', nid: '•••••5527', phone: '054-555-6674', date: '2026-07-19', source: 'בריאות', status: 'closed' },
  { id: 9, name: 'טל אביב', nid: '•••••4409', phone: '052-555-3352', date: '2026-07-18', source: 'משכנתא', status: 'new' },
  { id: 10, name: 'רותם דהן', nid: '•••••8134', phone: '053-555-2290', date: '2026-07-18', source: 'פנסיה', status: 'progress' },
  { id: 11, name: 'גיא מור', nid: '•••••1760', phone: '058-555-5541', date: '2026-07-17', source: 'הר הביטוח', status: 'closed' },
  { id: 12, name: 'ליאת נחום', nid: '•••••6318', phone: '050-555-8827', date: '2026-07-17', source: 'חו״ל', status: 'new' },
];

const STATUS_META: Record<Status, { label: string; badge: string; dot: string }> = {
  new: { label: 'חדש', badge: 'bg-sky-50 text-sky-700 ring-sky-200', dot: 'bg-sky-500' },
  progress: { label: 'בטיפול', badge: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-500' },
  closed: { label: 'נסגר', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500' },
};
const STATUS_CYCLE: Status[] = ['new', 'progress', 'closed'];

/** Source segmentation — icon + high-contrast brand colour + tab emoji. */
const SOURCE_META: Record<string, { emoji: string; Icon: LucideIcon; badge: string }> = {
  'חו״ל': { emoji: '✈️', Icon: Plane, badge: 'bg-sky-50 text-sky-700 ring-sky-200' },
  'הר הביטוח': { emoji: '🛡️', Icon: ShieldCheck, badge: 'bg-amber-50 text-[#8A6220] ring-amber-300' },
  בריאות: { emoji: '🩺', Icon: HeartPulse, badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  משכנתא: { emoji: '🏠', Icon: Home, badge: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
  פנסיה: { emoji: '📈', Icon: TrendingUp, badge: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200' },
};
const SOURCE_ORDER = ['חו״ל', 'הר הביטוח', 'בריאות', 'משכנתא', 'פנסיה'];

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/** 052-555-4417 → 972525554417 (Israeli international, no +/0/separators). */
function toIntlPhone(phone: string): string {
  return '972' + phone.replace(/\D/g, '').replace(/^0/, '');
}

/** Pre-filled WhatsApp deep-link personalised with the lead's name + source. */
function waHref(lead: Lead): string {
  const msg = `היי ${lead.name}, פנית אלינו באתר Future Insurance בנושא ${lead.source}. אשמח לספק לך את כל המידע וההצעה המשתלמת ביותר! 😃`;
  return `https://wa.me/${toIntlPhone(lead.phone)}?text=${encodeURIComponent(msg)}`;
}

export default function AdminLeadsDashboard({ initialLeads }: { initialLeads?: Lead[] }) {
  const isLive = Boolean(initialLeads && initialLeads.length > 0);
  const [leads, setLeads] = useState<Lead[]>(isLive ? (initialLeads as Lead[]) : SAMPLE);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Status>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | string>('all');

  const filtered = useMemo(() => {
    const q = query.trim();
    return leads.filter(
      (l) =>
        (statusFilter === 'all' || l.status === statusFilter) &&
        (sourceFilter === 'all' || l.source === sourceFilter) &&
        (q === '' || l.name.includes(q) || l.phone.includes(q) || l.source.includes(q)),
    );
  }, [leads, query, statusFilter, sourceFilter]);

  const kpis = useMemo(() => {
    const total = leads.length;
    const fresh = leads.filter((l) => l.status === 'new').length;
    const progress = leads.filter((l) => l.status === 'progress').length;
    const closed = leads.filter((l) => l.status === 'closed').length;
    const rate = total ? Math.round((closed / total) * 100) : 0;
    return { total, fresh, progress, closed, rate };
  }, [leads]);

  /** Status management — click a badge to advance New → In-Progress → Closed. */
  const cycleStatus = (id: string | number) =>
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, status: STATUS_CYCLE[(STATUS_CYCLE.indexOf(l.status) + 1) % STATUS_CYCLE.length] }
          : l,
      ),
    );

  const exportCsv = () => {
    const header = ['שם', 'ת.ז', 'טלפון', 'תאריך', 'מקור', 'סטטוס'];
    const rows = filtered.map((l) => [l.name, l.nid, l.phone, fmtDate(l.date), l.source, STATUS_META[l.status].label]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'future-insurance-leads.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const KPI = [
    { label: 'סה״כ לידים', value: kpis.total, icon: Users, tint: 'from-navy to-navy-deep', fg: 'text-white', sub: 'החודש' },
    { label: 'לידים חדשים', value: kpis.fresh, icon: Sparkles, tint: 'from-sky-500 to-sky-600', fg: 'text-white', sub: 'ממתינים לטיפול' },
    { label: 'בטיפול', value: kpis.progress, icon: Clock, tint: 'from-amber-400 to-amber-500', fg: 'text-navy-deep', sub: 'בתהליך מכירה' },
    { label: 'יחס המרה', value: `${kpis.rate}%`, icon: TrendingUp, tint: 'from-emerald-500 to-emerald-600', fg: 'text-white', sub: `${kpis.closed} נסגרו` },
  ];

  return (
    <div className="mx-auto w-full max-w-[95%] px-4 py-8 md:py-10">
      {/* live / demo + security notice */}
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-300/60 bg-amber-50/70 p-4 text-[13px] text-amber-900">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
        {isLive ? (
          <p className="leading-relaxed">
            <strong>מחובר למאגר הלידים החי.</strong> הטבלה מציגה לידים אמיתיים שנקלטו מהאתר. שימו לב:
            המסך עדיין <strong>אינו מוגן מאחורי הזדהות</strong> — יש להוסיף אימות לפני חשיפה חיצונית,
            ולעבור לבסיס נתונים מתמשך (הנתונים נשמרים כרגע בקובץ מקומי בלבד).
          </p>
        ) : (
          <p className="leading-relaxed">
            <strong>ממשק הדגמה.</strong> עדיין לא נקלטו לידים — מוצגים נתוני הדגמה. לידים חדשים מהאתר
            יופיעו כאן אוטומטית. לפני עלייה לאוויר יש להגן על המסך מאחורי הזדהות (אימות) — כרגע המסך
            אינו מוגן. מספרי הטלפון בהדגמה בטווח 555 בדיוני.
          </p>
        )}
      </div>

      {/* header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[clamp(24px,4vw,32px)] font-extrabold tracking-tight text-ink">מרכז ניהול לידים</h1>
          <p className="mt-1 text-[14px] text-muted">CRM · כל הפניות ממערכת Future Insurance במקום אחד.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            className="inline-flex h-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13.5px] font-bold text-ink shadow-sm transition-colors hover:bg-slate-50"
          >
            <CalendarRange className="h-4 w-4 text-muted" aria-hidden />
            סינון לפי תאריך
          </button>
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex h-fit items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 px-4 py-2.5 text-[13.5px] font-extrabold text-navy-deep shadow-[0_0_15px_rgba(251,191,36,0.5)] ring-1 ring-amber-300/50 transition-all hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" aria-hidden />
            ייצוא ל-CSV
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPI.map((k) => (
          <div key={k.label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${k.tint} p-5 shadow-lg`}>
            <div className="flex items-center justify-between">
              <span className={`text-[13px] font-bold ${k.fg} opacity-80`}>{k.label}</span>
              <k.icon className={`h-5 w-5 ${k.fg} opacity-70`} aria-hidden />
            </div>
            <div className={`mt-3 text-[32px] font-extrabold leading-none ${k.fg}`}>{k.value}</div>
            <div className={`mt-1.5 text-[12px] font-medium ${k.fg} opacity-70`}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* source segmentation tabs */}
      <div className="mt-7 flex flex-wrap items-center gap-2">
        <span className="me-1 text-[12.5px] font-bold uppercase tracking-wide text-faint">סינון לפי מקור:</span>
        <button
          type="button"
          onClick={() => setSourceFilter('all')}
          className={`rounded-xl px-3.5 py-2 text-[13.5px] font-bold transition-colors ${
            sourceFilter === 'all' ? 'bg-navy text-white shadow' : 'bg-white text-ink ring-1 ring-slate-200 hover:bg-slate-50'
          }`}
        >
          הכל
        </button>
        {SOURCE_ORDER.map((s) => {
          const active = sourceFilter === s;
          const count = leads.filter((l) => l.source === s).length;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setSourceFilter(s)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13.5px] font-bold transition-colors ${
                active ? 'bg-navy text-white shadow' : 'bg-white text-ink ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              <span aria-hidden>{SOURCE_META[s].emoji}</span>
              {s}
              <span className={`rounded-full px-1.5 text-[11px] ${active ? 'bg-white/20' : 'bg-slate-100 text-muted'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* status filter + search */}
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חיפוש לפי שם, טלפון או מקור…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pe-10 ps-4 text-[14px] text-ink placeholder:text-faint focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {(['all', 'new', 'progress', 'closed'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-[13px] font-bold transition-colors ${
                statusFilter === s ? 'bg-navy text-white' : 'bg-slate-100 text-muted hover:bg-slate-200'
              }`}
            >
              {s === 'all' ? 'הכל' : STATUS_META[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-start text-[14px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[12.5px] font-bold uppercase tracking-wide text-muted">
                <th className="px-5 py-3.5 text-start">שם מלא</th>
                <th className="px-5 py-3.5 text-start">ת.ז</th>
                <th className="px-5 py-3.5 text-start">טלפון</th>
                <th className="px-5 py-3.5 text-start">תאריך</th>
                <th className="px-5 py-3.5 text-start">מקור</th>
                <th className="px-5 py-3.5 text-start">סטטוס</th>
                <th className="px-5 py-3.5 text-start">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => {
                const st = STATUS_META[l.status];
                const src = SOURCE_META[l.source];
                return (
                  <tr
                    key={l.id}
                    className={`border-b border-slate-100 transition-colors hover:bg-gold-tint/40 ${
                      i % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'
                    }`}
                  >
                    <td className="whitespace-nowrap px-5 py-3.5 font-bold text-ink">{l.name}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 font-mono text-[13px] text-muted" dir="ltr">
                      {l.nid}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 font-mono text-[13px] text-muted" dir="ltr">
                      {l.phone}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-muted">{fmtDate(l.date)}</td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold ring-1 ${
                          src?.badge ?? 'bg-slate-100 text-muted ring-slate-200'
                        }`}
                      >
                        {src ? <src.Icon className="h-3.5 w-3.5" aria-hidden /> : null}
                        {l.source}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => cycleStatus(l.id)}
                        title="לחצו לעדכון סטטוס"
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold ring-1 transition-transform hover:scale-105 ${st.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-muted transition-colors hover:bg-slate-200 hover:text-ink"
                          title="צפייה בליד"
                        >
                          <Eye className="h-4 w-4" aria-hidden />
                        </button>
                        <a
                          href={waHref(l)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-100"
                          title={`שליחת וואטסאפ ל${l.name}`}
                        >
                          <MessageCircle className="h-4 w-4" aria-hidden />
                        </a>
                        <a
                          href={`tel:${l.phone.replace(/\D/g, '')}`}
                          className="grid h-8 w-8 place-items-center rounded-lg bg-navy/5 text-navy transition-colors hover:bg-navy/10"
                          title={`חיוג ל${l.name}`}
                        >
                          <Phone className="h-4 w-4" aria-hidden />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[14px] text-muted">
                    לא נמצאו לידים תואמים לסינון.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/60 px-5 py-3 text-[12.5px] text-muted">
          <span>
            מציג {filtered.length} מתוך {leads.length} לידים
          </span>
          <span>{isLive ? 'נתונים חיים' : 'נתוני הדגמה'}</span>
        </div>
      </div>
    </div>
  );
}
