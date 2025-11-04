'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestChatPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(window.location.origin);
    fetchTestJobs();
  }, []);

  const fetchTestJobs = async () => {
    try {
      // Try to fetch jobs from API (will fail if not authenticated, but we can show manual instructions)
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Test Chat URLs</h1>
          <p className="text-gray-600 mb-4">
            Direct URLs for testing user and agent chat pages. These URLs require authentication.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes:</h2>
            <ul className="list-disc list-inside text-yellow-700 text-sm space-y-1">
              <li>You must be logged in to access chat pages</li>
              <li>User can only access jobs where they are the userId</li>
              <li>Agent can only access jobs where they are the agentId</li>
              <li>Job IDs are generated when jobs are created</li>
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">URL Format:</h2>
            <code className="bg-gray-100 p-2 rounded block">
              {baseUrl}/chat/[jobId]
            </code>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading jobs...</div>
          ) : jobs.length > 0 ? (
            <div className="mb-6">
              <h2 className="font-semibold mb-3">Available Jobs:</h2>
              <div className="space-y-2">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Job ID: {job.id}</p>
                        <p className="text-sm text-gray-500">
                          {job.fileCount} files • Created:{' '}
                          {new Date(job.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/chat/${job.id}`}
                          className="px-3 py-1 bg-whatsapp-green text-white rounded text-sm hover:bg-whatsapp-green-dark"
                          target="_blank"
                        >
                          Open Chat
                        </Link>
                      </div>
                    </div>
                    <div className="mt-2">
                      <code className="text-xs bg-gray-100 p-1 rounded">
                        {baseUrl}/chat/{job.id}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                How to Get Test URLs:
              </h3>
              <ol className="list-decimal list-inside text-blue-700 text-sm space-y-2">
                <li>
                  <strong>Login as User:</strong> Sign in and create a new job from the dashboard
                </li>
                <li>
                  <strong>Login as Agent:</strong> Sign in with agent credentials to see assigned jobs
                </li>
                <li>
                  <strong>Check Database:</strong> Query the jobs table to get job IDs:
                  <pre className="bg-gray-800 text-white p-2 rounded mt-2 text-xs overflow-x-auto">
                    SELECT id, user_id, agent_id FROM jobs ORDER BY created_at DESC LIMIT 10;
                  </pre>
                </li>
                <li>
                  <strong>Use Job ID:</strong> Replace [jobId] in the URL format above
                </li>
              </ol>
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <h2 className="font-semibold mb-3">Quick Test URLs (if you know job IDs):</h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium mb-1">Enter Job ID:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="jobIdInput"
                    placeholder="e.g., job1234567890"
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                  />
                  <button
                    onClick={() => {
                      const jobId = (
                        document.getElementById('jobIdInput') as HTMLInputElement
                      ).value;
                      if (jobId) {
                        window.open(`/chat/${jobId}`, '_blank');
                      }
                    }}
                    className="px-4 py-2 bg-whatsapp-green text-white rounded hover:bg-whatsapp-green-dark"
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <Link
              href="/dashboard"
              className="text-whatsapp-green hover:underline"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

