import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Welcome to <strong>thesupport.agency</strong>, your trusted partner for professional design corrections and collaborative workflows.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              We provide a seamless, WhatsApp-style platform that connects clients with expert design professionals. 
              Our mission is to make design corrections accessible, transparent, and efficient through innovative 
              technology and user-friendly interfaces.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What We Do</h2>
            <p className="text-gray-600 mb-6">
              Our platform enables you to upload any file (images, videos, PDFs, documents) and collaborate 
              with skilled agents who provide expert corrections and feedback. Every job requires mutual 
              confirmation from both parties, ensuring transparency and satisfaction.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Key Features</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>Secure file uploads up to 20MB</li>
              <li>Real-time chat collaboration</li>
              <li>Mutual confirmation system</li>
              <li>Google OAuth and Email OTP authentication</li>
              <li>Mobile-responsive design</li>
              <li>Job tracking and profile management</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Why Choose Us</h2>
            <p className="text-gray-600 mb-4">
              We combine the simplicity of WhatsApp with the professionalism of enterprise software. 
              Our platform is built for both individuals and businesses who need reliable, transparent 
              design correction services.
            </p>

            <div className="bg-whatsapp-green-light p-6 rounded-lg mt-8">
              <p className="text-gray-800">
                <strong>Ready to get started?</strong> Sign up today and experience the future of 
                collaborative design corrections.
              </p>
              <Link href="/auth/signin" className="bg-whatsapp-green text-white px-6 py-2 rounded-md hover:bg-whatsapp-green-dark inline-block mt-4">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

