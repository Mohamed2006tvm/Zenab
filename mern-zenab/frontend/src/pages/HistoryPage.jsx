import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Activity, Thermometer, TrendingUp, AlertOctagon } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const HistoryPage = () => {
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState([]);
    const [selectedLoc, setSelectedLoc] = useState('');
    const [historicalData, setHistoricalData] = useState([]);
    const [predictionData, setPredictionData] = useState(null);
    const [hotspots, setHotspots] = useState([]);

    useEffect(() => {
        const init = async () => {
            try {
                // Fetch unique locations via backend aggregation
                const locRes = await api.get('/data/locations');
                const unique = locRes.data;
                setLocations(unique);

                if (unique.length > 0) setSelectedLoc(unique[0].id);

                // Fetch hotspots
                const hsRes = await api.get('/analysis/hotspots');
                setHotspots(hsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (!selectedLoc) return;

        const fetchHistoryAndPredict = async () => {
            setHistoricalData([]);
            setPredictionData(null);

            try {
                const hRes = await api.get(`/data/history/${selectedLoc}`);
                const data = hRes.data;

                if (data && data.length > 0) {
                    // Reverse to chronological
                    const tsData = data.reverse();
                    setHistoricalData(tsData);

                    // Prepare array of PM25 values
                    const pmValues = tsData.map(d => d.pm25);

                    const predRes = await api.post('/predict', {
                        location: tsData[0].location_name,
                        historical_pm25: pmValues
                    });
                    setPredictionData(predRes.data);
                }
            } catch (e) {
                console.error("History/Prediction fetch failed:", e);
            }
        };

        fetchHistoryAndPredict();
    }, [selectedLoc]);

    if (loading) return <div className="p-10 text-center"><Activity className="animate-spin mx-auto text-zenab" size={48} /> Loading analysis...</div>;

    // Chart Setup
    const labels = historicalData.map((d, i) => i);
    let futureLabels = [];
    let futureData = [];

    if (predictionData && predictionData.predicted_next_30_days) {
        futureLabels = Array.from({ length: 30 }, (_, i) => labels.length + i);
        futureData = predictionData.predicted_next_30_days;
    }

    const chartData = {
        labels: [...labels, ...futureLabels],
        datasets: [
            {
                label: 'Historical PM2.5',
                data: [...historicalData.map(d => d.pm25), ...Array(futureLabels.length).fill(null)],
                borderColor: '#34a853', // green
                backgroundColor: 'rgba(52, 168, 83, 0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'ML Prediction (Next 30 Readings)',
                data: [...Array(labels.length).fill(null), ...futureData],
                borderColor: '#ea4335', // red/orange
                borderDash: [5, 5],
                tension: 0.4,
                fill: false,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: false }
        },
        scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { grid: { display: false } }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex items-center gap-3">
                <TrendingUp className="text-zenab" size={32} />
                <h1 className="text-3xl font-extrabold text-gray-900">Historical & Predictive Analysis</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><AlertOctagon size={20} className="text-red-500" /> Hotspot Rankings</h3>
                        <ul className="space-y-4">
                            {hotspots.map((hs, i) => (
                                <li key={i} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-800 text-sm">{i + 1}. {hs.location.split(',')[0]}</span>
                                        <span className="text-xs text-gray-500">Avg PM2.5</span>
                                    </div>
                                    <div className="bg-red-50 text-red-700 font-bold px-3 py-1 rounded-lg text-sm shadow-inner">
                                        {hs.avg_pm25.toFixed(1)}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Select Node</h3>
                        <select
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-zenab focus:border-zenab block p-3 shadow-sm font-medium"
                            value={selectedLoc}
                            onChange={(e) => setSelectedLoc(e.target.value)}
                        >
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name} ({loc.id})</option>
                            ))}
                        </select>
                    </div>

                    {predictionData && (
                        <div className={`p-6 rounded-2xl shadow-sm border ${predictionData.trend === 'increasing' ? 'bg-red-50 border-red-200' :
                                predictionData.trend === 'decreasing' ? 'bg-green-50 border-green-200' :
                                    'bg-yellow-50 border-yellow-200'
                            }`}>
                            <h3 className="text-sm font-bold opacity-70 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Thermometer size={16} /> AI Forecast
                            </h3>
                            <p className="font-bold text-2xl capitalize text-gray-900 mb-1">{predictionData.trend} Trend</p>
                            <p className="text-sm font-medium opacity-80">Expect {predictionData.hotspot_level} pollution levels.</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-3 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="h-[500px] w-full relative">
                        {historicalData.length === 0 ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                                <p className="text-gray-500 font-medium">No historical data available for this node.</p>
                            </div>
                        ) : (
                            <Line data={chartData} options={options} />
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HistoryPage;
