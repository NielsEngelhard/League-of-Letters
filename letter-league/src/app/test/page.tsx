"use client"

import PageBase from "@/components/layout/PageBase";
import Button from "@/components/ui/Button";
import StatusDot from "@/components/ui/StatusDot";
import GameConnectionStatusIndicator from "@/features/game/components/GameConnectionStatusIndicator";
import { useSocket } from "@/features/realtime/useSocket";

export default function TestPage() {
    const { isConnected, initializeConnection } = useSocket();

    return (
        <PageBase>
            <div className="flex flex-row gap-2 items-center text-sm">
                Websocket connection: 
                <StatusDot isOnline={isConnected} />
            </div>

            <div className="flex flex-row gap-4">
                <Button variant="primary" onClick={initializeConnection}>
                    Connect
                </Button>
            </div>
        </PageBase>
    )
}