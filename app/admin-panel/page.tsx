import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { adminAuthOptions } from '@/lib/admin-auth';
import Link from 'next/link';
import {
  evaluateSLAStatuses,
  getSLAOverview,
  getJobsSummaryForAdmin,
  getOpenAnnotations,
} from '@/lib/db';
import SlaAutomationButton from '@/components/SlaAutomationButton';

const ADMIN_EMAIL = 'jaffarsadiq1001@gmail.com';

const statusBadgeClasses: Record<string, string> = {
  overdue: 'bg-red-100/20 text-red-300 border border-red-500/40',
  due_soon: 'bg-amber-100/20 text-amber-200 border border-amber-400/40',
  on_track: 'bg-emerald-100/20 text-emerald-200 border border-emerald-400/40',
  pending: 'bg-slate-100/10 text-slate-300 border border-slate-500/30',
  escalated: 'bg-rose-100/20 text-rose-200 border border-rose-400/40',
};

const statusLabel: Record<string, string> = {
  overdue: 'Overdue',
  due_soon: 'Due soon',
  on_track: 'On track',
  pending: 'Pending',
  escalated: 'Escalated',
};

export default async function AdminPanelPage() {
  // Server-side protection: Verify admin access
  const session = await getServerSession(adminAuthOptions);

  if (!session?.user) {
    redirect('/admin-panel/login?error=AccessDenied');
  }

  const email = session.user.email?.toLowerCase().trim();
  const adminEmailLower = ADMIN_EMAIL.toLowerCase().trim();
  const isAdmin = (session.user as any)?.isAdmin;

  // STRICT: Only allow jaffarsadiq1001@gmail.com
  if (!isAdmin || !email || email !== adminEmailLower) {
    redirect('/admin-panel/login?error=AccessDenied');
  }

  await evaluateSLAStatuses();
  const [slaOverview, jobs, annotations] = await Promise.all([
    getSLAOverview(),
    getJobsSummaryForAdmin(25),
    getOpenAnnotations(25),
  ]);

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Operational Overview</h2>
          <SlaAutomationButton />
        </div>
        <p className="mt-1 text-sm text-slate-400">
          Realtime snapshot across all user submissions. Use the automation button to refresh SLA calculations before reviewing.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Total jobs</p>
            <p className="mt-2 text-2xl font-semibold text-white">{slaOverview.total_jobs ?? 0}</p>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="text-xs uppercase tracking-wide text-amber-200">Due soon</p>
            <p className="mt-2 text-2xl font-semibold text-amber-100">{slaOverview.due_soon_jobs ?? 0}</p>
          </div>
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4">
            <p className="text-xs uppercase tracking-wide text-rose-200">Overdue</p>
            <p className="mt-2 text-2xl font-semibold text-rose-100">{slaOverview.overdue_jobs ?? 0}</p>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="text-xs uppercase tracking-wide text-emerald-200">On track</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-100">{slaOverview.on_track_jobs ?? 0}</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Active jobs</h3>
            <p className="text-sm text-slate-400">Sorted by most recent creation time.</p>
          </div>
          <Link
            href="/admin-panel/conversations"
            className="text-sm text-slate-300 underline-offset-4 hover:underline"
          >
            View all conversations
          </Link>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900/60 text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Job</th>
                <th className="px-4 py-3 text-left font-medium">Client</th>
                <th className="px-4 py-3 text-left font-medium">Service</th>
                <th className="px-4 py-3 text-left font-medium">Tags</th>
                <th className="px-4 py-3 text-left font-medium">Due</th>
                <th className="px-4 py-3 text-left font-medium">SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                    No jobs available.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-900/40">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-white">{job.title || job.id}</div>
                      <Link
                        href={`/admin-panel/conversations/${job.id}`}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        View conversation
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-200">{job.userName || 'Unknown user'}</p>
                      <p className="text-xs text-slate-500">
                        Created {new Date(job.createdAt).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-200 capitalize">{(job.serviceType || 'other').replace('_', ' ')}</p>
                      <p className="text-xs text-slate-500 capitalize">{(job.pricingModel || 'single_project').replace('_', ' ')}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {job.tags?.length
                          ? job.tags.map((tag) => (
                            <span
                              key={`${job.id}-${tag}`}
                              className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-200"
                            >
                              {tag}
                            </span>
                          ))
                          : <span className="text-xs text-slate-500">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {job.dueAt ? (
                        <span className="text-sm text-slate-200">
                          {new Date(job.dueAt).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Not set</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${statusBadgeClasses[job.slaStatus || 'pending'] ||
                          statusBadgeClasses.pending
                          }`}
                      >
                        {statusLabel[job.slaStatus || 'pending']}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Open annotations</h3>
            <p className="text-sm text-slate-400">Action items waiting for resolution.</p>
          </div>
          <Link
            href="/admin-panel/support"
            className="text-sm text-slate-300 underline-offset-4 hover:underline"
          >
            View all tickets
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {annotations.length === 0 ? (
            <p className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">
              No open annotations. Great job!
            </p>
          ) : (
            annotations.map((annotation) => (
              <div
                key={annotation.id}
                className="rounded-lg border border-slate-800 bg-slate-900/60 p-4"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={`/admin-panel/conversations/${annotation.jobId}`}
                    className="text-sm font-semibold text-white hover:underline"
                  >
                    View job
                  </Link>
                  <span className="text-xs text-slate-400">
                    {new Date(annotation.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-200 whitespace-pre-wrap">
                  {annotation.content}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Reported by {annotation.authorName || 'Unknown agent'}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

