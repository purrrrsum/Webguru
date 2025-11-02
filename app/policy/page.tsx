import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function PolicyPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Account information (name, email, company, address, phone)</li>
                <li>Files you upload to our platform</li>
                <li>Communication data through our chat system</li>
                <li>Authentication data (Google OAuth or email OTP)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process and manage your file uploads and corrections</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Data Security</h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information. 
                All data is encrypted in transit and stored securely. Files are stored in 
                protected directories and are only accessible by authorized personnel.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Data Retention</h2>
              <p className="mb-4">
                We retain your personal information for as long as necessary to provide our 
                services and comply with legal obligations. You may request deletion of your 
                account and associated data at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Opt-out of certain communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Contact Us</h2>
              <p className="mb-4">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p>
                <strong>Email:</strong> support@thesupport.agency<br />
                <strong>Address:</strong> Delhi, India
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

