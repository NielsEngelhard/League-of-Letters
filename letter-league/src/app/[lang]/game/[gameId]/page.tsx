"use client"

import { PICK_GAME_MODE_ROUTE } from "@/app/routes";
import PageBase from "@/components/layout/PageBase";
import LoadingSpinner from "@/components/ui/animation/LoadingSpinner";
import { useAuth } from "@/features/auth/AuthContext";
import { GetActiveGameByIdRequest } from "@/features/game/actions/query/get-active-game-by-id-request";
import { useActiveGame } from "@/features/game/components/active-game-context";
import Ingame from "@/features/game/components/InGame";
import { useSocket } from "@/features/realtime/socket-context";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GamePage() {
    const { account } = useAuth();
    const { initializeGameState, game, clearGameState } = useActiveGame();    
    const { initializeConnection, emitJoinGame, connectionStatus } = useSocket();
    const router = useRouter();

    const params = useParams();
    const gameId = params.gameId;

    useEffect(() => {
        if (!gameId || !account) return;        

        async function GetGame() {
            if (!gameId || !account) return;
            
            try {
                var resp = await GetActiveGameByIdRequest(gameId.toString());
                if (!resp) {
                    router.push(PICK_GAME_MODE_ROUTE)
                    return;
                };
                
                initializeGameState(resp, account.id);               
            } catch(err) {
                console.log(err);
                router.push(PICK_GAME_MODE_ROUTE);
            }
        }

        GetGame();
    }, [gameId, account]);

    // Connect with realtime if online game
    useEffect(() => {
        if (game && game.gameMode == "online") {
            initializeConnection();
        }
    }, [game]);

    // Join the game room when realtime is connected
    useEffect(() => {
        if (!account || !game || connectionStatus != "connected") return;
        
        emitJoinGame({
            gameId: game.id,
            accountId: account.id,
            username: account.username,
            isHost: account.id == game?.hostAccountId
        });         
    }, [connectionStatus, game, account]);

    useEffect(() => {
        return () => {
            clearGameState();
        }
    }, []);

    return (
        <PageBase>
            {game ? (
                <Ingame />
            ): (
                <LoadingSpinner size="lg" center={true} />
            )}
        </PageBase>
    )
}
