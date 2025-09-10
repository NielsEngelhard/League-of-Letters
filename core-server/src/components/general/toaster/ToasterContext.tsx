'use client';

import { generateUUID } from '@/lib/token-generation';
import { createContext, useState, ReactNode, useContext } from 'react';

export type ToastType = "success" | "warning" | "error" | "information" | "loading" | "live-connected";

export interface ToastContent {
  msg: string;
  title?: string;  
  type?: ToastType;
}

export interface Toast {
  id: string;
  content: ToastContent;
}

type ToasterContextType = {
  toasts: Toast[] | null;
  pushToast: (msg: ToastContent, durationInSeconds?: number | null) => void;
  errorToast: (msg?: string) => void;
  successToast: (msg?: string) => void;
  loadingToast: (msg?: string) => void;
  clearToasts: () => void;
  removeToast: (id: string) => void;
};

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

export function ToasterProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function pushToast(msg: ToastContent, durationInSeconds: number | null = 3) {
    if (!msg.type) msg.type = "information";

    const id = generateUUID();

    setToasts(prev => [...prev, {
      id: id,
      content: msg,
    }])

    if (durationInSeconds != null) {
      setTimeout(() => {
        removeToast(id);
      }, (durationInSeconds * 1000));
    }
  }

  function errorToast(msg: string = "Error") {
    pushToast({ msg: msg, type: "error"});
  }

  function successToast(msg: string = "Success") {
    pushToast({ msg: msg, type: "success"});
  }
  
  function loadingToast(msg: string = "Loading") {
    pushToast({ msg: msg, type: "loading"}, null);
  }  

  function clearToasts() {
    setToasts([]);
  }

  function removeToast(id: string) {
    setToasts(prev => prev.filter(t => t.id != id));
  }

  return (
    <ToasterContext.Provider value={{ toasts, removeToast, clearToasts, errorToast, loadingToast, pushToast, successToast }}>
      {children}
    </ToasterContext.Provider>
  );
}

export function useToaster() {
  const context = useContext(ToasterContext);
  if (context === undefined) {
    throw new Error('useToaster must be used within an ToasterProvider');
  }
  return context;
}
