'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-apple-gray-50">
      <Navigation />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-apple-blue-light text-apple-blue text-sm font-medium mb-6">
              ✨ Design, Creation, & Proofreading
            </span>
          </div>

          <h1 className="apple-heading-1 mb-8 max-w-5xl mx-auto">
            Exceptional creative services for marketing teams
          </h1>

          <p className="apple-body-large mb-8 max-w-3xl mx-auto text-apple-gray-700">
            Work directly with experienced agents who handle design, video editing, content creation, and meticulous proofreading.
            Scale your output seamlessly with on-demand talent and subscription packages.
          </p>

          <div className="flex justify-center gap-4 mb-12">
            {session ? (
              <Link href="/dashboard" className="apple-button-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/signin" className="apple-button-primary">
                  Get Started Free
                </Link>
                <Link href="/pricing" className="apple-button-secondary">
                  View Pricing
                </Link>
              </>
            )}
          </div>

          <div className="apple-card p-6 max-w-md mx-auto bg-gradient-to-r from-apple-blue-light to-white border-apple-blue/20">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🎯</span>
              <p className="text-apple-blue font-semibold">
                40% discount if no errors are found
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Human Proofreading Benefits Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="apple-heading-2 mb-6">Why human expertise matters</h2>
            <p className="apple-body-large max-w-3xl mx-auto text-apple-gray-600">
              AI misses nuance. Our creative pros craft, edit, and review every asset from start to finish,
              ensuring it perfectly aligns with your brand voice and goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="apple-card p-8">
              <div className="w-12 h-12 bg-apple-blue rounded-2xl flex items-center justify-center mb-6">
                <span className="text-white text-xl">🎯</span>
              </div>
              <h3 className="apple-heading-3 mb-4">Protect Your Brand Voice</h3>
              <p className="apple-body text-apple-gray-600">
                We check for tonal accuracy, compliant terminology, and the tiny slips that erode trust in high-visibility campaigns.
              </p>
            </div>

            <div className="apple-card p-8">
              <div className="w-12 h-12 bg-apple-blue rounded-2xl flex items-center justify-center mb-6">
                <span className="text-white text-xl">🌍</span>
              </div>
              <h3 className="apple-heading-3 mb-4">Consistent Across Languages</h3>
              <p className="apple-body text-apple-gray-600">
                From Tamil captions and Hindi product pages to English press kits, we cross-check translations, typography choices, and numerical data.
              </p>
            </div>

            <div className="apple-card p-8">
              <div className="w-12 h-12 bg-apple-blue rounded-2xl flex items-center justify-center mb-6">
                <span className="text-white text-xl">✓</span>
              </div>
              <h3 className="apple-heading-3 mb-4">Manual Fact & Detail Checks</h3>
              <p className="apple-body text-apple-gray-600">
                Our reviewers validate names, numbers, dates, and legal copy—catching mistakes that automated tools overlook.
              </p>
            </div>

            <div className="apple-card p-8">
              <div className="w-12 h-12 bg-apple-blue rounded-2xl flex items-center justify-center mb-6">
                <span className="text-white text-xl">🚀</span>
              </div>
              <h3 className="apple-heading-3 mb-4">Production-Ready Assets</h3>
              <p className="apple-body text-apple-gray-600">
                Upload screenshots, PDFs, or raw transcripts—our workflow supports comments, revisions, and approvals so you publish with ease.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What We Proofread Section */}
      <div className="py-24 bg-apple-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="apple-heading-2 mb-6">What we create & edit</h2>
            <p className="apple-body-large text-apple-gray-600 max-w-2xl mx-auto">
              From social media design to technical documentation, we handle all your creative and editorial needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="apple-card p-8 text-center">
              <div className="w-16 h-16 bg-apple-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="apple-heading-3 mb-4">Social Media Posts</h3>
              <p className="apple-body text-apple-gray-600">Perfect captions, hashtags, and content for your social media campaigns.</p>
            </div>

            <div className="apple-card p-8 text-center">
              <div className="w-16 h-16 bg-apple-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎬</span>
              </div>
              <h3 className="apple-heading-3 mb-4">Video Editing</h3>
              <p className="apple-body text-apple-gray-600">Professional editing, subtitles, and motion graphics for your contents.</p>
            </div>

            <div className="apple-card p-8 text-center">
              <div className="w-16 h-16 bg-apple-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="apple-heading-3 mb-4">Content & Copy</h3>
              <p className="apple-body text-apple-gray-600">Engaging writing and rigorous proofreading for all your materials.</p>
            </div>

            <div className="apple-card p-8 text-center">
              <div className="w-16 h-16 bg-apple-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌐</span>
              </div>
              <h3 className="apple-heading-3 mb-4">Website Content</h3>
              <p className="apple-body text-apple-gray-600">Landing pages, blog posts, product descriptions, and web copy.</p>
            </div>

            <div className="apple-card p-8 text-center">
              <div className="w-16 h-16 bg-apple-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📄</span>
              </div>
              <h3 className="apple-heading-3 mb-4">Technical Documents</h3>
              <p className="apple-body text-apple-gray-600">User manuals, API docs, technical specifications, and more.</p>
            </div>

            <div className="apple-card p-8 text-center">
              <div className="w-16 h-16 bg-apple-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="apple-heading-3 mb-4">Design Mockups</h3>
              <p className="apple-body text-apple-gray-600">Text corrections in design files, presentations, and marketing materials.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="apple-heading-2 mb-6">Why choose us</h2>
            <p className="apple-body-large text-apple-gray-600 max-w-2xl mx-auto">
              Experience the flexibility of a full creative agency, powered by dedicated agents and simple subscriptions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="apple-card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-apple-blue to-apple-blue-dark rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">💰</span>
              </div>
              <h3 className="apple-heading-3 mb-4">Competitive Pricing</h3>
              <p className="apple-body text-apple-gray-600">Starting at just ₹5 per image with bundle discounts available.</p>
            </div>

            <div className="apple-card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-apple-blue to-apple-blue-dark rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className="apple-heading-3 mb-4">Fast Turnaround</h3>
              <p className="apple-body text-apple-gray-600">Quick reviews and corrections by experienced proofreaders.</p>
            </div>

            <div className="apple-card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-apple-blue to-apple-blue-dark rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">✓</span>
              </div>
              <h3 className="apple-heading-3 mb-4">Mutual Confirmation</h3>
              <p className="apple-body text-apple-gray-600">Both parties confirm completion for complete transparency.</p>
            </div>

            <div className="apple-card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-apple-blue to-apple-blue-dark rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">📋</span>
              </div>
              <h3 className="apple-heading-3 mb-4">Copy & Paste Support</h3>
              <p className="apple-body text-apple-gray-600">Seamlessly paste images directly into the chat interface.</p>
            </div>

            <div className="apple-card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-apple-blue to-apple-blue-dark rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="apple-heading-3 mb-4">40% Discount Offer</h3>
              <p className="apple-body text-apple-gray-600">Automatic 40% discount if no errors are found or marked.</p>
            </div>

            <div className="apple-card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-apple-blue to-apple-blue-dark rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🌍</span>
              </div>
              <h3 className="apple-heading-3 mb-4">Multi-Language Support</h3>
              <p className="apple-body text-apple-gray-600">All Indian languages supported, with focus on Tamil.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 bg-apple-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="apple-heading-2 mb-6">How it works</h2>
            <p className="apple-body-large text-apple-gray-600 max-w-2xl mx-auto">
              Simple, transparent, and effective. Get your creative projects done in four easy steps.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="apple-card p-8 text-center">
              <div className="w-16 h-16 bg-apple-blue text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">1</div>
              <h3 className="apple-heading-3 mb-4">Create Account</h3>
              <p className="apple-body-small text-apple-gray-600">Sign up with Google or Email - it&apos;s completely free!</p>
            </div>

            <div className="apple-card p-8 text-center">
              <div className="w-16 h-16 bg-apple-blue text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">2</div>
              <h3 className="apple-heading-3 mb-4">Upload Content</h3>
              <p className="apple-body-small text-apple-gray-600">Upload images, documents, or videos with your correction requirements</p>
            </div>

            <div className="apple-card p-8 text-center">
              <div className="w-16 h-16 bg-apple-blue text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">3</div>
              <h3 className="apple-heading-3 mb-4">Expert Review</h3>
              <p className="apple-body-small text-apple-gray-600">Our proofreaders download, review, and upload corrected versions</p>
            </div>

            <div className="apple-card p-8 text-center">
              <div className="w-16 h-16 bg-apple-blue text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">4</div>
              <h3 className="apple-heading-3 mb-4">Mutual Confirmation</h3>
              <p className="apple-body-small text-apple-gray-600">Both parties confirm completion for complete transparency</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="py-24 bg-gradient-to-br from-apple-blue-light via-white to-apple-blue-light/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-16">
            <h2 className="apple-heading-2 mb-6">Transparent pricing</h2>
            <p className="apple-body-large text-apple-gray-600 max-w-2xl mx-auto">
              Simple, predictable pricing with no hidden fees. Volume discounts automatically applied.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="apple-card p-8 relative">
              <div className="text-center">
                <div className="text-3xl font-bold text-apple-blue mb-4">Single Project</div>
                <div className="apple-body text-apple-gray-600 mb-6">Pay per Request</div>
                <div className="text-sm text-apple-gray-500">Perfect for one-off creative or editing tasks</div>
              </div>
            </div>

            <div className="apple-card p-8 relative ring-2 ring-apple-blue">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-apple-blue text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-apple-blue mb-4">Monthly</div>
                <div className="apple-body text-apple-gray-600 mb-6">Subscription</div>
                <div className="text-sm text-apple-gray-500">Continuous creative support mapped to your cadence</div>
              </div>
            </div>

            <div className="apple-card p-8 relative">
              <div className="text-center">
                <div className="text-3xl font-bold text-apple-blue mb-4">Yearly</div>
                <div className="apple-body text-apple-gray-600 mb-6">Subscription</div>
                <div className="text-sm text-apple-gray-500">Maximum savings for long-term dedicated agents</div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <Link href="/pricing" className="apple-button-primary">
              View Full Pricing Details
            </Link>
          </div>

          <div className="apple-card p-6 max-w-md mx-auto bg-white/80 backdrop-blur-sm">
            <p className="apple-body-small text-apple-gray-600">
              <span className="font-semibold text-apple-blue">Bonus:</span> 40% automatic discount if no errors are found
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
