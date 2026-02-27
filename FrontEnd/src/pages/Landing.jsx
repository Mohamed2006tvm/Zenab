import { Link } from 'react-router-dom';

const features = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        title: 'Real-Time Monitoring',
        desc: 'Live AQI data from 30+ stations across India, updated continuously.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
        title: 'AI-Powered Insights',
        desc: 'Machine learning analyzes pollution patterns and forecasts air quality trends.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
        title: 'Health Assessment',
        desc: 'Personalized recommendations based on your health profile and local air quality.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
        ),
        title: 'Interactive Map',
        desc: 'Visual pollution mapping across India with color-coded AQI indicators.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        title: 'Detailed Reports',
        desc: 'Comprehensive daily, weekly, and monthly air quality reports with export options.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        ),
        title: 'Smart Alerts',
        desc: 'Instant notifications when air quality in your area reaches dangerous levels.',
    },
];

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#0a0f1e]">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d1528]/90 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                            </svg>
                        </div>
                        <span className="text-white font-bold text-xl">Zenab</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/auth/login" className="px-4 py-1.5 text-sm text-slate-300 hover:text-white transition-colors">Sign In</Link>
                        <Link to="/auth/signup" className="px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-400 text-white rounded-md font-medium transition-colors">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-32 pb-24 px-4 overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live monitoring across 30+ Indian cities
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                        Monitor Air Quality{' '}
                        <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            in Real-Time
                        </span>{' '}
                        Across India
                    </h1>

                    <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
                        Zenab provides comprehensive environmental monitoring with AI-powered insights,
                        health assessments, and interactive pollution mapping to help you make informed decisions.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/auth/signup"
                            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/25"
                        >
                            Start Monitoring →
                        </Link>
                        <Link
                            to="/dashboard"
                            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-slate-700 hover:border-slate-500 text-white font-semibold rounded-lg transition-all duration-200"
                        >
                            View Demo
                        </Link>
                    </div>
                </div>

                {/* Stats row */}
                <div className="relative max-w-3xl mx-auto mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { val: '30+', label: 'Cities monitored' },
                        { val: '24/7', label: 'Live updates' },
                        { val: 'AI', label: 'Powered insights' },
                        { val: 'Free', label: 'To get started' },
                    ].map(({ val, label }) => (
                        <div key={label} className="text-center bg-white/5 border border-slate-800 rounded-xl p-4">
                            <div className="text-2xl font-bold text-emerald-400">{val}</div>
                            <div className="text-slate-500 text-sm">{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Comprehensive Environmental Monitoring
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Everything you need to understand and respond to air quality challenges in your area
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="bg-[#111827] border border-slate-800 rounded-xl p-6 hover:border-emerald-500/40 hover:bg-[#1a2235] transition-all duration-200 group"
                            >
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/20 transition-colors">
                                    {f.icon}
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4">
                <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-12">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Monitoring?</h2>
                    <p className="text-slate-400 mb-8">Join thousands of users who trust Zenab for environmental monitoring</p>
                    <Link
                        to="/auth/signup"
                        className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/25"
                    >
                        Create Your Account
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-800 py-8 px-4 text-center">
                <p className="text-slate-500 text-sm">© 2024 Zenab Environmental Monitoring. All rights reserved.</p>
            </footer>
        </div>
    );
}
