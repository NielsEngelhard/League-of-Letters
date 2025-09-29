"use client"

import { LANGUAGE_ROUTE, MULTIPLAYER_GAME_ROUTE } from "@/app/routes";
import DotPulseAnimation from "@/components/ui/animation/DotPulseAnimation";
import { useAuth } from "@/features/auth/AuthContext";
import { useActiveGame } from "@/features/game/components/active-game-context";
import { useSocket } from "@/features/realtime/socket-context";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

// Game layout for managing websocket connection lifecycle over multiple pages (not discard when switching between pages)
export default function GameLayout({children}: {children: ReactNode}) {
    const { initializeConnection, connectionStatus, disconnectConnection } = useSocket();
    const { clearGameState, players } = useActiveGame();
    const { account } = useAuth();
    const router = useRouter();

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

    // When you navigate away and come back, do a hard refresh for if you missed realtime updates. E.g. minify on mobile browser.
    useEffect(() => {
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
        // User came back to the tab/app
        window.location.reload();
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    }, []);    

    // IF you are removed from the players list, navigate away (kicked probably)
    useEffect(() => {
        if (!account || !players || players.length < 1) return;

        const currentPlayerAccountId = account.id;
        if (players.some(p => p.accountId == currentPlayerAccountId) == false) {
            router.push(LANGUAGE_ROUTE(account.language, MULTIPLAYER_GAME_ROUTE));
        }
    }, [players]);    

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
