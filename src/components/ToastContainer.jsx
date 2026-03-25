import { createContext, useContext } from 'react';
import { useToast } from '../context/ToastContext';

export { ToastProvider } from '../context/ToastContext';
export { useToast };

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg pointer-events-auto animate-slide-in-right max-w-sm ${
            toast.type === 'success'
              ? 'bg-green-500 text-white'
              : toast.type === 'error'
                ? 'bg-red-500 text-white'
                : toast.type === 'warning'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-blue-500 text-white'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-lg font-bold hover:opacity-70 transition-opacity"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
