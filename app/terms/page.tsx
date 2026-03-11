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
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Credits, Wallet & Payments</h2>
              <p className="mb-4">
                thesupport.agency operates on a pre-paid credit model. When you pay thesupport.agency in advance, 
                the equivalent amount is added as credits to your user wallet. These credits can be used only on 
                the platform and have no cash value outside thesupport.agency.
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>
                  <strong>Credits allocation:</strong> Every successful payment made to thesupport.agency is converted 
                  into platform credits and assigned to the corresponding user account.
                </li>
                <li>
                  <strong>Job quotation:</strong> When a new job is created, an agent reviews the requirements and 
                  proposes a quotation (job price) in credits. The job only proceeds after the user explicitly 
                  accepts this quotation in the platform interface.
                </li>
                <li>
                  <strong>Credit hold (escrow):</strong> Upon accepting a quotation, or at the time the job is marked 
                  as completed by the agent, the quoted amount is reserved from the user&apos;s wallet balance and held 
                  in an internal escrow linked to that job.
                </li>
                <li>
                  <strong>Job completion:</strong> A job is considered completed only after both the user and the agent 
                  confirm completion by marking the job/files as completed in the interface. Once both sides confirm, 
                  the agreed credits are:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Irreversibly deducted from the user&apos;s wallet balance (if not already reserved), and</li>
                    <li>Credited to the assigned agent&apos;s wallet balance for that job.</li>
                  </ul>
                </li>
                <li>
                  <strong>Agent payouts:</strong> At the end of the day or at periodic intervals, thesupport.agency 
                  reconciles the agents&apos; wallet balances and transfers the equivalent amounts to agents via 
                  offline or backend payment methods (such as bank transfer or UPI). These off-platform payouts are 
                  separate from the in-app credit system.
                </li>
                <li>
                  <strong>Refunds & disputes:</strong> Any dispute or request for refund or adjustment of credits 
                  must be raised before both parties have confirmed completion. Once credits have been transferred 
                  from the user wallet to the agent wallet for a completed job, reversals are handled manually at 
                  thesupport.agency&apos;s discretion.
                </li>
              </ul>
              <p className="mb-4">
                By creating jobs, accepting quotations, and confirming completion, you acknowledge and agree to the 
                above credit and wallet rules, including how and when credits are moved between user and agent accounts.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify these terms at any time. Continued use of the 
                service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Contact Information</h2>
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

