'use client';

import { useRef, useState, DragEvent, useEffect } from 'react';

interface FileUploaderProps {
  onUpload: (file: File) => Promise<void>;
  maxSize?: number; // in bytes
  enablePaste?: boolean;
}

export default function FileUploader({
  onUpload,
  maxSize = 20 * 1024 * 1024, // 20MB default
  enablePaste = true,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size exceeds ${(maxSize / (1024 * 1024)).toFixed(0)}MB limit`;
    }
    return null;
  };

  const handleFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      await onUpload(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // Handle paste event for images
  useEffect(() => {
    if (!enablePaste) return;

    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault();
          const blob = item.getAsFile();
          if (blob) {
            // Create a File object from the blob
            const file = new File([blob], `pasted-image-${Date.now()}.png`, {
              type: blob.type || 'image/png',
            });
            await handleFile(file);
          }
          break;
        }
      }
    };

    const container = containerRef.current || window;
    container.addEventListener('paste', handlePaste);
    return () => {
      container.removeEventListener('paste', handlePaste);
    };
  }, [enablePaste, handleFile]);

  return (
    <div className="w-full" ref={containerRef} tabIndex={-1}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? 'border-whatsapp-green bg-whatsapp-green-light/20'
            : 'border-gray-300 hover:border-whatsapp-green'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <div className="text-4xl">📎</div>
          <p className="text-sm text-gray-600">
            {uploading
              ? 'Uploading...'
              : 'Drag & drop a file here or click to browse'}
          </p>
          <p className="text-xs text-gray-400">
            Max file size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
          </p>
          {enablePaste && (
            <p className="text-xs text-whatsapp-green mt-1">
              💡 Tip: You can also paste images directly (Ctrl+V / Cmd+V)
            </p>
          )}
        </label>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}

