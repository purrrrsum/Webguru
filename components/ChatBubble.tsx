'use client';

import { FileData } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';
import TickButton from './TickButton';

interface ChatBubbleProps {
  file: FileData;
  isOwn: boolean;
  currentUserId: string;
  currentUserRole: 'user' | 'agent';
  onTick: (fileId: string) => Promise<void>;
  onDelete: (fileId: string) => Promise<void>;
}

export default function ChatBubble({
  file,
  isOwn,
  currentUserId,
  currentUserRole,
  onTick,
  onDelete,
}: ChatBubbleProps) {
  const [imageError, setImageError] = useState(false);
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDownload = async () => {
    try {
      // Use the download API endpoint for proper file downloads with authentication
      const downloadUrl = `/api/download?fileId=${file.id}`;
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      // Fallback to opening original URL in new tab
      window.open(file.url, '_blank');
    }
  };

  const handleTick = async () => {
    await onTick(file.id);
  };

  const bothTicked = file.userTick && file.agentTick;

  return (
    <div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-3 ${
          isOwn
            ? 'bg-whatsapp-green-light rounded-tr-none'
            : 'bg-white rounded-tl-none'
        } shadow-sm`}
      >
        {/* File Preview */}
        {isImage && !imageError ? (
          <div className="relative w-full mb-2 rounded overflow-hidden">
            <Image
              src={file.url}
              alt={file.filename}
              width={400}
              height={300}
              className="object-contain w-full h-auto max-h-64"
              onError={() => setImageError(true)}
              unoptimized
            />
          </div>
        ) : isVideo ? (
          <div className="mb-2 rounded overflow-hidden">
            <video
              src={file.url}
              controls
              className="w-full max-h-64 object-contain"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="mb-2 p-4 bg-whatsapp-gray-light rounded flex items-center gap-3">
            <div className="w-10 h-10 bg-whatsapp-green rounded-full flex items-center justify-center text-white font-bold">
              📄
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-gray-800 truncate">
                {file.filename}
              </p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
        )}

        {/* File Info */}
        <div className="text-xs text-gray-600 mb-2">
          <p className="font-medium">{file.filename}</p>
          <p>{formatFileSize(file.size)}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 mt-2">
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 bg-whatsapp-green text-white rounded-md text-xs font-medium hover:bg-whatsapp-green-dark transition-colors"
          >
            Download
          </button>

          <TickButton
            fileId={file.id}
            isOwn={isOwn}
            userTick={file.userTick}
            agentTick={file.agentTick}
            currentUserRole={currentUserRole}
            onTick={handleTick}
            onDelete={() => onDelete(file.id)}
          />
        </div>

        {/* Timestamp */}
        <div className="text-xs text-gray-400 mt-1 text-right">
          {new Date(file.uploadedAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}

