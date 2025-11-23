import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getAllBlogCities } from '@/lib/db';

export default async function BlogPage() {
  const cities = await getAllBlogCities();

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
            <p className="text-xl text-gray-600">Tips, tutorials, and updates from our team</p>
          </div>

          {/* City-based Blog Posts */}
          {cities.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">City-Specific Content</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cities.map((city) => (
                  <article key={city.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-whatsapp-green uppercase tracking-wide">
                          {city.cityName}
                        </span>
                        <time className="text-xs text-gray-500" dateTime={city.updatedAt}>
                          {new Date(city.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        <Link href={`/blog/${city.slug}`} className="hover:text-whatsapp-green">
                          {city.cityName} - Design Services
                        </Link>
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {city.content.length > 150 ? city.content.substring(0, 150) + '...' : city.content}
                      </p>
                      <Link 
                        href={`/blog/${city.slug}`}
                        className="text-whatsapp-green hover:text-whatsapp-green-dark font-semibold text-sm"
                      >
                        Read more →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Default Blog Posts */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">General Blog Posts</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-whatsapp-green uppercase tracking-wide">
                      Tutorial
                    </span>
                    <time className="text-xs text-gray-500" dateTime="2024-01-15">
                      {new Date('2024-01-15').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    <Link href="/blog/1" className="hover:text-whatsapp-green">
                      Getting Started with Design Corrections
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Learn how to use our platform to get professional design corrections quickly and efficiently.
                  </p>
                  <Link 
                    href="/blog/1"
                    className="text-whatsapp-green hover:text-whatsapp-green-dark font-semibold text-sm"
                  >
                    Read more →
                  </Link>
                </div>
              </article>

              <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-whatsapp-green uppercase tracking-wide">
                      Tips
                    </span>
                    <time className="text-xs text-gray-500" dateTime="2024-01-10">
                      {new Date('2024-01-10').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    <Link href="/blog/2" className="hover:text-whatsapp-green">
                      Best Practices for File Uploads
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Tips and tricks for uploading files that get the best results from our correction service.
                  </p>
                  <Link 
                    href="/blog/2"
                    className="text-whatsapp-green hover:text-whatsapp-green-dark font-semibold text-sm"
                  >
                    Read more →
                  </Link>
                </div>
              </article>

              <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-whatsapp-green uppercase tracking-wide">
                      Feature
                    </span>
                    <time className="text-xs text-gray-500" dateTime="2024-01-05">
                      {new Date('2024-01-05').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    <Link href="/blog/3" className="hover:text-whatsapp-green">
                      Understanding the Mutual Confirmation System
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Learn about our unique two-party confirmation system that ensures transparency and satisfaction.
                  </p>
                  <Link 
                    href="/blog/3"
                    className="text-whatsapp-green hover:text-whatsapp-green-dark font-semibold text-sm"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            </div>
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
