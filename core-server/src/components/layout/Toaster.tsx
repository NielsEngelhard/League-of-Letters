"use client"

import { Check, CircleX, Info, Loader2, X } from "lucide-react";
import { GlobalMsgType, MessageBarMessage, useMessageBar } from "./MessageBarContext";
import { useEffect, useState } from "react";

const getToastConfig = (type?: GlobalMsgType) => {
    switch (type) {
        case "success":
            return {
                iconColor: 'text-success',
                iconBg: 'bg-success/20',
                Icon: Check
            }
        case "error":
            return {
                iconColor: 'text-error',
                iconBg: 'bg-error/20',
                Icon: CircleX
            }
        case "warning":
            return {
                iconColor: 'text-warning',
                iconBg: 'bg-warning/20',
                Icon: Info
            }
        case "loading":
            return {
                iconColor: 'text-primary',
                iconBg: 'bg-primary/20',
                Icon: Loader2
            }                                    
        default:
            return {
                iconColor: 'text-primary',
                iconBg: 'bg-primary/20',
                Icon: Info
            } 
    }
}; 

export default function ToastNotification() {
    const [isVisible, setIsVisible] = useState(false);
    const [msg, setMsg] = useState<MessageBarMessage | null>(null);
    const { currentMessage } = useMessageBar();

    useEffect(() => {
        if (currentMessage) {
            setMsg(currentMessage);
            setIsVisible(true);
            return;
        }

        if (isVisible) {
            setIsVisible(false);
            const timeout = setTimeout(() => setMsg(null), 300);
            return () => clearTimeout(timeout);
        }
    }, [currentMessage, isVisible]);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!msg) return null;

    const config = getToastConfig(msg.type);
    const { Icon } = config;

    return (
        <div className="fixed top-6 right-6 z-[9999] pointer-events-none">
            <div 
                className={`
                    bg-background border-border border border-t-2
                    pointer-events-auto
                    transform transition-all duration-300 ease-out
                    ${isVisible 
                        ? 'translate-x-0 opacity-100 scale-100' 
                        : 'translate-x-full opacity-0 scale-95'
                    }
                    rounded-lg shadow-lg backdrop-blur-sm min-w-80 max-w-md`}
            >
                <div className="flex items-start gap-3 p-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                        <div className={`p-1.5 rounded-lg ${config.iconBg}`}>
                            <Icon 
                                size={20} 
                                className={`${config.iconColor} ${msg.type === 'loading' ? 'animate-spin' : ''}`} 
                            />                            
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {msg.title && (
                            <p className="font-medium text-sm text-foreground">
                                {msg.title}
                            </p>
                        )}
                        {msg.msg && (
                            <p className={`text-xs leading-5 text-foreground-muted`}>
                                {msg.msg}
                            </p>
                        )}
                    </div>

                    {/* Close Button */}
                    {msg.type !== 'loading' && (
                        <button
                            onClick={handleClose}
                            className={`flex-shrink-0 p-1 rounded-md text-foreground-muted`}
                            aria-label="Close notification"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}