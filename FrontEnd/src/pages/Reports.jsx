import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../lib/api';

const STATUS_COLORS = {
    Good: 'text-emerald-400',
    Moderate: 'text-yellow-400',
    'Unhealthy for Sensitive Groups': 'text-orange-400',
    Unhealthy: 'text-red-400',
    'Very Unhealthy': 'text-purple-400',
    Hazardous: 'text-rose-400',
};

export default function Reports() {
    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        api.get('/reports/daily').then((res) => {
            setData(res.data);
            setFiltered(res.data);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        let result = data;
        if (search) {
            result = result.filter((r) =>
                r.city.toLowerCase().includes(search.toLowerCase()) ||
                r.state.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (filterStatus !== 'All') {
            result = result.filter((r) => r.status === filterStatus);
        }
        setFiltered(result);
    }, [search, filterStatus, data]);

    const exportCSV = () => {
        const headers = ['City', 'State', 'AQI', 'PM2.5', 'PM10', 'NO2', 'O3', 'Status', 'Date'];
        const rows = filtered.map((r) => [r.city, r.state, r.aqi, r.pm25, r.pm10, r.no2, r.o3, r.status, r.date]);
        const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `zenab-aqi-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const statuses = ['All', 'Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous'];

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">AQI Reports</h1>
                        <p className="text-slate-400 text-sm mt-1">Daily air quality data for all monitored cities</p>
                    </div>
                    <button
                        onClick={exportCSV}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export CSV
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Search by city or state..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-[#111827] border border-slate-700 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 outline-none text-sm"
                    />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-[#111827] border border-slate-700 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-white outline-none text-sm"
                    >
                        {statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                {/* Summary */}
                {!loading && (
                    <p className="text-slate-500 text-sm mb-4">
                        Showing <span className="text-white font-medium">{filtered.length}</span> of {data.length} stations
                        — {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                )}

                {/* Table */}
                <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 bg-[#0d1528]">
                                    <th className="px-4 py-3 text-left text-slate-400 font-medium">#</th>
                                    <th className="px-4 py-3 text-left text-slate-400 font-medium">City</th>
                                    <th className="px-4 py-3 text-left text-slate-400 font-medium">State</th>
                                    <th className="px-4 py-3 text-right text-slate-400 font-medium">AQI</th>
                                    <th className="px-4 py-3 text-right text-slate-400 font-medium">PM2.5</th>
                                    <th className="px-4 py-3 text-right text-slate-400 font-medium">PM10</th>
                                    <th className="px-4 py-3 text-right text-slate-400 font-medium">NO₂</th>
                                    <th className="px-4 py-3 text-right text-slate-400 font-medium">O₃</th>
                                    <th className="px-4 py-3 text-left text-slate-400 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(8)].map((_, i) => (
                                        <tr key={i} className="border-b border-slate-800/50 animate-pulse">
                                            {[...Array(9)].map((_, j) => (
                                                <td key={j} className="px-4 py-3">
                                                    <div className="h-4 bg-slate-800 rounded" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-12 text-slate-500">
                                            No stations found matching your filters
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((row, i) => (
                                        <tr
                                            key={row.city}
                                            className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                                        >
                                            <td className="px-4 py-3 text-slate-600">{i + 1}</td>
                                            <td className="px-4 py-3 text-white font-medium">{row.city}</td>
                                            <td className="px-4 py-3 text-slate-400">{row.state}</td>
                                            <td className={`px-4 py-3 text-right font-bold ${STATUS_COLORS[row.status] || 'text-white'}`}>
                                                {row.aqi}
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-300">{row.pm25}</td>
                                            <td className="px-4 py-3 text-right text-slate-300">{row.pm10}</td>
                                            <td className="px-4 py-3 text-right text-slate-300">{row.no2}</td>
                                            <td className="px-4 py-3 text-right text-slate-300">{row.o3}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-medium ${STATUS_COLORS[row.status] || 'text-white'}`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
