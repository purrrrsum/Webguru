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
            <p className="text-xl text-gray-600">Pay only for what you use. No hidden charges.</p>
            <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg inline-block">
              🎉 Special Offer: Get 40% discount if no errors are found or marked!
            </div>
          </div>

          {/* Image-Based Pricing */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Image-Based Pricing</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Single Image</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-whatsapp-green">₹5</span>
                  <span className="text-gray-600 ml-2">per image</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Perfect for occasional proofreading</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Pay as you go</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">No commitment</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-whatsapp-green relative">
                <span className="absolute top-0 right-0 bg-whatsapp-green text-white px-3 py-1 rounded-bl-lg text-sm font-semibold">
                  Popular
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-4">10+ Images</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-whatsapp-green">₹30</span>
                  <span className="text-gray-600 ml-2">for 10 images</span>
                </div>
                <div className="text-sm text-gray-500 mb-4">That's just ₹3 per image!</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Save 40% compared to single images</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Great for small projects</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Valid for 30 days</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">100+ Images</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-whatsapp-green">₹200</span>
                  <span className="text-gray-600 ml-2">for 100 images</span>
                </div>
                <div className="text-sm text-gray-500 mb-4">That's just ₹2 per image!</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Save 60% compared to single images</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Best for large projects</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-whatsapp-green mr-2">✓</span>
                    <span className="text-gray-600">Valid for 90 days</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Content-Based Pricing */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Content-Based Pricing</h2>
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">By Word Count</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">0 - 500 words</span>
                      <span className="font-semibold">₹10</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">501 - 1,000 words</span>
                      <span className="font-semibold">₹18</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">1,001 - 2,500 words</span>
                      <span className="font-semibold">₹40</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">2,501 - 5,000 words</span>
                      <span className="font-semibold">₹75</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">5,000+ words</span>
                      <span className="font-semibold">Custom Quote</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">By File Size</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Up to 5 MB</span>
                      <span className="font-semibold">₹15</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">5 - 10 MB</span>
                      <span className="font-semibold">₹25</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">10 - 20 MB</span>
                      <span className="font-semibold">₹40</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">20+ MB</span>
                      <span className="font-semibold">Custom Quote</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Payment Options</h2>
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
              <p className="text-gray-600 mb-6 text-center">
                We offer flexible payment options to suit your needs. All payments are processed manually.
              </p>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl mb-2">📅</div>
                  <div className="font-semibold">Per Session</div>
                  <div className="text-sm text-gray-600">Pay per job</div>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl mb-2">📆</div>
                  <div className="font-semibold">Weekly</div>
                  <div className="text-sm text-gray-600">Weekly billing</div>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl mb-2">🗓️</div>
                  <div className="font-semibold">Monthly</div>
                  <div className="text-sm text-gray-600">Monthly billing</div>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl mb-2">💼</div>
                  <div className="font-semibold">Custom</div>
                  <div className="text-sm text-gray-600">Contact us</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Comparison */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why We're Affordable</h2>
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Feature</th>
                      <th className="text-center py-3 px-4 font-semibold">Other Services</th>
                      <th className="text-center py-3 px-4 font-semibold text-whatsapp-green">thesupport.agency</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">Price per image</td>
                      <td className="py-3 px-4 text-center text-gray-600">₹15 - ₹50</td>
                      <td className="py-3 px-4 text-center font-semibold text-whatsapp-green">₹5</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Bulk discounts</td>
                      <td className="py-3 px-4 text-center text-gray-600">Limited</td>
                      <td className="py-3 px-4 text-center font-semibold text-whatsapp-green">Up to 60% off</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Error-free discount</td>
                      <td className="py-3 px-4 text-center text-gray-600">❌ Not available</td>
                      <td className="py-3 px-4 text-center font-semibold text-whatsapp-green">✓ 40% discount</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Copy-paste images</td>
                      <td className="py-3 px-4 text-center text-gray-600">❌ Limited</td>
                      <td className="py-3 px-4 text-center font-semibold text-whatsapp-green">✓ Fully supported</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Multi-language support</td>
                      <td className="py-3 px-4 text-center text-gray-600">Limited</td>
                      <td className="py-3 px-4 text-center font-semibold text-whatsapp-green">All Indian languages</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/auth/signin" className="bg-whatsapp-green text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-whatsapp-green-dark transition-colors inline-block">
              Get Started Now
            </Link>
            <p className="text-gray-600 mt-4">Have questions? <Link href="/contact" className="text-whatsapp-green hover:underline">Contact us</Link></p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
