import { useState } from 'react';
import Layout from '../components/Layout';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const CONDITIONS = [
    'Asthma', 'Heart Disease', 'Diabetes', 'Hypertension',
    'COPD', 'Allergies', 'Pregnancy', 'Lung Disease',
];

const ACTIVITY_LEVELS = [
    { val: 'sedentary', label: 'Minimal physical activity' },
    { val: 'light', label: 'Light exercise 1-3 days/week' },
    { val: 'moderate', label: 'Moderate exercise 3-5 days/week' },
    { val: 'intense', label: 'Intense exercise 6-7 days/week' },
    { val: 'professional', label: 'Professional / competitive athlete' },
];

const RISK_COLORS = {
    Low: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: '✅' },
    Moderate: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', icon: '⚠️' },
    High: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: '🚨' },
    'Very High': { bg: 'bg-rose-900/20', border: 'border-rose-500/30', text: 'text-rose-400', icon: '☣️' },
};

export default function Health() {
    const { user } = useAuth();
    const [form, setForm] = useState({ age: '', conditions: [], activityLevel: 'moderate', currentAqi: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const toggleCondition = (c) => {
        setForm((prev) => ({
            ...prev,
            conditions: prev.conditions.includes(c)
                ? prev.conditions.filter((x) => x !== c)
                : [...prev.conditions, c],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/health/assess', {
                userId: user?.id,
                age: Number(form.age),
                conditions: form.conditions,
                activityLevel: form.activityLevel,
                currentAqi: form.currentAqi ? Number(form.currentAqi) : undefined,
            });
            setResult(res.data);
        } catch {
            setError('Failed to get assessment. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const colors = result ? (RISK_COLORS[result.riskLevel] || RISK_COLORS['Low']) : null;

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Health Assessment</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Get personalized health recommendations based on current air quality and your health profile
                    </p>
                </div>

                {/* Features row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    {[
                        { icon: '👤', text: 'Tailored to your health profile' },
                        { icon: '🔬', text: 'Comprehensive risk assessment' },
                        { icon: '🛡️', text: 'Immediate & long-term strategies' },
                        { icon: '📋', text: 'Based on medical guidelines' },
                    ].map((f) => (
                        <div key={f.text} className="bg-[#111827] border border-slate-800 rounded-xl p-3 flex items-start gap-2">
                            <span className="text-xl">{f.icon}</span>
                            <span className="text-slate-400 text-xs leading-tight">{f.text}</span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Form */}
                    <div className="bg-[#111827] border border-slate-800 rounded-xl p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Age */}
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">Your Age</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="120"
                                    required
                                    value={form.age}
                                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                                    className="w-full bg-[#0d1528] border border-slate-700 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-white outline-none transition-colors text-sm"
                                    placeholder="e.g. 28"
                                />
                            </div>

                            {/* Current AQI */}
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Current AQI in your area <span className="text-slate-500">(optional)</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="500"
                                    value={form.currentAqi}
                                    onChange={(e) => setForm({ ...form, currentAqi: e.target.value })}
                                    className="w-full bg-[#0d1528] border border-slate-700 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-white outline-none transition-colors text-sm"
                                    placeholder="e.g. 150"
                                />
                            </div>

                            {/* Existing Conditions */}
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">Existing Health Conditions</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {CONDITIONS.map((c) => (
                                        <button
                                            type="button"
                                            key={c}
                                            onClick={() => toggleCondition(c)}
                                            className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${form.conditions.includes(c)
                                                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
                                                    : 'bg-[#0d1528] border border-slate-700 text-slate-400 hover:border-slate-500'
                                                }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Activity Level */}
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">Activity Level</label>
                                <div className="space-y-2">
                                    {ACTIVITY_LEVELS.map((a) => (
                                        <label key={a.val} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="activity"
                                                value={a.val}
                                                checked={form.activityLevel === a.val}
                                                onChange={() => setForm({ ...form, activityLevel: a.val })}
                                                className="accent-emerald-500 w-4 h-4"
                                            />
                                            <span className={`text-sm ${form.activityLevel === a.val ? 'text-emerald-400' : 'text-slate-400'} group-hover:text-slate-300 transition-colors`}>
                                                {a.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-white font-semibold rounded-lg transition-all shadow-lg shadow-emerald-500/25"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Analyzing...
                                    </span>
                                ) : 'Get Health Assessment'}
                            </button>
                        </form>
                    </div>

                    {/* Result */}
                    <div>
                        {!result ? (
                            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center h-full gap-4 text-center">
                                <div className="text-5xl">🌬️</div>
                                <p className="text-slate-500 text-sm">Fill in your health profile on the left and click <strong className="text-slate-300">Get Health Assessment</strong> to receive personalized recommendations.</p>
                            </div>
                        ) : (
                            <div className={`border rounded-xl p-6 ${colors.border} ${colors.bg}`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-3xl">{colors.icon}</span>
                                    <div>
                                        <div className="text-white font-bold text-lg">Risk Level: <span className={colors.text}>{result.riskLevel}</span></div>
                                        <div className="text-slate-400 text-sm">Based on your profile</div>
                                    </div>
                                </div>

                                <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border} mb-4`}>
                                    <p className="text-white text-sm font-medium leading-relaxed">{result.recommendation}</p>
                                </div>

                                <h3 className="text-white font-semibold mb-3">Personalized Tips</h3>
                                <ul className="space-y-2">
                                    {result.tips.map((tip, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                            <span className={`mt-0.5 ${colors.text}`}>•</span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => setResult(null)}
                                    className="mt-5 w-full py-2 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white text-sm rounded-lg transition-colors"
                                >
                                    New Assessment
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
