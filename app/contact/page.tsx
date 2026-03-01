'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form to your backend
    // For now, we'll just show a success message
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen brand-chat-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-brand-blue-light text-brand-blue text-sm font-medium">
                Get in Touch
              </span>
            </div>
            <h1 className="brand-heading-1 mb-6">We&apos;d love to hear from you</h1>
            <p className="brand-body-large max-w-2xl mx-auto text-brand-gray-600">
              Have questions about our proofreading services? Need help with your account?
              We&apos;re here to help you succeed.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="brand-heading-2 mb-8">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="brand-card p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                        <span className="text-xl">✉️</span>
                      </div>
                      <div>
                        <h3 className="brand-heading-3 mb-1">Email Support</h3>
                        <a href="mailto:support@thesupport.agency" className="text-brand-blue hover:text-brand-blue-dark transition-colors">
                          support@thesupport.agency
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="brand-card p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                        <span className="text-xl">📍</span>
                      </div>
                      <div>
                        <h3 className="brand-heading-3 mb-1">Location</h3>
                        <p className="brand-body text-brand-gray-600">Delhi, India</p>
                      </div>
                    </div>
                  </div>

                  <div className="brand-card p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                        <span className="text-xl">🕒</span>
                      </div>
                      <div>
                        <h3 className="brand-heading-3 mb-1">Support Hours</h3>
                        <p className="brand-body text-brand-gray-600">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="brand-card p-8">
                <h3 className="brand-heading-3 mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <Link href="/pricing" className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-gray-50 transition-colors">
                    <span className="text-xl">💰</span>
                    <span className="font-medium">View Pricing</span>
                  </Link>
                  <Link href="/about" className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-gray-50 transition-colors">
                    <span className="text-xl">ℹ️</span>
                    <span className="font-medium">Learn More About Us</span>
                  </Link>
                  <Link href="/become-agent" className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-gray-50 transition-colors">
                    <span className="text-xl">👥</span>
                    <span className="font-medium">Become a Proofreader</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="brand-card p-8">
              <h2 className="brand-heading-2 mb-8">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block brand-body-small font-medium text-brand-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-brand-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent text-brand-gray-900 placeholder-brand-gray-500"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block brand-body-small font-medium text-brand-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-brand-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent text-brand-gray-900 placeholder-brand-gray-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block brand-body-small font-medium text-brand-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-brand-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent text-brand-gray-900"
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback & Suggestions</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block brand-body-small font-medium text-brand-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white border border-brand-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent text-brand-gray-900 placeholder-brand-gray-500 resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {submitted && (
                  <div className="brand-card p-4 bg-green-50 border-green-200">
                    <div className="flex items-center gap-3">
                      <span className="text-green-600 text-xl">✓</span>
                      <p className="text-green-800 font-medium">
                        Thank you! Your message has been sent. We&apos;ll get back to you soon.
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full brand-button-primary"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

