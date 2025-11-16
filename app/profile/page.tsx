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
  const [isOnline, setIsOnline] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const [availableAgentsCount, setAvailableAgentsCount] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
      if (session.user.role === 'agent') {
        fetchAvailability();
      } else if (session.user.role === 'user') {
        fetchAvailableAgentsCount();
        // Refresh every 30 seconds
        const interval = setInterval(fetchAvailableAgentsCount, 30000);
        return () => clearInterval(interval);
      }
    }
  }, [session]);

  const fetchAvailableAgentsCount = async () => {
    try {
      const res = await fetch('/api/agents/available-count');
      if (res.ok) {
        const data = await res.json();
        setAvailableAgentsCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching available agents count:', error);
    }
  };

  const fetchAvailability = async () => {
    try {
      const res = await fetch('/api/agent/availability');
      if (res.ok) {
        const data = await res.json();
        setIsOnline(data.isOnline || false);
        setIsReady(data.isReady || false);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const handleAvailabilityToggle = async (field: 'isOnline' | 'isReady', value: boolean) => {
    if (session?.user?.role !== 'agent') return;
    
    setUpdatingAvailability(true);
    try {
      const newIsOnline = field === 'isOnline' ? value : isOnline;
      const newIsReady = field === 'isReady' ? value : isReady;
      
      const res = await fetch('/api/agent/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOnline: newIsOnline, isReady: newIsReady }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsOnline(data.user.isOnline);
        setIsReady(data.user.isReady);
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Failed to update availability');
    } finally {
      setUpdatingAvailability(false);
    }
  };

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
    <div className="min-h-screen telegram-bg">
      {/* Header */}
      <header className="telegram-header text-white p-4 shadow-md">
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
        <div className="telegram-card rounded-lg shadow-md p-6">
          {/* Job Count Badge */}
          <div className="mb-6 pb-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Completed Jobs</p>
                <p className="text-3xl font-bold text-whatsapp-green mt-1">
                  {user.jobCount || 0}
                </p>
              </div>
              <div className="w-16 h-16 bg-whatsapp-green/20 rounded-full flex items-center justify-center">
                <span className="text-3xl text-whatsapp-green">✓</span>
              </div>
            </div>
          </div>

          {/* Available Agents Count (for users only) */}
          {session.user.role === 'user' && availableAgentsCount !== null && (
            <div className="mb-6 pb-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Agents Available</p>
                  <p className="text-3xl font-bold text-blue-400 mt-1">
                    {availableAgentsCount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {availableAgentsCount === 0 
                      ? 'No agents online at the moment' 
                      : availableAgentsCount === 1
                      ? 'Agent ready to take tasks'
                      : 'Agents ready to take tasks'}
                  </p>
                </div>
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </div>
          )}

          {/* Agent Availability Toggle */}
          {session.user.role === 'agent' && (
            <div className="mb-6 pb-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Availability Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Online</p>
                    <p className="text-xs text-gray-500">Show as available in system</p>
                  </div>
                  <button
                    onClick={() => handleAvailabilityToggle('isOnline', !isOnline)}
                    disabled={updatingAvailability}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isOnline ? 'bg-whatsapp-green' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isOnline ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Ready to Take Tasks</p>
                    <p className="text-xs text-gray-500">Receive new job assignments</p>
                  </div>
                  <button
                    onClick={() => handleAvailabilityToggle('isReady', !isReady)}
                    disabled={updatingAvailability || !isOnline}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isReady && isOnline ? 'bg-whatsapp-green' : 'bg-gray-600'
                    } ${!isOnline ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isReady && isOnline ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {isOnline && isReady && (
                  <p className="text-xs text-green-400">✓ You are receiving new job assignments</p>
                )}
                {isOnline && !isReady && (
                  <p className="text-xs text-yellow-400">⚠ Online but not accepting new tasks</p>
                )}
                {!isOnline && (
                  <p className="text-xs text-gray-500">Offline - Jobs will be reassigned if you have pending messages</p>
                )}
              </div>
            </div>
          )}

          {/* Profile Form */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Edit Profile</h2>
            <ProfileForm initialData={user} onSave={handleSave} />
          </div>
        </div>
      </main>
    </div>
  );
}

