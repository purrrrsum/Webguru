'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { SupportTicket } from '@/lib/utils';

interface SupportTicketResponse {
  tickets?: SupportTicket[];
  warning?: string;
  error?: string;
  unreadCount?: number;
}

interface SupportTicketForm {
  subject: string;
  description: string;
  priority: 'low' | 'normal' | 'high';
}

export default function SupportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [form, setForm] = useState<SupportTicketForm>({
    subject: '',
    description: '',
    priority: 'normal',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/support');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchTickets();
    }
  }, [session]);

  const fetchTickets = async () => {
    setLoading(true);
    setWarning(null);
    setError(null);

    try {
      const res = await fetch('/api/support?markRead=true');
      const data: SupportTicketResponse = await res.json();

      if (res.ok) {
        const rawTickets = (data.tickets || []) as SupportTicket[];
        if (session?.user?.role === 'agent') {
          const unread = data.unreadCount ?? 0;
          setUnreadCount(unread);
          setTickets(rawTickets.map((ticket) => ({ ...ticket, unreadForAdmin: false })));
        } else {
          setTickets(rawTickets);
        }
        if (data.warning) {
          setWarning(data.warning);
        }
      } else {
        setError(data.error || 'Failed to load support tickets.');
      }
    } catch (err) {
      console.error('Support ticket fetch error:', err);
      setError('Failed to load support tickets.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Support request submitted. Our admin team will reach out soon.');
        setForm({ subject: '', description: '', priority: 'normal' });
        await fetchTickets();
      } else {
        setError(data.error || 'Failed to submit support request.');
      }
    } catch (err) {
      console.error('Support request submission error:', err);
      setError('Failed to submit support request.');
    } finally {
      setSubmitting(false);
    }
  };

  const isAgentView = useMemo(() => session?.user?.role === 'agent', [session?.user?.role]);

  const handleStatusUpdate = async (ticketId: string, status: SupportTicket['status']) => {
    setError(null);
    try {
      const res = await fetch('/api/support', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticketId, status }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update ticket');
      }
      setTickets((prev) => prev.map((ticket) => (ticket.id === ticketId ? data.ticket : ticket)));
      setUnreadCount((prev) => (data.ticket.unreadForAdmin ? prev : Math.max(0, prev - 1)));
    } catch (err: any) {
      console.error('Ticket update error:', err);
      setError(err.message || 'Failed to update ticket.');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-whatsapp-gray-light">
        <div className="text-whatsapp-green text-xl">Loading support center...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-whatsapp-gray-light">
      <header className="bg-whatsapp-green text-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-white hover:bg-white/20 p-2 rounded">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Support Center</h1>
              <p className="text-xs text-white/80">Report issues directly to the admin team</p>
            </div>
          </div>
          <Link
            href="/profile"
            className="px-3 py-1.5 bg-white/20 rounded-md hover:bg-white/30 transition-colors text-sm"
          >
            Profile
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {warning && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
            {warning}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {isAgentView && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded flex items-center justify-between">
            <div>
              <p className="font-semibold">Admin Notifications</p>
              <p className="text-sm">
                {unreadCount > 0
                  ? `You have ${unreadCount} new support ${unreadCount === 1 ? 'request' : 'requests'} to review.`
                  : 'All support requests have been reviewed.'}
              </p>
            </div>
            <button
              type="button"
              onClick={fetchTickets}
              className="text-sm text-blue-700 hover:underline whitespace-nowrap"
            >
              Refresh now
            </button>
          </div>
        )}

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Submit a Support Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                required
                maxLength={200}
                value={form.subject}
                onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green"
                placeholder="Brief summary of the issue"
                disabled={submitting}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                required
                maxLength={5000}
                rows={5}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green"
                placeholder="Explain the issue you are facing"
                disabled={submitting}
              />
              <p className="text-xs text-gray-400 mt-1">Include steps to reproduce and any error messages if available.</p>
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={form.priority}
                onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value as SupportTicketForm['priority'] }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green"
                disabled={submitting}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-whatsapp-green text-white px-4 py-2 rounded-md hover:bg-whatsapp-green-dark transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Support Request'}
            </button>
          </form>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Support History</h2>
            <button
              onClick={fetchTickets}
              className="text-sm text-whatsapp-green hover:underline"
            >
              Refresh
            </button>
          </div>

          {tickets.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm">No support tickets yet. Submit a request using the form above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{ticket.subject}</p>
                      <p className="text-xs text-gray-500">#{ticket.id} • {new Date(ticket.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAgentView && ticket.unreadForAdmin && (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          New
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          ticket.priority === 'high'
                            ? 'bg-red-100 text-red-700'
                            : ticket.priority === 'low'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {ticket.priority.toUpperCase()}
                      </span>
                      {isAgentView ? (
                        <select
                          value={ticket.status}
                          onChange={(e) => handleStatusUpdate(ticket.id, e.target.value as SupportTicket['status'])}
                          className="px-2 py-1 border border-gray-300 rounded-md text-xs"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            ticket.status === 'resolved'
                              ? 'bg-green-100 text-green-700'
                              : ticket.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {ticket.status.replace('_', ' ').toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                    {ticket.description}
                  </p>
                  {isAgentView && (
                    <p className="mt-3 text-xs text-gray-500">
                      Reported by {ticket.email} ({ticket.role})
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

