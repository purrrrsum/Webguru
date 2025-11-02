'use client';

import { useState } from 'react';

interface TickButtonProps {
  fileId: string;
  isOwn: boolean;
  userTick: boolean;
  agentTick: boolean;
  currentUserRole: 'user' | 'agent';
  onTick: () => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function TickButton({
  fileId,
  isOwn,
  userTick,
  agentTick,
  currentUserRole,
  onTick,
  onDelete,
}: TickButtonProps) {
  const [loading, setLoading] = useState(false);
  const bothTicked = userTick && agentTick;

  const handleClick = async () => {
    if (bothTicked) {
      // Already both ticked, delete file
      setLoading(true);
      try {
        await onDelete();
      } finally {
        setLoading(false);
      }
    } else {
      // Not both ticked yet, add tick
      setLoading(true);
      try {
        await onTick();
      } finally {
        setLoading(false);
      }
    }
  };

  const shouldShowButton = () => {
    if (currentUserRole === 'user') {
      return !userTick; // Show if user hasn't ticked
    } else {
      return !agentTick; // Show if agent hasn't ticked
    }
  };

  if (!shouldShowButton() && !bothTicked) {
    return (
      <div className="px-3 py-1.5 text-xs text-gray-500">
        {currentUserRole === 'user' ? 'Waiting for agent...' : 'Waiting for user...'}
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
        bothTicked
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-whatsapp-green hover:bg-whatsapp-green-dark text-white'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading
        ? '...'
        : bothTicked
        ? 'Delete ✓✓'
        : '✓ Tick'}
    </button>
  );
}

