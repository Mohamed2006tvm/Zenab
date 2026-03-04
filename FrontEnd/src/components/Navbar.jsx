import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';

const navLinks = [
    { to: '/analyze', label: '🔬 Analyzer', protected: true },
    { to: '/dashboard', label: 'Dashboard', protected: true },
    { to: '/map', label: 'Map', protected: false },
    { to: '/ai-insights', label: 'AI Insights', protected: false },
    { to: '/health', label: 'Health', protected: true },
    { to: '/reports', label: 'Reports', protected: true },
    { to: '/hardware', label: 'Hardware', protected: false },
];

export default function Navbar() {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (e) {
            console.error(e);
        }
    };

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
    const avatarLetter = displayName[0].toUpperCase();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 bg-[#0d1528]/90 border-slate-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                            </svg>
                        </div>
                        <span className="font-bold text-xl tracking-tight transition-colors text-white">Zenab</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.filter(link => !link.protected || user).map((link) => {
                            const isActive = location.pathname === link.to;
                            const classes = isActive ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-800';
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${classes}`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors group"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                        {avatarLetter}
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <div className="text-white text-sm font-medium leading-none">{displayName}</div>
                                        <div className="text-slate-500 text-xs mt-0.5">{user.email}</div>
                                    </div>
                                    <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-[#111827] border border-slate-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                                        <div className="px-4 py-3 border-b border-slate-800 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                                                    {avatarLetter}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <div className="text-white text-sm font-semibold truncate">{displayName}</div>
                                                    <div className="text-slate-500 text-xs truncate">{user.email}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="py-1">
                                            <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm">
                                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                Edit Profile
                                            </Link>
                                            <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm">
                                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                                                Dashboard
                                            </Link>
                                        </div>
                                        <div className="border-t border-slate-800 py-1">
                                            <button onClick={() => { setProfileOpen(false); handleSignOut(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/auth/login" className="px-4 py-1.5 text-sm transition-colors text-slate-300 hover:text-white">Sign In</Link>
                                <Link to="/auth/signup" className="px-5 py-2 text-sm font-bold rounded-full transition-all duration-300 bg-emerald-500 text-white hover:bg-emerald-400">Get Started</Link>
                            </div>
                        )}

                        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                            </svg>
                        </button>
                    </div>
                </div>

                {menuOpen && (
                    <div className="md:hidden border-t border-slate-800 py-3">
                        {navLinks.filter(link => !link.protected || user).map((link) => (
                            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className={`block px-3 py-2 rounded-md text-sm font-medium mb-1 transition-colors ${location.pathname === link.to ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                                {link.label}
                            </Link>
                        ))}
                        {!user && (
                            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-2 px-3">
                                <Link to="/auth/login" onClick={() => setMenuOpen(false)} className="text-center py-2 text-sm text-slate-300 hover:text-white font-medium transition-colors">Sign In</Link>
                                <Link to="/auth/signup" onClick={() => setMenuOpen(false)} className="text-center py-2 bg-emerald-500 text-white text-sm font-bold rounded-lg hover:bg-emerald-400 transition-colors">Get Started</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}