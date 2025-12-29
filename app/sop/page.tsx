'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function SOPPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [sampleUrls, setSampleUrls] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSampleUrlChange = (index: number, value: string) => {
    const newUrls = [...sampleUrls];
    newUrls[index] = value;
    setSampleUrls(newUrls);
  };

  const addSampleUrl = () => {
    setSampleUrls([...sampleUrls, '']);
  };

  const removeSampleUrl = (index: number) => {
    setSampleUrls(sampleUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would typically upload files and send the form data
      // For now, we'll just simulate a submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      setFiles([]);
      setSampleUrls(['']);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen apple-chat-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-apple-blue-light text-apple-blue text-sm font-medium">
                Design Request Process
              </span>
            </div>
            <h1 className="apple-heading-1 mb-6">Standard Operating Procedure</h1>
            <p className="apple-body-large max-w-2xl mx-auto text-apple-gray-600">
              Upload your content and sample posts to get started with our design services
            </p>
          </div>

          {/* Process Overview */}
          <div className="apple-card p-8 mb-12">
            <h2 className="apple-heading-2 mb-8">How It Works</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="apple-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-apple-blue text-white rounded-xl flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="apple-heading-3 mb-2">Upload Your Content</h3>
                    <p className="apple-body-small text-apple-gray-600">
                      Upload your content in PDF or Word document format. Include all guidelines, brand colors, fonts, and any specific requirements.
                    </p>
                  </div>
                </div>
              </div>

              <div className="apple-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-apple-blue text-white rounded-xl flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h3 className="apple-heading-3 mb-2">Provide Sample Posts</h3>
                    <p className="apple-body-small text-apple-gray-600">
                      Share sample posts either as URLs or images. This helps us understand your style and preferences.
                    </p>
                  </div>
                </div>
              </div>

              <div className="apple-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-apple-blue text-white rounded-xl flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h3 className="apple-heading-3 mb-2">Contact Within 1 Hour</h3>
                    <p className="apple-body-small text-apple-gray-600">
                      We&apos;ll contact you within 1 hour to discuss your requirements and answer any questions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="apple-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-apple-blue text-white rounded-xl flex items-center justify-center font-bold text-lg">
                  4
                </div>
                  <div>
                    <h3 className="apple-heading-3 mb-2">Receive Designs</h3>
                    <p className="apple-body-small text-apple-gray-600">
                      You&apos;ll receive 3-4 design templates and 1 unique design based on your requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          {submitted ? (
            <div className="apple-card p-8 text-center bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">✓</span>
              </div>
              <h2 className="apple-heading-2 mb-4">Thank You!</h2>
              <p className="apple-body-large text-apple-gray-700 mb-8">
                We&apos;ve received your submission. We&apos;ll contact you within 1 hour.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="apple-button-primary"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <div className="apple-card p-8">
              <h2 className="apple-heading-2 mb-8">Submit Your Request</h2>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="name" className="block apple-body-small font-medium text-apple-gray-700 mb-3">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 bg-white border border-apple-gray-200 rounded-xl focus:ring-2 focus:ring-apple-blue focus:border-transparent text-apple-gray-900 placeholder-apple-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block apple-body-small font-medium text-apple-gray-700 mb-3">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-white border border-apple-gray-200 rounded-xl focus:ring-2 focus:ring-apple-blue focus:border-transparent text-apple-gray-900 placeholder-apple-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block apple-body-small font-medium text-apple-gray-700 mb-3">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 bg-white border border-apple-gray-200 rounded-xl focus:ring-2 focus:ring-apple-blue focus:border-transparent text-apple-gray-900 placeholder-apple-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block apple-body-small font-medium text-apple-gray-700 mb-3">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-apple-gray-200 rounded-xl focus:ring-2 focus:ring-apple-blue focus:border-transparent text-apple-gray-900 placeholder-apple-gray-500"
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Content (PDF or Word Document) *
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green"
                />
                {files.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    {files.length} file(s) selected
                  </div>
                )}
              </div>

              {/* Sample URLs */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sample Posts (URLs or Image Links)
                </label>
                {sampleUrls.map((url, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleSampleUrlChange(index, e.target.value)}
                      placeholder="https://example.com/post or image URL"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green"
                    />
                    {sampleUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSampleUrl(index)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSampleUrl}
                  className="text-sm text-whatsapp-green hover:underline"
                >
                  + Add another URL
                </button>
              </div>

              {/* Image Upload for Samples */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Sample Images (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green"
                />
              </div>

              {/* Message */}
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Requirements or Notes
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green"
                  placeholder="Any specific requirements, brand guidelines, or notes..."
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="apple-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
                <p className="text-sm text-gray-600 mt-4">
                  We&apos;ll contact you within 1 hour after submission
                </p>
              </div>
            </form>
          )}

          {/* Related Content */}
          <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Services</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/services" className="block p-4 border border-gray-200 rounded-lg hover:border-whatsapp-green transition-colors">
                <h3 className="font-semibold text-gray-900 mb-2">Extra Services</h3>
                <p className="text-sm text-gray-600">Social media design, banners, and video editing</p>
              </Link>
              <Link href="/pricing" className="block p-4 border border-gray-200 rounded-lg hover:border-whatsapp-green transition-colors">
                <h3 className="font-semibold text-gray-900 mb-2">Pricing Plans</h3>
                <p className="text-sm text-gray-600">View our affordable pricing options</p>
              </Link>
              <Link href="/contact" className="block p-4 border border-gray-200 rounded-lg hover:border-whatsapp-green transition-colors">
                <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
                <p className="text-sm text-gray-600">Get in touch for custom requirements</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

