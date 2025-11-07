'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const [errorDetails, setErrorDetails] = useState<{
    error: string | null;
    errorDescription: string | null;
    errorCode: string | null;
    provider: string | null;
    callbackUrl: string | null;
  }>({
    error: null,
    errorDescription: null,
    errorCode: null,
    provider: null,
    callbackUrl: null,
  });

  useEffect(() => {
    if (!searchParams) {
      return;
    }

    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    const errorCode = searchParams.get('error_code');
    const provider = searchParams.get('provider');
    const callbackUrl = searchParams.get('callbackUrl');

    setErrorDetails({
      error: error || 'Unknown error',
      errorDescription: errorDescription || null,
      errorCode: errorCode || null,
      provider: provider || null,
      callbackUrl: callbackUrl || null,
    });
  }, [searchParams]);

  const getErrorInfo = (error: string) => {
    const errorMap: Record<string, { title: string; description: string; bugLocation: string }> = {
      'Configuration': {
        title: 'Configuration Error',
        description: 'There is a problem with the server configuration.',
        bugLocation: 'Check lib/auth.ts - NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or NEXTAUTH_URL may be missing or incorrect.',
      },
      'AccessDenied': {
        title: 'Access Denied',
        description: 'You do not have permission to sign in.',
        bugLocation: 'Check lib/auth.ts authorize() function - user may not meet authentication requirements.',
      },
      'Verification': {
        title: 'Verification Error',
        description: 'The verification token has expired or has already been used.',
        bugLocation: 'Check lib/otp.ts - OTP verification logic may have issues with token expiration or validation.',
      },
      'OAuthSignin': {
        title: 'OAuth Sign In Error',
        description: 'Error in constructing an authorization URL.',
        bugLocation: 'Check lib/auth.ts GoogleProvider configuration - GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET may be incorrect. Also verify redirect URIs in Google Console.',
      },
      'OAuthCallback': {
        title: 'OAuth Callback Error',
        description: 'Error in handling the response from an OAuth provider.',
        bugLocation: 'Check lib/auth.ts callbacks.signIn() - Google OAuth callback handling may have issues. Verify redirect URI matches exactly in Google Console.',
      },
      'OAuthCreateAccount': {
        title: 'OAuth Account Creation Error',
        description: 'Could not create OAuth account in the database.',
        bugLocation: 'Check lib/auth.ts callbacks.signIn() - User creation logic may have issues.',
      },
      'EmailCreateAccount': {
        title: 'Email Account Creation Error',
        description: 'Could not create email account in the database.',
        bugLocation: 'Check lib/auth.ts authorize() function - User creation logic may have issues.',
      },
      'Callback': {
        title: 'Callback Error',
        description: 'Error in the OAuth callback handler route.',
        bugLocation: 'Check app/api/auth/[...nextauth]/route.ts - NextAuth handler may have issues.',
      },
      'OAuthAccountNotLinked': {
        title: 'OAuth Account Not Linked',
        description: 'Email on the account is already linked, but not with this OAuth account.',
        bugLocation: 'Check lib/auth.ts callbacks.signIn() - Account linking logic may need to be implemented.',
      },
      'EmailSignin': {
        title: 'Email Sign In Error',
        description: 'Sending the e-mail with the sign in token failed.',
        bugLocation: 'Check lib/otp.ts or app/api/otp/route.ts - Email sending may have issues. Verify RESEND_API_KEY is set.',
      },
      'CredentialsSignin': {
        title: 'Credentials Sign In Error',
        description: 'The authorize callback returned null.',
        bugLocation: 'Check lib/auth.ts authorize() function - Credentials validation failed. Username/password matching logic may have issues.',
      },
      'SessionRequired': {
        title: 'Session Required',
        description: 'The content of this page requires you to be signed in at all times.',
        bugLocation: 'Check middleware.ts or page authentication - Session validation may have issues.',
      },
      'Default': {
        title: 'Authentication Error',
        description: 'An unexpected error occurred during authentication.',
        bugLocation: 'Check lib/auth.ts, app/api/auth/[...nextauth]/route.ts, or middleware.ts - General authentication flow may have issues.',
      },
    };

    return errorMap[error] || errorMap['Default'];
  };

  const errorInfo = getErrorInfo(errorDetails.error || 'Default');

  return (
    <div className="min-h-screen bg-whatsapp-gray-light flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            {errorInfo.title}
          </h1>
          <p className="text-gray-600">{errorInfo.description}</p>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Details</h3>
              <div className="mt-2 text-sm text-red-700">
                <p><strong>Error Code:</strong> {errorDetails.error}</p>
                {errorDetails.errorDescription && (
                  <p className="mt-1"><strong>Description:</strong> {errorDetails.errorDescription}</p>
                )}
                {errorDetails.errorCode && (
                  <p className="mt-1"><strong>Error Code:</strong> {errorDetails.errorCode}</p>
                )}
                {errorDetails.provider && (
                  <p className="mt-1"><strong>Provider:</strong> {errorDetails.provider}</p>
                )}
                {errorDetails.callbackUrl && (
                  <p className="mt-1"><strong>Callback URL:</strong> {errorDetails.callbackUrl}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">🐛 Bug Location</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p className="font-mono bg-yellow-100 p-2 rounded">{errorInfo.bugLocation}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">💡 Troubleshooting Steps</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ol className="list-decimal list-inside space-y-1">
                  <li>Check the bug location mentioned above</li>
                  <li>Verify environment variables are set correctly (NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, etc.)</li>
                  <li>Check Railway deployment logs for detailed error messages</li>
                  <li>Verify Google OAuth redirect URIs match exactly in Google Console</li>
                  <li>Ensure all required dependencies are installed</li>
                  <li>Check browser console for additional error details</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/signin"
            className="px-6 py-2 bg-whatsapp-green hover:bg-whatsapp-green-dark text-white font-medium rounded-md transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors"
          >
            Go Home
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Debug Information (Development Only)</h4>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(errorDetails, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-whatsapp-gray-light flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-gray-700">Loading error details...</h1>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}

