const AQI_COLORS = {
    Good: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
    Moderate: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', dot: 'bg-yellow-400' },
    'Unhealthy for Sensitive Groups': { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', dot: 'bg-orange-400' },
    Unhealthy: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', dot: 'bg-red-400' },
    'Very Unhealthy': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', dot: 'bg-purple-400' },
    Hazardous: { bg: 'bg-rose-900/40', text: 'text-rose-400', border: 'border-rose-500/30', dot: 'bg-rose-400' },
};

export default function AQICard({ station }) {
    const colors = AQI_COLORS[station.status] || AQI_COLORS['Moderate'];

    return (
        <div className={`relative bg-[#111827] border ${colors.border} rounded-xl p-4 hover:bg-[#1a2235] transition-all duration-200 group`}>
            {/* AQI Value */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="text-white font-semibold text-base leading-tight">{station.city}</h3>
                    <p className="text-slate-500 text-xs mt-0.5">{station.state}</p>
                </div>
                <div className={`text-3xl font-bold ${colors.text}`}>{station.aqi}</div>
            </div>

            {/* Status badge */}
            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} mb-3`}>
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} animate-pulse`} />
                {station.status}
            </div>

            {/* Pollutants */}
            <div className="grid grid-cols-3 gap-2">
                {[
                    { label: 'PM2.5', val: station.pm25 },
                    { label: 'PM10', val: station.pm10 },
                    { label: 'NO₂', val: station.no2 },
                    { label: 'O₃', val: station.o3 },
                    { label: 'SO₂', val: station.so2 },
                    { label: 'CO', val: station.co },
                ].map(({ label, val }) => (
                    <div key={label} className="text-center">
                        <div className="text-slate-400 text-xs">{label}</div>
                        <div className="text-white text-xs font-medium">{val}</div>
                    </div>
                ))}
            </div>

            {/* Updated time */}
            <div className="mt-3 pt-3 border-t border-slate-800 text-slate-600 text-xs">
                Updated: {new Date(station.updatedAt).toLocaleTimeString()}
            </div>
        </div>
    );
}
