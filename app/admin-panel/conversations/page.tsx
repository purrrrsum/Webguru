import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { adminAuthOptions } from '@/lib/admin-auth';
import { getAllJobsWithUsers } from '@/lib/db';
import Link from 'next/link';

const ADMIN_EMAIL = 'jaffarsadiq1001@gmail.com';

export default async function AdminConversationsPage() {
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

  const jobs = await getAllJobsWithUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">All Conversations</h2>
          <p className="mt-1 text-sm text-slate-400">
            View and manage all user-agent conversations
          </p>
        </div>
        <div className="text-sm text-slate-400">
          Total: {jobs.length} conversations
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900/60">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Job #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Files
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-900/40 divide-y divide-slate-800">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    No conversations found.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-slate-300">
                        #{job.jobNumber || job.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">
                        {job.title || 'Untitled Job'}
                      </div>
                      {job.tags && job.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {job.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">
                        {job.userName || 'Unknown User'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">
                        {job.agentName || 'Unassigned'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-400">
                        {job.fileCount || 0} files
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {new Date(job.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin-panel/conversations/${job.id}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        View Chat
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

