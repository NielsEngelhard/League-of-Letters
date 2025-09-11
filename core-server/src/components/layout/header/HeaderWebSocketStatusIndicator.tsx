"use client"

import { useSocket } from "@/features/realtime/socket-context"
import WebSocketStatusIndicator from "@/features/realtime/WebSocketStatusIndicator";

export default function HeaderWebSocketStatusIndicator() {
    const { connectionStatus } = useSocket();

    return (
        <WebSocketStatusIndicator connectionStatus={connectionStatus} showText={true} />
    )
}