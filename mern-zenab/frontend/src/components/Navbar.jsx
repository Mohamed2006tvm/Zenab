import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Map, History, Lightbulb, LogOut } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('userInfo');
        window.dispatchEvent(new Event('auth-change'));
        navigate('/login');
    };

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: <Leaf size={20} /> },
        { name: 'Map', path: '/map', icon: <Map size={20} /> },
        { name: 'History', path: '/history', icon: <History size={20} /> },
        { name: 'Insights', path: '/recommendations', icon: <Lightbulb size={20} /> },
    ];

    return (
        <nav className="bg-white shadow-md fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-zenab flex items-center justify-center text-white">
                                <Leaf size={20} />
                            </div>
                            <span className="font-bold text-xl text-zenab-dark tracking-wide">ZENAB AI</span>
                        </Link>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${location.pathname === link.path
                                        ? 'bg-zenab-light text-zenab-dark font-bold'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}
                        <button
                            onClick={handleSignOut}
                            className="ml-4 flex items-center gap-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
