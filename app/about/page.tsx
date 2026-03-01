import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen brand-chat-bg">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-brand-blue-light text-brand-blue text-sm font-medium">
                About Our Mission
              </span>
            </div>
            <h1 className="brand-heading-1 mb-6">Human-powered creative services for modern teams</h1>
            <p className="brand-body-large max-w-3xl mx-auto text-brand-gray-600">
              We connect visionary clients with skilled professionals worldwide, offering premium Design, Content Creation, Video Editing, and Proofreading services without the premium price tag.
            </p>
          </div>

          {/* Mission Section */}
          <div className="brand-card p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="brand-heading-2 mb-4">Our Mission</h2>
              <p className="brand-body-large text-brand-gray-600 max-w-3xl mx-auto">
                To democratize professional creative and editorial services, making them accessible, affordable, and efficient
                for businesses of all sizes through our innovative human-powered platform.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="brand-heading-3 mb-3">Quality First</h3>
                <p className="brand-body-small text-brand-gray-600">
                  Every project is executed by experienced professionals with deep attention to detail.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="brand-heading-3 mb-3">Lightning Fast</h3>
                <p className="brand-body-small text-brand-gray-600">
                  Quick turnaround times without ever compromising on the quality of our deliverables.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="brand-heading-3 mb-3">Transparent</h3>
                <p className="brand-body-small text-brand-gray-600">
                  Clear communication and mutual confirmation ensure complete satisfaction.
                </p>
              </div>
            </div>
          </div>

          {/* What We Do */}
          <div className="mb-12">
            <h2 className="brand-heading-2 text-center mb-12">Our Specialized Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "🎨", title: "Design & Graphics", desc: "Logos, brand identity, marketing materials, and UI/UX design mockups." },
                { icon: "✍️", title: "Content Creation", desc: "Engaging blog posts, SEO articles, copywriting, and social media captions." },
                { icon: "🎬", title: "Video Editing", desc: "Professional cuts, color grading, subtitles, and motion graphics for all platforms." },
                { icon: "🔍", title: "Proofreading", desc: "Meticulous review of documents, books, and website copy to ensure flawless delivery." }
              ].map((item, index) => (
                <div key={index} className="brand-card p-6 text-center">
                  <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <h3 className="brand-heading-3 mb-3">{item.title}</h3>
                  <p className="brand-body-small text-brand-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-12">
            <h2 className="brand-heading-2 text-center mb-12">How It Works</h2>
            <div className="brand-card p-8">
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center mx-auto mb-4 text-lg font-bold">1</div>
                  <h3 className="font-semibold mb-2">Upload Content</h3>
                  <p className="text-sm text-brand-gray-600">Upload images, documents, or videos with your requirements</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center mx-auto mb-4 text-lg font-bold">2</div>
                  <h3 className="font-semibold mb-2">Expert Execution</h3>
                  <p className="text-sm text-brand-gray-600">Our vetted professionals download and execute your vision</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center mx-auto mb-4 text-lg font-bold">3</div>
                  <h3 className="font-semibold mb-2">Receive Deliverables</h3>
                  <p className="text-sm text-brand-gray-600">Get your finalized files back with complete transparency</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center mx-auto mb-4 text-lg font-bold">4</div>
                  <h3 className="font-semibold mb-2">Mutual Confirmation</h3>
                  <p className="text-sm text-brand-gray-600">Both parties confirm completion for transparency</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="brand-card p-8 bg-gradient-to-r from-brand-pink/20 to-brand-orange/20 text-center border border-brand-pink/30 shadow-[0_0_15px_rgba(235,93,139,0.1)]">
            <h2 className="brand-heading-2 mb-4 text-white">Ready to get started?</h2>
            <p className="brand-body-large text-gray-300 mb-6">
              Join thousands of businesses who trust us with their creative needs.
            </p>
            <Link href="/auth/signin" className="brand-button-primary">
              Launch Your First Project
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

