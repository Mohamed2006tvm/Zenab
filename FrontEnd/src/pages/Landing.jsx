import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/api';

const features = [
    {
        icon: '🌿',
        title: 'Natural Fine Dust Filter',
        desc: 'Precisely calibrated moss cultures with enormous surface areas bind and metabolize particulate matter naturally.',
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
    },
];

function AnimatedStat({ value, label, color }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        const target = Number(value) || 0;
        if (target === 0) return;
        let start = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setDisplay(target); clearInterval(timer); }
            else setDisplay(start);
        }, 30);
        return () => clearInterval(timer);
    }, [value]);
    return (
        <div className="text-center">
            <div className={`text-4xl sm:text-5xl font-extrabold ${color} tabular-nums`}>{display}</div>
            <div className="text-slate-400 text-sm mt-1">{label}</div>
        </div>
    );
}

export default function Landing() {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        api.get('/aqi/summary').then(r => setSummary(r.data)).catch(() => { });
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0f1e] text-white font-sans selection:bg-emerald-500/30 flex flex-col">
            <Navbar />

            {/* ── Hero Section ── */}
            <section className="relative pt-32 pb-24 px-4 overflow-hidden min-h-[92vh] flex items-center">
                {/* Background image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Clean environment"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e]/80 via-[#0a0f1e]/70 to-[#0a0f1e]" />
                </div>

                {/* Animated background orbs */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
                    <div className="absolute top-1/2 -right-32 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
                    <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-emerald-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center w-full">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-semibold tracking-wide mb-8 border border-emerald-500/30">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        The World's First Regenerative Bio Filters
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-8 tracking-tight">
                        Tackling Air Pollution with{' '}
                        <br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            Nature &amp; Technology
                        </span>
                    </h1>

                    <p className="text-lg sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
                        We create green urban places by using living moss as a natural fine dust filter, combined with intelligent IoT hardware to monitor and clean the air.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <Link
                            to="/hardware"
                            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-bold rounded-full transition-all duration-300 shadow-xl shadow-emerald-500/30 hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            <span>Test Hardware Components</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                        <Link
                            to="/dashboard"
                            className="px-8 py-4 bg-transparent hover:bg-slate-800 border-2 border-slate-700 text-slate-300 hover:text-white text-lg font-bold rounded-full transition-all duration-300 hover:border-slate-600 flex items-center justify-center"
                        >
                            View Live Dashboard
                        </Link>
                    </div>

                    {/* Live stats row */}
                    {summary && (
                        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
                            <AnimatedStat value={summary.total} label="Stations Online" color="text-cyan-400" />
                            <AnimatedStat value={summary.safe} label="Safe Zones" color="text-emerald-400" />
                            <AnimatedStat value={summary.hazardous} label="Hazardous Areas" color="text-red-400" />
                            <AnimatedStat value={summary.avgAqi} label="Average AQI" color="text-yellow-400" />
                        </div>
                    )}
                </div>
            </section>

            {/* ── How It Works ── */}
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
                            <div
                                key={i}
                                className="bg-[#111827] p-8 rounded-3xl shadow-xl shadow-black/20 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 group cursor-default"
                            >
                                <div className="text-4xl mb-6 bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                                    {f.icon}
                                </div>
                                <h4 className="text-xl font-bold text-white mb-4">{f.title}</h4>
                                <p className="text-slate-400 leading-relaxed font-light">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Stats Section ── */}
            <section className="py-20 px-4 bg-[#0a0f1e]">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                        {[
                            { value: '400K', label: 'Leaves per m² on our moss walls', icon: '🌿' },
                            { value: '2.5s', label: 'Sensor response time for PM readings', icon: '⚡' },
                            { value: '99%', label: 'System uptime across all stations', icon: '📡' },
                        ].map((s) => (
                            <div key={s.value} className="bg-[#111827] border border-slate-800 rounded-2xl p-8 hover:border-emerald-500/30 transition-colors">
                                <div className="text-3xl mb-3">{s.icon}</div>
                                <div className="text-4xl font-extrabold text-white mb-2">{s.value}</div>
                                <div className="text-slate-400 text-sm leading-snug">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Section ── */}
            <section className="py-32 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-950">
                    <img
                        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Forest"
                        className="w-full h-full object-cover mix-blend-overlay opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent" />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-4xl sm:text-5xl font-extrabold mb-8 drop-shadow-lg">Experience the Technology</h2>
                    <p className="text-xl text-emerald-100 mb-12 font-light max-w-2xl mx-auto">
                        Explore our internal component diagram and test the real-time API integrations that power the world's most advanced natural air filtration system.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/hardware"
                            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-emerald-900 hover:bg-emerald-50 text-xl font-bold rounded-full transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 hover:scale-105"
                        >
                            Try the Interactive Demo
                        </Link>
                        <Link
                            to="/auth/signup"
                            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-emerald-900/60 border-2 border-emerald-500/50 text-white hover:bg-emerald-800/60 hover:border-emerald-400 text-xl font-bold rounded-full transition-all duration-300"
                        >
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
