"use client"

import { ConnectionStatus } from "@/features/realtime/realtime-models";

interface Props {
    connectionStatus: ConnectionStatus;
    showText?: boolean;
}

const getStatusConfig = (connectionStatus: ConnectionStatus) => {
    switch (connectionStatus) {
        case 'connected':
            return {
                dot: 'bg-success shadow-success/20',
                text: 'Connected',
                pulse: false
            };
        case 'connecting':
            return {
                dot: 'bg-warning shadow-warning/20',
                text: 'Connecting',
                pulse: true
            };
        case 'disconnected':
            return {
                dot: 'bg-error shadow-error/10',
                text: 'Disconnected',
                pulse: true
            };
        case 'error':
            return {
                dot: 'bg-error shadow-error/25',
                text: 'Error',
                pulse: true
            };
        default:
            return {
                dot: 'bg-slate-500 shadow-slate-500/10',
                text: 'Unknown',
                pulse: false
            }
    }
}

export default function WebSocketStatusIndicator({ connectionStatus, showText = false }: Props) {
    const config = getStatusConfig(connectionStatus);

    return (
        <>
            {connectionStatus != "empty" && (
                <div className="flex flex-row gap-1">
                    {/* Status Indicator */}
                    <div className="relative flex items-center justify-center">
                        {/* Main Status Dot */}
                        <div className={`relative w-2.5 h-2.5 rounded-full ${config.dot} shadow-md transition-all duration-300 ${config.pulse ? 'animate-pulse' : ''}`}>
                            {/* Inner Highlight for that finishing touch */}
                            <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-white" />
                        </div>
                    </div>

                    {/* Status Text - Hidden on mobile, visible on larger screens */}
                    {showText && (
                        <div className="hidden sm:flex flex-col justify-center">
                            <span className="text-[8px] font-medium text-foreground/40 uppercase tracking-wider leading-none">
                                websocket
                            </span>
                            <span className="text-xs font-semibold text-foreground/90 tracking-wide leading-tight">
                                {config.text}
                            </span>
                        </div>                        
                    )}
                </div>
            )}
        </>
    )
}