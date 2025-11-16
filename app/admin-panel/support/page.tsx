import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { adminAuthOptions } from '@/lib/admin-auth';
import { getAllSupportTickets } from '@/lib/db';

const ADMIN_EMAIL = 'jaffarsadiq1001@gmail.com';

const statusBadgeClasses: Record<string, string> = {
  open: 'bg-gray-100/20 text-gray-300 border border-gray-500/40',
  in_progress: 'bg-blue-100/20 text-blue-300 border border-blue-500/40',
  resolved: 'bg-green-100/20 text-green-300 border border-green-500/40',
};

const priorityBadgeClasses: Record<string, string> = {
  low: 'bg-blue-100/20 text-blue-300 border border-blue-500/40',
  normal: 'bg-yellow-100/20 text-yellow-300 border border-yellow-500/40',
  high: 'bg-red-100/20 text-red-300 border border-red-500/40',
};

export default async function AdminSupportPage() {
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

  const tickets = await getAllSupportTickets();
  const unreadCount = tickets.filter((ticket) => ticket.unreadForAdmin).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Support Inbox</h2>
          <p className="mt-1 text-sm text-slate-400">
            Manage all support tickets from users and agents
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-lg">
            <span className="text-sm font-semibold text-red-300">
              {unreadCount} new {unreadCount === 1 ? 'ticket' : 'tickets'}
            </span>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No support tickets found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`rounded-lg border p-4 transition-colors ${
                  ticket.unreadForAdmin
                    ? 'border-blue-500/50 bg-blue-500/10'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {ticket.subject}
                      </h3>
                      {ticket.unreadForAdmin && (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-300 border border-blue-500/50">
                          NEW
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          statusBadgeClasses[ticket.status] || statusBadgeClasses.open
                        }`}
                      >
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          priorityBadgeClasses[ticket.priority] || priorityBadgeClasses.normal
                        }`}
                      >
                        {ticket.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 whitespace-pre-wrap mb-3">
                      {ticket.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>
                        From: {ticket.email} ({ticket.role})
                      </span>
                      <span>•</span>
                      <span>
                        Created: {new Date(ticket.createdAt).toLocaleString()}
                      </span>
                      {ticket.userId && (
                        <>
                          <span>•</span>
                          <span>User ID: {ticket.userId.slice(0, 8)}...</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

