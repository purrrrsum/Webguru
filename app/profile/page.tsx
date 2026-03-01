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
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
        <div className="text-brand-blue text-xl font-medium">Loading...</div>
      </div>
    );
  }

  if (!session || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 p-6 text-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/10 transition-all"
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
            <div>
              <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
              <p className="text-sm text-slate-400">Manage your account and preferences</p>
            </div>
          </div>
          <Link
            href="/api/auth/signout"
            className="brand-button-secondary"
          >
            Sign Out
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Empty Profile Alert */}
        {(!user.name || !user.phone) && (
          <div className="bg-brand-orange/10 border border-brand-orange/40 rounded-xl p-4 flex items-start gap-4 animate-fade-in shadow-[0_0_15px_rgba(255,117,140,0.1)]">
            <span className="text-2xl mt-0.5">⚠️</span>
            <div>
              <h3 className="text-brand-orange font-semibold tracking-wide">Complete Your Profile</h3>
              <p className="text-sm text-slate-300 mt-1 mb-0 pb-0">Please fill out your name and contact phone number below to access all platform features seamlessly.</p>
            </div>
          </div>
        )}

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
          {/* Job Count Badge */}
          <div className="mb-8 pb-8 border-b border-slate-800">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 bg-gradient-to-r from-slate-900 to-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wide font-medium">Completed Jobs</p>
                  <p className="text-4xl font-bold text-brand-blue mt-2">
                    {user.jobCount || 0}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {session.user.role === 'agent' ? 'Jobs completed' : 'Proofreading projects done'}
                  </p>
                </div>
                <div className="w-20 h-20 bg-brand-blue/10 rounded-2xl flex items-center justify-center border border-brand-blue/20">
                  <span className="text-4xl text-brand-blue">✓</span>
                </div>
              </div>
            </div>
          </div>

          {/* Available Agents Count (for users only) */}
          {session.user.role === 'user' && availableAgentsCount !== null && (
            <div className="mb-8 pb-8 border-b border-slate-800">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 bg-gradient-to-r from-slate-900 to-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 uppercase tracking-wide font-medium">Agents Online</p>
                    <p className="text-4xl font-bold text-brand-blue mt-2">
                      {availableAgentsCount}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {availableAgentsCount === 0
                        ? 'No agents online at the moment'
                        : availableAgentsCount === 1
                          ? 'Agent ready to take tasks'
                          : 'Agents ready to take tasks'}
                    </p>
                  </div>
                  <div className="w-20 h-20 bg-brand-blue/10 rounded-2xl flex items-center justify-center border border-brand-blue/20">
                    <span className="text-4xl">👥</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Agent Availability Toggle */}
          {session.user.role === 'agent' && (
            <div className="mb-8 pb-8 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white mb-6">Availability Status</h3>
              <div className="space-y-6">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Online Status</h4>
                      <p className="text-sm text-slate-500">Show as available in the system</p>
                    </div>
                    <button
                      onClick={() => handleAvailabilityToggle('isOnline', !isOnline)}
                      disabled={updatingAvailability}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${isOnline ? 'bg-brand-blue' : 'bg-brand-gray-300'
                        }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${isOnline ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Ready to Take Tasks</h4>
                      <p className="text-sm text-slate-500">Receive new job assignments</p>
                    </div>
                    <button
                      onClick={() => handleAvailabilityToggle('isReady', !isReady)}
                      disabled={updatingAvailability || !isOnline}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${isReady && isOnline ? 'bg-brand-blue' : 'bg-brand-gray-300'
                        } ${!isOnline ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${isReady && isOnline ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  {isOnline && isReady && (
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 border border-green-500/40 text-xs">✓</span>
                      <p className="text-sm text-green-400 font-medium">You are receiving new job assignments</p>
                    </div>
                  )}
                  {isOnline && !isReady && (
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-400 border border-yellow-500/40 text-xs">⚠</span>
                      <p className="text-sm text-yellow-400 font-medium">Online but not accepting new tasks</p>
                    </div>
                  )}
                  {!isOnline && (
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 border border-slate-700 text-xs">⭕</span>
                      <p className="text-sm text-slate-500">Offline - Jobs will be reassigned if you have pending messages</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Profile Form */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
            <ProfileForm initialData={user} onSave={handleSave} />
          </div>
        </div>
      </main>
    </div>
  );
}

