import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function BecomeAgentPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-whatsapp-green to-whatsapp-green-dark text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Become a Proofreading Agent</h1>
            <p className="text-xl mb-8">
              Work from home, set your own hours, and earn extra income by helping design agencies with proofreading.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
              <div className="text-3xl font-bold mb-2">50% Revenue Share</div>
              <div className="text-lg">For every ₹1 earned by the platform, you get 50 paise - guaranteed!</div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Who Can Apply */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Perfect For</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-5xl mb-4">👩‍👧</div>
                <h3 className="text-xl font-semibold mb-3">Housewives</h3>
                <p className="text-gray-600">Work from home while managing your family. Flexible hours, perfect work-life balance.</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-5xl mb-4">👩‍🎓</div>
                <h3 className="text-xl font-semibold mb-3">College Students</h3>
                <p className="text-gray-600">Earn while studying. Great pocket money and valuable work experience.</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-5xl mb-4">👧</div>
                <h3 className="text-xl font-semibold mb-3">Young Teens</h3>
                <p className="text-gray-600">Start early! Build skills and earn money in your free time.</p>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="mb-16 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Basic Requirements</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-whatsapp-green">Equipment Needed</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-3 text-xl">✓</span>
                    <div>
                      <div className="font-semibold">Internet Connection</div>
                      <div className="text-gray-600 text-sm">Stable broadband or mobile data</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-3 text-xl">✓</span>
                    <div>
                      <div className="font-semibold">Device</div>
                      <div className="text-gray-600 text-sm">Tablet, Mobile, or PC - any device works!</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-3 text-xl">✓</span>
                    <div>
                      <div className="font-semibold">Basic Editing App</div>
                      <div className="text-gray-600 text-sm">Free apps like Canva, MS Paint, or any image editor</div>
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-whatsapp-green">Skills Needed</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-3 text-xl">✓</span>
                    <div>
                      <div className="font-semibold">Good Grammar</div>
                      <div className="text-gray-600 text-sm">Strong command of grammar and spelling</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-3 text-xl">✓</span>
                    <div>
                      <div className="font-semibold">Local Language Proficiency</div>
                      <div className="text-gray-600 text-sm">Strong in Tamil (currently focusing) or any Indian language</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-3 text-xl">✓</span>
                    <div>
                      <div className="font-semibold">Attention to Detail</div>
                      <div className="text-gray-600 text-sm">Spot errors, typos, and inconsistencies</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Revenue Share Details */}
          <div className="mb-16 bg-whatsapp-green-light rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How Revenue Share Works</h2>
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-whatsapp-green mb-2">50/50 Split</div>
                <div className="text-gray-600">Always guaranteed, regardless of discounts</div>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-whatsapp-green pl-4">
                  <div className="font-semibold mb-2">Example 1: Regular Pricing</div>
                  <div className="text-sm text-gray-600">
                    User pays ₹5 → Platform gets ₹2.50, You get ₹2.50
                  </div>
                </div>
                <div className="border-l-4 border-whatsapp-green pl-4">
                  <div className="font-semibold mb-2">Example 2: With 40% Discount</div>
                  <div className="text-sm text-gray-600">
                    User pays ₹3 (40% off ₹5) → Platform gets ₹1.50, You still get ₹2.50 (50% of original ₹5)
                  </div>
                </div>
                <div className="border-l-4 border-whatsapp-green pl-4">
                  <div className="font-semibold mb-2">Example 3: Bundle Deal</div>
                  <div className="text-sm text-gray-600">
                    User pays ₹30 for 10 images → Platform gets ₹15, You get ₹15
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="font-semibold text-yellow-800 mb-2">💡 Important:</div>
              <div className="text-yellow-700 text-sm">
                Your 50% share is calculated on the original price before discounts. We absorb the discount cost, not you!
              </div>
            </div>
          </div>

          {/* Settlement Options */}
          <div className="mb-16 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Settlement Schedule</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <div className="text-3xl mb-3">📅</div>
                <div className="font-semibold mb-2">Daily</div>
                <div className="text-sm text-gray-600">Get paid every day</div>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <div className="text-3xl mb-3">📆</div>
                <div className="font-semibold mb-2">Weekly</div>
                <div className="text-sm text-gray-600">Get paid every week</div>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <div className="text-3xl mb-3">🗓️</div>
                <div className="font-semibold mb-2">Monthly</div>
                <div className="text-sm text-gray-600">Get paid every month</div>
              </div>
              <div className="text-center p-6 border-2 border-whatsapp-green rounded-lg bg-whatsapp-green-light">
                <div className="text-3xl mb-3">🎁</div>
                <div className="font-semibold mb-2">Yearly</div>
                <div className="text-sm text-gray-600">Additional benefits!</div>
                <div className="text-xs text-whatsapp-green font-semibold mt-2">Special perks</div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-2">Choose the schedule that works best for you</p>
              <p className="text-sm text-gray-500">Yearly settlement agents receive additional benefits (announced later)</p>
            </div>
          </div>

          {/* Language Support */}
          <div className="mb-16 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Language Support</h2>
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">
                Currently focusing on <strong>Tamil</strong>, but we support all Indian languages for SEO and reach:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Tamil', 'Hindi', 'Telugu', 'Marathi', 'Bengali', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Odia', 'Assamese', 'Urdu'].map((lang) => (
                  <span key={lang} className="bg-whatsapp-green-light text-whatsapp-green px-4 py-2 rounded-full text-sm font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-whatsapp-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
                <h3 className="font-semibold mb-2">Sign Up</h3>
                <p className="text-gray-600 text-sm">Register as an agent with your details</p>
              </div>
              <div className="text-center">
                <div className="bg-whatsapp-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
                <h3 className="font-semibold mb-2">Receive Jobs</h3>
                <p className="text-gray-600 text-sm">Get notified when users upload content</p>
              </div>
              <div className="text-center">
                <div className="bg-whatsapp-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
                <h3 className="font-semibold mb-2">Review & Correct</h3>
                <p className="text-gray-600 text-sm">Download, mark corrections, upload</p>
              </div>
              <div className="text-center">
                <div className="bg-whatsapp-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">4</div>
                <h3 className="font-semibold mb-2">Get Paid</h3>
                <p className="text-gray-600 text-sm">Receive your 50% share on schedule</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-whatsapp-green text-white rounded-lg shadow-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
            <p className="text-xl mb-8">Join hundreds of agents helping design agencies create perfect content</p>
            <div className="flex justify-center space-x-4">
              <Link href="/admin" className="bg-white text-whatsapp-green px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
                Apply as Agent
              </Link>
              <Link href="/contact" className="bg-whatsapp-green-dark text-white border-2 border-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-whatsapp-green transition-colors">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

