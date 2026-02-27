import { useEffect, useState } from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import Layout from '../components/Layout';
import api from '../lib/api';

export default function AIInsights() {
    const [trend, setTrend] = useState([]);
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
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const insights = [
        {
            icon: '📈',
            title: 'Pollution Trend',
            text: summary
                ? `Average AQI across India is ${summary.avgAqi}. ${summary.hazardous} stations report dangerous levels.`
                : 'Loading analysis...',
            color: 'border-emerald-500/30 bg-emerald-500/5',
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
            text: 'Major pollution sources include vehicular emissions, industrial activity, and agricultural burning. Cities in UP and Delhi-NCR need urgent intervention.',
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
                    <h1 className="text-2xl font-bold text-white">AI Insights</h1>
                    <p className="text-slate-400 text-sm mt-1">Machine learning analysis of pollution patterns across India</p>
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
                        <h2 className="text-white font-semibold mb-4">7-Day Average AQI Trend</h2>
                        {loading ? <Skeleton /> : (
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={trend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                                    <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, color: '#f9fafb' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="avgAqi"
                                        stroke="#10b981"
                                        strokeWidth={2.5}
                                        dot={{ fill: '#10b981', r: 4 }}
                                        name="Avg AQI"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Top 5 Polluted Cities */}
                    <div className="bg-[#111827] border border-slate-800 rounded-xl p-6">
                        <h2 className="text-white font-semibold mb-4">Top 5 Most Polluted Cities</h2>
                        {loading ? <Skeleton /> : (
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={topPolluted} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                                    <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                    <YAxis dataKey="city" type="category" tick={{ fill: '#9ca3af', fontSize: 12 }} width={80} />
                                    <Tooltip
                                        contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, color: '#f9fafb' }}
                                    />
                                    <Bar dataKey="aqi" fill="#10b981" radius={[0, 4, 4, 0]} name="AQI" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
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
                    <p className="text-slate-500 text-xs mt-4">
                        * PM2.5 remains the dominant pollutant contributing to poor air quality across urban India.
                        Vehicle emissions and construction dust are primary sources of PM10.
                    </p>
                </div>
            </div>
        </Layout>
    );
}
