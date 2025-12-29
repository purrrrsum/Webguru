import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-apple-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-semibold mb-6 text-white">thesupport.agency</h3>
            <p className="text-apple-gray-400 leading-relaxed">
              Human-powered proofreading for design & marketing teams.
              Exceptional quality, transparent pricing.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-white">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-apple-gray-400 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-apple-gray-400 hover:text-white transition-colors duration-200">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-apple-gray-400 hover:text-white transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-apple-gray-400 hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-white">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/services" className="text-apple-gray-400 hover:text-white transition-colors duration-200">
                  Proofreading Services
                </Link>
              </li>
              <li>
                <Link href="/become-agent" className="text-apple-gray-400 hover:text-white transition-colors duration-200">
                  Become an Agent
                </Link>
              </li>
              <li>
                <span className="text-apple-gray-400">Multi-language Support</span>
              </li>
              <li>
                <span className="text-apple-gray-400">24/7 Availability</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-white">Get Started</h4>
            <p className="text-apple-gray-400 mb-4 leading-relaxed">
              Ready to experience human-powered proofreading?
            </p>
            <Link
              href="/auth/signin"
              className="apple-button-primary inline-block"
            >
              Sign In Free
            </Link>
          </div>
        </div>

        <div className="border-t border-apple-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-apple-gray-400 text-sm">
              &copy; {new Date().getFullYear()} thesupport.agency. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/policy" className="text-apple-gray-400 hover:text-white text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-apple-gray-400 hover:text-white text-sm transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

