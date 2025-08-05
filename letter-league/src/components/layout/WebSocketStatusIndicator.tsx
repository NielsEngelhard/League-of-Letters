import { ConnectionStatus, useSocket } from "@/features/realtime/socket-context";
import { useEffect } from "react";

interface Props {

}

const getStatusConfig = (status: ConnectionStatus) => {
    switch (status) {
        case 'connected':
            return {
                color: 'bg-success',
                text: 'Connected',
                icon: '●',
                pulse: false
            };
        case 'connecting':
            return {
                color: 'bg-warning',
                text: 'Connecting',
                icon: '◐',
                pulse: true
            };
        case 'disconnected':
            return {
                color: 'bg-error',
                text: 'Disconnected',
                icon: '○',
                pulse: false
            };
        case 'error':
            return {
                color: 'bg-red-500',
                text: 'Connection Error',
                icon: '✕',
                pulse: true
            };
        default:
            return {
                color: '',
                text: '',
                icon: '',
                pulse: false
            }
    }
}

export default function WebSocketStatusIndicator({}: Props) {
    const { connectionStatus } = useSocket();

    useEffect(() => {

    });

    const config = getStatusConfig(connectionStatus);

    return (
        <>
            {connectionStatus != "empty" && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border">
                    <div className={`w-2 h-2 rounded-full ${config.color} ${config.pulse ? 'animate-pulse' : ''}`} />
                    <span className="text-xs font-medium text-foreground hidden sm:inline">
                        {config.text}
                    </span>
                    <span className="text-xs text-foreground sm:hidden">
                        {config.icon}
                    </span>
                </div>                
            )}
        </>
    )
}