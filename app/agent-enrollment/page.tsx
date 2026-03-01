'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AgentEnrollmentPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'enroll' | 'login'>('enroll');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Enrollment State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        experience: '',
        tools: '',
        portfolioUrl: '',
        certifications: ''
    });

    const handleEnrollChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                email: loginEmail,
                otp: loginPassword,
                redirect: false,
                role: 'agent',
            });

            if (result?.error) {
                setError('Invalid credentials or you are not registered as an agent.');
            } else if (result?.ok) {
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError('Login failed: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleEnrollSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/register-agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
            } else {
                setError(data.error || 'Enrollment failed.');
            }
        } catch (err) {
            setError('A network error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-brand shadow-brand-lg p-8 w-full max-w-2xl border border-brand-gray-200">

                <div className="text-center mb-8">
                    <Link href="/">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-pink to-brand-orange mb-2 inline-block">
                            thesupport.agency
                        </h1>
                    </Link>
                    <p className="text-brand-gray-600 font-medium">Agent Portal</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-brand-gray-200 mb-8">
                    <button
                        onClick={() => { setActiveTab('enroll'); setError(null); }}
                        className={`flex-1 pb-4 text-center font-medium transition-colors ${activeTab === 'enroll'
                                ? 'text-brand-orange border-b-2 border-brand-orange'
                                : 'text-brand-gray-500 hover:text-brand-gray-700'
                            }`}
                    >
                        Apply to be an Agent
                    </button>
                    <button
                        onClick={() => { setActiveTab('login'); setError(null); }}
                        className={`flex-1 pb-4 text-center font-medium transition-colors ${activeTab === 'login'
                                ? 'text-brand-orange border-b-2 border-brand-orange'
                                : 'text-brand-gray-500 hover:text-brand-gray-700'
                            }`}
                    >
                        Existing Agent Login
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-800 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                {activeTab === 'login' && (
                    <form onSubmit={handleLoginSubmit} className="max-w-md mx-auto space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-brand-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-brand-gray-300 rounded-lg focus:ring-brand-orange focus:border-brand-orange"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-brand-gray-300 rounded-lg focus:ring-brand-orange focus:border-brand-orange"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-brand-pink to-brand-orange text-white font-medium py-3 px-4 rounded-xl shadow-md transition-all hover:shadow-lg disabled:opacity-50 mt-4"
                        >
                            {loading ? 'Authenticating...' : 'Secure Login'}
                        </button>
                    </form>
                )}

                {/* Enrollment Form */}
                {activeTab === 'enroll' && success ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl text-green-600">✓</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Application Received!</h2>
                        <p className="text-brand-gray-600 mb-6 max-w-md mx-auto">
                            Your profile has been created. Your secure login password has been sent to <strong>{formData.email}</strong>. Once logged in, waiting periods or admin reviews may apply.
                        </p>
                        <button
                            onClick={() => { setActiveTab('login'); setSuccess(false); }}
                            className="px-6 py-2 bg-brand-gray-100 text-brand-gray-800 rounded-lg font-medium hover:bg-brand-gray-200 transition-colors"
                        >
                            Go to Login
                        </button>
                    </div>
                ) : activeTab === 'enroll' && !success && (
                    <form onSubmit={handleEnrollSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Info</h3>
                                <div>
                                    <label className="block text-sm font-medium text-brand-gray-700 mb-1">Full Name *</label>
                                    <input type="text" name="name" required value={formData.name} onChange={handleEnrollChange} className="w-full px-4 py-2 border rounded-lg focus:ring-brand-orange focus:border-brand-orange" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-gray-700 mb-1">Email Address *</label>
                                    <input type="email" name="email" required value={formData.email} onChange={handleEnrollChange} className="w-full px-4 py-2 border rounded-lg focus:ring-brand-orange focus:border-brand-orange" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-gray-700 mb-1">Phone Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleEnrollChange} className="w-full px-4 py-2 border rounded-lg focus:ring-brand-orange focus:border-brand-orange" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-gray-700 mb-1">Primary Specialization *</label>
                                    <select name="specialization" required value={formData.specialization} onChange={handleEnrollChange} className="w-full px-4 py-2 border rounded-lg focus:ring-brand-orange focus:border-brand-orange bg-white">
                                        <option value="">Select Specialization</option>
                                        <option value="design">Design & Graphics</option>
                                        <option value="content_creation">Content Creation</option>
                                        <option value="video_editing">Video Editing</option>
                                        <option value="proofreading">Text Proofreading</option>
                                    </select>
                                </div>
                            </div>

                            {/* Professional Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Professional Details</h3>
                                <div>
                                    <label className="block text-sm font-medium text-brand-gray-700 mb-1">Years of Experience *</label>
                                    <select name="experience" required value={formData.experience} onChange={handleEnrollChange} className="w-full px-4 py-2 border rounded-lg focus:ring-brand-orange focus:border-brand-orange bg-white">
                                        <option value="">Select Experience</option>
                                        <option value="0-1">0-1 Years Junior</option>
                                        <option value="1-3">1-3 Years Intermediate</option>
                                        <option value="3-5">3-5 Years Senior</option>
                                        <option value="5+">5+ Years Expert</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-gray-700 mb-1">Tools / Software Used</label>
                                    <input type="text" name="tools" placeholder="e.g. Adobe Suite, Figma, Final Cut" value={formData.tools} onChange={handleEnrollChange} className="w-full px-4 py-2 border rounded-lg focus:ring-brand-orange focus:border-brand-orange" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-gray-700 mb-1">Portfolio URL (Required for Design/Video) *</label>
                                    <input type="url" name="portfolioUrl" placeholder="https://dribbble.com/..." required value={formData.portfolioUrl} onChange={handleEnrollChange} className="w-full px-4 py-2 border rounded-lg focus:ring-brand-orange focus:border-brand-orange" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-gray-700 mb-1">Certifications (Optional)</label>
                                    <textarea name="certifications" rows={2} value={formData.certifications} onChange={handleEnrollChange} className="w-full px-4 py-2 border rounded-lg focus:ring-brand-orange focus:border-brand-orange" placeholder="List relevant degrees or certificates..." />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-brand-pink to-brand-orange text-white font-medium py-3 px-4 rounded-xl shadow-md transition-all hover:shadow-lg disabled:opacity-50 mt-6"
                        >
                            {loading ? 'Submitting Application...' : 'Submit Application'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
