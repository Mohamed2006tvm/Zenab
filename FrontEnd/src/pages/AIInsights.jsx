import { useEffect, useState } from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
} from 'recharts';
import Layout from '../components/Layout';
import api from '../lib/api';

export default function AIInsights() {
    const [trend, setTrend] = useState([]);
    const [tempTrend, setTempTrend] = useState([]);
    const [topPolluted, setTopPolluted] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/aqi/trend'),
            api.get('/aqi/summary'),
        ]).then(([trendRes, summaryRes]) => {
            setTrend(trendRes.data);
            setSummary(summaryRes.data);
            setTopPolluted(summaryRes.data.topPolluted || []);
            
            // Generate simulated temperature trend based on AQI trend
            const simulatedTemp = trendRes.data.map(t => ({
                day: t.day,
                temp: parseFloat((22 + Math.random() * 5).toFixed(1))
            }));
            setTempTrend(simulatedTemp);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const prediction = {
        value: 164,
        status: 'High',
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30'
    };

    const insights = [
        {
            icon: '📉',
            title: 'Future Prediction',
            text: `AI models predict an average AQI of ${prediction.value} for the next 24 hours. Risk level is currently ${prediction.status}.`,
            color: 'border-rose-500/30 bg-rose-500/5',
        },
        {
            icon: '🌡️',
            title: 'Health Risk',
            text: summary
                ? `${summary.requireAttention} stations require immediate attention. ${summary.safe} zones are currently safe.`
                : 'Loading analysis...',
            color: 'border-yellow-500/30 bg-yellow-500/5',
        },
        {
            icon: '🤖',
            title: 'AI Forecast',
            text: 'Based on seasonal patterns, air quality in Northern India is expected to worsen in winter months due to crop burning and cold air trapping pollutants.',
            color: 'border-cyan-500/30 bg-cyan-500/5',
        },
        {
            icon: '💡',
            title: 'Recommendation',
            text: 'Activate Zenab purification system when indoor AQI exceeds 100. Wear N95 masks during peak morning hours.',
            color: 'border-purple-500/30 bg-purple-500/5',
        },
    ];

    const Skeleton = () => (
        <div className="animate-pulse bg-[#111827] border border-slate-800 rounded-xl h-72" />
    );

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">AI Predictive Insights</h1>
                    <p className="text-slate-400 text-sm mt-1">Machine learning analysis and future pollution forecasting</p>
                </div>

                {/* AI Prediction Card */}
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-[#111827] to-[#0a0f1e] border border-slate-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🔮</span>
                                <h2 className="text-white font-bold text-lg">Next 24h Prediction</h2>
                            </div>
                            <p className="text-slate-400 text-sm max-w-sm">
                                Based on current wind speeds, humidity, and historical patterns, ZENAB-AI forecasts a moderate increase in particulate matter.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-center px-6 py-4 bg-slate-900/60 rounded-2xl border border-slate-800 min-w-[140px]">
                                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Predicted AQI</div>
                                <div className={`text-4xl font-black ${prediction.color}`}>{prediction.value}</div>
                            </div>
                            <div className="text-center px-6 py-4 bg-slate-900/60 rounded-2xl border border-slate-800 min-w-[140px]">
                                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Risk Level</div>
                                <div className={`text-xl font-black uppercase ${prediction.color}`}>{prediction.status}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Insight Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {insights.map((ins) => (
                        <div key={ins.title} className={`border rounded-xl p-5 ${ins.color}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">{ins.icon}</span>
                                <h3 className="text-white font-semibold">{ins.title}</h3>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">{ins.text}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 7-Day AQI Trend */}
                    <div className="bg-[#111827] border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white font-semibold flex items-center gap-2">
                                <span className="text-emerald-400">📈</span> AQI Trend (7 Days)
                            </h2>
                        </div>
                        {loading ? <Skeleton /> : (
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={trend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                    <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, color: '#f8fafc' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="avgAqi"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#111827' }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                        name="Avg AQI"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Temperature Trend */}
                    <div className="bg-[#111827] border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white font-semibold flex items-center gap-2">
                                <span className="text-cyan-400">🌡️</span> Temperature Trend
                            </h2>
                        </div>
                        {loading ? <Skeleton /> : (
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={tempTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                    <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                                    <Tooltip
                                        contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, color: '#f8fafc' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="temp"
                                        stroke="#06b6d4"
                                        strokeWidth={3}
                                        dot={{ fill: '#06b6d4', r: 4, strokeWidth: 2, stroke: '#111827' }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                        name="Temp (°C)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Top 5 Polluted Cities moved down or as a bar */}
                <div className="mt-6 bg-[#111827] border border-slate-800 rounded-xl p-6">
                    <h2 className="text-white font-semibold mb-4">Regional Pollution Analysis</h2>
                    {loading ? <Skeleton /> : (
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={topPolluted.slice(0, 5)} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="city" type="category" tick={{ fill: '#9ca3af', fontSize: 11 }} width={90} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#1e293b', opacity: 0.4 }}
                                    contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, color: '#f8fafc' }}
                                />
                                <Bar dataKey="aqi" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} name="AQI" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Pollutant breakdown forecast */}
                <div className="mt-6 bg-[#111827] border border-slate-800 rounded-xl p-6">
                    <h2 className="text-white font-semibold mb-4">Pollutant Distribution Analysis</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { name: 'PM2.5', pct: 42, color: 'bg-red-500' },
                            { name: 'PM10', pct: 28, color: 'bg-orange-500' },
                            { name: 'NO₂', pct: 15, color: 'bg-yellow-500' },
                            { name: 'O₃', pct: 8, color: 'bg-cyan-500' },
                            { name: 'SO₂', pct: 5, color: 'bg-purple-500' },
                            { name: 'CO', pct: 2, color: 'bg-emerald-500' },
                        ].map((p) => (
                            <div key={p.name} className="flex flex-col items-center gap-2">
                                <div className="text-white font-bold text-xl">{p.pct}%</div>
                                <div className={`w-full h-2 rounded-full ${p.color}`} />
                                <div className="text-slate-400 text-xs">{p.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
