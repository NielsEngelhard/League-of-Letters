"use client"

import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useActiveGame } from "../game/components/active-game-context";
import { useSocket } from "./socket-context";
import DotPulseAnimation from "@/components/ui/animation/DotPulseAnimation";

interface Props {
    children: React.ReactNode;
}

export default function RealtimeInitClient({ children }: Props) {
    const { initializeConnection, connectionStatus, disconnectConnection } = useSocket();
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

    return (
        <>
            {connectionStatus == "connected" ? (
            <>
                {children}
            </>                
            ) : (
            <div className="mt-[100px] flex items-center justify-center">
                <DotPulseAnimation label="connecting to realtime server" />
            </div>
            )}
        </>        
    )
}