import { Link } from 'react-router-dom';

const footerLinks = [
    {
        title: 'Platform',
        links: [
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Interactive Map', to: '/map' },
            { label: 'Health Assessment', to: '/health' },
            { label: 'AI Insights', to: '/ai-insights' },
            { label: 'Reports', to: '/reports' },
        ],
    },
    {
        title: 'Hardware',
        links: [
            { label: 'Hardware Overview', to: '/hardware' },
            { label: 'PM Analyzer', to: '/analyze' },
        ],
    },
    {
        title: 'Account',
        links: [
            { label: 'Sign In', to: '/auth/login' },
            { label: 'Get Started', to: '/auth/signup' },
            { label: 'My Profile', to: '/profile' },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="bg-[#0d1528] border-t border-slate-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                                </svg>
                            </div>
                            <span className="font-bold text-lg text-white">Zenab</span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Intelligent air quality monitoring powered by living moss bio-filters and IoT technology.
                        </p>
                        <div className="flex items-center gap-1.5 mt-4">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-emerald-400 text-xs font-medium">Live Monitoring Active</span>
                        </div>
                    </div>

                    {/* Link columns */}
                    {footerLinks.map((col) => (
                        <div key={col.title}>
                            <h3 className="text-white font-semibold text-sm mb-4 tracking-wide">{col.title}</h3>
                            <ul className="space-y-2.5">
                                {col.links.map((l) => (
                                    <li key={l.to}>
                                        <Link
                                            to={l.to}
                                            className="text-slate-500 hover:text-emerald-400 text-sm transition-colors"
                                        >
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-slate-600 text-xs">
                        © {new Date().getFullYear()} Zenab Systems. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-slate-700 text-xs">Hardware Registry v2.4.1</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span className="text-slate-700 text-xs">YOLO ML Model</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span className="text-slate-700 text-xs">Supabase Auth</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
