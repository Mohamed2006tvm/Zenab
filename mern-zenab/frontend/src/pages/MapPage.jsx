import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import api from '../services/api';
import { Leaf, Activity } from 'lucide-react';

const MapPage = () => {
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Default center (India)
    const center = [20.5937, 78.9629];
    const zoom = 5;

    useEffect(() => {
        const fetchNodes = async () => {
            try {
                const res = await api.get('/data/recent?limit=200');

                // Group by location to only show the latest for each
                const latestByLoc = {};
                res.data.forEach(reading => {
                    if (!latestByLoc[reading.location_name] && reading.latitude && reading.longitude) {
                        latestByLoc[reading.location_name] = reading;
                    }
                });

                setNodes(Object.values(latestByLoc));
            } catch (err) {
                console.error("Failed to load map data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNodes();

        // Poll for updates
        const interval = setInterval(fetchNodes, 10000);

        return () => clearInterval(interval);
    }, []);

    const getColor = (pm25) => {
        if (pm25 < 30) return '#34a853'; // Green
        if (pm25 < 60) return '#fbbc05'; // Yellow
        if (pm25 < 90) return '#fb8c00'; // Orange
        return '#ea4335'; // Red
    };

    if (loading) {
        return (
            <div className="h-[calc(100vh-4rem)] flex justify-center items-center">
                <div className="flex flex-col items-center">
                    <Activity className="animate-spin text-zenab mb-4" size={48} />
                    <p className="text-gray-500 font-medium">Loading network topography...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-[calc(100vh-4rem)] w-full">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[400] bg-white/90 backdrop-blur shadow-lg rounded-full px-6 py-3 flex items-center gap-4">
                <Leaf className="text-zenab" size={24} />
                <h2 className="font-extrabold text-gray-800 tracking-wide text-lg">ZENAB Live Topology</h2>
                <div className="flex gap-3 ml-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> <span className="hidden md:inline">Good</span></div>
                    <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> <span className="hidden md:inline">Moderate</span></div>
                    <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500"></span> <span className="hidden md:inline">Poor</span></div>
                    <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> <span className="hidden md:inline">Severe</span></div>
                </div>
            </div>

            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                className="h-full w-full z-10"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {nodes.map((node, index) => (
                    <CircleMarker
                        key={index}
                        center={[node.latitude, node.longitude]}
                        pathOptions={{
                            color: getColor(node.pm25),
                            fillColor: getColor(node.pm25),
                            fillOpacity: 0.7,
                            weight: 2
                        }}
                        radius={node.pm25 > 90 ? 15 : (node.pm25 > 60 ? 12 : 10)}
                    >
                        <Popup className="rounded-xl overflow-hidden shadow-2xl border-0">
                            <div className="p-1 min-w-[200px]">
                                <h3 className="font-bold text-gray-900 border-b pb-2 mb-2">{node.location_name}</h3>
                                <div className="flex items-end justify-between mb-3">
                                    <span className="text-gray-500 text-sm">Tree ID:</span>
                                    <span className="font-mono text-xs font-semibold">{node.device_id}</span>
                                </div>
                                <div className={`p-4 rounded-xl text-center shadow-inner ${node.pm25 < 30 ? 'bg-green-50 text-green-700 border border-green-100' :
                                        node.pm25 < 60 ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                                            node.pm25 < 90 ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                                                'bg-red-50 text-red-700 border border-red-100'
                                    }`}>
                                    <div className="text-3xl font-black mb-1">{node.pm25.toFixed(1)}</div>
                                    <div className="text-xs uppercase font-bold tracking-widest opacity-80">µg/m³ PM2.5</div>
                                </div>
                                <div className="text-xs text-center text-gray-400 mt-4">
                                    Last updated: {new Date(node.recorded_at).toLocaleTimeString()}
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapPage;
