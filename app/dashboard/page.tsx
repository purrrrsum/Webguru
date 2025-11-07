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
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

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

  const createNewJob = async () => {
    try {
      const res = await fetch('/api/jobs', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.warning) {
          alert(data.warning);
        }
        router.push(`/chat/${data.job.id}`);
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Failed to create job.' }));
        alert(errorData.error || 'Failed to create job.');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job.');
    }
  };

  return (
    <div className="min-h-screen bg-whatsapp-gray-light">
      {/* Header */}
      <header className="bg-whatsapp-green text-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white hover:underline">
              ← Back to Home
            </Link>
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="px-4 py-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors text-sm"
            >
              Profile
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {session.user.role === 'user' ? 'Your Jobs' : 'Active Jobs'}
            </h2>
            {session.user.role === 'user' && (
              <button
                onClick={createNewJob}
                className="px-4 py-2 bg-whatsapp-green text-white rounded-md hover:bg-whatsapp-green-dark transition-colors"
              >
                + New Job
              </button>
            )}
          </div>

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
                          Job #{job.id.slice(0, 8)}
                        </p>
                        {job.hasUnread && (
                          <span className="w-2 h-2 bg-whatsapp-green rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {job.fileCount} file{job.fileCount !== 1 ? 's' : ''} •{' '}
                        {new Date(job.createdAt).toLocaleDateString()}
                      </p>
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

