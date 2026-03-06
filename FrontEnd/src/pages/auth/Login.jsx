import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const checkRequirements = async () => {
        // if (!window.isSecureContext) throw new Error('Bluetooth requires a secure connection (HTTPS). Please ensure you are visiting via https:// or localhost.');
        if (!navigator.onLine) throw new Error('Wi-Fi or Network access is required to sign in.');
        // if (!navigator.bluetooth) throw new Error('Bluetooth is not supported on this browser/device.');
        // const btAvailable = await navigator.bluetooth.getAvailability();
        // if (!btAvailable) throw new Error('System Bluetooth is currently unavailable or disabled.');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await checkRequirements();
        } catch (err) {
            setError(err.message || 'Network access is required to sign in.');
            return;
        }

        setLoading(true);
        try {
            await signIn(form.email, form.password);
            navigate('/analyze');
        } catch (err) {
            setError(err.message || 'Failed to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        try {
            await checkRequirements();
        } catch (err) {
            setError(err.message || 'Network access is required to sign in.');
            return;
        }

        setLoading(true);
        try {
            await signInWithGoogle();
        } catch (err) {
            setError(err.message || 'Failed to sign in with Google.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                            </svg>
                        </div>
                        <span className="text-white font-bold text-2xl">Zenab</span>
                    </Link>
                    <p className="text-slate-400">Environmental Monitoring System</p>
                </div>

                {/* Card */}
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8">
                    <h2 className="text-white text-xl font-semibold mb-6">Welcome back</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-slate-400 text-sm mb-1.5">Email address</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full bg-[#0d1528] border border-slate-700 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 outline-none transition-colors text-sm"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full bg-[#0d1528] border border-slate-700 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 outline-none transition-colors text-sm pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-emerald-400 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/25"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-between">
                        <span className="border-b border-slate-700 w-1/5 lg:w-1/4"></span>
                        <span className="text-xs text-center text-slate-500 uppercase">or continue with</span>
                        <span className="border-b border-slate-700 w-1/5 lg:w-1/4"></span>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        type="button"
                        className="w-full mt-6 py-2.5 bg-[#0d1528] hover:bg-[#1a233a] border border-slate-700 text-white font-medium rounded-lg flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.58c2.08-1.92 3.27-4.74 3.27-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.58-2.77c-.98.66-2.23 1.06-3.7 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>

                    <p className="text-center text-slate-500 text-sm mt-6">
                        Don&apos;t have an account?{' '}
                        <Link to="/auth/signup" className="text-emerald-400 hover:text-emerald-300 font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
