import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center px-4 text-center">
            {/* Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative">
                {/* 404 Number */}
                <div className="text-[10rem] font-extrabold leading-none bg-gradient-to-b from-slate-700 to-slate-900 bg-clip-text text-transparent select-none mb-4">
                    404
                </div>

                {/* Icon */}
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 -mt-6">
                    🌿
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                    Page Not Found
                </h1>
                <p className="text-slate-400 text-base max-w-md mx-auto mb-8 leading-relaxed">
                    The page you're looking for has drifted into the atmosphere. Let's get you back to clean air.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5"
                    >
                        Go to Homepage
                    </Link>
                    <Link
                        to="/dashboard"
                        className="px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium rounded-full transition-all duration-300 hover:-translate-y-0.5"
                    >
                        View Dashboard
                    </Link>
                </div>

                {/* Quick links */}
                <div className="mt-12 flex flex-wrap justify-center gap-3">
                    {[
                        { label: '🗺️ Map', to: '/map' },
                        { label: '🤖 AI Insights', to: '/ai-insights' },
                        { label: '❤️ Health', to: '/health' },
                        { label: '⚡ Hardware', to: '/hardware' },
                    ].map((l) => (
                        <Link
                            key={l.to}
                            to={l.to}
                            className="px-4 py-2 text-sm text-slate-500 hover:text-emerald-400 border border-slate-800 hover:border-emerald-500/30 rounded-lg transition-colors"
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
