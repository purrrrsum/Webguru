'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        industry: '',
        preferredService: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                // Do not auto-route to dashboard because they need to go back 
                // to login and use their emailed credentials
            } else {
                setError(data.error || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('A network error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-brand shadow-brand-lg p-8 w-full max-w-md border border-brand-gray-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-pink to-brand-orange mb-2">
                        thesupport.agency
                    </h1>
                    <p className="text-brand-gray-600">Complete your profile to join</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm whitespace-pre-wrap">
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl text-green-600">✓</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
                        <p className="text-brand-gray-600 mb-6">
                            Your profile has been created. We have emailed your secure login password to <strong>{formData.email}</strong>.
                        </p>
                        <Link
                            href="/auth/signin"
                            className="inline-block w-full bg-gradient-to-r from-brand-pink to-brand-orange text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg"
                        >
                            Go to Sign In
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-brand-gray-700 mb-1">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-brand-gray-300 rounded-lg focus:ring-brand-orange focus:border-brand-orange"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-brand-gray-700 mb-1">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-brand-gray-300 rounded-lg focus:ring-brand-orange focus:border-brand-orange"
                                placeholder="you@company.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-brand-gray-700 mb-1">
                                Company (Optional)
                            </label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-brand-gray-300 rounded-lg focus:ring-brand-orange focus:border-brand-orange"
                                placeholder="Acme Corp"
                            />
                        </div>

                        <div>
                            <label htmlFor="industry" className="block text-sm font-medium text-brand-gray-700 mb-1">
                                Industry (Optional)
                            </label>
                            <input
                                type="text"
                                id="industry"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-brand-gray-300 rounded-lg focus:ring-brand-orange focus:border-brand-orange"
                                placeholder="e.g. Retail, FinTech"
                            />
                        </div>

                        <div>
                            <label htmlFor="preferredService" className="block text-sm font-medium text-brand-gray-700 mb-1">
                                What are you looking for? *
                            </label>
                            <select
                                id="preferredService"
                                name="preferredService"
                                value={formData.preferredService}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-brand-gray-300 rounded-lg focus:ring-brand-orange focus:border-brand-orange bg-white"
                            >
                                <option value="">Select a service</option>
                                <option value="design">Design & Graphics</option>
                                <option value="content_creation">Content Creation</option>
                                <option value="video_editing">Video Editing</option>
                                <option value="proofreading">Proofreading</option>
                                <option value="other">Multiple / Not Sure</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-brand-pink to-brand-orange text-white font-medium py-3 px-4 rounded-xl shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? 'Processing...' : 'Complete Registration'}
                        </button>

                        <div className="mt-6 text-center pt-4 border-t border-brand-gray-200">
                            <span className="text-brand-gray-600 text-sm">Already have an account? </span>
                            <Link
                                href="/auth/signin"
                                className="text-sm font-medium text-brand-orange hover:underline"
                            >
                                Sign in here
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
