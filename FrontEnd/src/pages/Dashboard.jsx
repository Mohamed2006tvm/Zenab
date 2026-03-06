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
            const res = await fetch('/api/powerbi/push', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
            const json = await res.json();
            if (res.ok) {
                setPbiTestResult({ ok: true, msg: '✅ Test row pushed to Power BI successfully!' });
            } else {
                setPbiTestResult({ ok: false, msg: '❌ ' + (json.error || 'Push failed') });
            }
        } catch (e) {
            setPbiTestResult({ ok: false, msg: '❌ Network error: ' + e.message });
        } finally {
            setPbiTesting(false);
        }
    };

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

                {/* Power BI Integration */}
                <div className="mb-8">
                    {/* Header card — always visible, clickable */}
                    <div
                        className={`bg-[#111827] border rounded-xl p-5 transition-all cursor-pointer ${
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
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
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
                                    <span className="text-xs px-2 py-0.5 rounded-full font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
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
