import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getBlogCityBySlug } from '@/lib/db';

export default async function BlogCityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = await getBlogCityBySlug(slug);

  if (!city) {
    notFound();
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link 
            href="/blog"
            className="text-whatsapp-green hover:text-whatsapp-green-dark mb-6 inline-block"
          >
            ← Back to Blog
          </Link>

          <article className="bg-white">
            <header className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-whatsapp-green uppercase tracking-wide">
                  {city.cityName}
                </span>
                <time className="text-sm text-gray-500" dateTime={city.updatedAt}>
                  {new Date(city.updatedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </time>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Design Services in {city.cityName}
              </h1>
            </header>

            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 whitespace-pre-wrap">
                {city.content}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link 
                href="/contact"
                className="bg-whatsapp-green text-white px-6 py-3 rounded-lg hover:bg-whatsapp-green-dark transition-colors inline-block"
              >
                Contact Us for Services in {city.cityName}
              </Link>
            </div>
          </article>
        </div>
      </div>
      <Footer />
    </>
  );
}

