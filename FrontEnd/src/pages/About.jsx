import Layout from '../components/Layout';

const TEAM = [
    { name: 'Mohamed', role: 'Project Lead & Backend', emoji: '👨‍💻' },
    { name: 'Zenab', role: 'AI/ML & Data Analysis', emoji: '🤖' },
    { name: 'Team Member 3', role: 'Frontend Development', emoji: '🎨' },
    { name: 'Team Member 4', role: 'Hardware & Sensors', emoji: '🔧' },
];

const IMPACT = [
    { icon: '🌱', title: 'Reduced Carbon Footprint', desc: 'Real-time monitoring enables targeted intervention, reducing unnecessary energy use.' },
    { icon: '💧', title: 'Cleaner Air for Communities', desc: 'Early warnings help vulnerable populations avoid harmful pollution exposure.' },
    { icon: '🌍', title: 'Supports UN SDG 11', desc: 'Contributes to Sustainable Cities by providing actionable environmental data.' },
    { icon: '🔋', title: 'Energy Efficient Design', desc: 'Low-power IoT sensors minimize environmental impact of the monitoring network.' },
];

export default function About() {
    return (
        <Layout>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Hero */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-4">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        Project ZENAB
                    </div>
                    <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
                        About <span className="text-emerald-400">ZENAB</span>
                    </h1>
                    <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
                        An AI-powered air quality monitoring and purification system designed to create cleaner,
                        healthier environments using smart IoT sensors and machine learning.
                    </p>
                </div>

                {/* Problem Statement */}
                <div className="mb-8 bg-[#111827] border border-slate-800 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-xl">
                            🌫️
                        </div>
                        <h2 className="text-xl font-bold text-white">Problem Statement</h2>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-sm">
                        Air pollution is one of the world's greatest environmental health risks, causing over
                        <span className="text-red-400 font-semibold"> 7 million premature deaths</span> annually according to the WHO.
                        Indoor and outdoor particulate matter (PM2.5 & PM10), along with toxic gases like NO₂ and CO₂,
                        silently deteriorate public health — yet most people have no real-time visibility into the air they breathe.
                        Traditional monitoring stations are expensive, sparse, and provide data that is often delayed or inaccessible to ordinary citizens.
                    </p>
                </div>

                {/* Solution */}
                <div className="mb-8 bg-[#111827] border border-emerald-500/20 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl">
                            💡
                        </div>
                        <h2 className="text-xl font-bold text-white">Our Solution</h2>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-sm mb-6">
                        ZENAB is a smart, affordable, and AI-enhanced air quality monitoring system that combines
                        <span className="text-emerald-400 font-semibold"> IoT sensor hardware</span>,
                        <span className="text-cyan-400 font-semibold"> computer vision (YOLO)</span>, and a
                        <span className="text-purple-400 font-semibold"> real-time web dashboard</span> to:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { icon: '📡', title: 'Monitor', desc: 'Continuously track PM2.5, PM10, CO₂, temperature, and humidity via low-cost sensors.' },
                            { icon: '🤖', title: 'Predict', desc: 'Use AI models to forecast pollution levels and identify health risk patterns before they worsen.' },
                            { icon: '🌿', title: 'Purify', desc: 'Automatically activate air purification when thresholds are exceeded, responding in real time.' },
                        ].map((item) => (
                            <div key={item.title} className="bg-[#0d1528] border border-slate-800 rounded-xl p-5">
                                <div className="text-3xl mb-3">{item.icon}</div>
                                <div className="text-white font-semibold mb-2">{item.title}</div>
                                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sustainability Impact */}
                <div className="mb-8 bg-[#111827] border border-slate-800 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-xl">
                            ♻️
                        </div>
                        <h2 className="text-xl font-bold text-white">Sustainability Impact</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {IMPACT.map((item) => (
                            <div key={item.title} className="flex gap-4 bg-[#0d1528] border border-slate-800 rounded-xl p-5">
                                <div className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</div>
                                <div>
                                    <div className="text-white font-semibold text-sm mb-1">{item.title}</div>
                                    <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                        <p className="text-emerald-300 text-xs text-center leading-relaxed">
                            🌱 ZENAB aligns with <strong>UN Sustainable Development Goal 3</strong> (Good Health & Well-Being)
                            and <strong>SDG 11</strong> (Sustainable Cities & Communities)
                        </p>
                    </div>
                </div>

                {/* Team */}
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl">
                            👥
                        </div>
                        <h2 className="text-xl font-bold text-white">Team Members</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {TEAM.map((member) => (
                            <div key={member.name} className="bg-[#0d1528] border border-slate-800 hover:border-emerald-500/30 transition-colors rounded-xl p-5 text-center">
                                <div className="text-4xl mb-3">{member.emoji}</div>
                                <div className="text-white font-semibold text-sm mb-1">{member.name}</div>
                                <div className="text-slate-500 text-xs leading-relaxed">{member.role}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </Layout>
    );
}
