import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { X, AlertCircle, CheckCircle2, Info } from 'lucide-react';

export interface ToastMessage {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProps {
    message: ToastMessage;
    onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(message.id);
        }, 5000);

        return () => clearTimeout(timer);
    }, [message.id, onClose]);

    const colors = {
        success: 'from-green-500/10 to-green-600/5 border-green-500/30',
        error: 'from-red-500/10 to-red-600/5 border-red-500/30',
        info: 'from-blue-500/10 to-blue-600/5 border-blue-500/30',
    };

    const iconColors = {
        success: 'text-green-400',
        error: 'text-red-400',
        info: 'text-blue-400',
    };

    const Icon = message.type === 'success' ? CheckCircle2 : message.type === 'error' ? AlertCircle : Info;

    return (
        <div
            className={`flex items-start gap-3 bg-gradient-to-r ${colors[message.type]} border backdrop-blur-md rounded-xl p-4 shadow-lg min-w-[300px] max-w-md animate-slide-in-right z-[500]`}
        >
            <Icon className={`${iconColors[message.type]} flex-shrink-0 mt-0.5`} size={20} />
            <p className="text-white text-sm flex-1">{message.message}</p>
            <button
                onClick={() => onClose(message.id)}
                className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
                <X size={18} />
            </button>
        </div>
    );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<ToastMessage[]>([]);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setMessages((prev) => [...prev, { id, message, type }]);
    }, []);

    const closeToast = useCallback((id: string) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[500] flex flex-col gap-3 pointer-events-none">
                {messages.map((message) => (
                    <div key={message.id} className="pointer-events-auto">
                        <Toast message={message} onClose={closeToast} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

