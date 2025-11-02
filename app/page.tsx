'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-whatsapp-green-light to-white">
      <Navigation />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            WhatsApp-Style Design<br />Correction Portal
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload any file, get expert corrections, and collaborate seamlessly with our intuitive chat-based platform.
          </p>
          <div className="flex justify-center space-x-4">
            {session ? (
              <Link href="/dashboard" className="bg-whatsapp-green text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-whatsapp-green-dark transition-colors">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/signin" className="bg-whatsapp-green text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-whatsapp-green-dark transition-colors">
                  Get Started
                </Link>
                <Link href="/pricing" className="bg-white text-whatsapp-green border-2 border-whatsapp-green px-8 py-3 rounded-lg text-lg font-semibold hover:bg-whatsapp-green-light transition-colors">
                  View Pricing
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📎</div>
              <h3 className="text-xl font-semibold mb-2">Upload Any File</h3>
              <p className="text-gray-600">Support for images, videos, PDFs, DOCX, and more. Up to 20MB per file.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">WhatsApp-Style Chat</h3>
              <p className="text-gray-600">Familiar chat interface for seamless collaboration with agents.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-semibold mb-2">Mutual Confirmation</h3>
              <p className="text-gray-600">Both user and agent confirm before completing a job. Transparency guaranteed.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
              <p className="text-gray-600">Google OAuth or Email OTP. Your data is always secure.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-semibold mb-2">Profile Management</h3>
              <p className="text-gray-600">Update your profile and track completed jobs easily.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Mobile Responsive</h3>
              <p className="text-gray-600">Works perfectly on desktop, tablet, and mobile devices.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-whatsapp-gray-light py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-whatsapp-green text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600 text-sm">Create your account with Google or Email</p>
            </div>
            <div className="text-center">
              <div className="bg-whatsapp-green text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold mb-2">Upload File</h3>
              <p className="text-gray-600 text-sm">Upload any file up to 20MB</p>
            </div>
            <div className="text-center">
              <div className="bg-whatsapp-green text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold mb-2">Agent Reviews</h3>
              <p className="text-gray-600 text-sm">Expert agents review and correct your file</p>
            </div>
            <div className="text-center">
              <div className="bg-whatsapp-green text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="font-semibold mb-2">Confirm & Done</h3>
              <p className="text-gray-600 text-sm">Both parties confirm, job complete!</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

