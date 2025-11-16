'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Job {
  id: string;
  userId: string;
  agentId: string;
  createdAt: string;
  updatedAt: string;
  fileCount: number;
  hasUnread: boolean;
  title?: string | null;
  tags?: string[];
  userName?: string | null;
  dueAt?: string | null;
  slaStatus?: 'pending' | 'on_track' | 'due_soon' | 'overdue' | 'escalated';
  escalationLevel?: 'none' | 'warning' | 'escalated';
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobTagsInput, setJobTagsInput] = useState('');
  const [jobDueAt, setJobDueAt] = useState('');
  const [jobFormError, setJobFormError] = useState<string | null>(null);
  const [creatingJob, setCreatingJob] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchJobs();
    }
  }, [session]);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
        if (data.warning) {
          console.warn(data.warning);
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-whatsapp-gray-light">
        <div className="text-whatsapp-green text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isAgent = session.user.role === 'agent';
  const headerClass = isAgent ? 'bg-slate-900 text-slate-100' : 'bg-whatsapp-green text-white';
  const pageBgClass = isAgent ? 'bg-slate-900/70' : 'bg-whatsapp-gray-light';

  const handleNewJobSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!jobTitle.trim()) {
      setJobFormError('Please add a job title.');
      return;
    }

    const tags = Array.from(
      new Set(
        jobTagsInput
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      )
    ).slice(0, 3);

    setJobFormError(null);
    setCreatingJob(true);

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: jobTitle.trim(),
          tags,
          dueAt: jobDueAt ? new Date(jobDueAt).toISOString() : null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.warning) {
          alert(data.warning);
        }
        setJobTitle('');
        setJobTagsInput('');
        setJobDueAt('');
        setShowJobForm(false);
        setLoading(true);
        await fetchJobs();
        router.push(`/chat/${data.job.id}`);
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Failed to create job.' }));
        setJobFormError(errorData.error || 'Failed to create job.');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      setJobFormError('Failed to create job.');
    } finally {
      setCreatingJob(false);
    }
  };

  return (
    <div className={`min-h-screen ${pageBgClass}`}>
      {/* Header */}
      <header className={`${headerClass} p-4 shadow-md`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:underline">
              ← Back to Home
            </Link>
            <h1 className="text-xl font-bold">
              {isAgent ? 'Agent Queue' : 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="px-4 py-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors text-sm"
            >
              Profile
            </Link>
            <Link
              href="/support"
              className="px-4 py-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors text-sm"
            >
              Support
            </Link>
            <Link
              href="/api/auth/signout"
              className="px-4 py-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors text-sm"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4">
        {session.user.role === 'user' && (
          <div className="mb-6 rounded-lg border border-whatsapp-green/30 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">Pay for your proofreading jobs</h2>
            <p className="mt-1 text-sm text-gray-600">
              Scan the QR or use the UPI details below. Share the payment reference in the chat so our finance team can match it quickly.
            </p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="sm:w-48">
                <a
                  href="https://i.imgur.com/TqbKx7b.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden rounded-lg border border-gray-200"
                >
                  <img
                    src="https://i.imgur.com/TqbKx7b.png"
                    alt="QR code for thesupport.agency payment"
                    className="w-full"
                  />
                </a>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  Tap to enlarge QR in a new tab.
                </p>
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone (UPI linked)</p>
                  <p className="text-lg font-semibold text-gray-900">+91 90000 12345</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">UPI ID</p>
                  <p className="text-lg font-semibold text-gray-900">thesupport@upi</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Need help?</p>
                  <p className="text-sm text-gray-600">
                    Share payment slips in the chat or email{' '}
                    <a href="mailto:billing@thesupport.agency" className="text-whatsapp-green hover:underline">
                      billing@thesupport.agency
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {session.user.role === 'user' ? 'Your Jobs' : 'All User Conversations'}
            </h2>
            {session.user.role === 'user' && (
              <button
                onClick={() => {
                  if (showJobForm) {
                    setJobTitle('');
                    setJobTagsInput('');
                    setJobFormError(null);
                  }
                  setShowJobForm((prev) => !prev);
                }}
                className="px-4 py-2 bg-whatsapp-green text-white rounded-md hover:bg-whatsapp-green-dark transition-colors"
              >
                {showJobForm ? 'Cancel' : '+ New Job'}
              </button>
            )}
          </div>

          {showJobForm && (
            <form onSubmit={handleNewJobSubmit} className="mb-6 bg-whatsapp-gray-light/40 border border-gray-200 rounded-lg p-4 space-y-3">
              <div>
                <label htmlFor="job-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Job title
                </label>
                <input
                  id="job-title"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  maxLength={120}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green"
                  placeholder="e.g. Brochure Proofread – September Launch"
                  required
                />
              </div>
              <div>
                <label htmlFor="job-tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (optional)
                </label>
                <input
                  id="job-tags"
                  type="text"
                  value={jobTagsInput}
                  onChange={(e) => setJobTagsInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green"
                  placeholder="Add up to 3 tags, separated by commas"
                />
                <p className="text-xs text-gray-500 mt-1">Example: brochure, campaign, client-name</p>
              </div>
              <div>
                <label htmlFor="job-due" className="block text-sm font-medium text-gray-700 mb-1">
                  Due date & time (optional)
                </label>
                <input
                  id="job-due"
                  type="datetime-local"
                  value={jobDueAt}
                  onChange={(e) => setJobDueAt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green"
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set expectations so agents can plan and automations can alert on delays.
                </p>
              </div>
              {jobFormError && (
                <p className="text-sm text-red-600">{jobFormError}</p>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={creatingJob}
                  className="px-4 py-2 bg-whatsapp-green text-white rounded-md hover:bg-whatsapp-green-dark transition-colors disabled:opacity-50"
                >
                  {creatingJob ? 'Creating...' : 'Create Job'}
                </button>
              </div>
            </form>
          )}

          {isAgent && (
            <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700">
              <p className="text-sm font-semibold">Agent view</p>
              <p className="mt-1 text-sm">
                You can open any active job to review messages and files. Tags highlight the content type and status shared by the user.
              </p>
            </div>
          )}

          {jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No jobs yet</p>
              {session.user.role === 'user' && (
                <p className="text-sm">Click "New Job" to start a conversation</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/chat/${job.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800">
                          {job.title?.length ? job.title : `Job ${job.id.slice(0, 8)}`}
                        </p>
                        {job.hasUnread && (
                          <span className="w-2 h-2 bg-whatsapp-green rounded-full"></span>
                        )}
                      </div>
                      {isAgent && job.userName && (
                        <p className="text-xs text-gray-500 mt-1">Client: {job.userName}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {job.fileCount} file{job.fileCount !== 1 ? 's' : ''} •{' '}
                        {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                      {job.tags && job.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {job.tags.map((tag) => (
                            <span key={`${job.id}-${tag}`} className="text-xs px-2 py-1 bg-whatsapp-green-light text-whatsapp-green rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {job.dueAt && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <span className="font-semibold text-gray-600">
                            Due: {new Date(job.dueAt).toLocaleString()}
                          </span>
                          {job.slaStatus && (
                            <span
                              className={`px-2 py-1 rounded-full ${
                                job.slaStatus === 'overdue'
                                  ? 'bg-red-100 text-red-700'
                                  : job.slaStatus === 'due_soon'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {job.slaStatus === 'overdue'
                                ? 'Overdue'
                                : job.slaStatus === 'due_soon'
                                ? 'Due soon'
                                : 'On track'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

