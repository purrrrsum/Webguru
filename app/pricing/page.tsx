import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function PricingPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Transparent Pricing</h1>
            <p className="text-xl text-gray-600">Choose the plan that works best for you</p>
            <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg inline-block">
              🎉 Special Offer: Get 40% discount if no errors are found or marked!
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose Your Plan</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {/* Single Image Plan */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Pay Per Image</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-whatsapp-green">₹5</span>
                  <span className="text-gray-600 ml-2">per image</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Perfect for occasional use</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Pay as you go</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">No commitment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Agent response: 5-10 minutes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">3 revisions included</span>
                  </li>
                </ul>
              </div>

              {/* Weekly Plan */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-whatsapp-green relative">
                <span className="absolute top-0 right-0 bg-whatsapp-green text-white px-3 py-1 rounded-bl-lg text-sm font-semibold">
                  Popular
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Weekly Plan</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-whatsapp-green">₹100</span>
                  <span className="text-gray-600 ml-2">per week</span>
                </div>
                <div className="text-sm text-gray-500 mb-4">Unlimited images</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Unlimited image processing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Agent response: 3-7 minutes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">3 revisions per image</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Best for regular users</span>
                  </li>
                </ul>
              </div>

              {/* Monthly Plan */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Plan</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-whatsapp-green">₹400</span>
                  <span className="text-gray-600 ml-2">per month</span>
                </div>
                <div className="text-sm text-gray-500 mb-4">20 videos + Unlimited images</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">20 videos included</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Unlimited images</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Dedicated agent</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Agent response: 2-5 minutes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">3 revisions per item</span>
                  </li>
                </ul>
              </div>

              {/* Premium Plan */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-purple-500 relative">
                <span className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 rounded-bl-lg text-sm font-semibold">
                  Premium
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Premium Plan</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-purple-600">₹1000</span>
                  <span className="text-gray-600 ml-2">per month</span>
                </div>
                <div className="text-sm text-gray-500 mb-4">Unlimited everything</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span className="text-gray-600">Unlimited images & videos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span className="text-gray-600">Extended agent time</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span className="text-gray-600">Agent response: 1-3 minutes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span className="text-gray-600">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span className="text-gray-600">Unlimited revisions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Language Support */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Language Support</h2>
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
              <p className="text-gray-600 mb-6 text-center">
                We currently support the following languages with more coming soon:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-3xl mb-2">🇬🇧</div>
                  <div className="font-semibold text-lg">English</div>
                  <div className="text-sm text-gray-600">Full support</div>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-3xl mb-2">🇮🇳</div>
                  <div className="font-semibold text-lg">Hindi</div>
                  <div className="text-sm text-gray-600">Full support</div>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-3xl mb-2">🇮🇳</div>
                  <div className="font-semibold text-lg">Tamil</div>
                  <div className="text-sm text-gray-600">Full support</div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 mt-6">
                More languages will be added soon!
              </p>
            </div>
          </div>

          {/* Response Time Info */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Agent Response Times</h2>
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Plan</th>
                      <th className="text-center py-3 px-4 font-semibold">Response Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">Pay Per Image</td>
                      <td className="py-3 px-4 text-center">5-10 minutes</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Weekly Plan</td>
                      <td className="py-3 px-4 text-center">3-7 minutes</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Monthly Plan</td>
                      <td className="py-3 px-4 text-center">2-5 minutes</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Premium Plan</td>
                      <td className="py-3 px-4 text-center">1-3 minutes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Revisions Info */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Revisions Policy</h2>
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
              <p className="text-gray-600 mb-4">
                We want you to be completely satisfied with your work. All plans include:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">✓</span>
                  <span className="text-gray-600"><strong>Pay Per Image:</strong> 3 revisions per image</span>
                </li>
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">✓</span>
                  <span className="text-gray-600"><strong>Weekly Plan:</strong> 3 revisions per image</span>
                </li>
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">✓</span>
                  <span className="text-gray-600"><strong>Monthly Plan:</strong> 3 revisions per item (image/video)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">✓</span>
                  <span className="text-gray-600"><strong>Premium Plan:</strong> Unlimited revisions</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Link 
              href="/auth/signin" 
              className="bg-whatsapp-green text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-whatsapp-green-dark transition-colors inline-block"
            >
              Get Started Now
            </Link>
            <p className="text-gray-600 mt-4">
              Have questions? <Link href="/contact" className="text-whatsapp-green hover:underline">Contact us</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
