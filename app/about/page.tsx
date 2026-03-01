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
            <h1 className="brand-heading-1 mb-6">Human-powered proofreading for modern teams</h1>
            <p className="brand-body-large max-w-3xl mx-auto text-brand-gray-600">
              We believe every creative deserves professional proofreading without the premium price tag.
              Our platform connects design agencies with skilled proofreaders worldwide.
            </p>
          </div>

          {/* Mission Section */}
          <div className="brand-card p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="brand-heading-2 mb-4">Our Mission</h2>
              <p className="brand-body-large text-brand-gray-600 max-w-3xl mx-auto">
                To democratize professional proofreading services, making them accessible, affordable, and efficient
                for design agencies of all sizes through our innovative human-powered platform.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="brand-heading-3 mb-3">Quality First</h3>
                <p className="brand-body-small text-brand-gray-600">
                  Every piece of content is reviewed by experienced professionals with attention to detail.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="brand-heading-3 mb-3">Lightning Fast</h3>
                <p className="brand-body-small text-brand-gray-600">
                  Quick turnaround times without compromising on the quality of our proofreading.
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

          {/* What We Proofread */}
          <div className="mb-12">
            <h2 className="brand-heading-2 text-center mb-12">What We Proofread</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "📱", title: "Social Media Posts", desc: "Captions, hashtags, and content for all platforms" },
                { icon: "🎬", title: "Videos & Subtitles", desc: "Accurate subtitles, translations, and closed captions" },
                { icon: "📚", title: "Books & Publications", desc: "Complete proofreading for novels and eBooks" },
                { icon: "🌐", title: "Website Content", desc: "Landing pages, blog posts, and web copy" },
                { icon: "📄", title: "Technical Documents", desc: "User manuals and technical specifications" },
                { icon: "🎨", title: "Design Mockups", desc: "Text corrections in design files and presentations" }
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
                  <h3 className="font-semibold mb-2">Expert Review</h3>
                  <p className="text-sm text-brand-gray-600">Our proofreaders download and review your content</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center mx-auto mb-4 text-lg font-bold">3</div>
                  <h3 className="font-semibold mb-2">Receive Corrections</h3>
                  <p className="text-sm text-brand-gray-600">Get your proofread content back with detailed corrections</p>
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
          <div className="brand-card p-8 bg-gradient-to-r from-brand-blue-light to-white text-center">
            <h2 className="brand-heading-2 mb-4">Ready to get started?</h2>
            <p className="brand-body-large text-brand-gray-700 mb-6">
              Join thousands of design professionals who trust us with their content.
            </p>
            <Link href="/auth/signin" className="brand-button-primary">
              Start Proofreading Today
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

