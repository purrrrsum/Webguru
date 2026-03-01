import { getUserById } from '@/lib/db';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';

export default async function AgentProfilePage({ params }: { params: { id: string } }) {
    const agentId = params.id;

    if (!agentId) {
        notFound();
    }

    const agent = await getUserById(agentId);

    // Ensure user exists and is actually an agent
    if (!agent || agent.role !== 'agent') {
        notFound();
    }

    return (
        <main className="min-h-screen bg-slate-950 flex flex-col font-outfit selection:bg-brand-pink/30">
            <Navigation />

            <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-32 sm:px-6 lg:px-8">

                {/* Header Profile Section */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 sm:p-12 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/5 via-transparent to-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center relative z-10">
                        {/* Avatar Placeholder */}
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-brand-pink to-brand-orange p-1 flex-shrink-0">
                            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-white">
                                {agent.name.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{agent.name}</h1>
                                {agent.isOnline && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400 border border-green-500/20">
                                        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                                        Online
                                    </span>
                                )}
                                {agent.isReady && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-3 py-1 text-sm font-medium text-brand-blue border border-brand-blue/20">
                                        Available for Jobs
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
                                {agent.industry && (
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {agent.industry}
                                    </div>
                                )}

                                {agent.preferredService && (
                                    <div className="flex items-center gap-2 capitalize">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        {agent.preferredService.replace('_', ' ')}
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-orange" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="font-semibold text-white">{agent.ratingAvg?.toFixed(1) || '0.0'}</span>
                                    <span className="text-slate-500">({agent.reviewCount || 0} reviews)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio & Resume Grid */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Professional Bio
                            </h2>
                            <div className="prose prose-invert max-w-none text-slate-300 font-light leading-relaxed whitespace-pre-wrap">
                                {agent.bio ? agent.bio : (
                                    <p className="text-slate-500 italic">This professional hasn&apos;t written a bio yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Verified Experience/Jobs Component */}
                        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
                            <h2 className="text-xl font-bold text-white mb-6">Platform Statistics</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                                    <div className="text-brand-orange text-3xl font-bold mb-2">{agent.jobCount || 0}</div>
                                    <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Jobs Completed</div>
                                </div>
                                <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                                    <div className="text-brand-blue text-3xl font-bold mb-2">Member</div>
                                    <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">
                                        Since {new Date(agent.createdAt || new Date()).getFullYear()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-gradient-to-b from-slate-900/80 to-slate-900/40 border border-slate-800 rounded-2xl p-8 sticky top-32">
                            <h3 className="text-lg font-bold text-white mb-6">Portfolio & Documents</h3>

                            {agent.resumePdfUrl ? (
                                <a
                                    href={agent.resumePdfUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-slate-700 hover:border-brand-pink/50 hover:bg-brand-pink/5 transition-all duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500 group-hover:text-brand-pink transition-colors mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-sm font-semibold text-white group-hover:text-brand-pink">View Verified PDF Resume</span>
                                    <span className="text-xs text-slate-500 mt-2 text-center">Click to open securely</span>
                                </a>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-slate-800 bg-slate-950">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm text-slate-500 text-center">No resume uploaded</span>
                                </div>
                            )}

                            {agent.website && (
                                <div className="mt-6">
                                    <a href={agent.website} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                        </svg>
                                        Visit Personal Website
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>

            <Footer />
        </main>
    );
}
