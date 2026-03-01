import React, { useState, useEffect } from 'react';
import BluetoothConnect from '../components/BluetoothConnect';
import RealTimeCard from '../components/RealTimeCard';
import api from '../services/api';
import { Leaf, Activity, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [localData, setLocalData] = useState(null);
    const [recentReadings, setRecentReadings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch recent readings
        const fetchRecent = async () => {
            try {
                const res = await api.get('/data/recent?limit=5');
                setRecentReadings(res.data);
            } catch (error) {
                console.error("Failed to fetch recent readings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecent();

        // Poll for updates since we moved from Supabase to MongoDB without WebSockets
        const interval = setInterval(fetchRecent, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleLocalDataReceived = (data) => {
        setLocalData(data);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-tr from-zenab to-zenab-dark text-white rounded-lg shadow-sm">
                            <Leaf size={28} />
                        </div>
                        ZENAB Network Dashboard
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Real-time artificial tree PM2.5 monitoring.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/map" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-all">
                        Live Map
                    </Link>
                    <Link to="/history" className="px-5 py-2.5 bg-zenab text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(52,168,83,0.39)] hover:bg-zenab-dark hover:shadow-[0_6px_20px_rgba(52,168,83,0.23)] flex items-center gap-2 transition-all">
                        Insights <ArrowUpRight size={18} />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl p-1 shadow-sm border border-gray-100">
                        <BluetoothConnect onDataReceived={handleLocalDataReceived} />
                    </div>
                </div>
                <div className="lg:col-span-2">
                    {localData ? (
                        <RealTimeCard
                            pm25={localData.pm25}
                            location={localData.location}
                            label="Your Connected Tree"
                        />
                    ) : (
                        <div className="h-full bg-gradient-to-b from-gray-50 to-white rounded-3xl p-8 border border-gray-100 flex flex-col justify-center items-center text-center shadow-sm">
                            <Activity size={48} className="text-gray-300 mb-4 animate-pulse" />
                            <h3 className="text-xl font-bold text-gray-700 mb-2">No Active Connection</h3>
                            <p className="text-gray-500 max-w-sm">Connect a ZENAB Tree via Bluetooth to see live, hyperlocal air quality sensor readings.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Global Network Activity</h3>
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zenab opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-zenab-dark"></span>
                    </span>
                </div>

                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-16 bg-gray-100 rounded-xl w-full"></div>
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="pb-4 pt-2">Location</th>
                                    <th className="pb-4 pt-2">Tree ID</th>
                                    <th className="pb-4 pt-2">PM2.5 Level</th>
                                    <th className="pb-4 pt-2 text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 relative">
                                {recentReadings.map((reading, index) => (
                                    <tr key={index} className="group hover:bg-gray-50 transition-colors">
                                        <td className="py-4 font-medium text-gray-800 group-hover:text-zenab-dark transition-colors">{reading.location_name}</td>
                                        <td className="py-4 text-gray-500 text-sm font-mono">{reading.device_id}</td>
                                        <td className="py-4 font-bold">
                                            <span className={`px-3 py-1 rounded-full text-sm ${reading.pm25 < 30 ? 'bg-green-100 text-green-700' :
                                                    reading.pm25 < 60 ? 'bg-yellow-100 text-yellow-700' :
                                                        reading.pm25 < 90 ? 'bg-orange-100 text-orange-700' :
                                                            'bg-red-100 text-red-700'
                                                }`}>
                                                {reading.pm25.toFixed(1)} µg/m³
                                            </span>
                                        </td>
                                        <td className="py-4 text-right text-gray-400 text-sm whitespace-nowrap">
                                            {new Date(reading.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </td>
                                    </tr>
                                ))}
                                {recentReadings.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-gray-500">
                                            No network activity recorded recently.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
