import { useState, useRef, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import api from '../lib/api';

const STATUS_CONFIG = {
    'Good': { color: '#10b981', label: 'Good', emoji: '🟢', tip: 'Air quality is excellent. Safe for everyone including sensitive groups.' },
    'Moderate': { color: '#f59e0b', label: 'Moderate', emoji: '🟡', tip: 'Air quality is acceptable. Unusually sensitive people should limit prolonged outdoor activity.' },
    'Unhealthy for Sensitive Groups': { color: '#f97316', label: 'Sensitive', emoji: '🟠', tip: 'Sensitive groups (asthma, elderly, children) should limit outdoor exertion. Wear a mask.' },
    'Unhealthy': { color: '#ef4444', label: 'Unhealthy', emoji: '🔴', tip: 'Everyone should limit prolonged outdoor exertion. Wear N95/KN95 mask if going outside.' },
    'Very Unhealthy': { color: '#8b5cf6', label: 'Very Unhealthy', emoji: '🟣', tip: 'Avoid outdoor activity. Keep windows closed. Use air purifier indoors.' },
    'Hazardous': { color: '#be123c', label: 'Hazardous', emoji: '☣️', tip: 'Health emergency. Stay indoors. Seal windows and doors. Follow emergency guidelines.' },
};

function aqiColor(aqi) {
    if (aqi <= 50) return '#10b981';
    if (aqi <= 100) return '#f59e0b';
    if (aqi <= 150) return '#f97316';
    if (aqi <= 200) return '#ef4444';
    if (aqi <= 300) return '#8b5cf6';
    return '#be123c';
}

// Animated gauge arc
function AQIGauge({ aqi }) {
    const max = 500;
    const pct = Math.min(aqi / max, 1);
    const angle = pct * 180;
    const r = 80;
    const cx = 100, cy = 100;
    const startX = cx - r, startY = cy;
    const rad = (angle - 180) * (Math.PI / 180);
    const endX = cx + r * Math.cos(rad);
    const endY = cy + r * Math.sin(rad);
    const largeArc = angle > 180 ? 1 : 0;
    const color = aqiColor(aqi);

    return (
        <svg viewBox="0 0 200 110" className="w-full max-w-xs mx-auto">
            {/* Background arc */}
            <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                stroke="#1f2937" strokeWidth="16" fill="none" strokeLinecap="round" />
            {/* Value arc */}
            {aqi > 0 && (
                <path d={`M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`}
                    stroke={color} strokeWidth="16" fill="none" strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 6px ${color}80)` }} />
            )}
            {/* AQI number */}
            <text x={cx} y={cy - 10} textAnchor="middle" fill={color}
                fontSize="32" fontWeight="800" fontFamily="Inter, sans-serif">{aqi}</text>
            <text x={cx} y={cy + 12} textAnchor="middle" fill="#6b7280"
                fontSize="11" fontFamily="Inter, sans-serif">AQI</text>
            {/* Scale labels */}
            <text x="18" y={cy + 4} fill="#374151" fontSize="9" fontFamily="Inter, sans-serif">0</text>
            <text x="168" y={cy + 4} fill="#374151" fontSize="9" fontFamily="Inter, sans-serif">500</text>
        </svg>
    );
}

export default function Analyze() {
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [dragging, setDragging] = useState(false);
    const fileRef = useRef();

    useEffect(() => {
        api.get('/measure/history').then(r => setHistory(r.data)).catch(() => { });
    }, []);

    const handleFile = useCallback((f) => {
        if (!f || !f.type.startsWith('image/')) return;
        setFile(f);
        setResult(null);
        setError('');
        const reader = new FileReader();
        reader.onload = e => setPreview(e.target.result);
        reader.readAsDataURL(f);
    }, []);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const form = new FormData();
            form.append('image', file);
            const res = await api.post('/measure/analyze', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(res.data);
            setHistory(prev => [res.data, ...prev].slice(0, 50));
        } catch (err) {
            setError(err.response?.data?.error || 'Analysis failed. Make sure the ML service is running on port 8000.');
        } finally {
            setLoading(false);
        }
    };

    const cfg = result ? (STATUS_CONFIG[result.status] || STATUS_CONFIG['Moderate']) : null;

    return (
        <Layout>
            <div className="min-h-screen bg-[#0a0f1e]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Page Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm mb-4">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            Powered by Best.pt YOLO Model
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                            PM Concentration Analyzer
                        </h1>
                        <p className="text-slate-400 text-base max-w-xl mx-auto">
                            Upload your OpenCV-processed image. The AI model instantly reads
                            <span className="text-emerald-400 font-semibold"> PM2.5</span> &amp;
                            <span className="text-cyan-400 font-semibold"> PM10</span> concentration levels.
                        </p>
                    </div>

                    {/* Main content */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                        {/* ── Upload Panel (left / 2 cols) ── */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Dropzone */}
                            <div
                                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileRef.current?.click()}
                                className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden group
                  ${dragging
                                        ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
                                        : 'border-slate-700 hover:border-emerald-500/70 hover:bg-slate-800/30'
                                    }`}
                                style={{ minHeight: 260 }}
                            >
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={e => handleFile(e.target.files[0])}
                                />
                                {preview ? (
                                    <div className="relative">
                                        <img src={preview} alt="OpenCV image" className="w-full object-cover rounded-xl" style={{ maxHeight: 300 }} />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                            <p className="text-white text-sm font-medium">Click to change image</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full py-14 gap-4 px-6">
                                        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                                            🖼️
                                        </div>
                                        <div className="text-center">
                                            <p className="text-white font-semibold text-base">Drop OpenCV Image Here</p>
                                            <p className="text-slate-500 text-sm mt-1">or click to browse</p>
                                            <p className="text-slate-600 text-xs mt-2">JPG · PNG · BMP · WebP</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Filename row */}
                            {file && (
                                <div className="flex items-center justify-between bg-[#111827] border border-slate-800 rounded-xl px-4 py-2.5">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-emerald-400 text-sm">📄</span>
                                        <span className="text-slate-300 text-sm truncate">{file.name}</span>
                                    </div>
                                    <span className="text-slate-600 text-xs ml-2 flex-shrink-0">{(file.size / 1024).toFixed(1)} KB</span>
                                </div>
                            )}

                            {/* Analyze button */}
                            <button
                                onClick={handleAnalyze}
                                disabled={!file || loading}
                                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/30 text-base flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Analyzing with Best.pt...
                                    </>
                                ) : (
                                    <>
                                        <span className="text-lg">🔬</span>
                                        Analyze Image
                                    </>
                                )}
                            </button>

                            {/* Error */}
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm leading-relaxed">
                                    ⚠️ {error}
                                </div>
                            )}
                        </div>

                        {/* ── Results Panel (right / 3 cols) ── */}
                        <div className="lg:col-span-3">
                            {!result ? (
                                <div className="h-full bg-[#111827] border border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-5 p-10 text-center min-h-64">
                                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-4xl">📊</div>
                                    <div>
                                        <p className="text-white font-semibold text-lg mb-1">Awaiting Image</p>
                                        <p className="text-slate-500 text-sm max-w-xs">
                                            Upload your OpenCV-processed image and click <strong className="text-slate-300">Analyze Image</strong> to see PM2.5 &amp; PM10 levels.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Simulated warning */}
                                    {result.simulated && (
                                        <div className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-400 text-sm">
                                            ⚠️ <span>Simulated result — place <code className="bg-black/30 px-1 rounded">Best.pt</code> in <code className="bg-black/30 px-1 rounded">MLService/</code> for real readings</span>
                                        </div>
                                    )}

                                    {/* Gauge + AQI */}
                                    <div
                                        className="rounded-2xl p-6 border"
                                        style={{ borderColor: cfg.color + '40', background: cfg.color + '08' }}
                                    >
                                        <AQIGauge aqi={result.aqi} />
                                        <div className="text-center mt-1">
                                            <span className="text-lg font-bold" style={{ color: cfg.color }}>
                                                {cfg.emoji} {cfg.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* PM2.5 / PM10 Big numbers */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#111827] border border-emerald-500/20 rounded-2xl p-5 text-center">
                                            <div className="text-slate-400 text-xs uppercase tracking-widest mb-2">PM2.5</div>
                                            <div className="text-5xl font-extrabold text-emerald-400">{result.pm25}</div>
                                            <div className="text-slate-500 text-sm mt-1">µg/m³</div>
                                            {result.pm25 > 35.4 && (
                                                <div className="mt-2 text-xs text-red-400">⚠️ Above WHO guideline</div>
                                            )}
                                        </div>
                                        <div className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-5 text-center">
                                            <div className="text-slate-400 text-xs uppercase tracking-widest mb-2">PM10</div>
                                            <div className="text-5xl font-extrabold text-cyan-400">{result.pm10}</div>
                                            <div className="text-slate-500 text-sm mt-1">µg/m³</div>
                                            {result.pm10 > 50 && (
                                                <div className="mt-2 text-xs text-red-400">⚠️ Above WHO guideline</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Health tip */}
                                    <div
                                        className="rounded-xl px-4 py-3 text-sm border"
                                        style={{ background: cfg.color + '0d', borderColor: cfg.color + '30', color: '#cbd5e1' }}
                                    >
                                        <span className="font-semibold" style={{ color: cfg.color }}>Health Advisory: </span>
                                        {cfg.tip}
                                    </div>

                                    {/* Meta row */}
                                    <div className="flex items-center justify-between text-xs text-slate-600 px-1">
                                        <span>Confidence: {(result.confidence * 100).toFixed(1)}%</span>
                                        <span>{result.detections} detection{result.detections !== 1 ? 's' : ''}</span>
                                        <span>{file?.name}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── History Table ── */}
                    {history.length > 0 && (
                        <div className="mt-12">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-white font-semibold text-lg">Past Measurements</h2>
                                <span className="text-slate-500 text-sm">{history.length} readings saved</span>
                            </div>
                            <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-800 bg-[#0d1528]">
                                                <th className="px-5 py-3 text-left text-slate-500 font-medium">#</th>
                                                <th className="px-5 py-3 text-right text-emerald-400 font-medium">PM2.5 (µg/m³)</th>
                                                <th className="px-5 py-3 text-right text-cyan-400 font-medium">PM10 (µg/m³)</th>
                                                <th className="px-5 py-3 text-right text-slate-400 font-medium">AQI</th>
                                                <th className="px-5 py-3 text-left text-slate-400 font-medium">Status</th>
                                                <th className="px-5 py-3 text-left text-slate-400 font-medium">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.map((m, i) => {
                                                const c = STATUS_CONFIG[m.status] || STATUS_CONFIG['Moderate'];
                                                return (
                                                    <tr key={m._id || i} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                                                        <td className="px-5 py-3 text-slate-600">{i + 1}</td>
                                                        <td className="px-5 py-3 text-right font-bold text-emerald-400">{m.pm25}</td>
                                                        <td className="px-5 py-3 text-right font-bold text-cyan-400">{m.pm10}</td>
                                                        <td className="px-5 py-3 text-right font-semibold" style={{ color: c.color }}>{m.aqi}</td>
                                                        <td className="px-5 py-3 text-xs font-medium" style={{ color: c.color }}>{c.emoji} {m.status}</td>
                                                        <td className="px-5 py-3 text-slate-500 text-xs">
                                                            {m.createdAt ? new Date(m.createdAt).toLocaleString() : 'Just now'}
                                                            {m.simulated && <span className="ml-1.5 text-yellow-600/70">(sim)</span>}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
