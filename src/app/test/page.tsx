"use client"

import PageBase from "@/components/layout/PageBase";
import GameResultOverview from "@/features/game/components/GameResultOverview";
import { ActiveGamePlayerModel } from "@/features/game/game-models";

export default function TestPage() {
    
    const players: ActiveGamePlayerModel[] = [
        {
            id: "1",
            score: 101,
             username: "waterpolo"
        },
        {
            id: "5",
            score: 1044,
             username: "HeleLangeUsernameee"
        },
        {
            id: "3",
            score: 2,
             username: "koekjesdeeg"
        },
        {
            id: "2",
            score: 22,
             username: "asdadsad"
        },
        {
            id: "1123123",
            score: 23123,
             username: "WarmChipmunk20032"
        }                                
    ]
    
    return (
        <PageBase>
            <GameResultOverview
                players={players}
            >

            </GameResultOverview>
        </PageBase>
    )
}