'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'agent';
  createdAt: string;
  jobCount: number;
  walletBalance: number;
}

export default function UsersManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingWallet, setEditingWallet] = useState<string | null>(null);
  const [walletAmount, setWalletAmount] = useState<string>('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin-panel/login');
      return;
    }

    if (status === 'authenticated') {
      fetchUsers();
    }
  }, [status, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'user' | 'agent') => {
    setUpdating(userId);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/admin/users/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        setSuccess(`User role updated to ${newRole}`);
        // Refresh users list
        await fetchUsers();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update user role');
      }
    } catch (err) {
      setError('Failed to update user role');
    } finally {
      setUpdating(null);
    }
  };

  const handleWalletUpdate = async (userId: string) => {
    if (!walletAmount || isNaN(Number(walletAmount))) {
      setError('Please enter a valid amount');
      return;
    }

    setUpdating(userId);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/admin/users/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount: Number(walletAmount) }),
      });

      if (res.ok) {
        setSuccess('Wallet balance updated successfully');
        await fetchUsers();
        setEditingWallet(null);
        setWalletAmount('');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update wallet balance');
      }
    } catch (err) {
      setError('Failed to update wallet balance');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-400">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">User Management</h2>
          <p className="mt-1 text-sm text-slate-400">
            Manage user roles. Each email can only have one role (user or agent).
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-900/30 p-4 text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/50 bg-green-900/30 p-4 text-green-200">
          {success}
        </div>
      )}

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="overflow-hidden rounded-lg border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900/60 text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Current Role</th>
                <th className="px-4 py-3 text-left font-medium">Wallet</th>
                <th className="px-4 py-3 text-left font-medium">Jobs</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-900/40">
                    <td className="px-4 py-3 text-white">{user.email}</td>
                    <td className="px-4 py-3 text-slate-200">{user.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${user.role === 'agent'
                            ? 'bg-blue-500/20 text-blue-200 border border-blue-500/40'
                            : 'bg-slate-500/20 text-slate-200 border border-slate-500/40'
                          }`}
                      >
                        {user.role === 'agent' ? 'Agent' : 'User'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {editingWallet === user.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={walletAmount}
                            onChange={(e) => setWalletAmount(e.target.value)}
                            placeholder="+/- amount"
                            className="w-24 px-2 py-1 text-xs rounded border border-slate-600 bg-slate-800 text-white"
                          />
                          <button
                            onClick={() => handleWalletUpdate(user.id)}
                            disabled={updating === user.id}
                            className="bg-green-600 hover:bg-green-700 text-white rounded px-2 py-1 text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => { setEditingWallet(null); setWalletAmount(''); }}
                            className="bg-slate-600 hover:bg-slate-700 text-white rounded px-2 py-1 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-white">${user.walletBalance?.toFixed(2) || '0.00'}</span>
                          <button
                            onClick={() => setEditingWallet(user.id)}
                            className="text-brand-blue hover:text-blue-400 text-xs underline"
                          >
                            Adjust
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{user.jobCount || 0}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {user.role === 'user' ? (
                          <button
                            onClick={() => handleRoleChange(user.id, 'agent')}
                            disabled={updating === user.id}
                            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updating === user.id ? 'Updating...' : 'Make Agent'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRoleChange(user.id, 'user')}
                            disabled={updating === user.id}
                            className="rounded-md bg-slate-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updating === user.id ? 'Updating...' : 'Make User'}
                          </button>
                        )}
                      </div>
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

