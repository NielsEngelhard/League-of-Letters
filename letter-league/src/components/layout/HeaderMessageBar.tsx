"use client"
import { Book, Check, CircleX, Settings } from "lucide-react";
import { GlobalMsgType, MessageBarMessage, useMessageBar } from "./MessageBarContext";
import { useEffect, useState } from "react";

const getConfig = (status: GlobalMsgType) => {
    switch (status) {
        case 'success':
            return {
                bg: 'bg-success/10',
                color: 'text-success',
                Icon: Check,
                text: 'Successfully executed!'
            };
        case 'loading':
            return {
                bg: 'bg-warning/10',
                color: 'text-warning',
                Icon: Settings,
                text: 'Loading ...'
            };
        case 'error':
            return {
                bg: 'bg-error/10',
                color: 'text-error',
                Icon: CircleX,
                text: 'Something went wrong...'
            };
        default:
            return {
                bg: 'bg-primary/10',
                color: 'text-primary',
                Icon: Book,
                text: '??'
            };
    }
}

export default function HeaderMessageBar() {
    const [isOpen, setIsOpen] = useState(false); // Different bool for smooth animation
    const [msg, setMsg] = useState<MessageBarMessage | null>(null);

    const { currentMessage } = useMessageBar();

    // For smooth text animation
    useEffect(() => {
        if (currentMessage != null) {
            setMsg(currentMessage);
            setIsOpen(true);
            return;
        }

        if (!isOpen) {
            return;
        }

        setIsOpen(false);
        setTimeout(() => {
            setMsg(null);
        }, 300);
    }, [currentMessage]);
    
    const config = getConfig(msg?.type ?? "information");
    const { Icon } = config;

    return (
        <div 
            className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
            <div className={`w-full flex items-center justify-center gap-1 ${config.bg}`}>
                <Icon className={`w-4 h-4 ${config.color} ${msg?.type == "loading" && "animate-spin"}`} />
                <span className={`text-sm py-3 font-medium ${config.color}`}>
                    {msg?.msg ?? config.text}
                </span>
            </div>
        </div>
    );
}