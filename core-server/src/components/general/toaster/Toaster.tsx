"use client"

import ToastComponent from "./Toast";
import { useToaster } from "./ToasterContext";

export default function Toaster() {
    const { toasts } = useToaster();

    if (!toasts || toasts.length < 1) return null;

    // Show only the 3 most recent toasts if there are more than 3
    const displayedToasts = toasts.length > 3 ? toasts.slice(-3) : toasts;

    return (
        <div className="fixed top-6 right-6 z-[9999] pointer-events-none flex flex-col gap-2">
            {displayedToasts.map((toast) => (
                <ToastComponent toast={toast} key={toast.id} />
            ))}
        </div>
    );
}