import Icon from "@/components/ui/Icon";
import { ConnectionStatus } from "./realtime-models"
import { Cable, ServerCrash, Telescope, Unplug, Wifi } from "lucide-react";

interface Props {
    status: ConnectionStatus;
}

const getStatusConfig = (status: ConnectionStatus) => {
    switch (status) {
        case 'connected':
            return {
                bg: 'bg-success',
                color: 'text-success',
                Icon: Wifi
            };
        case 'connecting':
            return {
                bg: 'bg-warning',
                color: 'text-warning',
                Icon: Cable
            };
        case 'disconnected':
            return {
                bg: 'bg-error',
                color: 'text-error',
                Icon: Unplug
            };
        case 'error':
            return {
                bg: 'bg-error',
                color: 'text-error',
                Icon: ServerCrash
            };
        case 'empty':
            return {
                bg: 'bg-gray-500',
                color: 'text-gray-500',
                Icon: Telescope
            };
    }
}

export default function StatusDot({ status }: Props) {
    const config = getStatusConfig(status);

    return (
    <div className="flex flex-row gap-1 items-center">
        <div className={`${config.color}`}>
            <Icon LucideIcon={config.Icon} size="xs" />
        </div>

        <div className={`w-2 h-2 rounded-full ${config.bg}`} />        
    </div>        
    )
}