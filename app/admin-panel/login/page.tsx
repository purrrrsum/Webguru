'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession, SessionProvider } from 'next-auth/react';
import Link from 'next/link';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const error = searchParams?.get('error');

  useEffect(() => {
    // If already authenticated as admin, redirect to admin panel
    if (status === 'authenticated' && (session?.user as any)?.isAdmin) {
      router.push('/admin-panel');
    }
  }, [session, status, router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn('google', {
        callbackUrl: '/admin-panel',
        redirect: true,
      });
    } catch (err) {
      console.error('Sign in error:', err);
      setLoading(false);
    }
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        router.push('/admin-panel/login?error=AccessDenied');
        setLoading(false);
      } else {
        router.push('/admin-panel');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen telegram-bg flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen telegram-bg flex items-center justify-center p-4">
      <div className="telegram-card rounded-2xl shadow-2xl p-10 w-full max-w-md border border-gray-700">
        {/* Logo/Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-400">Secure access to admin panel</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 text-red-300 rounded-lg text-sm">
            {error === 'AccessDenied'
              ? 'Access denied. Only authorized administrators can sign in.'
              : 'An error occurred. Please try again.'}
          </div>
        )}

        {/* Google Sign In Button */}
        <div className="space-y-4">
          <form onSubmit={handleCredentialsSignIn} className="space-y-4 mb-6 pb-6 border-b border-gray-700">
            <div>
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              Sign In with Credentials
            </button>
          </form>
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Sign in with Google</span>
              </>
            )}
          </button>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-gray-400 text-center">
              <span className="font-semibold text-blue-400">Authorized Access Only</span>
              <br />
              Only approved administrators can access this portal
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <SessionProvider basePath="/api/admin/auth">
      <AdminLoginContent />
    </SessionProvider>
  );
}

