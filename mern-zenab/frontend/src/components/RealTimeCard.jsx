import React from 'react';
import { Leaf, AlertTriangle, Wind, Info } from 'lucide-react';

const RealTimeCard = ({ pm25, location, label = 'Local readings' }) => {
    // Determine color and health message based on PM2.5 levels
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    let icon = <Info size={40} className="text-gray-500" />;
    let message = 'Gathering data...';

    if (pm25 !== null) {
        if (pm25 <= 30) {
            bgColor = 'bg-green-50 border-green-200';
            textColor = 'text-green-700';
            icon = <Leaf size={40} className="text-green-500" />;
            message = 'Good: Air is fresh and healthy.';
        } else if (pm25 <= 60) {
            bgColor = 'bg-yellow-50 border-yellow-200';
            textColor = 'text-yellow-700';
            icon = <Wind size={40} className="text-yellow-500" />;
            message = 'Moderate: Acceptable air quality.';
        } else if (pm25 <= 90) {
            bgColor = 'bg-orange-50 border-orange-200';
            textColor = 'text-orange-700';
            icon = <AlertTriangle size={40} className="text-orange-500" />;
            message = 'Poor: Sensitive groups may feel effects.';
        } else {
            bgColor = 'bg-red-50 border-red-200';
            textColor = 'text-red-700';
            icon = <AlertTriangle size={40} className="text-red-600 animate-pulse" />;
            message = 'Severe: Health warning in effect.';
        }
    }

    return (
        <div className={`p-6 rounded-2xl border ${bgColor} shadow-sm transition-all duration-500 flex flex-col`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">{label}</h4>
                    <h2 className={`text-5xl font-extrabold ${textColor}`}>
                        {pm25 !== null ? pm25.toFixed(1) : '--'}
                        <span className="text-xl font-medium opacity-70 ml-2">µg/m³</span>
                    </h2>
                </div>
                <div className="p-3 bg-white/50 backdrop-blur-sm rounded-full shadow-sm">
                    {icon}
                </div>
            </div>

            {location && (
                <div className="flex items-center gap-2 mb-4 text-gray-600 font-medium bg-white/40 px-3 py-1.5 rounded-md self-start">
                    <Wind size={16} />
                    {location}
                </div>
            )}

            <div className={`mt-auto pt-4 border-t border-black/10 font-medium ${textColor}`}>
                {message}
            </div>
        </div>
    );
};

export default RealTimeCard;
