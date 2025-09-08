"use client"

import { Book, Check, CircleX, Router, Settings, X } from "lucide-react";
import { GlobalMsgType, MessageBarMessage, useMessageBar } from "./MessageBarContext";
import { useEffect, useState } from "react";

const getConfig = (status: GlobalMsgType) => {
    switch (status) {
        case 'success':
            return {
                bg: 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800',
                color: 'text-green-800 dark:text-green-200',
                iconColor: 'text-green-600 dark:text-green-400',
                Icon: Check,
                text: 'Success'
            };
        case 'loading':
            return {
                bg: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
                color: 'text-blue-800 dark:text-blue-200',
                iconColor: 'text-blue-600 dark:text-blue-400',
                Icon: Settings,
                text: 'Loading...'
            };
        case 'error':
            return {
                bg: 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800',
                color: 'text-red-800 dark:text-red-200',
                iconColor: 'text-red-600 dark:text-red-400',
                Icon: CircleX,
                text: 'Error'
            };
        case 'live-connected':
            return {
                bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
                color: 'text-emerald-800 dark:text-emerald-200',
                iconColor: 'text-emerald-600 dark:text-emerald-400',
                Icon: Router,
                text: 'Connected'
            };         
        default:
            return {
                bg: 'bg-gray-50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800',
                color: 'text-gray-800 dark:text-gray-200',
                iconColor: 'text-gray-600 dark:text-gray-400',
                Icon: Book,
                text: 'Information'
            };
    }
}

export default function ToastNotification() {
    const [isVisible, setIsVisible] = useState(false);
    const [msg, setMsg] = useState<MessageBarMessage | null>(null);

    const { currentMessage } = useMessageBar();

    // Handle message visibility with smooth animations
    useEffect(() => {
        if (currentMessage != null) {
            setMsg(currentMessage);
            setIsVisible(true);
            return;
        }

        if (!isVisible) {
            return;
        }

        setIsVisible(false);
        const timeout = setTimeout(() => {
            setMsg(null);
        }, 300);

        return () => clearTimeout(timeout);
    }, [currentMessage, isVisible]);

    const handleClose = () => {
        setIsVisible(false);
    };
    
    const config = getConfig(msg?.type ?? "information");
    const { Icon } = config;

    if (!msg) return null;

    return (
        <div className="fixed top-4 right-4 z-[100] pointer-events-none">
            <div 
                className={`
                    pointer-events-auto transform transition-all duration-300 ease-out
                    ${isVisible 
                        ? 'translate-x-0 opacity-100 scale-100' 
                        : 'translate-x-full opacity-0 scale-95'
                    }
                `}
            >
                <div className={`
                    max-w-sm w-full rounded-lg border shadow-lg backdrop-blur-sm
                    ${config.bg}
                `}>
                    <div className="p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <Icon 
                                    className={`w-5 h-5 ${config.iconColor} ${
                                        msg.type === "loading" ? "animate-spin" : ""
                                    }`} 
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${config.color}`}>
                                    {msg.msg || config.text}
                                </p>
                            </div>
                            {msg.type !== 'loading' && (
                                <button
                                    onClick={handleClose}
                                    className={`
                                        flex-shrink-0 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/5 
                                        transition-colors ${config.iconColor}
                                    `}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* Progress bar for loading state */}
                    {msg.type === 'loading' && (
                        <div className="h-1 bg-foreground/10 rounded-b-lg overflow-hidden">
                            <div className="h-full bg-warning opacity-60 animate-pulse rounded-b-lg" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}