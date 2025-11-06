'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function AgentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('agent@thesupport.in');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Try password login directly (for all agents with passwords)
      const result = await signIn('credentials', {
        email,
        otp: password, // Using OTP field for password (auth handles it)
        redirect: false,
      });

      if (result?.error) {
        // Fallback to admin login API for backward compatibility
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          // Sign in with the agent credentials using special admin-login OTP
          const result2 = await signIn('credentials', {
            email: data.email,
            otp: 'admin-login',
            redirect: false,
          });

          if (result2?.error) {
            setError('Authentication failed. Please try again.');
          } else {
            router.push('/dashboard');
          }
        } else {
          setError('Invalid email or password. Please try again.');
        }
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-whatsapp-gray-light flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-whatsapp-green mb-2">
              Agent Login
            </h1>
            <p className="text-gray-600">Sign in to access agent portal</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handlePasswordLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green"
                placeholder="agent@thesupport.in"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-whatsapp-green hover:bg-whatsapp-green-dark text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In with Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/signin"
              className="text-sm text-whatsapp-green hover:underline"
            >
              User Login →
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

