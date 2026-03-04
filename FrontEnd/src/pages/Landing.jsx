import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const features = [
    {
        icon: '🌿',
        title: 'Natural Fine Dust Filter',
        desc: 'Using precisely calibrated moss cultures with enormous surface areas to bind and metabolize particulate matter.',
    },
    {
        icon: '🤖',
        title: 'Smart IoT Technology',
        desc: 'Integrated sensors deliver real-time environmental data, ensuring optimal conditions for the moss and automated maintenance.',
    },
    {
        icon: '❄️',
        title: 'Climate Coolspot',
        desc: 'Evaporation from the moss generates active cooling, creating comfortable microclimates around the installation.',
    },
    {
        icon: '♻️',
        title: 'Regenerative Bio Filters',
        desc: 'Self-cleaning and sustainable. Our filters use rainwater segregation and solar panels for completely autonomous operation.',
    }
];

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#0a0f1e] text-white font-sans selection:bg-emerald-500/30">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-4 overflow-hidden min-h-[90vh] flex items-center">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Clean environment"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e]/90 via-[#0a0f1e]/80 to-[#0a0f1e]" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-semibold tracking-wide mb-8 border border-emerald-500/30">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        The World's First Regenerative Bio Filters
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-8 tracking-tight">
                        Tackling Air Pollution with <br className="hidden sm:block" />
                        <span className="text-emerald-600">Nature & Technology</span>
                    </h1>

                    <p className="text-lg sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
                        We create green urban places by using living moss as a natural fine dust filter, combined with intelligent IoT hardware to monitor and clean the air.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center mt-10">
                        <Link
                            to="/hardware"
                            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-bold rounded-full transition-all duration-300 shadow-xl shadow-emerald-500/30 hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            <span>Test Hardware Components</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </Link>
                        <Link
                            to="/dashboard"
                            className="px-8 py-4 bg-transparent hover:bg-slate-800 border-2 border-slate-700 text-slate-300 hover:text-white text-lg font-bold rounded-full transition-all duration-300 hover:border-slate-600 flex items-center justify-center"
                        >
                            View Live Dashboard
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works Layer */}
            <section className="py-24 px-4 bg-[#0d1528] border-y border-slate-800">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-sm font-bold tracking-widest text-emerald-500 uppercase mb-4">Our Clean Air Concept</h2>
                        <h3 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">A Modular Eco System</h3>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            The Smart Eco Tree is more than just a filter. It's a complete microclimate regulator engineered for urban spaces.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="bg-[#111827] p-8 rounded-3xl shadow-xl shadow-black/20 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 group cursor-default">
                                <div className="text-4xl mb-6 bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">{f.icon}</div>
                                <h4 className="text-xl font-bold text-white mb-4">{f.title}</h4>
                                <p className="text-slate-400 leading-relaxed font-light">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interactive Demo CTA */}
            <section className="py-32 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-950">
                    <img
                        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Forest"
                        className="w-full h-full object-cover mix-blend-overlay opacity-40"
                    />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-4xl sm:text-5xl font-extrabold mb-8 drop-shadow-lg">Experience the Technology</h2>
                    <p className="text-xl text-emerald-100 mb-12 font-light max-w-2xl mx-auto">
                        Explore our internal component diagram and test the real-time API integrations that power the world's most advanced natural air filtration system.
                    </p>
                    <Link
                        to="/hardware"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-white text-emerald-900 hover:bg-emerald-50 text-xl font-bold rounded-full transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 hover:scale-105"
                    >
                        Try the Interactive Demo
                    </Link>
                </div>
            </section>
        </div>
    );
}
