'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import ChatBubble from '@/components/ChatBubble';
import FileUploader from '@/components/FileUploader';
import { FileData } from '@/lib/utils';

interface ChatData {
  job: {
    id: string;
    userId: string;
    agentId: string;
    createdAt: string;
    updatedAt: string;
  };
  files: FileData[];
  otherUser: {
    id: string;
    name: string;
    role: string;
  } | null;
}

export default function ChatPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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
  }, [chatData?.files]);

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
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {chatData.files.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No files yet</p>
              <p className="text-sm">Upload a file to get started</p>
            </div>
          ) : (
            chatData.files.map((file) => (
              <ChatBubble
                key={file.id}
                file={file}
                isOwn={file.uploadedBy === session.user.id}
                currentUserId={session.user.id}
                currentUserRole={session.user.role}
                onTick={handleTick}
                onDelete={handleDelete}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <FileUploader onUpload={handleUpload} />
        </div>
      </div>
    </div>
  );
}

