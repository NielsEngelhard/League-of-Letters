"use client"

import PageBase from "@/components/layout/PageBase";
import Button from "@/components/ui/Button";
import RealtimeStatusIndicator from "@/features/realtime/RealtimeStatusIndicator";
import { useAuth } from "@/features/auth/AuthContext";
import { JoinGameRealtimeModel } from "@/features/realtime/realtime-models";
import { useSocket } from "@/features/realtime/socket-context";

export default function AdminTestSocketPage() {
    const { connectionStatus, initializeConnection, emitJoinGame, emitTestEvent } = useSocket();
    const { authSession } = useAuth();

    function onJoinGame() {
        var data: JoinGameRealtimeModel = {
            gameId: "yolo",
            userId: authSession?.id ?? "unauthed_id",
            username: authSession?.username ?? "unauthed_uname"
        }

        emitJoinGame(data);
    }

    return (
        <PageBase>
            <div className="flex flex-row gap-2 items-center text-sm">
                Websocket connection: 
                <RealtimeStatusIndicator status={connectionStatus} />
            </div>

            <div className="flex flex-row gap-4">
                <Button variant="primary" onClick={initializeConnection}>
                    Connect
                </Button>

                <Button variant="secondary" onClick={onJoinGame}>
                    Join room "yolo"
                </Button>    

                <Button variant="skeleton" onClick={() => emitTestEvent("yolo")}>
                    Test event
                </Button>                                
            </div>
        </PageBase>
    )
}