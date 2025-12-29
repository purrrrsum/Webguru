import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function ServicesPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Extra Services</h1>
            <p className="text-xl text-gray-600">Professional design and video editing services</p>
          </div>

          {/* Design Services */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Design Services</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Social Media Posts */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Social Media Posts</h3>
                <p className="text-gray-600 mb-4">
                  Eye-catching social media posts for Instagram, Facebook, Twitter, and LinkedIn.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Custom graphics and layouts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Brand-consistent designs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Multiple format sizes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Response time: 1-24 hours</span>
                  </li>
                </ul>
                <div className="text-sm text-gray-500">
                  Perfect for influencers, businesses, and content creators
                </div>
              </div>

              {/* Banners */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Banner Design</h3>
                <p className="text-gray-600 mb-4">
                  Professional banners for websites, events, promotions, and advertisements.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Web and print ready</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">High-resolution output</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Custom dimensions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Response time: 1-24 hours</span>
                  </li>
                </ul>
                <div className="text-sm text-gray-500">
                  Ideal for marketing campaigns and events
                </div>
              </div>

              {/* Flier Design */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
                <div className="text-4xl mb-4">📄</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Flier Design</h3>
                <p className="text-gray-600 mb-4">
                  Attractive fliers and flyers for events, promotions, and announcements.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Print-ready designs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Multiple layout options</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Professional typography</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Response time: 1-24 hours</span>
                  </li>
                </ul>
                <div className="text-sm text-gray-500">
                  Great for events, sales, and promotions
                </div>
              </div>
            </div>
          </div>

          {/* Video Editing Services */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Video Editing Services</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Influencer Videos */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-purple-500">
                <div className="text-4xl mb-4">🎬</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Influencer Videos</h3>
                <p className="text-gray-600 mb-4">
                  Professional video editing for influencers and content creators.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span className="text-gray-600">Color correction & grading</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span className="text-gray-600">Transitions & effects</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span className="text-gray-600">Audio enhancement</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span className="text-gray-600">Response time: 1-24 hours</span>
                  </li>
                </ul>
                <div className="text-sm text-gray-500">
                  Perfect for YouTube, Instagram, TikTok
                </div>
              </div>

              {/* Product Videos */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Product Videos</h3>
                <p className="text-gray-600 mb-4">
                  Engaging product videos for e-commerce and marketing campaigns.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Product showcases</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Motion graphics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Text overlays & captions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Response time: 1-24 hours</span>
                  </li>
                </ul>
                <div className="text-sm text-gray-500">
                  Ideal for product launches and ads
                </div>
              </div>

              {/* Real Estate Videos */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Real Estate Videos</h3>
                <p className="text-gray-600 mb-4">
                  Professional real estate promotional videos and property tours.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Property walkthroughs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Virtual tour editing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Professional narration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Response time: 1-24 hours</span>
                  </li>
                </ul>
                <div className="text-sm text-gray-500">
                  Perfect for property listings and marketing
                </div>
              </div>
            </div>
          </div>

          {/* Response Time Info */}
          <div className="mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Response Times</h3>
              <p className="text-gray-600 mb-4 text-center">
                Our response time for extra services ranges from 1 hour to 24 hours depending on:
              </p>
              <ul className="space-y-2 max-w-2xl mx-auto">
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">•</span>
                  <span className="text-gray-600">Complexity of the project</span>
                </li>
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">•</span>
                  <span className="text-gray-600">Current workload</span>
                </li>
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">•</span>
                  <span className="text-gray-600">Urgency of your request</span>
                </li>
              </ul>
              <p className="text-gray-600 mt-6 text-center">
                We&apos;ll provide an estimated completion time when you submit your request.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link 
              href="/contact" 
              className="bg-whatsapp-green text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-whatsapp-green-dark transition-colors inline-block"
            >
              Request a Quote
            </Link>
            <p className="text-gray-600 mt-4">
              Or <Link href="/auth/signin" className="text-whatsapp-green hover:underline">sign in</Link> to get started
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

