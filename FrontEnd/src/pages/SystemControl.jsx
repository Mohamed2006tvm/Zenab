import { useState } from 'react';
import Layout from '../components/Layout';

const INITIAL_STATE = {
    monitoring: false,
    systemActive: false,
    log: [],
};

function addLog(logs, msg, type = 'info') {
    return [
        { time: new Date().toLocaleTimeString(), msg, type },
        ...logs.slice(0, 19),
    ];
}

export default function SystemControl() {
    const [state, setState] = useState(INITIAL_STATE);
    const [resetting, setResetting] = useState(false);

    const startMonitoring = () => {
        if (state.monitoring) return;
        setState((s) => ({
            ...s,
            monitoring: true,
            log: addLog(s.log, '▶ Sensor monitoring started', 'success'),
        }));
    };

    const activateSystem = () => {
        setState((s) => ({
            ...s,
            systemActive: true,
            monitoring: true,
            log: addLog(
                addLog(s.log, '✅ Purification system activated', 'success'),
                '▶ Sensor monitoring started', 'success'
            ),
        }));
    };

    const resetSystem = () => {
        setResetting(true);
        setTimeout(() => {
            setState({ ...INITIAL_STATE, log: [] });
            setResetting(false);
        }, 1200);
    };

    const overallStatus = state.systemActive ? 'System Active' : state.monitoring ? 'Monitoring' : 'Idle';
    const statusColor = state.systemActive ? 'text-emerald-400' : state.monitoring ? 'text-cyan-400' : 'text-slate-500';
    const statusDot = state.systemActive ? 'bg-emerald-400' : state.monitoring ? 'bg-cyan-400' : 'bg-slate-600';

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-white">System Control</h1>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${state.systemActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : state.monitoring ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusDot} ${state.monitoring || state.systemActive ? 'animate-pulse' : ''}`} />
                            {overallStatus}
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm">Control the ZENAB air quality monitoring and purification system</p>
                </div>

                {/* Control Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

                    {/* Start Monitoring */}
                    <div className={`bg-[#111827] border rounded-2xl p-6 flex flex-col gap-4 transition-all ${state.monitoring ? 'border-cyan-500/40' : 'border-slate-800'}`}>
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl">
                            📡
                        </div>
                        <div>
                            <div className="text-white font-semibold mb-1">Start Monitoring</div>
                            <p className="text-slate-500 text-xs leading-relaxed">
                                Begin continuous AQI, PM2.5, PM10, temperature, and CO₂ sensor readings.
                            </p>
                        </div>
                        <div className="mt-auto">
                            <div className={`text-xs mb-3 font-medium ${state.monitoring ? 'text-cyan-400' : 'text-slate-600'}`}>
                                {state.monitoring ? '● Monitoring active' : '○ Not started'}
                            </div>
                            <button
                                onClick={startMonitoring}
                                disabled={state.monitoring}
                                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all duration-200 shadow-lg shadow-cyan-500/20"
                            >
                                {state.monitoring ? '✔ Running' : '▶ Start Monitoring'}
                            </button>
                        </div>
                    </div>

                    {/* Activate System */}
                    <div className={`bg-[#111827] border rounded-2xl p-6 flex flex-col gap-4 transition-all ${state.systemActive ? 'border-emerald-500/40' : 'border-slate-800'}`}>
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl">
                            🌿
                        </div>
                        <div>
                            <div className="text-white font-semibold mb-1">Activate System</div>
                            <p className="text-slate-500 text-xs leading-relaxed">
                                Activate full purification + monitoring. Responds automatically to poor air quality.
                            </p>
                        </div>
                        <div className="mt-auto">
                            <div className={`text-xs mb-3 font-medium ${state.systemActive ? 'text-emerald-400' : 'text-slate-600'}`}>
                                {state.systemActive ? '● System active & purifying' : '○ System inactive'}
                            </div>
                            <button
                                onClick={activateSystem}
                                disabled={state.systemActive}
                                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all duration-200 shadow-lg shadow-emerald-500/20"
                            >
                                {state.systemActive ? '✔ Active' : '⚡ Activate System'}
                            </button>
                        </div>
                    </div>

                    {/* Reset */}
                    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-2xl">
                            🔄
                        </div>
                        <div>
                            <div className="text-white font-semibold mb-1">Reset System</div>
                            <p className="text-slate-500 text-xs leading-relaxed">
                                Stop all processes, clear logs, and return system to its default idle state.
                            </p>
                        </div>
                        <div className="mt-auto">
                            <div className="text-xs mb-3 font-medium text-slate-600">
                                {resetting ? '⟳ Resetting...' : '○ Demo only'}
                            </div>
                            <button
                                onClick={resetSystem}
                                disabled={resetting}
                                className="w-full py-2.5 bg-red-500/80 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                {resetting ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Resetting…
                                    </>
                                ) : (
                                    '↺ Reset System'
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* System Status Overview */}
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 mb-6">
                    <h2 className="text-white font-semibold mb-4">System Status Overview</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: 'Monitoring', active: state.monitoring, icon: '📡' },
                            { label: 'Purification', active: state.systemActive, icon: '🌿' },
                            { label: 'AI Analysis', active: state.systemActive, icon: '🤖' },
                            { label: 'Alerts', active: state.monitoring || state.systemActive, icon: '🔔' },
                        ].map((item) => (
                            <div key={item.label} className={`rounded-xl border p-4 text-center transition-all ${item.active ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-800 bg-[#0d1528]'}`}>
                                <div className="text-2xl mb-2">{item.icon}</div>
                                <div className={`text-xs font-semibold mb-1 ${item.active ? 'text-emerald-400' : 'text-slate-600'}`}>
                                    {item.active ? 'Active' : 'Inactive'}
                                </div>
                                <div className="text-slate-400 text-xs">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Log */}
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-semibold">Activity Log</h2>
                        <span className="text-slate-600 text-xs">{state.log.length} entries</span>
                    </div>
                    {state.log.length === 0 ? (
                        <div className="text-center py-8 text-slate-600 text-sm">
                            No activity yet. Start monitoring or activate the system to see logs.
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {state.log.map((entry, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <span className="text-slate-600 text-xs font-mono flex-shrink-0">{entry.time}</span>
                                    <span className={entry.type === 'success' ? 'text-emerald-400' : 'text-slate-400'}>
                                        {entry.msg}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </Layout>
    );
}
