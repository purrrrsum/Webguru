import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'agent' || session.user.email !== 'admin@thesupport.agency') {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Admin Console</p>
            <h1 className="text-lg font-semibold text-white">thesupport.agency</h1>
          </div>
          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <Link href="/admin-panel" className="hover:text-white">
              Dashboard
            </Link>
            <Link href="/dashboard" className="hover:text-white">
              Agent View
            </Link>
            <Link href="/support" className="hover:text-white">
              Support Inbox
            </Link>
            <Link href="/api/auth/signout" className="rounded-md border border-slate-700 px-3 py-1.5 hover:border-white hover:text-white">
              Sign out
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

