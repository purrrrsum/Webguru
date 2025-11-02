'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-whatsapp-green hover:text-whatsapp-green-dark">
              thesupport.agency
            </Link>
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
              href="/blog"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname?.startsWith('/blog') 
                  ? 'text-whatsapp-green bg-whatsapp-green-light' 
                  : 'text-gray-700 hover:text-whatsapp-green hover:bg-gray-50'
              }`}
            >
              Blog
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
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                href="/auth/signin" 
                className="bg-whatsapp-green text-white px-4 py-2 rounded-md hover:bg-whatsapp-green-dark text-sm font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

