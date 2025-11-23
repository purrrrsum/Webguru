import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getBlogCityBySlug } from '@/lib/db';

const blogPosts: Record<string, { title: string; date: string; category: string; content: string }> = {
  '1': {
    title: 'Getting Started with Design Corrections',
    date: '2024-01-15',
    category: 'Tutorial',
    content: `
      <p>Welcome to thesupport.agency! This guide will help you get started with our design correction platform.</p>
      <h2>Creating Your Account</h2>
      <p>First, sign up using either Google OAuth or Email OTP. Both methods are secure and take just a few seconds.</p>
      <h2>Uploading Your First File</h2>
      <p>Once logged in, you can create a new job and upload files up to 20MB. Our platform supports images, videos, PDFs, and documents.</p>
      <h2>Working with Agents</h2>
      <p>Our expert agents will review your files and provide corrections. Use the chat interface to communicate and collaborate.</p>
    `,
  },
  '2': {
    title: 'Best Practices for File Uploads',
    date: '2024-01-10',
    category: 'Tips',
    content: `
      <p>Follow these tips to get the best results from your file uploads.</p>
      <h2>File Size and Format</h2>
      <p>Keep files under 20MB for optimal performance. Use standard formats like JPG, PNG, PDF, or DOCX for best compatibility.</p>
      <h2>Clear Communication</h2>
      <p>Use the chat feature to provide context about what you need corrected. The more information you provide, the better the results.</p>
      <h2>Multiple Revisions</h2>
      <p>Don't hesitate to request revisions. Our mutual confirmation system ensures you're satisfied before a job is marked complete.</p>
    `,
  },
  '3': {
    title: 'Understanding the Mutual Confirmation System',
    date: '2024-01-05',
    category: 'Feature',
    content: `
      <p>Our unique mutual confirmation system ensures transparency and satisfaction for both users and agents.</p>
      <h2>How It Works</h2>
      <p>Both you and the agent must "tick" or confirm that a file correction is complete. Only when both parties have confirmed can the file be marked as done and deleted.</p>
      <h2>Benefits</h2>
      <p>This system prevents misunderstandings and ensures that both parties are satisfied with the work before finalizing a job.</p>
      <h2>Job Tracking</h2>
      <p>Your completed jobs are tracked in your profile, giving you a record of all successful collaborations.</p>
    `,
  },
};

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Check if it's a numeric ID (old blog post) or a slug (city blog post)
  const isNumericId = /^\d+$/.test(id);
  
  if (isNumericId) {
    // Handle old blog posts with numeric IDs
    const post = blogPosts[id];
    
    if (!post) {
      notFound();
    }

    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <Link href="/blog" className="text-whatsapp-green hover:text-whatsapp-green-dark mb-6 inline-block">
              ← Back to Blog
            </Link>
            
            <article>
              <div className="mb-6">
                <span className="text-xs font-semibold text-whatsapp-green uppercase tracking-wide">
                  {post.category}
                </span>
                <time className="text-sm text-gray-500 ml-4" dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-8">{post.title}</h1>
              
              <div 
                className="prose prose-lg max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          </div>
        </div>
        <Footer />
      </>
    );
  } else {
    // Handle city blog posts with slugs
    const city = await getBlogCityBySlug(id);

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
}
