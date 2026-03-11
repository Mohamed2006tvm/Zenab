import { useState } from 'react';

export default function SmartAlert({ aqi }) {
    const [dismissed, setDismissed] = useState(false);

    if (aqi <= 150 || dismissed) return null;

    const level = aqi > 300 ? 'Hazardous' : aqi > 200 ? 'Very Unhealthy' : 'Unhealthy';
    const recommendation =
        aqi > 300
            ? 'Evacuate area if possible. Activate all purification systems immediately.'
            : aqi > 200
            ? 'Activate air purification system. Close all windows and doors.'
            : 'Activate purification system. Limit outdoor exposure.';

    const borderColor = aqi > 300 ? 'border-rose-500/60' : aqi > 200 ? 'border-purple-500/60' : 'border-orange-500/60';
    const bgColor = aqi > 300 ? 'bg-rose-500/10' : aqi > 200 ? 'bg-purple-500/10' : 'bg-orange-500/10';
    const textColor = aqi > 300 ? 'text-rose-400' : aqi > 200 ? 'text-purple-400' : 'text-orange-400';
    const badgeColor = aqi > 300 ? 'bg-rose-500/20 text-rose-300' : aqi > 200 ? 'bg-purple-500/20 text-purple-300' : 'bg-orange-500/20 text-orange-300';

    return (
        <div className={`mb-6 rounded-xl border ${borderColor} ${bgColor} p-4 flex items-start gap-4`}>
            {/* Pulsing icon */}
            <div className={`mt-0.5 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${bgColor} border ${borderColor}`}>
                <span className="text-xl animate-pulse">⚠️</span>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`font-bold text-sm ${textColor}`}>
                        🚨 Air Quality Alert — AQI {aqi}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badgeColor}`}>
                        {level}
                    </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                    <span className="font-semibold">Warning:</span> Air quality has exceeded safe limits.
                </p>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                    <span className={`font-semibold ${textColor}`}>💡 Recommendation:</span> {recommendation}
                </p>
            </div>

            <button
                onClick={() => setDismissed(true)}
                className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors mt-0.5"
                title="Dismiss alert"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
