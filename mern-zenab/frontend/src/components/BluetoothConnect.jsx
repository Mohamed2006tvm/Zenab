import React, { useState } from 'react';
import { Bluetooth, Activity, CheckCircle, WifiOff } from 'lucide-react';
import api from '../services/api';

const BluetoothConnect = ({ onDataReceived }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [device, setDevice] = useState(null);
    const [errorMSG, setErrorMSG] = useState(null);

    const simulateBLE = () => {
        setIsConnecting(true);
        setErrorMSG(null);

        // Simulate connection delay
        setTimeout(() => {
            setDevice({ name: "ZENAB-SmartTree-001" });
            setIsConnecting(false);

            // Simulate receiving data every 5 seconds
            setInterval(() => {
                const fakePM = (Math.random() * (120 - 20) + 20).toFixed(2);
                const data = {
                    device_id: 'tree-001',
                    location: 'Connaught Place, Delhi', // Fixed mock location for prototype
                    latitude: 28.6304,
                    longitude: 77.2177,
                    pm25: parseFloat(fakePM),
                    timestamp: new Date().toISOString()
                };

                onDataReceived(data);

                // Post to backend
                api.post(`/data/submit`, data).catch(err => console.error("API error", err));

            }, 5000);
        }, 1500);
    };

    const connectBLE = async () => {
        try {
            if (!navigator.bluetooth) {
                setErrorMSG("Web Bluetooth is not supported in this browser.");
                // Fallback to simulation
                simulateBLE();
                return;
            }

            setIsConnecting(true);
            setErrorMSG(null);

            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: ['battery_service'] // Replace with actual Zenab Tree UUID Service
            });

            setDevice(device);
            const server = await device.gatt.connect();
            // Implementation for real sensor data reading...
            // For now, simulate real-time feed once connected
            setIsConnecting(false);
            simulateBLE(); // using simulation loop after connect for demo

        } catch (error) {
            console.error(error);
            setIsConnecting(false);
            simulateBLE(); // Fallback to simulation if user cancels or fails
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${device ? 'bg-green-100 text-zenab' : 'bg-blue-50 text-blue-500'}`}>
                {device ? <CheckCircle size={32} /> : <Bluetooth size={32} />}
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">Connect to Zenab Tree</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
                Pair your device with a local artificial tree to receive real-time PM2.5 metrics via Bluetooth.
            </p>

            {device ? (
                <div className="flex items-center gap-2 text-zenab font-semibold bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                    <Activity size={18} className="animate-pulse" />
                    Connected to {device.name}
                </div>
            ) : (
                <button
                    onClick={connectBLE}
                    disabled={isConnecting}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
                >
                    {isConnecting ? (
                        <><Activity size={20} className="animate-spin" /> Scanning...</>
                    ) : (
                        <><WifiOff size={20} /> Pair Device</>
                    )}
                </button>
            )}

            {errorMSG && <p className="text-red-500 text-xs mt-4">{errorMSG}</p>}
        </div>
    );
};

export default BluetoothConnect;
