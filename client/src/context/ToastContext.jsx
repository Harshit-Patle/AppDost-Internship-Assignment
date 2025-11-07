import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]); // { id, type, message }

    const remove = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const push = useCallback((message, type = 'info', ttl = 3000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => remove(id), ttl);
    }, [remove]);

    return (
        <ToastContext.Provider value={{ push }}>
            {children}
            {/* Toast container */}
            <div
                aria-live="polite"
                aria-atomic="true"
                className="fixed bottom-4 right-4 z-50 space-y-2 w-72"
            >
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`px-4 py-3 rounded-lg shadow-sm text-sm font-medium flex items-start gap-3 border animate-slideUp ${t.type === 'error'
                                ? 'bg-red-50 border-red-200 text-red-800'
                                : t.type === 'success'
                                    ? 'bg-green-50 border-green-200 text-green-800'
                                    : 'bg-gray-800 border-gray-700 text-white'
                            }`}
                        role="alert"
                    >
                        <span className="flex-1">{t.message}</span>
                        <button
                            aria-label="Dismiss notification"
                            onClick={() => remove(t.id)}
                            className="text-xs font-semibold opacity-70 hover:opacity-100"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
