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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing Plans</h1>
            <p className="text-xl text-gray-600">Choose the plan that works best for you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Free</span>
                <span className="text-gray-600">/ forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">✓</span>
                  <span className="text-gray-600">5 jobs per month</span>
                </li>
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">✓</span>
                  <span className="text-gray-600">Up to 10MB per file</span>
                </li>
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">✓</span>
                  <span className="text-gray-600">Email support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">✓</span>
                  <span className="text-gray-600">Basic features</span>
                </li>
              </ul>
              <Link href="/auth/signin" className="block w-full bg-gray-200 text-gray-800 text-center py-3 rounded-md hover:bg-gray-300 transition-colors">
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-whatsapp-green relative">
              <span className="absolute top-0 right-0 bg-whatsapp-green text-white px-3 py-1 rounded-bl-lg text-sm font-semibold">
                Popular
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$29</span>
                <span className="text-gray-600">/ month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">✓</span>
                  <span className="text-gray-600">Unlimited jobs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">✓</span>
                  <span className="text-gray-600">Up to 20MB per file</span>
                </li>
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">✓</span>
                  <span className="text-gray-600">Priority support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">✓</span>
                  <span className="text-gray-600">Advanced features</span>
                </li>
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">✓</span>
                  <span className="text-gray-600">Dedicated agent</span>
                </li>
              </ul>
              <Link href="/auth/signin" className="block w-full bg-whatsapp-green text-white text-center py-3 rounded-md hover:bg-whatsapp-green-dark transition-colors">
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Custom</span>
                <span className="text-gray-600">/ quote</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">✓</span>
                  <span className="text-gray-600">Unlimited everything</span>
                </li>
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">✓</span>
                  <span className="text-gray-600">Custom file sizes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">✓</span>
                  <span className="text-gray-600">24/7 support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">✓</span>
                  <span className="text-gray-600">API access</span>
                </li>
                <li className="flex items-start">
                  <span className="text-whatsapp-green mr-2">✓</span>
                  <span className="text-gray-600">Custom integrations</span>
                </li>
              </ul>
              <Link href="/contact" className="block w-full bg-gray-800 text-white text-center py-3 rounded-md hover:bg-gray-900 transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">All plans include SSL encryption and secure file storage</p>
            <Link href="/contact" className="text-whatsapp-green hover:underline">Have questions? Contact us</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

