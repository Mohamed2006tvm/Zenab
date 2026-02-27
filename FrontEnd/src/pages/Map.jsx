import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Layout from '../components/Layout';
import api from '../lib/api';

function getMarkerColor(aqi) {
    if (aqi <= 50) return '#10b981';
    if (aqi <= 100) return '#f59e0b';
    if (aqi <= 150) return '#f97316';
    if (aqi <= 200) return '#ef4444';
    if (aqi <= 300) return '#8b5cf6';
    return '#be123c';
}

export default function MapPage() {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        api.get('/stations').then((res) => {
            setStations(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">Interactive AQI Map</h1>
                    <p className="text-slate-400 text-sm mt-1">Real-time air quality across India — click any marker for details</p>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 mb-4">
                    {[
                        { label: 'Good (0-50)', color: '#10b981' },
                        { label: 'Moderate (51-100)', color: '#f59e0b' },
                        { label: 'Sensitive (101-150)', color: '#f97316' },
                        { label: 'Unhealthy (151-200)', color: '#ef4444' },
                        { label: 'Very Unhealthy (201-300)', color: '#8b5cf6' },
                        { label: 'Hazardous (300+)', color: '#be123c' },
                    ].map(({ label, color }) => (
                        <div key={label} className="flex items-center gap-1.5 text-xs text-slate-400">
                            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: color }} />
                            {label}
                        </div>
                    ))}
                </div>

                {loading ? (
                    <div className="h-[600px] bg-[#111827] border border-slate-800 rounded-xl flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-400">Loading map data...</p>
                        </div>
                    </div>
                ) : (
                    <div className="border border-slate-800 rounded-xl overflow-hidden" style={{ height: '600px' }}>
                        <MapContainer
                            center={[22.5, 80.0]}
                            zoom={5}
                            style={{ height: '100%', width: '100%', background: '#0d1528' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            />
                            {stations.map((s) => (
                                <CircleMarker
                                    key={s._id}
                                    center={[s.lat, s.lng]}
                                    radius={14}
                                    pathOptions={{
                                        fillColor: getMarkerColor(s.aqi),
                                        fillOpacity: 0.85,
                                        color: getMarkerColor(s.aqi),
                                        weight: 1.5,
                                    }}
                                    eventHandlers={{ click: () => setSelected(s) }}
                                >
                                    <Popup>
                                        <div className="text-gray-900">
                                            <div className="font-bold text-base">{s.city}</div>
                                            <div className="text-xs text-gray-500 mb-2">{s.state}</div>
                                            <div className="text-2xl font-extrabold" style={{ color: getMarkerColor(s.aqi) }}>
                                                AQI {s.aqi}
                                            </div>
                                            <div className="text-xs font-medium mt-1">{s.status}</div>
                                            <div className="grid grid-cols-2 gap-1 mt-2 text-xs text-gray-600">
                                                <span>PM2.5: {s.pm25}</span>
                                                <span>PM10: {s.pm10}</span>
                                                <span>NO₂: {s.no2}</span>
                                                <span>O₃: {s.o3}</span>
                                            </div>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            ))}
                        </MapContainer>
                    </div>
                )}

                {/* Station count */}
                <p className="text-slate-500 text-sm mt-3">Showing {stations.length} monitoring stations</p>
            </div>
        </Layout>
    );
}
