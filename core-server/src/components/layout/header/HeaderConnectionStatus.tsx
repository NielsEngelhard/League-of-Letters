"use client"

import RealtimeStatusIndicator from "@/features/realtime/RealtimeStatusIndicator";
import { useSocket } from "@/features/realtime/socket-context";

export default function HeaderConnectionStatus() {
    const { connectionStatus } = useSocket();

    return (
        connectionStatus !== "empty" && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background">
                <RealtimeStatusIndicator status={connectionStatus} showDot={true} showIcon={false} showLabel={false} />
            </div>
        )
    )
}