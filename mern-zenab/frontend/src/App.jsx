import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import HistoryPage from './pages/HistoryPage';
import Recommendations from './pages/Recommendations';
import Login from './pages/Login';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('userInfo'));

    useEffect(() => {
        const handleAuthChange = () => {
            setIsAuthenticated(!!localStorage.getItem('userInfo'));
        };

        window.addEventListener('auth-change', handleAuthChange);
        return () => window.removeEventListener('auth-change', handleAuthChange);
    }, []);

    const PrivateRoute = ({ children }) => {
        return isAuthenticated ? children : <Navigate to="/login" replace />;
    };

    return (
        <BrowserRouter>
            {isAuthenticated && <Navbar />}
            <div className={`${isAuthenticated ? 'pt-16' : ''} pb-6 min-h-screen bg-gray-50`}>
                <Routes>
                    <Route
                        path="/login"
                        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
                    />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/map" element={<PrivateRoute><MapPage /></PrivateRoute>} />
                    <Route path="/history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
                    <Route path="/recommendations" element={<PrivateRoute><Recommendations /></PrivateRoute>} />

                    <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
                    <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
