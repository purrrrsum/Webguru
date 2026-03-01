'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [supportBadge, setSupportBadge] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let interval: NodeJS.Timeout | null = null;

    const fetchSupportSummary = async () => {
      if (!session?.user || session.user.role !== 'agent') {
        if (isMounted) {
          setSupportBadge(0);
        }
        return;
      }

      try {
        const res = await fetch('/api/support?summary=true', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && typeof data.unreadCount === 'number') {
          setSupportBadge(data.unreadCount);
        }
      } catch (error) {
        console.error('Failed to load support summary:', error);
      }
    };

    fetchSupportSummary();

    if (session?.user?.role === 'agent') {
      interval = setInterval(fetchSupportSummary, 60000);
    }

    return () => {
      isMounted = false;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [session?.user?.role, pathname]);

  return (
    <nav className="brand-glass border-b border-brand-gray-200/50 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold text-brand-blue hover:text-brand-blue-dark transition-colors">
              thesupport.agency
            </Link>
            <span className="ml-3 text-sm text-brand-gray-600 hidden md:inline font-medium">
              Human proofreading for teams
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                pathname === '/'
                  ? 'text-brand-blue bg-brand-blue-light shadow-sm'
                  : 'text-brand-gray-600 hover:text-brand-blue hover:bg-brand-gray-50'
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                pathname === '/about'
                  ? 'text-brand-blue bg-brand-blue-light shadow-sm'
                  : 'text-brand-gray-600 hover:text-brand-blue hover:bg-brand-gray-50'
              }`}
            >
              About
            </Link>
            <Link
              href="/pricing"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                pathname === '/pricing'
                  ? 'text-brand-blue bg-brand-blue-light shadow-sm'
                  : 'text-brand-gray-600 hover:text-brand-blue hover:bg-brand-gray-50'
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/become-agent"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                pathname === '/become-agent'
                  ? 'text-brand-blue bg-brand-blue-light shadow-sm'
                  : 'text-brand-gray-600 hover:text-brand-blue hover:bg-brand-gray-50'
              }`}
            >
              Become Agent
            </Link>
            <Link
              href="/contact"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                pathname === '/contact'
                  ? 'text-brand-blue bg-brand-blue-light shadow-sm'
                  : 'text-brand-gray-600 hover:text-brand-blue hover:bg-brand-gray-50'
              }`}
            >
              Contact
            </Link>

            {session ? (
              <>
                <div className="w-px h-6 bg-brand-gray-200 mx-2"></div>
                <Link
                  href="/profile"
                  className="text-brand-gray-600 hover:text-brand-blue px-3 py-2 text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <span>Profile</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    session.user.role === 'agent'
                      ? 'bg-brand-blue/10 text-brand-blue'
                      : 'bg-brand-blue/10 text-brand-blue'
                  }`}>
                    {session.user.role === 'agent' ? 'Agent' : 'User'}
                  </span>
                </Link>
                <Link
                  href="/dashboard"
                  className="brand-button-primary text-sm"
                >
                  Dashboard
                </Link>
                <Link
                  href="/support"
                  className="text-brand-gray-600 hover:text-brand-blue px-3 py-2 text-sm font-medium relative flex items-center transition-colors"
                >
                  <span>Support</span>
                  {session.user.role === 'agent' && supportBadge > 0 && (
                    <span className="ml-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white shadow-sm">
                      {supportBadge > 9 ? '9+' : supportBadge}
                    </span>
                  )}
                </Link>
                {session.user.role === 'agent' && (
                  <Link
                    href="/admin"
                    className="text-brand-gray-600 hover:text-brand-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-brand-gray-600 hover:text-brand-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <div className="w-px h-6 bg-brand-gray-200 mx-2"></div>
                <Link
                  href="/auth/signin"
                  className="text-brand-gray-600 hover:text-brand-blue px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/agent-login"
                  className="brand-button-primary text-sm"
                >
                  Agent Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

