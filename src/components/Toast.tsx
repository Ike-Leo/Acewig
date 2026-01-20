/**
 * Toast Notification System
 * 
 * Stackable toast notifications with auto-dismiss.
 * Matches dark luxury theme with gold accents.
 */

import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Toast as ToastType, ToastType as ToastTypeEnum } from '@/types';
import { useToast } from '@/src/contexts/AppContext';

// =====================================
// Toast Item Component
// =====================================

interface ToastItemProps {
    toast: ToastType;
    onClose: () => void;
}

const iconMap: Record<ToastTypeEnum, React.ElementType> = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
};

const colorMap: Record<ToastTypeEnum, { bg: string; border: string; icon: string; text: string }> = {
    success: {
        bg: 'bg-green-900/30',
        border: 'border-green-500/30',
        icon: 'text-green-400',
        text: 'text-green-100',
    },
    error: {
        bg: 'bg-red-900/30',
        border: 'border-red-500/30',
        icon: 'text-red-400',
        text: 'text-red-100',
    },
    info: {
        bg: 'bg-primary/10',
        border: 'border-primary/30',
        icon: 'text-primary',
        text: 'text-foreground',
    },
    warning: {
        bg: 'bg-yellow-900/30',
        border: 'border-yellow-500/30',
        icon: 'text-yellow-400',
        text: 'text-yellow-100',
    },
};

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
    const Icon = iconMap[toast.type];
    const colors = colorMap[toast.type];

    return (
        <div
            className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl
        animate-slide-in-right
        ${colors.bg} ${colors.border}
      `}
            role="alert"
            aria-live="polite"
        >
            <Icon className={`w-5 h-5 flex-shrink-0 ${colors.icon}`} />
            <p className={`text-sm font-medium flex-1 ${colors.text}`}>
                {toast.message}
            </p>
            <button
                onClick={onClose}
                className="text-foreground-muted hover:text-foreground transition-colors p-1 -mr-1"
                aria-label="Close notification"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

// =====================================
// Toast Container Component
// =====================================

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div
            className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full"
            aria-label="Notifications"
        >
            {toasts.map(toast => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

// =====================================
// CSS Animation (add to index.css)
// =====================================

/*
Add this to your index.css:

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out forwards;
}
*/

export default ToastContainer;
