"use client"

import { Book, Check, CircleX, Settings,  } from "lucide-react";
import { GlobalMsgType, useMessageBar } from "./MessageBarContext";

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
                text: ''
            };
    }
}

export default function HeaderMessageBar() {
    const { currentMessage } = useMessageBar();

    const config = getConfig(currentMessage?.type ?? "information");

    return (
        <>
            {currentMessage && (
                <div className={`w-full flex justify-center slide-in-top ${config.bg}`}>
                    <span className={`text-sm py-2 font-medium ${config.color}`}>
                        {currentMessage.msg ?? config.text}
                    </span>
                </div>                
            )}
        </>
    );
}
