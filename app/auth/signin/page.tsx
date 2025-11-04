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
    // Temporarily disabled for testing
    // signIn('google', { callbackUrl: '/' });
    alert('Google login temporarily disabled. Use test login below.');
  };

  const handleTestLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Direct login as test user
      const result = await signIn('credentials', {
        email: 'user@example.com',
        otp: 'test-login-bypass',
        redirect: false,
      });

      if (result?.error) {
        setError('Test login failed. Please check database.');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
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

    try {
      const result = await signIn('credentials', {
        email,
        otp: password, // Using OTP field for password (auth handles it)
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
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
          <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
            {error}
          </div>
        )}

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
            {/* Test Login Button - Temporarily enabled for testing */}
            <button
              onClick={handleTestLogin}
              disabled={loading}
              className="w-full mb-4 px-4 py-3 bg-whatsapp-green text-white rounded-md hover:bg-whatsapp-green-dark transition-colors flex items-center justify-center gap-3 disabled:opacity-50 font-medium"
            >
              🧪 Test Login (User)
            </button>
            <p className="text-xs text-gray-500 mb-4 text-center">
              Login as: user@example.com (Test Mode)
            </p>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

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

