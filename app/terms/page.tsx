import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using thesupport.agency, you accept and agree to be bound by 
                the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Use License</h2>
              <p className="mb-4">
                Permission is granted to use our platform for personal and commercial purposes, 
                subject to the following restrictions:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>You must not use the service for illegal purposes</li>
                <li>You must not upload malicious files or content</li>
                <li>You must not attempt to gain unauthorized access</li>
                <li>You must not abuse or spam the service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. File Upload Policy</h2>
              <p className="mb-4">
                Users may upload files up to 20MB in size. Acceptable file types include:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Images (JPG, PNG, GIF, etc.)</li>
                <li>Documents (PDF, DOCX, etc.)</li>
                <li>Videos (MP4, AVI, etc.)</li>
                <li>Other common file formats</li>
              </ul>
              <p className="mb-4">
                Files containing illegal, copyrighted, or malicious content are prohibited and 
                will be removed immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. User Accounts</h2>
              <p className="mb-4">
                You are responsible for maintaining the confidentiality of your account credentials. 
                You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Service Availability</h2>
              <p className="mb-4">
                We strive to provide 24/7 service availability but do not guarantee uninterrupted 
                access. We reserve the right to suspend or terminate service for maintenance, 
                security, or other reasons.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Limitation of Liability</h2>
              <p className="mb-4">
                Thesupport.agency shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages resulting from your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify these terms at any time. Continued use of the 
                service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Contact Information</h2>
              <p className="mb-4">
                For questions about these Terms of Service, contact us at:
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

