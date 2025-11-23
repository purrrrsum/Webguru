'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AdminPanelAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to ensure session is loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && status === 'unauthenticated') {
      if (pathname !== '/admin-panel/login') {
        router.push('/admin-panel/login');
      }
    } else if (!isLoading && status === 'authenticated') {
      // STRICT: Check if user is admin AND email matches exactly
      const isAdmin = (session?.user as any)?.isAdmin;
      const email = session?.user?.email?.toLowerCase().trim();
      const adminEmail = 'jaffarsadiq1001@gmail.com'.toLowerCase().trim();
      
      // Reject if not admin OR email doesn't match
      if (!isAdmin || !email || email !== adminEmail) {
        if (pathname !== '/admin-panel/login') {
          router.push('/admin-panel/login?error=AccessDenied');
        }
      }
    }
  }, [status, session, isLoading, pathname, router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin-panel/login' });
  };

  // Show loading state
  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen telegram-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If on login page, don't show the layout
  if (pathname === '/admin-panel/login') {
    return <>{children}</>;
  }

  // STRICT: Check if user is admin AND email matches exactly
  const isAdmin = (session?.user as any)?.isAdmin;
  const email = session?.user?.email?.toLowerCase().trim();
  const adminEmail = 'jaffarsadiq1001@gmail.com'.toLowerCase().trim();
  const isAuthorizedAdmin = isAdmin && email === adminEmail;

  // If not authorized admin, show nothing (redirect will happen)
  if (!isAuthorizedAdmin) {
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
            <Link 
              href="/admin-panel" 
              className={`px-3 py-2 rounded-md transition-colors ${
                pathname === '/admin-panel' || pathname === '/admin-panel/'
                  ? 'bg-slate-800 text-white'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/admin-panel/conversations" 
              className={`px-3 py-2 rounded-md transition-colors ${
                pathname?.startsWith('/admin-panel/conversations')
                  ? 'bg-slate-800 text-white'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              Conversations
            </Link>
            <Link 
              href="/admin-panel/support" 
              className={`px-3 py-2 rounded-md transition-colors ${
                pathname === '/admin-panel/support'
                  ? 'bg-slate-800 text-white'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              Support Inbox
            </Link>
            <Link 
              href="/admin-panel/users" 
              className={`px-3 py-2 rounded-md transition-colors ${
                pathname === '/admin-panel/users'
                  ? 'bg-slate-800 text-white'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              Users
            </Link>
            <Link 
              href="/admin-panel/cms" 
              className={`px-3 py-2 rounded-md transition-colors ${
                pathname === '/admin-panel/cms'
                  ? 'bg-slate-800 text-white'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              CMS
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

