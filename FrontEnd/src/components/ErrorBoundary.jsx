import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('Zenab ErrorBoundary caught:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
                    <div className="max-w-md text-center">
                        <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                            ⚠️
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            An unexpected error occurred in the application. Please try refreshing the page.
                        </p>
                        {this.state.error && (
                            <pre className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-left mb-6 overflow-auto max-h-40">
                                {this.state.error.message}
                            </pre>
                        )}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => this.setState({ hasError: false, error: null })}
                                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
                            >
                                Try Again
                            </button>
                            <Link
                                to="/"
                                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium rounded-lg transition-colors"
                            >
                                Go Home
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
