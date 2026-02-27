import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import AQICard from '../components/AQICard';
import api from '../lib/api';

const quickLinks = [
    { to: '/map', label: 'Interactive Map', icon: '🗺️', desc: 'View AQI heatmap across India' },
    { to: '/health', label: 'Health Assessment', icon: '❤️', desc: 'Get personalized health advice' },
    { to: '/reports', label: 'Generate Report', icon: '📊', desc: 'Download & view AQI reports' },
    { to: '/ai-insights', label: 'AI Insights', icon: '🤖', desc: 'AI-powered pollution analysis' },
];

export default function Dashboard() {
    const [stations, setStations] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [stationsRes, summaryRes] = await Promise.all([
                    api.get('/stations'),
                    api.get('/aqi/summary'),
                ]);
                setStations(stationsRes.data);
                setSummary(summaryRes.data);
            } catch {
                setError('Unable to connect to server. Make sure the backend is running on port 5000.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Environmental Dashboard</h1>
                        <p className="text-slate-400 text-sm mt-1">Real-time air quality monitoring across India</p>
                    </div>
                    <Link
                        to="/map"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/20 transition-colors"
                    >
                        <span>🗺️</span> View Map
                    </Link>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                        ⚠️ {error}
                    </div>
                )}

                {/* Stats Bar */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-[#111827] border border-slate-800 rounded-xl p-5 animate-pulse h-24" />
                        ))}
                    </div>
                ) : summary && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Total Stations', val: summary.total, color: 'text-cyan-400', icon: '📡' },
                            { label: 'Hazardous Areas', val: summary.hazardous, color: 'text-red-400', icon: '⚠️' },
                            { label: 'Safe Zones', val: summary.safe, color: 'text-emerald-400', icon: '✅' },
                            { label: 'Average AQI', val: summary.avgAqi, color: 'text-yellow-400', icon: '📈' },
                        ].map(({ label, val, color, icon }) => (
                            <div key={label} className="bg-[#111827] border border-slate-800 rounded-xl p-5">
                                <div className="text-2xl mb-2">{icon}</div>
                                <div className={`text-3xl font-bold ${color}`}>{val}</div>
                                <div className="text-slate-500 text-sm mt-1">{label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick Links */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {quickLinks.map((q) => (
                        <Link
                            key={q.to}
                            to={q.to}
                            className="bg-[#111827] border border-slate-800 hover:border-emerald-500/40 rounded-xl p-4 transition-all hover:bg-[#1a2235] group"
                        >
                            <div className="text-2xl mb-2">{q.icon}</div>
                            <div className="text-white font-medium text-sm group-hover:text-emerald-400 transition-colors">{q.label}</div>
                            <div className="text-slate-500 text-xs mt-1">{q.desc}</div>
                        </Link>
                    ))}
                </div>

                {/* Live AQI Grid */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-semibold text-lg">Live Air Quality Data</h2>
                    <div className="flex items-center gap-1.5 text-emerald-400 text-sm">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        Live
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-[#111827] border border-slate-800 rounded-xl p-4 animate-pulse h-48" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {stations.map((station) => (
                            <AQICard key={station._id} station={station} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
