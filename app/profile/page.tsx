'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProfileForm from '@/components/ProfileForm';
import { User } from '@/lib/utils';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        if (data.warning) {
          console.warn(data.warning);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Partial<User>) => {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Failed to update profile' }));
      throw new Error(errorData.error || 'Failed to update profile');
    }

    const updated = await res.json();
    setUser(updated);
    return updated;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-whatsapp-gray-light">
        <div className="text-whatsapp-green text-xl">Loading...</div>
      </div>
    );
  }

  if (!session || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-whatsapp-gray-light">
      {/* Header */}
      <header className="bg-whatsapp-green text-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-white hover:bg-white/20 p-2 rounded"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-xl font-bold">Profile</h1>
          </div>
          <Link
            href="/api/auth/signout"
            className="px-4 py-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors text-sm"
          >
            Sign Out
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Job Count Badge */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed Jobs</p>
                <p className="text-3xl font-bold text-whatsapp-green mt-1">
                  {user.jobCount || 0}
                </p>
              </div>
              <div className="w-16 h-16 bg-whatsapp-green-light rounded-full flex items-center justify-center">
                <span className="text-3xl">✓</span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Profile</h2>
            <ProfileForm initialData={user} onSave={handleSave} />
          </div>
        </div>
      </main>
    </div>
  );
}

