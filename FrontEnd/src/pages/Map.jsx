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

    const zenabDevice = {
        _id: 'zenab-01',
        city: 'Bangalore (ZENAB HQ)',
        state: 'Karnataka',
        lat: 12.9716,
        lng: 77.5946,
        aqi: 42,
        status: 'Safe',
        pm25: 12,
        pm10: 24,
        no2: 8,
        o3: 15,
        isZenab: true
    };

    useEffect(() => {
        api.get('/stations').then((res) => {
            setStations(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Interactive AQI Map</h1>
                        <p className="text-slate-400 text-sm mt-1">Real-time air quality across India — ZENAB device is active in Bangalore</p>
                    </div>
                    {/* ZENAB Quick Info */}
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <div>
                            <div className="text-white text-xs font-bold uppercase tracking-wider">ZENAB Node 01</div>
                            <div className="text-emerald-400 text-[10px] font-mono">12.97°N, 77.59°E</div>
                        </div>
                    </div>
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
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold ml-auto">
                        <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-white inline-block" />
                        ZENAB Device
                    </div>
                </div>

                {loading ? (
                    <div className="h-[600px] bg-[#111827] border border-slate-800 rounded-xl flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-400">Loading map data...</p>
                        </div>
                    </div>
                ) : (
                    <div className="border border-slate-800 rounded-xl overflow-hidden relative" style={{ height: '600px' }}>
                        <MapContainer
                            center={[22.5, 80.0]}
                            zoom={5}
                            style={{ height: '100%', width: '100%', background: '#0d1528' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            />

                            {/* ZENAB Device Marker */}
                            <CircleMarker
                                center={[zenabDevice.lat, zenabDevice.lng]}
                                radius={18}
                                pathOptions={{
                                    fillColor: '#10b981',
                                    fillOpacity: 1,
                                    color: '#fff',
                                    weight: 3,
                                }}
                                eventHandlers={{ click: () => setSelected(zenabDevice) }}
                            >
                                <Popup>
                                    <div className="text-gray-900">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xl">🌿</span>
                                            <div className="font-bold text-base text-emerald-600">ZENAB Tree Node</div>
                                        </div>
                                        <div className="text-xs text-gray-500 mb-2">{zenabDevice.city}</div>
                                        <div className="text-2xl font-extrabold text-emerald-500">
                                            AQI {zenabDevice.aqi}
                                        </div>
                                        <div className="text-xs font-medium mt-1">Status: Active & Healthy</div>
                                        <div className="grid grid-cols-2 gap-1 mt-2 text-xs text-gray-600 border-t pt-2">
                                            <span>PM2.5: {zenabDevice.pm25}</span>
                                            <span>PM10: {zenabDevice.pm10}</span>
                                            <span className="col-span-2">GPS: 12.9716, 77.5946</span>
                                        </div>
                                    </div>
                                </Popup>
                            </CircleMarker>

                            {stations.map((s) => (
                                <CircleMarker
                                    key={s._id}
                                    center={[s.lat, s.lng]}
                                    radius={12}
                                    pathOptions={{
                                        fillColor: getMarkerColor(s.aqi),
                                        fillOpacity: 0.7,
                                        color: getMarkerColor(s.aqi),
                                        weight: 1,
                                    }}
                                    eventHandlers={{ click: () => setSelected(s) }}
                                >
                                    <Popup>
                                        <div className="text-gray-900 min-w-[140px]">
                                            <div className="font-bold text-base">{s.city}</div>
                                            <div className="text-xs text-gray-500 mb-2">{s.state}</div>
                                            <div className="text-2xl font-extrabold" style={{ color: getMarkerColor(s.aqi) }}>
                                                AQI {s.aqi}
                                            </div>
                                            <div className="text-xs font-medium mt-1">{s.status}</div>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            ))}
                        </MapContainer>

                        {/* Map Overlay Card for Selection */}
                        {selected && (
                            <div className="absolute bottom-6 left-6 z-[1000] w-72 bg-slate-900/90 border border-slate-700 p-5 rounded-2xl backdrop-blur-md shadow-2xl animate-in slide-in-from-left-4">
                                <button
                                    onClick={() => setSelected(null)}
                                    className="absolute top-3 right-3 text-slate-500 hover:text-white"
                                >✕</button>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xl">{selected.isZenab ? '🌿' : '📡'}</span>
                                    <div>
                                        <div className="text-white font-bold text-sm leading-tight">{selected.city}</div>
                                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{selected.state}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                                        <div className="text-slate-500 text-[9px] font-bold uppercase mb-1">AQI Level</div>
                                        <div className="text-2xl font-black" style={{ color: getMarkerColor(selected.aqi) }}>{selected.aqi}</div>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                                        <div className="text-slate-500 text-[9px] font-bold uppercase mb-1">Status</div>
                                        <div className="text-xs font-bold text-white mt-1.5">{selected.status}</div>
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-2 text-[10px]">
                                    <div className="flex justify-between text-slate-400"><span>PM2.5</span> <span className="text-white">{selected.pm25}</span></div>
                                    <div className="flex justify-between text-slate-400"><span>PM10</span> <span className="text-white">{selected.pm10}</span></div>
                                    <div className="flex justify-between text-slate-400"><span>NO₂</span> <span className="text-white">{selected.no2 || '--'}</span></div>
                                    <div className="flex justify-between text-slate-400"><span>O₃</span> <span className="text-white">{selected.o3 || '--'}</span></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Station count */}
                <div className="flex items-center justify-between mt-3 px-1">
                    <p className="text-slate-500 text-xs">Showing {stations.length} stations + 1 ZENAB active node</p>
                    <div className="text-slate-600 text-[10px] font-mono">Last Sync: {new Date().toLocaleTimeString()}</div>
                </div>
            </div>
        </Layout>
    );
}
