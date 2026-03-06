import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = ++toastId;
        setToasts((prev) => [...prev, { id, message, type, duration }]);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = {
        success: (msg, dur) => addToast(msg, 'success', dur),
        error: (msg, dur) => addToast(msg, 'error', dur),
        info: (msg, dur) => addToast(msg, 'info', dur),
        warning: (msg, dur) => addToast(msg, 'warning', dur),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
    return ctx;
}

const TYPE_STYLES = {
    success: { bar: 'bg-emerald-500', icon: '✅', border: 'border-emerald-500/30 bg-emerald-500/10', text: 'text-emerald-300' },
    error:   { bar: 'bg-red-500',     icon: '❌', border: 'border-red-500/30 bg-red-500/10',       text: 'text-red-300'     },
    warning: { bar: 'bg-yellow-500',  icon: '⚠️', border: 'border-yellow-500/30 bg-yellow-500/10', text: 'text-yellow-300'  },
    info:    { bar: 'bg-blue-500',    icon: 'ℹ️', border: 'border-blue-500/30 bg-blue-500/10',     text: 'text-blue-300'    },
};

function ToastItem({ toast, onRemove }) {
    const s = TYPE_STYLES[toast.type] || TYPE_STYLES.info;

    useEffect(() => {
        const t = setTimeout(() => onRemove(toast.id), toast.duration || 4000);
        return () => clearTimeout(t);
    }, [toast.id, toast.duration, onRemove]);

    return (
        <div
            className={`relative flex items-start gap-3 w-80 max-w-[calc(100vw-32px)] border rounded-xl px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur-sm ${s.border} animate-[slideInRight_0.3s_ease-out]`}
        >
            {/* Progress bar */}
            <div
                className={`absolute bottom-0 left-0 h-0.5 rounded-full ${s.bar} animate-[shrink_linear]`}
                style={{ animationDuration: `${toast.duration || 4000}ms`, animationFillMode: 'forwards' }}
            />
            <span className="text-lg flex-shrink-0 mt-0.5">{s.icon}</span>
            <p className={`text-sm leading-snug flex-1 ${s.text} pr-4`}>{toast.message}</p>
            <button
                onClick={() => onRemove(toast.id)}
                className="absolute top-2 right-2 text-slate-500 hover:text-slate-300 transition-colors text-xs"
                aria-label="Dismiss"
            >
                ✕
            </button>
        </div>
    );
}

function ToastContainer({ toasts, removeToast }) {
    if (!toasts.length) return null;
    return (
        <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
            {toasts.map((t) => (
                <div key={t.id} className="pointer-events-auto">
                    <ToastItem toast={t} onRemove={removeToast} />
                </div>
            ))}
        </div>
    );
}
