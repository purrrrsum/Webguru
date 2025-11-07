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
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-whatsapp-green hover:text-whatsapp-green-dark">
              thesupport.agency
            </Link>
            <span className="ml-2 text-sm text-gray-600 hidden md:inline">Affordable Proofreading for Design Agencies</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/' 
                  ? 'text-whatsapp-green bg-whatsapp-green-light' 
                  : 'text-gray-700 hover:text-whatsapp-green hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/about' 
                  ? 'text-whatsapp-green bg-whatsapp-green-light' 
                  : 'text-gray-700 hover:text-whatsapp-green hover:bg-gray-50'
              }`}
            >
              About
            </Link>
            <Link 
              href="/pricing"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/pricing' 
                  ? 'text-whatsapp-green bg-whatsapp-green-light' 
                  : 'text-gray-700 hover:text-whatsapp-green hover:bg-gray-50'
              }`}
            >
              Pricing
            </Link>
            <Link 
              href="/become-agent"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/become-agent' 
                  ? 'text-whatsapp-green bg-whatsapp-green-light' 
                  : 'text-gray-700 hover:text-whatsapp-green hover:bg-gray-50'
              }`}
            >
              Become an Agent
            </Link>
            <Link 
              href="/contact"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/contact' 
                  ? 'text-whatsapp-green bg-whatsapp-green-light' 
                  : 'text-gray-700 hover:text-whatsapp-green hover:bg-gray-50'
              }`}
            >
              Contact
            </Link>
            {session ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="bg-whatsapp-green text-white px-4 py-2 rounded-md hover:bg-whatsapp-green-dark text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/support"
                  className="text-gray-700 hover:text-whatsapp-green px-3 py-2 text-sm font-medium relative flex items-center"
                >
                  <span>Support</span>
                  {session.user.role === 'agent' && supportBadge > 0 && (
                    <span className="ml-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
                      {supportBadge > 9 ? '9+' : supportBadge}
                    </span>
                  )}
                </Link>
                {session.user.role === 'agent' && (
                  <Link 
                    href="/admin" 
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/signin" 
                  className="text-gray-700 hover:text-whatsapp-green px-3 py-2 text-sm font-medium"
                >
                  User Login
                </Link>
                <Link 
                  href="/agent-login" 
                  className="bg-whatsapp-green text-white px-4 py-2 rounded-md hover:bg-whatsapp-green-dark text-sm font-medium"
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

