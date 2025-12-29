import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function ServicesPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen apple-chat-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-apple-blue-light text-apple-blue text-sm font-medium">
                Additional Services
              </span>
            </div>
            <h1 className="apple-heading-1 mb-6">Beyond proofreading</h1>
            <p className="apple-body-large max-w-2xl mx-auto text-apple-gray-600">
              Professional design and video editing services to complement your content creation needs.
            </p>
          </div>

          {/* Design Services */}
          <div className="mb-20">
            <h2 className="apple-heading-2 text-center mb-12">Design Services</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Social Media Posts */}
              <div className="apple-card p-8">
                <div className="w-16 h-16 bg-apple-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">📱</span>
                </div>
                <h3 className="apple-heading-3 mb-4 text-center">Social Media Posts</h3>
                <p className="apple-body text-apple-gray-600 mb-6 text-center">
                  Eye-catching social media posts for Instagram, Facebook, Twitter, and LinkedIn.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">Custom graphics and layouts</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">Brand-consistent designs</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">Multiple format sizes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">1-24 hour delivery</span>
                  </li>
                </ul>
                <p className="apple-body-small text-apple-gray-500 text-center">
                  Perfect for influencers, businesses, and content creators
                </p>
              </div>

              {/* Banners */}
              <div className="apple-card p-8">
                <div className="w-16 h-16 bg-apple-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🎨</span>
                </div>
                <h3 className="apple-heading-3 mb-4 text-center">Banner Design</h3>
                <p className="apple-body text-apple-gray-600 mb-6 text-center">
                  Professional banners for websites, events, promotions, and advertisements.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">Web and print ready</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">High-resolution output</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">Custom dimensions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">1-24 hour delivery</span>
                  </li>
                </ul>
                <p className="apple-body-small text-apple-gray-500 text-center">
                  Ideal for marketing campaigns and events
                </p>
              </div>

              {/* Flier Design */}
              <div className="apple-card p-8">
                <div className="w-16 h-16 bg-apple-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">📄</span>
                </div>
                <h3 className="apple-heading-3 mb-4 text-center">Flier Design</h3>
                <p className="apple-body text-apple-gray-600 mb-6 text-center">
                  Attractive fliers and flyers for events, promotions, and announcements.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">Print-ready designs</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">Multiple layout options</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">Professional typography</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">1-24 hour delivery</span>
                  </li>
                </ul>
                <p className="apple-body-small text-apple-gray-500 text-center">
                  Great for events, sales, and promotions
                </p>
              </div>
            </div>
          </div>

          {/* Video Editing Services */}
          <div className="mb-20">
            <h2 className="apple-heading-2 text-center mb-12">Video Editing Services</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Influencer Videos */}
              <div className="apple-card p-8 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">Popular</span>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-white">🎬</span>
                </div>
                <h3 className="apple-heading-3 mb-4 text-center">Influencer Videos</h3>
                <p className="apple-body text-apple-gray-600 mb-6 text-center">
                  Professional video editing for influencers and content creators.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">Color correction & grading</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">Transitions & effects</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">Audio enhancement</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">1-24 hour delivery</span>
                  </li>
                </ul>
                <p className="apple-body-small text-apple-gray-500 text-center">
                  Perfect for YouTube, Instagram, TikTok
                </p>
              </div>

              {/* Product Videos */}
              <div className="apple-card p-8">
                <div className="w-16 h-16 bg-apple-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">📦</span>
                </div>
                <h3 className="apple-heading-3 mb-4 text-center">Product Videos</h3>
                <p className="apple-body text-apple-gray-600 mb-6 text-center">
                  Engaging product videos for e-commerce and marketing campaigns.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">Product showcases</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">Motion graphics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">Text overlays & captions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">1-24 hour delivery</span>
                  </li>
                </ul>
                <p className="apple-body-small text-apple-gray-500 text-center">
                  Ideal for product launches and ads
                </p>
              </div>

              {/* Real Estate Videos */}
              <div className="apple-card p-8">
                <div className="w-16 h-16 bg-apple-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🏠</span>
                </div>
                <h3 className="apple-heading-3 mb-4 text-center">Real Estate Videos</h3>
                <p className="apple-body text-apple-gray-600 mb-6 text-center">
                  Professional real estate promotional videos and property tours.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">Property walkthroughs</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">Virtual tour editing</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">Professional narration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="apple-body-small text-apple-gray-600">1-24 hour delivery</span>
                  </li>
                </ul>
                <p className="apple-body-small text-apple-gray-500 text-center">
                  Perfect for property listings and marketing
                </p>
              </div>
            </div>
          </div>

          {/* Response Time Info */}
          <div className="mb-20">
            <div className="apple-card p-8 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="apple-heading-2 mb-4">Quick Turnaround</h3>
                <p className="apple-body-large text-apple-gray-600">
                  We deliver high-quality results quickly. Response times range from 1-24 hours depending on:
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-apple-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🧩</span>
                  </div>
                  <h4 className="apple-heading-3 mb-2">Project Complexity</h4>
                  <p className="apple-body-small text-apple-gray-600">More complex projects may take additional time</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-apple-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h4 className="apple-heading-3 mb-2">Current Workload</h4>
                  <p className="apple-body-small text-apple-gray-600">Our team manages multiple projects simultaneously</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-apple-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h4 className="apple-heading-3 mb-2">Your Timeline</h4>
                  <p className="apple-body-small text-apple-gray-600">Urgent requests receive priority scheduling</p>
                </div>
              </div>

              <div className="text-center">
                <p className="apple-body text-apple-gray-600">
                  We&apos;ll provide an estimated completion time when you submit your request.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="apple-card p-8 max-w-2xl mx-auto bg-gradient-to-r from-apple-blue-light to-white text-center">
            <h2 className="apple-heading-2 mb-4">Ready to get started?</h2>
            <p className="apple-body-large text-apple-gray-700 mb-8">
              Contact us today to discuss your design or video editing needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact" className="apple-button-primary">
                Request a Quote
              </Link>
              <Link href="/auth/signin" className="apple-button-secondary">
                Sign In to Continue
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

