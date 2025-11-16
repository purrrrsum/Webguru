'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useRef, ClipboardEvent as ReactClipboardEvent } from 'react';
import ChatBubble from '@/components/ChatBubble';
import FileUploader from '@/components/FileUploader';
import { FileData, Message, JobAnnotation, JobVersion } from '@/lib/utils';

interface ChatData {
  job: {
    id: string;
    userId: string;
    agentId: string;
    createdAt: string;
    updatedAt: string;
    title?: string | null;
    tags?: string[];
    userName?: string | null;
    dueAt?: string | null;
    slaStatus?: 'pending' | 'on_track' | 'due_soon' | 'overdue' | 'escalated';
    escalationLevel?: 'none' | 'warning' | 'escalated';
    jobNumber?: number | null;
    priority?: 'normal' | 'high' | 'urgent';
  };
  files: FileData[];
  messages: Message[];
  otherUser: {
    id: string;
    name: string;
    role: string;
  } | null;
}

export default function ChatPage() {
  const { data: session } = useSession();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const jobId = params?.id;

  if (!jobId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Invalid chat ID. Please check the link and try again.</p>
      </div>
    );
  }

  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [annotations, setAnnotations] = useState<JobAnnotation[]>([]);
  const [annotationContent, setAnnotationContent] = useState('');
  const [savingAnnotation, setSavingAnnotation] = useState(false);
  const [versions, setVersions] = useState<JobVersion[]>([]);
  const [versionNotes, setVersionNotes] = useState('');
  const [savingVersion, setSavingVersion] = useState(false);
  const [slaDueInput, setSlaDueInput] = useState('');
  const [updatingSla, setUpdatingSla] = useState(false);
  const [editingJobNumber, setEditingJobNumber] = useState(false);
  const [jobNumberInput, setJobNumberInput] = useState('');
  const [updatingJobNumber, setUpdatingJobNumber] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchChatData();
  }, [session, jobId]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatData?.files, chatData?.messages]);

  const fetchChatData = async () => {
    try {
      const res = await fetch(`/api/chat/${jobId}`);
      if (res.ok) {
        const data = await res.json();
        setChatData(data);
        if (data?.job?.dueAt) {
          setSlaDueInput(new Date(data.job.dueAt).toISOString().slice(0, 16));
        }
        if (data?.job?.jobNumber) {
          setJobNumberInput(String(data.job.jobNumber));
        }
        await Promise.all([fetchAnnotations(), fetchVersions()]);
      } else if (res.status === 404) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnotations = async () => {
    if (!jobId) return;
    try {
      const res = await fetch(`/api/collaboration/annotations?jobId=${jobId}`);
      if (res.ok) {
        const data = await res.json();
        setAnnotations(data.annotations || []);
      }
    } catch (error) {
      console.error('Error fetching annotations:', error);
    }
  };

  const fetchVersions = async () => {
    if (!jobId) return;
    try {
      const res = await fetch(`/api/collaboration/versions?jobId=${jobId}`);
      if (res.ok) {
        const data = await res.json();
        setVersions(data.versions || []);
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
    }
  };

  const handleUpload = async (file: File) => {
    if (!session?.user) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobId', jobId);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        await fetchChatData(); // Refresh chat data
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleTick = async (fileId: string) => {
    try {
      const res = await fetch('/api/tick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.bothTicked) {
          // Both ticks done, refresh to show delete button or auto-delete
          await fetchChatData();
        } else {
          await fetchChatData(); // Update tick status
        }
      }
    } catch (error) {
      console.error('Tick error:', error);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      const res = await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId }),
      });

      if (res.ok) {
        await fetchChatData(); // Refresh chat data
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !session?.user || sendingMessage) return;

    setSendingMessage(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, message: messageText.trim() }),
      });

      if (res.ok) {
        setMessageText('');
        await fetchChatData(); // Refresh chat data
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Send message error:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleAnnotationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annotationContent.trim()) return;
    setSavingAnnotation(true);
    try {
      const res = await fetch('/api/collaboration/annotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          content: annotationContent.trim(),
        }),
      });
      if (res.ok) {
        setAnnotationContent('');
        await fetchAnnotations();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to add annotation');
      }
    } catch (error) {
      console.error('Annotation submit error:', error);
      alert('Failed to add annotation');
    } finally {
      setSavingAnnotation(false);
    }
  };

  const handleResolveAnnotation = async (annotationId: string) => {
    try {
      const res = await fetch(`/api/collaboration/annotations/${annotationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      if (res.ok) {
        await fetchAnnotations();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to resolve annotation');
      }
    } catch (error) {
      console.error('Resolve annotation error:', error);
      alert('Failed to resolve annotation');
    }
  };

  const handleVersionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingVersion(true);
    try {
      const res = await fetch('/api/collaboration/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          notes: versionNotes.trim() || undefined,
        }),
      });
      if (res.ok) {
        setVersionNotes('');
        await fetchVersions();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to record version');
      }
    } catch (error) {
      console.error('Version submit error:', error);
      alert('Failed to record version');
    } finally {
      setSavingVersion(false);
    }
  };

  const handleSlaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) return;
    setUpdatingSla(true);
    try {
      const res = await fetch('/api/jobs/sla', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          dueAt: slaDueInput ? new Date(slaDueInput).toISOString() : null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setChatData((prev) =>
          prev
            ? {
                ...prev,
                job: {
                  ...prev.job,
                  dueAt: data.job?.dueAt || null,
                  slaStatus: data.job?.slaStatus || 'pending',
                  escalationLevel: data.job?.escalationLevel || 'none',
                },
              }
            : prev
        );
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to update SLA');
      }
    } catch (error) {
      console.error('SLA submit error:', error);
      alert('Failed to update SLA');
    } finally {
      setUpdatingSla(false);
    }
  };

  const handleJobNumberUpdate = async () => {
    if (!jobId || !jobNumberInput.trim()) return;
    const newNumber = parseInt(jobNumberInput.trim());
    if (isNaN(newNumber) || newNumber < 1) {
      alert('Please enter a valid job number');
      return;
    }

    setUpdatingJobNumber(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobNumber: newNumber }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatData((prev) =>
          prev
            ? {
                ...prev,
                job: {
                  ...prev.job,
                  jobNumber: data.job?.jobNumber || null,
                },
              }
            : prev
        );
        setEditingJobNumber(false);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || 'Failed to update job number');
      }
    } catch (error) {
      console.error('Error updating job number:', error);
      alert('Failed to update job number');
    } finally {
      setUpdatingJobNumber(false);
    }
  };

  const handlePasteImage = async (event: ReactClipboardEvent<HTMLInputElement>) => {
    const items = event.clipboardData?.items;
    if (!items?.length) {
      return;
    }

    const imageItems = Array.from(items).filter((item) => item.type.startsWith('image/'));
    if (imageItems.length === 0) {
      return;
    }

    event.preventDefault();

    for (const item of imageItems) {
      const blob = item.getAsFile();
      if (!blob) {
        continue;
      }

      const extension = blob.type.split('/')[1] || 'png';
      const filename = `pasted-${Date.now()}.${extension}`;
      const file = new File([blob], filename, { type: blob.type });
      try {
        await handleUpload(file);
      } catch (error) {
        console.error('Failed to upload pasted image:', error);
      }
    }
  };

  // Combine files and messages, sort by timestamp
  const allItems = [
    ...(chatData?.files.map(f => ({ type: 'file' as const, data: f, timestamp: f.uploadedAt })) || []),
    ...(chatData?.messages.map(m => ({ type: 'message' as const, data: m, timestamp: m.createdAt })) || [])
  ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center telegram-bg">
        <div className="text-whatsapp-green text-xl">Loading chat...</div>
      </div>
    );
  }

  if (!chatData || !session?.user) {
    return null;
  }

  const jobTitle = chatData.job.title && chatData.job.title.trim().length > 0
    ? chatData.job.title
    : `Job ${chatData.job.id.slice(0, 8)}`;

  const counterpartName =
    session.user.role === 'user'
      ? chatData.otherUser?.name || 'Support Agent'
      : chatData.otherUser?.name || 'Client';

  const counterpartRole = session.user.role === 'user' ? 'Agent' : 'User';

  return (
    <div className="min-h-screen telegram-bg flex flex-col">
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
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {chatData.job.jobNumber && (
                  <span className="text-xs font-mono text-white/70">#{chatData.job.jobNumber}</span>
                )}
                {session.user.role === 'user' && (
                  <button
                    onClick={() => setEditingJobNumber(!editingJobNumber)}
                    className="text-xs text-white/70 hover:text-white underline"
                  >
                    {editingJobNumber ? 'Cancel' : 'Edit #'}
                  </button>
                )}
                {chatData.job.priority === 'high' || chatData.job.priority === 'urgent' ? (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    chatData.job.priority === 'urgent' 
                      ? 'bg-red-500/30 text-red-200 border border-red-500/50' 
                      : 'bg-orange-500/30 text-orange-200 border border-orange-500/50'
                  }`}>
                    {chatData.job.priority === 'urgent' ? 'URGENT' : 'HIGH'}
                  </span>
                ) : null}
              </div>
              {editingJobNumber && session.user.role === 'user' && (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    value={jobNumberInput}
                    onChange={(e) => setJobNumberInput(e.target.value)}
                    className="px-2 py-1 text-sm bg-white/10 border border-white/20 rounded text-white w-24"
                    placeholder="Job #"
                    min="1"
                  />
                  <button
                    onClick={handleJobNumberUpdate}
                    disabled={updatingJobNumber}
                    className="px-3 py-1 text-xs bg-whatsapp-green hover:bg-whatsapp-green-dark rounded disabled:opacity-50"
                  >
                    {updatingJobNumber ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
              <h1 className="text-lg font-bold mt-1">{jobTitle}</h1>
              <p className="text-xs text-white/80">
                {counterpartRole}: {counterpartName}
              </p>
              {chatData.job.tags && chatData.job.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {chatData.job.tags.map((tag) => (
                    <span key={`${chatData.job.id}-${tag}`} className="text-[10px] uppercase tracking-wide bg-white/20 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-white/80">
                Created {new Date(chatData.job.createdAt).toLocaleString()}
              </p>
              {chatData.job.dueAt && (
                <p className="mt-1 text-xs font-semibold text-yellow-200">
                  Due {new Date(chatData.job.dueAt).toLocaleString()} • Status:{' '}
                  {chatData.job.slaStatus === 'overdue'
                    ? 'Overdue'
                    : chatData.job.slaStatus === 'due_soon'
                    ? 'Due soon'
                    : chatData.job.slaStatus === 'on_track'
                    ? 'On track'
                    : 'Pending'}
                </p>
              )}
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

      <main className="flex-1 p-4">
        <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[2fr_1fr] lg:gap-6">
          <div className="mb-6 lg:mb-0">
            {/* Chat Messages */}
            <div className="telegram-card rounded-lg shadow-sm overflow-hidden flex flex-col min-h-[60vh]">
              <div className="flex-1 overflow-y-auto p-4 pb-24">
                {allItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-lg mb-2">No messages yet</p>
                    <p className="text-sm">Send a message or upload a file to get started</p>
                  </div>
                ) : (
                  allItems.map((item) => {
                    if (item.type === 'file') {
                      const file = item.data as FileData;
                      return (
                        <ChatBubble
                          key={`file-${file.id}`}
                          file={file}
                          isOwn={file.uploadedBy === session.user.id}
                          currentUserId={session.user.id}
                          currentUserRole={session.user.role}
                          onTick={handleTick}
                          onDelete={handleDelete}
                        />
                      );
                    } else {
                      const message = item.data as Message;
                      const isOwn = message.senderId === session.user.id;
                      return (
                        <div
                          key={`message-${message.id}`}
                          className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            isOwn
                              ? 'bg-whatsapp-green text-white'
                              : 'bg-gray-700/50 text-gray-100 shadow-sm border border-gray-600'
                          }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwn ? 'text-white/70' : 'text-gray-400'
                              }`}
                            >
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="telegram-card border-t border-gray-700 p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onPaste={handlePasteImage}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-green text-white placeholder-gray-400"
                    disabled={sendingMessage}
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim() || sendingMessage}
                    className="px-6 py-2 bg-whatsapp-green text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {sendingMessage ? 'Sending...' : 'Send'}
                  </button>
                </form>
                <div className="mt-2">
                  <FileUploader onUpload={handleUpload} />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="telegram-card rounded-lg shadow-sm p-4">
              <h2 className="text-sm font-semibold text-white mb-3">SLA & Schedule</h2>
              <p className="text-xs text-gray-400 mb-2">
                Track due dates to keep the project on schedule. Automations notify when items approach or miss deadlines.
              </p>
              <div className="text-sm text-gray-300 space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-300">Status</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      chatData.job.slaStatus === 'overdue'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : chatData.job.slaStatus === 'due_soon'
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                        : chatData.job.slaStatus === 'on_track'
                        ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/40'
                    }`}
                  >
                    {chatData.job.slaStatus === 'overdue'
                      ? 'Overdue'
                      : chatData.job.slaStatus === 'due_soon'
                      ? 'Due soon'
                      : chatData.job.slaStatus === 'on_track'
                      ? 'On track'
                      : 'Pending'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-300">Due date</p>
                  <p className="text-sm text-gray-300">
                    {chatData.job.dueAt
                      ? new Date(chatData.job.dueAt).toLocaleString()
                      : 'Not set'}
                  </p>
                </div>
              </div>
              {session.user.role === 'agent' && (
                <form onSubmit={handleSlaSubmit} className="space-y-2">
                  <label htmlFor="sla-due" className="block text-xs font-medium text-gray-300">
                    Update due date
                  </label>
                  <input
                    id="sla-due"
                    type="datetime-local"
                    value={slaDueInput}
                    onChange={(e) => setSlaDueInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green text-sm text-white"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <button
                    type="submit"
                    disabled={updatingSla}
                    className="w-full px-3 py-2 text-sm bg-whatsapp-green text-white rounded-md hover:bg-whatsapp-green-dark transition disabled:opacity-50"
                  >
                    {updatingSla ? 'Saving...' : 'Save due date'}
                  </button>
                </form>
              )}
            </div>

            <div className="telegram-card rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white">Collaboration Notes</h2>
                <span className="text-xs text-gray-400">
                  {annotations.filter((a) => a.status === 'open').length} open
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-3">
                {annotations.length === 0 ? (
                  <p className="text-xs text-gray-400">No annotations yet.</p>
                ) : (
                  annotations.map((annotation) => (
                    <div
                      key={annotation.id}
                      className="border border-gray-700 rounded-md p-2 text-xs text-gray-300"
                    >
                      <p className="font-semibold text-gray-200">
                        {annotation.authorName || 'Unknown'} •{' '}
                        {new Date(annotation.createdAt).toLocaleString()}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap">{annotation.content}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded-full ${
                            annotation.status === 'resolved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {annotation.status === 'resolved' ? 'Resolved' : 'Open'}
                        </span>
                        {annotation.status === 'open' && session.user.role === 'agent' && (
                          <button
                            type="button"
                            onClick={() => handleResolveAnnotation(annotation.id)}
                            className="text-whatsapp-green hover:underline"
                          >
                            Mark resolved
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleAnnotationSubmit} className="mt-3 space-y-2">
                <textarea
                  value={annotationContent}
                  onChange={(e) => setAnnotationContent(e.target.value)}
                  placeholder="Add a clarification or instruction..."
                  className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green text-sm text-white placeholder-gray-400"
                  rows={3}
                />
                <button
                  type="submit"
                  disabled={savingAnnotation || !annotationContent.trim()}
                  className="w-full px-3 py-2 text-sm bg-slate-800 text-white rounded-md hover:bg-slate-900 transition disabled:opacity-50"
                >
                  {savingAnnotation ? 'Saving...' : 'Add note'}
                </button>
              </form>
            </div>

            <div className="telegram-card rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white">Revision History</h2>
                <span className="text-xs text-gray-400">{versions.length} versions</span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-3">
                {versions.length === 0 ? (
                  <p className="text-xs text-gray-400">No versions recorded yet.</p>
                ) : (
                  versions.map((version) => (
                    <div key={version.id} className="border border-gray-700 rounded-md p-2 text-xs text-gray-300">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-200">
                          Version {version.versionNumber}
                        </span>
                        <span className="text-gray-400">
                          {new Date(version.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-300">
                        By {version.createdByName || 'Unknown'}
                      </p>
                      {version.notes && (
                        <p className="mt-1 whitespace-pre-wrap">{version.notes}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleVersionSubmit} className="mt-3 space-y-2">
                <textarea
                  value={versionNotes}
                  onChange={(e) => setVersionNotes(e.target.value)}
                  placeholder="Describe what changed in this revision..."
                  className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green text-sm text-white placeholder-gray-400"
                  rows={2}
                />
                <button
                  type="submit"
                  disabled={savingVersion}
                  className="w-full px-3 py-2 text-sm bg-slate-100 text-slate-800 rounded-md hover:bg-slate-200 transition disabled:opacity-50"
                >
                  {savingVersion ? 'Recording...' : 'Record version'}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

