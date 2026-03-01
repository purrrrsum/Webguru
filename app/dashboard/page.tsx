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
  jobNumber?: number | null;
  priority?: 'normal' | 'high' | 'urgent';
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
  const [jobServiceType, setJobServiceType] = useState('design');
  const [jobPricingModel, setJobPricingModel] = useState('single_project');
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
      <div className="min-h-screen flex items-center justify-center apple-chat-bg">
        <div className="text-apple-blue text-xl font-medium">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isAgent = session.user.role === 'agent';
  const headerClass = 'telegram-header text-white';
  const pageBgClass = 'apple-chat-bg';

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
          serviceType: jobServiceType,
          pricingModel: jobPricingModel,
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
        setJobServiceType('design');
        setJobPricingModel('single_project');
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
          <div className="mb-6 apple-card p-6">
            <h2 className="apple-heading-3 text-apple-gray-900 mb-3">Pay for your proofreading jobs</h2>
            <p className="apple-body-small text-apple-gray-600 mb-4">
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
                <p className="mt-2 text-xs text-gray-400 text-center">
                  Tap to enlarge QR in a new tab.
                </p>
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-300">Phone (UPI linked)</p>
                  <p className="text-lg font-semibold text-white">+91 90000 12345</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">UPI ID</p>
                  <p className="text-lg font-semibold text-white">thesupport@upi</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Need help?</p>
                  <p className="text-sm text-gray-300">
                    Share payment slips in the chat or email{' '}
                    <a href="mailto:billing@thesupport.agency" className="text-apple-blue hover:text-apple-blue-dark">
                      billing@thesupport.agency
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="apple-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">
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
                className="apple-button-primary"
              >
                {showJobForm ? 'Cancel' : '+ New Job'}
              </button>
            )}
          </div>

          {showJobForm && (
            <form onSubmit={handleNewJobSubmit} className="mb-6 bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-3">
              <div>
                <label htmlFor="job-title" className="block text-sm font-medium text-gray-300 mb-1">
                  Job title
                </label>
                <input
                  id="job-title"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  maxLength={120}
                  className="w-full px-4 py-3 bg-white border border-apple-gray-200 rounded-xl focus:ring-2 focus:ring-apple-blue focus:border-transparent text-apple-gray-900 placeholder-apple-gray-500"
                  placeholder="e.g. Brochure Proofread – September Launch"
                  required
                />
              </div>
              <div>
                <label htmlFor="service-type" className="block text-sm font-medium text-gray-300 mb-1">
                  Service requirements
                </label>
                <select
                  id="service-type"
                  value={jobServiceType}
                  onChange={(e) => setJobServiceType(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-apple-gray-200 rounded-xl focus:ring-2 focus:ring-apple-blue focus:border-transparent text-apple-gray-900"
                >
                  <option value="design">Design</option>
                  <option value="content_creation">Content Creation</option>
                  <option value="video_editing">Video Editing</option>
                  <option value="text_editing">Text Editing</option>
                  <option value="proofreading">Proofreading</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="pricing-model" className="block text-sm font-medium text-gray-300 mb-1">
                  Pricing Model
                </label>
                <select
                  id="pricing-model"
                  value={jobPricingModel}
                  onChange={(e) => setJobPricingModel(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-apple-gray-200 rounded-xl focus:ring-2 focus:ring-apple-blue focus:border-transparent text-apple-gray-900"
                >
                  <option value="single_project">Single Project / Task</option>
                  <option value="monthly_subscription">Monthly Subscription</option>
                  <option value="yearly_subscription">Yearly Subscription</option>
                </select>
              </div>
              <div>
                <label htmlFor="job-tags" className="block text-sm font-medium text-gray-300 mb-1">
                  Tags (optional)
                </label>
                <input
                  id="job-tags"
                  type="text"
                  value={jobTagsInput}
                  onChange={(e) => setJobTagsInput(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-apple-gray-200 rounded-xl focus:ring-2 focus:ring-apple-blue focus:border-transparent text-apple-gray-900 placeholder-apple-gray-500"
                  placeholder="Add up to 3 tags, separated by commas"
                />
                <p className="text-xs text-gray-400 mt-1">Example: brochure, campaign, client-name</p>
              </div>
              <div>
                <label htmlFor="job-due" className="block text-sm font-medium text-gray-300 mb-1">
                  Due date & time (optional)
                </label>
                <input
                  id="job-due"
                  type="datetime-local"
                  value={jobDueAt}
                  onChange={(e) => setJobDueAt(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green text-white"
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Set expectations so agents can plan and automations can alert on delays.
                </p>
              </div>
              {jobFormError && (
                <p className="text-sm text-red-400">{jobFormError}</p>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={creatingJob}
                  className="apple-button-primary disabled:opacity-50"
                >
                  {creatingJob ? 'Creating...' : 'Create Job'}
                </button>
              </div>
            </form>
          )}

          {isAgent && (
            <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800/50 p-4 text-gray-300">
              <p className="text-sm font-semibold">Agent view</p>
              <p className="mt-1 text-sm">
                You can open any active job to review messages and files. Tags highlight the content type and status shared by the user.
              </p>
            </div>
          )}

          {jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg mb-2">No jobs yet</p>
              {session.user.role === 'user' && (
                <p className="text-sm">Click &quot;New Job&quot; to start a conversation</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/chat/${job.id}`}
                  className="block apple-card p-6 hover:shadow-apple-lg transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {job.jobNumber && (
                          <span className="text-xs font-mono text-gray-400">#{job.jobNumber}</span>
                        )}
                        <p className="font-medium text-white">
                          {job.title?.length ? job.title : `Job ${job.id.slice(0, 8)}`}
                        </p>
                        {job.priority === 'high' || job.priority === 'urgent' ? (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${job.priority === 'urgent'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                            }`}>
                            {job.priority === 'urgent' ? 'URGENT' : 'HIGH'}
                          </span>
                        ) : null}
                        {job.hasUnread && (
                          <span className="w-2 h-2 bg-apple-blue rounded-full"></span>
                        )}
                      </div>
                      {isAgent && job.userName && (
                        <p className="text-xs text-gray-400 mt-1">Client: {job.userName}</p>
                      )}
                      <p className="text-sm text-gray-400 mt-1">
                        {job.fileCount} file{job.fileCount !== 1 ? 's' : ''} •{' '}
                        {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                      {job.tags && job.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {job.tags.map((tag) => (
                            <span key={`${job.id}-${tag}`} className="text-xs px-3 py-1 bg-apple-blue/10 text-apple-blue rounded-full border border-apple-blue/20">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {job.dueAt && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <span className="font-semibold text-gray-300">
                            Due: {new Date(job.dueAt).toLocaleString()}
                          </span>
                          {job.slaStatus && (
                            <span
                              className={`px-2 py-1 rounded-full ${job.slaStatus === 'overdue'
                                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                  : job.slaStatus === 'due_soon'
                                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                                    : 'bg-green-500/20 text-green-300 border border-green-500/40'
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
                      className="w-5 h-5 text-gray-500"
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

