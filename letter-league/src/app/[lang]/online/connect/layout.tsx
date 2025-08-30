"use client"

import DotPulseAnimation from "@/components/ui/animation/DotPulseAnimation";
import { useAuth } from "@/features/auth/AuthContext";
import { useActiveGame } from "@/features/game/components/active-game-context";
import { useSocket } from "@/features/realtime/socket-context";
import { ReactNode, useEffect } from "react";

// Game layout for managing websocket connection lifecycle over multiple pages (not discard when switching between pages)
export default function GameLayout({children}: {children: ReactNode}) {
    const { initializeConnection, emitJoinGame, connectionStatus, disconnectConnection } = useSocket();
    const { clearGameState } = useActiveGame();
    const { account } = useAuth();

    // Clear game state when discarding the client
    useEffect(() => {
        return () => {
            disconnectConnection();
            clearGameState();
        }
    }, []);    

    // Initialize general* websocket connection when the account is initialized/loaded
    // general* websocket connection because the logic for joining an actual game (room) is for other components
    useEffect(() => {
      if (!account) return;

        initializeConnection();
    }, [account]);    

    if (connectionStatus != "connected") {
        return (
            <div className="mt-[100px] flex items-center justify-center">
                <DotPulseAnimation label="connecting to realtime server" />
            </div>
        )
    }

    return (
        <>
            {children}
        </>
    )
}
