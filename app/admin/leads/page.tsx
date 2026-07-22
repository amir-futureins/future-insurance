import type { Metadata } from 'next';
import AdminLeadsDashboard from '@/components/admin/AdminLeadsDashboard';

// Internal tool — never index, and keep it out of any share/social surface.
export const metadata: Metadata = {
  title: 'ניהול לידים — Future Insurance',
  description: 'ממשק ניהול לידים פנימי.',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLeadsPage() {
  return (
    <main className="min-h-screen bg-base">
      <AdminLeadsDashboard />
    </main>
  );
}
