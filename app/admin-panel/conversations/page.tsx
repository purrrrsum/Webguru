'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Job {
  id: string;
  userId: string;
  agentId: string;
  createdAt: string;
  updatedAt: string;
  title?: string | null;
  tags?: string[];
  userName?: string | null;
  agentName?: string | null;
  dueAt?: string | null;
  slaStatus?: string;
  status?: 'open' | 'closed';
  jobNumber?: number | null;
  fileCount?: number;
}

export default function AdminConversationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'long-open'>('all');
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [longOpenJobs, setLongOpenJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const [allRes, longOpenRes] = await Promise.all([
        fetch('/api/admin/jobs'),
        fetch('/api/admin/jobs/long-open'),
      ]);

      if (allRes.ok) {
        const allData = await allRes.json();
        setAllJobs(allData);
      }

      if (longOpenRes.ok) {
        const longOpenData = await longOpenRes.json();
        setLongOpenJobs(longOpenData);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: 'open' | 'closed') => {
    try {
      setUpdating(jobId);
      const res = await fetch(`/api/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        await fetchJobs();
      } else {
        alert('Failed to update job status');
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('Failed to update job status');
    } finally {
      setUpdating(null);
    }
  };

  const jobsToDisplay = activeTab === 'all' ? allJobs : longOpenJobs;
  const openJobsCount = allJobs.filter(j => j.status === 'open').length;
  const longOpenCount = longOpenJobs.length;

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
          Total: {allJobs.length} conversations
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          All Conversations ({allJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('long-open')}
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${
            activeTab === 'long-open'
              ? 'text-amber-400 border-b-2 border-amber-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          Open &gt; 15 min
          {longOpenCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-amber-500/20 text-amber-300 rounded-full">
              {longOpenCount}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading...</div>
      ) : (
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
                    Status
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
                {jobsToDisplay.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                      {activeTab === 'long-open' 
                        ? 'No jobs open for more than 15 minutes.' 
                        : 'No conversations found.'}
                    </td>
                  </tr>
                ) : (
                  jobsToDisplay.map((job) => {
                    const isLongOpen = activeTab === 'long-open';
                    const minutesOpen = Math.floor(
                      (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60)
                    );
                    
                    return (
                      <tr 
                        key={job.id} 
                        className={`hover:bg-slate-900/60 transition-colors ${
                          isLongOpen ? 'bg-amber-500/5' : ''
                        }`}
                      >
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
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                job.status === 'open'
                                  ? 'bg-green-500/20 text-green-300'
                                  : 'bg-slate-500/20 text-slate-300'
                              }`}
                            >
                              {job.status === 'open' ? 'Open' : 'Closed'}
                            </span>
                            {isLongOpen && (
                              <span className="text-xs text-amber-400">
                                {minutesOpen}m
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {new Date(job.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/admin-panel/conversations/${job.id}`}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => handleStatusChange(
                                job.id, 
                                job.status === 'open' ? 'closed' : 'open'
                              )}
                              disabled={updating === job.id}
                              className={`text-xs px-2 py-1 rounded transition-colors ${
                                job.status === 'open'
                                  ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                                  : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                              } disabled:opacity-50`}
                            >
                              {updating === job.id 
                                ? '...' 
                                : job.status === 'open' 
                                  ? 'Close' 
                                  : 'Reopen'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
