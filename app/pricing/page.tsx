import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function PricingPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen brand-chat-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-brand-blue-light text-brand-blue text-sm font-medium">
                Transparent Pricing
              </span>
            </div>
            <h1 className="brand-heading-1 mb-6">Choose the perfect plan for your needs</h1>
            <p className="brand-body-large max-w-2xl mx-auto text-brand-gray-600 mb-8">
              Simple, predictable pricing with no hidden fees. Volume discounts automatically applied.
            </p>
            <div className="brand-card p-6 max-w-md mx-auto bg-gradient-to-r from-brand-blue-light to-white">
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">🎯</span>
                <p className="text-brand-blue font-semibold">
                  40% automatic discount if no errors are found
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="mb-20">
            <h2 className="brand-heading-2 text-center mb-12">Choose Your Plan</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {/* Pay Per Image Plan */}
              <div className="brand-card p-8">
                <div className="text-center mb-6">
                  <h3 className="brand-heading-3 mb-4">Pay Per Image</h3>
                  <div className="mb-2">
                    <span className="text-5xl font-bold text-brand-blue">₹5</span>
                  </div>
                  <p className="brand-body-small text-brand-gray-600">per image</p>
                  <p className="brand-body-small text-brand-gray-500 mt-2">Perfect for occasional use</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="brand-body-small text-brand-gray-600">Pay as you go</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="brand-body-small text-brand-gray-600">No commitment</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="brand-body-small text-brand-gray-600">5-10 min response</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="brand-body-small text-brand-gray-600">3 revisions included</span>
                  </li>
                </ul>
              </div>

              {/* Weekly Plan - Most Popular */}
              <div className="brand-card p-8 relative ring-2 ring-brand-blue">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-brand-blue text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
                </div>
                <div className="text-center mb-6">
                  <h3 className="brand-heading-3 mb-4">Weekly Plan</h3>
                  <div className="mb-2">
                    <span className="text-5xl font-bold text-brand-blue">₹100</span>
                  </div>
                  <p className="brand-body-small text-brand-gray-600">per week</p>
                  <p className="brand-body-small text-brand-gray-500 mt-2">Unlimited images</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="brand-body-small text-brand-gray-600">Unlimited images</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="brand-body-small text-brand-gray-600">3-7 min response</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="brand-body-small text-brand-gray-600">3 revisions per image</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="brand-body-small text-brand-gray-600">Best for regular users</span>
                  </li>
                </ul>
              </div>

              {/* Monthly Plan */}
              <div className="brand-card p-8">
                <div className="text-center mb-6">
                  <h3 className="brand-heading-3 mb-4">Monthly Plan</h3>
                  <div className="mb-2">
                    <span className="text-5xl font-bold text-brand-blue">₹400</span>
                  </div>
                  <p className="brand-body-small text-brand-gray-600">per month</p>
                  <p className="brand-body-small text-brand-gray-500 mt-2">20 videos + Unlimited images</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="brand-body-small text-brand-gray-600">20 videos included</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="brand-body-small text-brand-gray-600">Unlimited images</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="brand-body-small text-brand-gray-600">Dedicated agent</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="brand-body-small text-brand-gray-600">2-5 min response</span>
                  </li>
                </ul>
              </div>

              {/* Premium Plan */}
              <div className="brand-card p-8 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">Premium</span>
                </div>
                <div className="text-center mb-6">
                  <h3 className="brand-heading-3 mb-4">Premium Plan</h3>
                  <div className="mb-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">₹1000</span>
                  </div>
                  <p className="brand-body-small text-brand-gray-600">per month</p>
                  <p className="brand-body-small text-brand-gray-500 mt-2">Unlimited everything</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="brand-body-small text-brand-gray-600">Unlimited content</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="brand-body-small text-brand-gray-600">1-3 min response</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="brand-body-small text-brand-gray-600">Priority support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="brand-body-small text-brand-gray-600">Unlimited revisions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Language Support */}
          <div className="mb-20">
            <h2 className="brand-heading-2 text-center mb-12">Multi-Language Support</h2>
            <div className="brand-card p-8 max-w-5xl mx-auto">
              <p className="brand-body-large text-center text-brand-gray-600 mb-12">
                Professional proofreading across multiple languages with native-speaking experts
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 brand-card">
                  <div className="text-4xl mb-4">🇬🇧</div>
                  <h3 className="brand-heading-3 mb-2">English</h3>
                  <p className="brand-body-small text-brand-gray-600">Full professional support</p>
                </div>
                <div className="text-center p-6 brand-card">
                  <div className="text-4xl mb-4">🇮🇳</div>
                  <h3 className="brand-heading-3 mb-2">Hindi</h3>
                  <p className="brand-body-small text-brand-gray-600">Native speaker proofreading</p>
                </div>
                <div className="text-center p-6 brand-card">
                  <div className="text-4xl mb-4">🇮🇳</div>
                  <h3 className="brand-heading-3 mb-2">Tamil</h3>
                  <p className="brand-body-small text-brand-gray-600">Expert Tamil proofreading</p>
                </div>
              </div>
              <div className="text-center mt-8">
                <p className="brand-body-small text-brand-gray-500">
                  More languages coming soon • <Link href="/contact" className="text-brand-blue hover:text-brand-blue-dark">Request a language</Link>
                </p>
              </div>
            </div>
          </div>

          {/* Response Time Info */}
          <div className="mb-20">
            <h2 className="brand-heading-2 text-center mb-12">Lightning-Fast Response Times</h2>
            <div className="brand-card p-8 max-w-4xl mx-auto">
              <p className="brand-body-large text-center text-brand-gray-600 mb-8">
                Get your proofreading done quickly with our dedicated team of experts
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="brand-card p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div>
                      <h3 className="brand-heading-3">Pay Per Image</h3>
                      <p className="brand-body text-brand-blue font-semibold">5-10 minutes</p>
                    </div>
                  </div>
                </div>
                <div className="brand-card p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <div>
                      <h3 className="brand-heading-3">Weekly Plan</h3>
                      <p className="brand-body text-brand-blue font-semibold">3-7 minutes</p>
                    </div>
                  </div>
                </div>
                <div className="brand-card p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">💎</span>
                    </div>
                    <div>
                      <h3 className="brand-heading-3">Monthly Plan</h3>
                      <p className="brand-body text-brand-blue font-semibold">2-5 minutes</p>
                    </div>
                  </div>
                </div>
                <div className="brand-card p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <span className="text-2xl text-white">⭐</span>
                    </div>
                    <div>
                      <h3 className="brand-heading-3">Premium Plan</h3>
                      <p className="brand-body bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">1-3 minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Revisions Policy */}
          <div className="mb-20">
            <h2 className="brand-heading-2 text-center mb-12">Satisfaction Guaranteed</h2>
            <div className="brand-card p-8 max-w-4xl mx-auto">
              <p className="brand-body-large text-center text-brand-gray-600 mb-8">
                Your satisfaction is our priority. We offer generous revision policies to ensure perfect results.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="brand-card p-6">
                  <h3 className="brand-heading-3 mb-4">Standard Plans</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      <span className="brand-body-small">Pay Per Image: 3 revisions</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      <span className="brand-body-small">Weekly Plan: 3 revisions per image</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      <span className="brand-body-small">Monthly Plan: 3 revisions per item</span>
                    </li>
                  </ul>
                </div>
                <div className="brand-card p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                  <h3 className="brand-heading-3 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Premium Plan</h3>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm">∞</span>
                    <span className="brand-body font-semibold">Unlimited revisions included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <div className="brand-card p-8 max-w-2xl mx-auto bg-gradient-to-r from-brand-blue-light to-white">
              <h2 className="brand-heading-2 mb-4">Ready to get started?</h2>
              <p className="brand-body-large text-brand-gray-700 mb-8">
                Join thousands of professionals who trust us with their content proofreading needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/auth/signin" className="brand-button-primary">
                  Get Started Today
                </Link>
                <Link href="/contact" className="brand-button-secondary">
                  Have Questions?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
