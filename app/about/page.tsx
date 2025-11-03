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
            <p className="text-gray-600 mb-6 text-lg">
              Welcome to <strong>thesupport.agency</strong>, the affordable proofreading platform designed specifically for design agencies 
              who need professional content correction at the lowest prices in the market.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              We believe that every design agency, regardless of size, should have access to professional proofreading services 
              without breaking the bank. Our mission is to make quality content correction accessible, affordable, and efficient 
              through our innovative platform that connects agencies with skilled proofreading agents.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What We Proofread</h2>
            <p className="text-gray-600 mb-4">
              Our platform is perfect for a wide range of content types that design agencies work with daily:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li><strong>Social Media Posts:</strong> Captions, hashtags, and content for Instagram, Facebook, Twitter, and more</li>
              <li><strong>Videos with Subtitles:</strong> Accurate subtitles, translations, and closed captions</li>
              <li><strong>Books & Publications:</strong> Complete proofreading for novels, eBooks, and printed materials</li>
              <li><strong>Website Content:</strong> Landing pages, blog posts, product descriptions, and web copy</li>
              <li><strong>Technical Documents:</strong> User manuals, API documentation, technical specifications</li>
              <li><strong>Design Mockups:</strong> Text corrections in design files, presentations, and marketing materials</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How It Works</h2>
            <p className="text-gray-600 mb-6">
              Our platform enables you to upload any file (images, documents, videos) along with a text message specifying your 
              correction requirements. Expert agents download, review, and upload corrected versions. Both you and the agent must 
              tick the original file to confirm completion, ensuring transparency and satisfaction.
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

