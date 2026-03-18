'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type ToastType = 'success' | 'error' | 'info' | 'loading';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => string;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (type !== 'loading') {
      setTimeout(() => {
        hideToast(id);
      }, 5000);
    }
    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[1000] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div className={`
                flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border
                ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600' : ''}
                ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-[#b50a0a]' : ''}
                ${toast.type === 'info' ? 'bg-blue-500/10 border-blue-500/20 text-blue-600' : ''}
                ${toast.type === 'loading' ? 'bg-black/80 border-white/10 text-white' : ''}
                ${toast.type !== 'loading' && toast.type !== 'success' && toast.type !== 'error' && toast.type !== 'info' ? 'bg-white border-gray-100 text-gray-900' : ''}
              `}>
                <div className="shrink-0">
                  {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                  {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                  {toast.type === 'info' && <Info className="w-5 h-5" />}
                  {toast.type === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
                </div>
                <p className="text-[11px] font-black uppercase tracking-widest">{toast.message}</p>
                <button 
                  onClick={() => hideToast(toast.id)}
                  className="ml-4 p-1 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
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
