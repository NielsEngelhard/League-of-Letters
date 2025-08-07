import Icon from "@/components/ui/Icon";
import { ConnectionStatus } from "./realtime-models"
import { Cable, ServerCrash, Telescope, Unplug, Wifi } from "lucide-react";

interface Props {
    status: ConnectionStatus;
    showIcon?: boolean;
    showDot?: boolean;
    showLabel?: boolean;
}

const getStatusConfig = (status: ConnectionStatus) => {
    switch (status) {
        case 'connected':
            return {
                bg: 'bg-success',
                color: 'text-success',
                Icon: Wifi,
                text: 'connected'
            };
        case 'connecting':
            return {
                bg: 'bg-warning animate-pulse animate-ping',
                color: 'text-warning',
                Icon: Cable,
                text: 'connecting'
            };
        case 'disconnected':
            return {
                bg: 'bg-error',
                color: 'text-error',
                Icon: Unplug,
                text: 'disconnected'
            };
        case 'error':
            return {
                bg: 'bg-error',
                color: 'text-error',
                Icon: ServerCrash,
                text: 'error'
            };
        case 'empty':
            return {
                bg: 'bg-gray-500',
                color: 'text-gray-500',
                Icon: Telescope,
                text: '??'
            };
    }
}

export default function RealtimeStatusIndicator({ status, showIcon = false, showDot = true, showLabel = false }: Props) {
    const config = getStatusConfig(status);

    return (
    <div className="flex flex-row gap-1 items-center">
        {showLabel && (
            <span className={`text-sm ${config.color}`}>{config.text}</span>
        )}

        {showIcon && (
            <div className={`${config.color}`}>
                <Icon LucideIcon={config.Icon} size="sm" />
            </div>            
        )}

        {showDot && (
            <div className={`w-2.5 h-2.5 rounded-full ${config.bg}`} />
        )}
    </div>        
    )
}