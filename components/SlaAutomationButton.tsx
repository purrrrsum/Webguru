'use client';

import { useState } from 'react';

export default function SlaAutomationButton() {
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRun = async () => {
    setRunning(true);
    setMessage(null);
    try {
      const res = await fetch('/api/automations/sla', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setMessage(
          `Processed ${data.processed} jobs — overdue: ${data.summary?.overdue_jobs ?? 0}, due soon: ${data.summary?.due_soon_jobs ?? 0}`
        );
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || 'Failed to run automation');
      }
    } catch (error) {
      setMessage('Failed to run automation');
    } finally {
      setRunning(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleRun}
        disabled={running}
        className="rounded-md border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-sm text-slate-200 transition hover:border-white hover:text-white disabled:opacity-50"
      >
        {running ? 'Running...' : 'Run SLA automation'}
      </button>
      {message && <p className="text-xs text-slate-400">{message}</p>}
    </div>
  );
}

