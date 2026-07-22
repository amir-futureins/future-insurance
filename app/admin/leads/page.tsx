import type { Metadata } from 'next';
import AdminLeadsDashboard from '@/components/admin/AdminLeadsDashboard';
import { getLeads } from '@/lib/lead-store';

// Internal tool — never index, and keep it out of any share/social surface.
export const metadata: Metadata = {
  title: 'ניהול לידים — Future Insurance',
  description: 'ממשק ניהול לידים פנימי.',
  robots: { index: false, follow: false, nocache: true },
};

// Always render fresh so newly-captured leads appear immediately.
export const dynamic = 'force-dynamic';

function fmtPhone(phone: string): string {
  const d = phone.replace(/\D/g, '');
  return d.length === 10 ? `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}` : phone;
}

export default async function AdminLeadsPage() {
  const stored = await getLeads();
  const leads = stored.map((l) => ({
    id: l.id,
    name: l.name,
    nid: l.nid ? '•••••' + l.nid.slice(-4) : '—',
    dob: l.dob ?? '',
    issueDate: l.issueDate ?? '',
    phone: fmtPhone(l.phone),
    date: l.createdAt.slice(0, 10),
    source: l.source,
    status: l.status,
  }));

  return (
    <main className="min-h-screen bg-base">
      <AdminLeadsDashboard initialLeads={leads} />
    </main>
  );
}
