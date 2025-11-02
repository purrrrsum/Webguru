import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const blogPosts = [
  {
    id: 1,
    title: 'Getting Started with Design Corrections',
    excerpt: 'Learn how to use our platform to get professional design corrections quickly and efficiently.',
    date: '2024-01-15',
    category: 'Tutorial',
  },
  {
    id: 2,
    title: 'Best Practices for File Uploads',
    excerpt: 'Tips and tricks for uploading files that get the best results from our correction service.',
    date: '2024-01-10',
    category: 'Tips',
  },
  {
    id: 3,
    title: 'Understanding the Mutual Confirmation System',
    excerpt: 'Learn about our unique two-party confirmation system that ensures transparency and satisfaction.',
    date: '2024-01-05',
    category: 'Feature',
  },
];

export default function BlogPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
            <p className="text-xl text-gray-600">Tips, tutorials, and updates from our team</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-whatsapp-green uppercase tracking-wide">
                      {post.category}
                    </span>
                    <time className="text-xs text-gray-500" dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    <Link href={`/blog/${post.id}`} className="hover:text-whatsapp-green">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Link 
                    href={`/blog/${post.id}`}
                    className="text-whatsapp-green hover:text-whatsapp-green-dark font-semibold text-sm"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">More blog posts coming soon!</p>
            <Link href="/contact" className="text-whatsapp-green hover:underline">
              Have a topic suggestion? Contact us
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

