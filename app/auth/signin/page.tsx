'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('password');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard', role: 'user' });
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStep('otp');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email,
        otp: password, // Using OTP field for password (auth handles it)
        redirect: false,
        role: 'user',
      });

      if (result?.error) {
        console.error('Login error:', result.error);
        // Provide more specific error messages
        if (result.error.includes('database') || result.error.includes('connection')) {
          setError('Database connection error. Please check if the database is configured.');
        } else if (result.error.includes('not found')) {
          setError('User not found. Please check your email address.');
        } else {
          setError('Invalid email or password. Please try again.');
        }
      } else if (result?.ok) {
        router.push('/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Login exception:', err);
      setError('Login failed: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email,
        otp,
        redirect: false,
        role: 'user',
      });

      if (result?.error) {
        setError('Invalid OTP. Please try again.');
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
    <div className="min-h-screen bg-whatsapp-gray-light flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-whatsapp-green mb-2">
            thesupport.agency
          </h1>
          <p className="text-gray-600">User Sign In</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm whitespace-pre-wrap">
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full mb-4 px-4 py-3 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 font-medium shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        {loginMethod === 'password' ? (
          <form onSubmit={handlePasswordLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green"
                placeholder="your@email.com"
              />
            </div>

            <div className="mb-4">
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('otp');
                  setStep('email');
                  setError(null);
                  setPassword('');
                }}
                className="text-sm text-whatsapp-green hover:underline"
              >
                Login with OTP instead
              </button>
            </div>
          </form>
        ) : step === 'email' ? (
          <>

            <form onSubmit={handleSendOTP}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green"
                  placeholder="your@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-whatsapp-green hover:bg-whatsapp-green-dark text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('password');
                    setStep('email');
                    setError(null);
                    setOtp('');
                  }}
                  className="text-sm text-whatsapp-green hover:underline"
                >
                  Login with password instead
                </button>
              </div>
            </form>
          </>
        ) : (
          <form onSubmit={handleOTPLogin}>
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green text-center text-2xl tracking-widest"
                placeholder="000000"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                We sent a 6-digit code to {email}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-whatsapp-green hover:bg-whatsapp-green-dark text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setOtp('');
                  setError(null);
                }}
                className="flex-1 text-whatsapp-green hover:underline text-sm"
              >
                Change email
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('password');
                  setStep('email');
                  setOtp('');
                  setError(null);
                }}
                className="flex-1 text-whatsapp-green hover:underline text-sm"
              >
                Use password
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link
            href="/agent-login"
            className="block text-center text-sm text-whatsapp-green hover:underline"
          >
            Agent Login →
          </Link>
        </div>
      </div>
    </div>
  );
}

