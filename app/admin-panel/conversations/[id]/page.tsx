'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import ChatBubble from '@/components/ChatBubble';
import { FileData, Message } from '@/lib/utils';

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
    agentName?: string | null;
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

export default function AdminConversationPage() {
  const { data: session } = useSession();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const jobId = params?.id;

  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session) {
      return;
    }
    fetchChatData();
  }, [session, jobId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatData?.files, chatData?.messages]);

  const fetchChatData = async () => {
    try {
      const res = await fetch(`/api/chat/${jobId}`);
      if (res.ok) {
        const data = await res.json();
        setChatData(data);
      } else if (res.status === 404) {
        router.push('/admin-panel/conversations');
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center telegram-bg">
        <div className="text-white text-xl">Loading conversation...</div>
      </div>
    );
  }

  if (!chatData) {
    return (
      <div className="min-h-screen flex items-center justify-center telegram-bg">
        <div className="text-white">Conversation not found.</div>
      </div>
    );
  }

  // Combine files and messages, sort by timestamp
  const allItems = [
    ...chatData.files.map((file) => ({ type: 'file' as const, data: file, timestamp: new Date(file.uploadedAt).getTime() })),
    ...chatData.messages.map((msg) => ({ type: 'message' as const, data: msg, timestamp: new Date(msg.createdAt).getTime() })),
  ].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin-panel/conversations"
            className="text-sm text-slate-400 hover:text-white mb-2 inline-block"
          >
            ← Back to Conversations
          </Link>
          <h2 className="text-2xl font-semibold text-white">
            Conversation #{chatData.job.jobNumber || chatData.job.id.slice(0, 8)}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {chatData.job.title || 'Untitled Job'}
          </p>
        </div>
        <div className="text-sm text-slate-400 space-y-1">
          <div>User: {chatData.job.userName || 'Unknown'}</div>
          <div>Agent: {chatData.job.agentName || 'Unassigned'}</div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {chatData.job.tags?.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Created:</span>{' '}
              <span className="text-white">
                {new Date(chatData.job.createdAt).toLocaleString()}
              </span>
            </div>
            {chatData.job.dueAt && (
              <div>
                <span className="text-slate-400">Due:</span>{' '}
                <span className="text-white">
                  {new Date(chatData.job.dueAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Chat History</h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {allItems.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p>No messages or files yet.</p>
              </div>
            ) : (
              allItems.map((item, index) => {
                if (item.type === 'file') {
                  const file = item.data as FileData;
                  const isOwn = file.uploadedBy === session?.user?.id;
                  const chatRole = 'agent'; // Admin views as agent
                  
                  return (
                    <ChatBubble
                      key={`file-${file.id}`}
                      file={file}
                      isOwn={isOwn}
                      currentUserId={session?.user?.id || ''}
                      currentUserRole={chatRole as 'user' | 'agent'}
                      onTick={async () => {}}
                      onDelete={async () => {}}
                    />
                  );
                } else {
                  const message = item.data as Message;
                  const isOwn = message.senderId === session?.user?.id;
                  
                  return (
                    <div
                      key={`message-${message.id}`}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isOwn
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-200'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                }
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

