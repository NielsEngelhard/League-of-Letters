"use client"

import { X } from "lucide-react";

interface Props {
    children: React.ReactNode;
    title?: string;
    onClose?: () => void;
}

export default function SidePopup({ children, title, onClose }: Props) {
    return (
        <div className="fixed right-4 bottom-4 md:right-8 md:bottom-8 max-w-sm w-full md:w-auto bg-background backdrop-blur-xl border border-border rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-light text-foreground tracking-tight">
                    {title && title}
                </h3>

                {onClose && (
                    <button
                        onClick={onClose}
                        className="ml-4 p-1.5 rounded-full bg-foreground-muted/20 hover:bg-foreground-muted/40 transition-colors duration-200 group"
                        aria-label="Close"
                    >
                        <X 
                            size={16} 
                            className="text-foreground/70"
                        />
                    </button>
                )}
            </div>

            {/* Content */}
            <div>
                {children}
            </div>
        </div>
    );
}
