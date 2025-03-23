'use client';

import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

const ToastProvider = React.createContext<{
  toasts: Toast[]
  addToast: (toast: Toast) => void
  removeToast: (id: string) => void
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export type ToastVariant = "default" | "destructive" | "success";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant;
  onClose?: () => void;
}

export function Toast({
  className,
  variant = "default",
  onClose,
  children,
  ...props
}: ToastProps) {
  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border border-gray-700 p-6 shadow-lg transition-all",
        {
          "bg-navy-dark text-white border-gray-700": variant === "default",
          "bg-red-900/50 text-white border-red-800": variant === "destructive",
          "bg-green-900/50 text-white border-green-800": variant === "success",
        },
        className
      )}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-transparent opacity-50 hover:opacity-100 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function ToastTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <div
      className={cn("text-sm font-semibold", className)}
      {...props}
    />
  );
}

export function ToastDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("text-sm opacity-90", className)}
      {...props}
    />
  );
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Toast) => {
    const id = toast.id || generateId();
    const duration = toast.duration || 5000;
    
    setToasts((prev) => [...prev, { ...toast, id }]);
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);
  
  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  
  return (
    <ToastProvider.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 md:max-w-[420px]">
          {toasts.map((toast) => (
            <Toast 
              key={toast.id} 
              variant={toast.variant} 
              onClose={() => removeToast(toast.id)}
              className="animate-in fade-in slide-in-from-bottom-5"
            >
              {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
              {toast.description && (
                <ToastDescription>{toast.description}</ToastDescription>
              )}
            </Toast>
          ))}
        </div>
      )}
    </ToastProvider.Provider>
  );
}

export const useToast = () => {
  const context = React.useContext(ToastProvider);
  
  if (!context) {
    throw new Error("useToast must be used within a ToastContainer");
  }
  
  const toast = React.useCallback(
    (props: Omit<Toast, "id">) => {
      context.addToast({ ...props, id: generateId() });
    },
    [context]
  );
  
  return { 
    toast,
    dismiss: context.removeToast 
  };
};
