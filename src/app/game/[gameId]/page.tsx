"use client"

import { PICK_GAME_MODE_ROUTE } from "@/app/routes";
import PageBase from "@/components/layout/PageBase";
import { GetActiveGameByIdRequest } from "@/features/game/actions/query/get-active-game-by-id-request";
import { ActiveGameProvider, useActiveGame } from "@/features/game/components/active-game-context";
import GameBoard from "@/features/game/components/GameBoard";
import { ActiveGameModel } from "@/features/game/game-models";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function GamePage() {
    const router = useRouter();
    const [game, setGame] = useState<ActiveGameModel | null>(null);

    const params = useParams();
    const gameId = params.gameId;

    useEffect(() => {
        async function GetGame() {
            if (!gameId) return;
            
            try {
                var resp = await GetActiveGameByIdRequest(gameId.toString());
                if (!resp) router.push(PICK_GAME_MODE_ROUTE);
                setGame(resp);                
            } catch {
                router.push(PICK_GAME_MODE_ROUTE);
            }
        }

        GetGame();
    }, [gameId]);

    return (
        <PageBase>
            {game ? (
                <ActiveGameProvider _activeGame={game}>
                    <GameBoard>
                
                    </GameBoard>
                </ActiveGameProvider>
            ): (
                <div>no game</div>
            )}
        </PageBase>
    )
}