import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import AQICard from '../components/AQICard';
import SmartAlert from '../components/SmartAlert';
import api from '../lib/api';

const quickLinks = [
    { to: '/map', label: 'Interactive Map', icon: '🗺️', desc: 'View AQI heatmap' },
    { to: '/ai-insights', label: 'AI Prediction', icon: '🤖', desc: 'Predictive analytics' },
    { to: '/analyze', label: 'Analyzer', icon: '🔬', desc: 'Analyze PM levels' },
    { to: '/system-control', label: 'System Control', icon: '⚡', desc: 'Manage ZENAB device' },
];

// Power BI SVG Icon
function PowerBIIcon({ className = 'w-6 h-6' }) {
    return (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="14" width="6" height="16" rx="1.5" fill="#F2C811" />
            <rect x="11" y="8" width="6" height="22" rx="1.5" fill="#F2C811" opacity="0.85" />
            <rect x="20" y="2" width="6" height="28" rx="1.5" fill="#F2C811" opacity="0.65" />
        </svg>
    );
}

export default function Dashboard() {
    const [stations, setStations] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- Live Simulation State ---
    const [liveAqi, setLiveAqi] = useState(42);
    const [liveTemp, setLiveTemp] = useState(24.5);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveAqi(prev => {
                const change = (Math.random() - 0.5) * 4;
                return Math.max(10, Math.min(450, Math.round(prev + change)));
            });
            setLiveTemp(prev => {
                const change = (Math.random() - 0.5) * 0.4;
                return parseFloat((prev + change).toFixed(1));
            });
            setLastUpdated(new Date());
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const statusInfo = useMemo(() => {
        if (liveAqi <= 50) return { label: 'Safe', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
        if (liveAqi <= 100) return { label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
        if (liveAqi <= 150) return { label: 'Warning', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
        return { label: 'Dangerous', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
    }, [liveAqi]);
    // ----------------------------

    // Power BI Integration state
    const [showPowerBI, setShowPowerBI] = useState(false);
    const [powerBIUrl, setPowerBIUrl] = useState('');
    const [powerBIEmbedUrl, setPowerBIEmbedUrl] = useState('');
    const [pbiStatus, setPbiStatus] = useState(null);   // null | { configured: bool }
    const [pbiTesting, setPbiTesting] = useState(false);
    const [pbiTestResult, setPbiTestResult] = useState(null); // null | { ok: bool, msg: string }

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

    // Check Power BI API configuration status from the backend
    useEffect(() => {
        fetch('/api/powerbi/status')
            .then((r) => r.json())
            .then((d) => setPbiStatus(d))
            .catch(() => setPbiStatus({ configured: false, error: true }));
    }, []);

    const handlePbiTestPush = async () => {
        setPbiTesting(true);
        setPbiTestResult(null);
        try {
            const res = await api.post('/powerbi/push', {});
            const json = res.data;
            setPbiTestResult({ ok: true, msg: '✅ Test row pushed to Power BI successfully!' });
        } catch (e) {
            setPbiTestResult({ ok: false, msg: '❌ ' + (e.response?.data?.error || e.message) });
        } finally {
            setPbiTesting(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">ZENAB Monitoring</h1>
                        <p className="text-slate-400 text-sm mt-1">AI-Powered Environmental Control Dashboard</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            System Active
                        </div>
                        <Link
                            to="/system-control"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg text-sm hover:bg-slate-700 transition-colors"
                        >
                            <span>⚡</span> Control
                        </Link>
                    </div>
                </div>

                {/* Smart Alert Banner */}
                <SmartAlert aqi={liveAqi} />

                {/* HERO CARD - Live Metrics */}
                <div className="mb-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900/40 via-[#0d1528] to-[#0a0f1e] border border-emerald-500/20 p-8 relative group">
                        {/* Decorative background circle */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-emerald-500/10 transition-colors duration-500" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 py-4">
                            <div className="text-center md:text-left">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border ${statusInfo.border} ${statusInfo.bg} ${statusInfo.color}`}>
                                    {statusInfo.label} Status
                                </span>
                                <div className="flex items-baseline gap-3 mb-2 justify-center md:justify-start">
                                    <span className={`text-7xl font-black ${statusInfo.color}`}>
                                        {liveAqi}
                                    </span>
                                    <span className="text-slate-500 font-bold text-xl uppercase">AQI</span>
                                </div>
                                <p className="text-slate-400 text-sm max-w-xs mx-auto md:mx-0">
                                    Local air quality is {statusInfo.label.toLowerCase()}. {liveAqi > 150 ? 'Please wear a mask outdoors.' : 'Safe for all outdoor activities.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm min-w-[140px]">
                                    <div className="text-cyan-400 text-2xl mb-1">🌡️</div>
                                    <div className="text-2xl font-bold text-white">{liveTemp}°C</div>
                                    <div className="text-slate-500 text-xs font-medium uppercase mt-1">Temperature</div>
                                </div>
                                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm min-w-[140px]">
                                    <div className="text-purple-400 text-2xl mb-1">⏱️</div>
                                    <div className="text-lg font-bold text-white">{lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                                    <div className="text-slate-500 text-xs font-medium uppercase mt-1">Last Updated</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 grid grid-cols-1 gap-4">
                        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-2xl">📡</div>
                                <div>
                                    <div className="text-white font-bold">Tree Node 01</div>
                                    <div className="text-slate-500 text-xs mt-1">Location: Bangalore</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-emerald-400 text-xs font-bold flex items-center gap-1 justify-end">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                    Online
                                </div>
                                <div className="text-slate-600 text-[10px] mt-1 font-mono">ID: ZEN-001</div>
                            </div>
                        </div>

                        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <div className="text-slate-400 text-sm font-semibold">Weekly Health Risk</div>
                                <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-black border border-yellow-500/20 uppercase">Moderate</span>
                            </div>
                            <div className="mt-4 flex items-end gap-1 h-12">
                                {[35, 42, 38, 55, 62, 48, 42].map((v, i) => (
                                    <div key={i} className="flex-1 bg-slate-800 rounded-sm hover:bg-emerald-500/40 transition-colors group relative" style={{ height: `${(v / 80) * 100}%` }}>
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{v} AQI</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
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
                            { label: 'Hazardous Areas', val: summary.hazardous, color: 'text-rose-400', icon: '⚠️' },
                            { label: 'Safe Zones', val: summary.safe, color: 'text-emerald-400', icon: '✅' },
                            { label: 'Average AQI', val: summary.avgAqi, color: 'text-yellow-400', icon: '📈' },
                        ].map(({ label, val, color, icon }) => (
                            <div key={label} className="bg-[#111827] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                                <div className="text-2xl mb-2">{icon}</div>
                                <div className={`text-3xl font-black ${color}`}>{val}</div>
                                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">{label}</div>
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
                            className="bg-[#111827] border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 transition-all hover:bg-[#1a2235] group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">{q.icon}</div>
                            <div className="text-white font-bold text-sm group-hover:text-emerald-400 transition-colors">{q.label}</div>
                            <div className="text-slate-500 text-[11px] mt-1 leading-relaxed">{q.desc}</div>
                        </Link>
                    ))}
                </div>

                {/* Power BI Integration */}
                <div className="mb-8">
                    {/* Header card — always visible, clickable */}
                    <div
                        className={`bg-[#111827] border rounded-2xl p-5 transition-all cursor-pointer ${
                            pbiStatus?.configured
                                ? 'border-yellow-500/40 hover:border-yellow-400/60'
                                : 'border-slate-800 hover:border-yellow-500/30'
                        }`}
                        onClick={() => setShowPowerBI((v) => !v)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                                    pbiStatus?.configured
                                        ? 'bg-yellow-500/15 border-yellow-500/30'
                                        : 'bg-yellow-500/10 border-yellow-500/20'
                                }`}>
                                    <PowerBIIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-white font-semibold text-sm">Power BI Integration</div>
                                    <div className="text-slate-500 text-xs mt-0.5">
                                        {pbiStatus === null
                                            ? 'Checking API connection...'
                                            : pbiStatus.configured
                                                ? '🟢 Backend is pushing data to Power BI after every analysis'
                                                : '⚠️ Push URL not configured — set POWERBI_PUSH_URL in Backend/.env'}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* API Status badge */}
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-widest ${
                                    pbiStatus === null
                                        ? 'bg-slate-800 text-slate-500 border-slate-700'
                                        : pbiStatus.configured
                                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            : 'bg-slate-800 text-slate-500 border-slate-700'
                                }`}>
                                    {pbiStatus === null ? '…' : pbiStatus.configured ? 'API Connected' : 'Not configured'}
                                </span>
                                {/* Embed badge */}
                                {powerBIEmbedUrl && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase tracking-widest">
                                        Report Embedded
                                    </span>
                                )}
                                <svg
                                    className={`w-4 h-4 text-slate-400 transition-transform ${showPowerBI ? 'rotate-180' : ''}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {showPowerBI && (
                        <div className="mt-2 bg-[#0d1528] border border-slate-800 rounded-xl p-5 space-y-5">

                            {/* ── API Connection Section ── */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-white text-sm font-semibold flex items-center gap-2">
                                        <PowerBIIcon className="w-4 h-4" />
                                        Streaming Dataset API
                                    </h3>
                                    <button
                                        onClick={handlePbiTestPush}
                                        disabled={pbiTesting || !pbiStatus?.configured}
                                        title={!pbiStatus?.configured ? 'Configure POWERBI_PUSH_URL first' : 'Send a test row to Power BI'}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-medium transition-colors"
                                    >
                                        {pbiTesting ? (
                                            <><span className="w-3 h-3 border border-yellow-400/40 border-t-yellow-400 rounded-full animate-spin" /> Sending…</>
                                        ) : (
                                            <><span>⚡</span> Test Push</>
                                        )}
                                    </button>
                                </div>

                                {/* Test result */}
                                {pbiTestResult && (
                                    <div className={`p-3 rounded-lg text-xs font-medium mb-3 ${
                                        pbiTestResult.ok
                                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                            : 'bg-red-500/10 border border-red-500/20 text-red-400'
                                    }`}>
                                        {pbiTestResult.msg}
                                    </div>
                                )}

                                {/* Data schema preview */}
                                <div className="bg-[#111827] rounded-lg p-3 border border-slate-800">
                                    <div className="text-slate-500 text-xs mb-2 font-medium">Each analysis push contains:</div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                        {['timestamp', 'pm25', 'pm10', 'aqi', 'status', 'confidence'].map((field) => (
                                            <code key={field} className="text-xs bg-slate-800 text-yellow-300/80 px-2 py-0.5 rounded font-mono">
                                                {field}
                                            </code>
                                        ))}
                                    </div>
                                </div>

                                {/* Setup guide — shown when not configured */}
                                {!pbiStatus?.configured && (
                                    <div className="mt-3 bg-[#111827] border border-yellow-500/10 rounded-lg p-4">
                                        <div className="text-yellow-400 text-xs font-semibold mb-3">📋 One-time setup (~2 min)</div>
                                        <ol className="space-y-2">
                                            {[
                                                <span>Go to <a href="https://app.powerbi.com" target="_blank" rel="noopener noreferrer" className="text-yellow-400 underline hover:text-yellow-300">app.powerbi.com</a> → your workspace → <strong>+ New → Streaming dataset</strong></span>,
                                                <span>Select <strong>API</strong> as the source</span>,
                                                <span>Add fields: <code className="bg-slate-800 px-1 rounded font-mono text-yellow-300/80">timestamp</code> (DateTime), <code className="bg-slate-800 px-1 rounded font-mono text-yellow-300/80">pm25</code>, <code className="bg-slate-800 px-1 rounded font-mono text-yellow-300/80">pm10</code>, <code className="bg-slate-800 px-1 rounded font-mono text-yellow-300/80">aqi</code> (Number), <code className="bg-slate-800 px-1 rounded font-mono text-yellow-300/80">status</code> (Text)</span>,
                                                <span>Copy the <strong>Push URL</strong> that Power BI gives you</span>,
                                                <span>Paste it in <code className="bg-slate-800 px-1 rounded font-mono text-yellow-300/80">Backend/.env</code> as <code className="bg-slate-800 px-1 rounded font-mono text-yellow-300/80">POWERBI_PUSH_URL=&lt;url&gt;</code></span>,
                                                <span>Restart the backend — every analysis will auto-push to Power BI</span>,
                                            ].map((step, i) => (
                                                <li key={i} className="flex gap-2.5 text-slate-400 text-xs">
                                                    <span className="w-5 h-5 shrink-0 bg-yellow-500/15 text-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                                                    <span className="leading-relaxed">{step}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="border-t border-slate-800" />

                            {/* ── Embed Report Section ── */}
                            <div>
                                <h3 className="text-white text-sm font-semibold mb-3">📺 Embed Report in Dashboard</h3>
                                <label className="block text-slate-400 text-xs font-medium mb-1.5">Power BI Embed URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        value={powerBIUrl}
                                        onChange={(e) => setPowerBIUrl(e.target.value)}
                                        placeholder="https://app.powerbi.com/reportEmbed?reportId=..."
                                        className="flex-1 bg-[#111827] border border-slate-700 focus:border-yellow-500/60 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 outline-none transition-colors text-sm"
                                    />
                                    <button
                                        onClick={() => setPowerBIEmbedUrl(powerBIUrl)}
                                        disabled={!powerBIUrl.trim()}
                                        className="px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold rounded-lg text-sm transition-colors"
                                    >
                                        Embed
                                    </button>
                                    {powerBIEmbedUrl && (
                                        <button
                                            onClick={() => { setPowerBIEmbedUrl(''); setPowerBIUrl(''); }}
                                            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-sm transition-colors"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                                <p className="text-slate-600 text-xs mt-1.5">
                                    Power BI → your report → File → Embed report → Website or portal → copy the embed URL.
                                </p>

                                {/* Quick links */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <a href="https://app.powerbi.com" target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 rounded-lg text-xs font-medium transition-colors">
                                        <PowerBIIcon className="w-3.5 h-3.5" /> Open Power BI
                                    </a>
                                    <a href="https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-embed-secure" target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg text-xs font-medium transition-colors">
                                        📖 Embed Guide
                                    </a>
                                    <a href="https://learn.microsoft.com/en-us/power-bi/developer/embedded/" target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg text-xs font-medium transition-colors">
                                        🔌 Developer API
                                    </a>
                                </div>

                                {/* Embedded iframe */}
                                {powerBIEmbedUrl && (
                                    <div className="mt-4 rounded-xl overflow-hidden border border-yellow-500/20">
                                        <div className="bg-[#111827] px-4 py-2 flex items-center gap-2 border-b border-slate-800">
                                            <PowerBIIcon className="w-4 h-4" />
                                            <span className="text-slate-400 text-xs font-medium">Power BI Report</span>
                                            <span className="ml-auto text-slate-600 text-xs truncate max-w-[200px]">{powerBIEmbedUrl}</span>
                                        </div>
                                        <iframe
                                            title="Power BI Report"
                                            src={powerBIEmbedUrl}
                                            className="w-full"
                                            style={{ height: '600px', border: 'none' }}
                                            allowFullScreen
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
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
