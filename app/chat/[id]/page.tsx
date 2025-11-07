'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useRef, ClipboardEvent as ReactClipboardEvent } from 'react';
import ChatBubble from '@/components/ChatBubble';
import FileUploader from '@/components/FileUploader';
import { FileData, Message } from '@/lib/utils';

interface ChatData {
  job: {
    id: string;
    userId: string;
    agentId: string;
    createdAt: string;
    updatedAt: string;
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
      } else if (res.status === 404) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
    } finally {
      setLoading(false);
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
      <div className="min-h-screen flex items-center justify-center bg-whatsapp-gray-light">
        <div className="text-whatsapp-green text-xl">Loading chat...</div>
      </div>
    );
  }

  if (!chatData || !session?.user) {
    return null;
  }

  const otherUserName =
    session.user.role === 'user' ? chatData.otherUser?.name : chatData.otherUser?.name;

  return (
    <div className="min-h-screen bg-whatsapp-gray-light flex flex-col">
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
            <div>
              <h1 className="text-lg font-bold">
                {otherUserName || (session.user.role === 'user' ? 'Support Agent' : 'User')}
              </h1>
              <p className="text-xs text-white/80">
                {session.user.role === 'user' ? 'Agent' : 'User'}
              </p>
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

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="max-w-4xl mx-auto">
          {allItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
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
                          : 'bg-white text-gray-800 shadow-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwn ? 'text-white/70' : 'text-gray-500'
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
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onPaste={handlePasteImage}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-green"
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
  );
}

