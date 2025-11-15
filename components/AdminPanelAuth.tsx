'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminPanelAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for admin session in localStorage
    const adminSession = localStorage.getItem('admin_session');
    
    if (adminSession) {
      try {
        const admin = JSON.parse(adminSession);
        if (admin && admin.id) {
          setIsAuthenticated(true);
        } else {
          router.push('/admin-panel/login');
        }
      } catch (error) {
        router.push('/admin-panel/login');
      }
    } else {
      // If no localStorage session, redirect to login
      if (pathname !== '/admin-panel/login') {
        router.push('/admin-panel/login');
      }
    }
    
    setIsLoading(false);
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    router.push('/admin-panel/login');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If on login page, don't show the layout
  if (pathname === '/admin-panel/login') {
    return <>{children}</>;
  }

  // If not authenticated and not on login page, show nothing (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // Show admin panel layout
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
            <button
              onClick={handleLogout}
              className="rounded-md border border-slate-700 px-3 py-1.5 hover:border-white hover:text-white"
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

