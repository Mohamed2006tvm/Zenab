import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Lightbulb, Info, AlertTriangle, ShieldCheck, Leaf } from 'lucide-react';

const Recommendations = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [pm25Input, setPm25Input] = useState('');
    const [recentAvg, setRecentAvg] = useState(50);

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);
                // Get the latest reading average from the network
                const recentRes = await api.get('/data/recent?limit=10');
                const recent = recentRes.data;

                let initialPm25 = 50;
                if (recent && recent.length > 0) {
                    initialPm25 = recent.reduce((sum, r) => sum + r.pm25, 0) / recent.length;
                    setRecentAvg(initialPm25);
                }

                const res = await api.get(`/recommendations?pm25=${initialPm25}`);
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const fetchManual = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await api.get(`/recommendations?pm25=${pm25Input}`);
            setData(res.data);
            setPm25Input('');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-4 bg-zenab-light text-zenab-dark rounded-full mb-4 shadow-sm">
                    <Lightbulb size={40} />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">AI Insights & Remedies</h1>
                <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto font-medium">
                    Evidence-based actionable mitigation strategies derived from ZENAB Smart Tree data.
                </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center mb-12">
                <div className="flex-1 w-full">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Simulate PM2.5 Scenario</h3>
                    <p className="text-gray-500 text-sm mb-4">Current network average is <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">{recentAvg.toFixed(1)} µg/m³</span></p>
                    <form onSubmit={fetchManual} className="flex gap-3">
                        <input
                            type="number"
                            value={pm25Input}
                            onChange={(e) => setPm25Input(e.target.value)}
                            placeholder="Enter PM2.5 value..."
                            className="flex-1 border bg-gray-50 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zenab shadow-inner font-medium text-gray-800"
                            required
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-md"
                            disabled={loading}
                        >
                            Analyze
                        </button>
                    </form>
                </div>
                <div className="hidden md:block w-px h-24 bg-gray-200 mx-4"></div>
                <div className="flex-1 w-full text-center">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">Analyzing Level</div>
                    {data ? (
                        <div className={`text-6xl font-black ${data.pm25_level < 30 ? 'text-green-500' :
                                data.pm25_level < 60 ? 'text-yellow-500' :
                                    data.pm25_level < 90 ? 'text-orange-500' :
                                        'text-red-500'
                            }`}>
                            {data.pm25_level.toFixed(1)}
                        </div>
                    ) : (
                        <div className="text-4xl font-black text-gray-300">--</div>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="text-center p-12">
                    <Activity className="animate-spin text-zenab mx-auto" size={48} />
                </div>
            ) : data ? (
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <ShieldCheck size={28} className="text-zenab" />
                        <h2 className="text-2xl font-bold text-gray-800">Recommended Actions</h2>
                    </div>
                    <div className="grid gap-4">
                        {data.recommendations.map((rec, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow group">
                                <div className={`p-3 rounded-full shrink-0 ${data.pm25_level > 90 ? 'bg-red-50 text-red-500' :
                                        data.pm25_level > 60 ? 'bg-orange-50 text-orange-500' :
                                            'bg-green-50 text-green-500'
                                    }`}>
                                    {data.pm25_level > 90 ? <AlertTriangle size={24} /> :
                                        data.pm25_level > 60 ? <Info size={24} /> :
                                            <Leaf size={24} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-zenab-dark transition-colors">{rec}</h4>
                                    <p className="text-gray-500 text-sm font-medium">Status verified against CPCB guidelines corresponding to AQI equivalent levels.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default Recommendations;
