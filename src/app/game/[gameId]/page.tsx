"use client"

import PageBase from "@/components/layout/PageBase";
import { useActiveGame } from "@/features/game/components/active-game-context";
import GameBoard from "@/features/game/components/GameBoard";
import { useParams } from "next/navigation";


export default function GamePage() {
    const {} = useActiveGame();

    const params = useParams();
    const gameId = params.gameId;

    return (
        <PageBase>
            <GameBoard>

            </GameBoard>
        </PageBase>
    )
}