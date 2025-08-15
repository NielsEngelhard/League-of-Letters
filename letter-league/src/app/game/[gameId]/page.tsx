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
    const { initializeGameState, game } = useActiveGame();    
    const { initializeConnection, emitJoinGame } = useSocket();
    const router = useRouter();

    const params = useParams();
    const gameId = params.gameId;

    useEffect(() => {
        if (!gameId || !account) return;

        initializeConnection();

        async function GetGame() {
            if (!gameId || !account) return;
            
            try {
                var resp = await GetActiveGameByIdRequest(gameId.toString());
                if (!resp) {
                    router.push(PICK_GAME_MODE_ROUTE)
                    return;
                };
                
                initializeGameState(resp, account.id);
                emitJoinGame({
                    gameId: resp.id,
                    userId: account.id,
                    username: account.username,
                    isHost: false // TODO
                });                
            } catch(err) {
                console.log(err);
                router.push(PICK_GAME_MODE_ROUTE);
            }
        }

        GetGame();
    }, [gameId, account]);

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