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
            AI-Assisted Proofreading for Design, Marketing & LLM Teams
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Level up every visual, subtitle and paragraph with a dedicated proofreading squad that understands
            <strong> brand voice, multilingual publishing, SEO copywriting and large language model (LLM) outputs</strong>.
            We combine human editors with AI QA to deliver conversion-ready content across campaigns, websites and technical documents.
          </p>
          <p className="text-lg text-gray-700 mb-8 max-w-4xl mx-auto">
            Whether you are polishing Figma mockups, refining ChatGPT or Claude drafts, or shipping multi-lingual reels,
            our specialists remove grammar slips, factual drifts and tone mismatches so your content builds trust and authority.
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
          <div className="mt-8">
            <p className="text-whatsapp-green font-semibold text-lg">
              🎉 Special Offer: Get 40% discount if no errors are found!
            </p>
          </div>
        </div>
      </div>

      {/* LLM + Proofreading SEO Section */}
      <div className="bg-white py-16 border-t border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Why Proofreading Is Non-Negotiable in the LLM Era</h2>
          <p className="text-lg text-gray-700 text-center mb-8">
            Generative AI speeds up copy production but also introduces hallucinations, broken tone and localisation misses.
            Our proofreading workflows catch those hidden issues before your audience does.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-whatsapp-gray-light rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">SEO & Brand Consistency</h3>
              <p className="text-gray-600">
                Search engines reward clear intent, structured formatting and error-free messaging. We optimise LLM drafts with
                keyword-rich headings, CTA alignment and metadata-friendly copy so your campaigns rank and convert.
              </p>
            </div>
            <div className="p-6 bg-whatsapp-gray-light rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust Across Languages & Channels</h3>
              <p className="text-gray-600">
                From Tamil captions and Hindi product pages to English press kits, every typo damages credibility.
                Our proofreaders validate translations, typography, numbers and brand terminology for pixels, PDFs and code blocks alike.
              </p>
            </div>
            <div className="p-6 bg-whatsapp-gray-light rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">LLM Alignment & Hallucination Checks</h3>
              <p className="text-gray-600">
                We review AI-generated responses for factual accuracy, inclusive language, regulatory wording and style guide compliance.
                Every delivery includes editor notes so your team can retrain prompts and maintain governance.
              </p>
            </div>
            <div className="p-6 bg-whatsapp-gray-light rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Production-Ready Assets</h3>
              <p className="text-gray-600">
                Upload screenshots, PDFs or raw transcripts—our workflow supports copy-paste, annotated markups and version control.
                Approved files come back ready for publishing across social, product, eLearning and documentation stacks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What We Proofread Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What We Proofread</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Social Media Posts</h3>
              <p className="text-gray-600">Perfect captions, hashtags, and content for your social media campaigns.</p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold mb-2">Videos with Subtitles</h3>
              <p className="text-gray-600">Accurate subtitles, translations, and closed captions for your video content.</p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Books & Publications</h3>
              <p className="text-gray-600">Complete proofreading for novels, eBooks, and printed materials.</p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold mb-2">Website Content</h3>
              <p className="text-gray-600">Landing pages, blog posts, product descriptions, and web copy.</p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2">Technical Documents</h3>
              <p className="text-gray-600">User manuals, API docs, technical specifications, and more.</p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🖼️</div>
              <h3 className="text-xl font-semibold mb-2">Design Mockups</h3>
              <p className="text-gray-600">Text corrections in design files, presentations, and marketing materials.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-whatsapp-gray-light py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Lowest Prices</h3>
              <p className="text-gray-600">Starting at just ₹5 per image. Bundle discounts available.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Fast Turnaround</h3>
              <p className="text-gray-600">Quick reviews and corrections by experienced agents.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-semibold mb-2">Mutual Confirmation</h3>
              <p className="text-gray-600">Both you and the agent confirm before completing a job.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">Copy & Paste Support</h3>
              <p className="text-gray-600">Seamlessly paste images directly into the chat interface.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">40% Discount Offer</h3>
              <p className="text-gray-600">If no errors are found or marked, enjoy 40% discount automatically.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Multi-Language Support</h3>
              <p className="text-gray-600">All Indian languages supported. Currently focusing on Tamil.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-whatsapp-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="font-semibold mb-2 text-lg">Create Account</h3>
              <p className="text-gray-600 text-sm">Sign up with Google or Email - it's free!</p>
            </div>
            <div className="text-center">
              <div className="bg-whatsapp-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="font-semibold mb-2 text-lg">Upload Content</h3>
              <p className="text-gray-600 text-sm">Upload images, documents, or videos with your correction requirements</p>
            </div>
            <div className="text-center">
              <div className="bg-whatsapp-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="font-semibold mb-2 text-lg">Agent Reviews</h3>
              <p className="text-gray-600 text-sm">Expert agents download, review, and upload corrected versions</p>
            </div>
            <div className="text-center">
              <div className="bg-whatsapp-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">4</div>
              <h3 className="font-semibold mb-2 text-lg">Mutual Tick & Complete</h3>
              <p className="text-gray-600 text-sm">Both parties tick the original file to confirm completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="bg-whatsapp-green-light py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Transparent Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-whatsapp-green mb-2">₹5</div>
              <div className="text-gray-600">Per Image</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-whatsapp-green mb-2">₹30</div>
              <div className="text-gray-600">10+ Images Bundle</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-whatsapp-green mb-2">₹200</div>
              <div className="text-gray-600">100+ Images Bundle</div>
            </div>
          </div>
          <Link href="/pricing" className="bg-whatsapp-green text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-whatsapp-green-dark transition-colors inline-block">
            View Full Pricing
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
