"use client"

import InGameTranslations from "@/features/i18n/translation-file-interfaces/InGameTranslations";
import { useActiveGame } from "../active-game-context"
import PlayerGrid from "./PlayersGrid";

interface Props {
    hostAccountId?: string;
    gameId?: string;
    includeKickOption?: boolean;
    gridCols?: string;
    t: InGameTranslations;
    showScore?: boolean;
    isInGame?: boolean;
}

export default function ActiveGamePlayersGrid({hostAccountId, gameId, includeKickOption, gridCols, t, isInGame}: Props) {
    const { players } = useActiveGame();

    return (
        <PlayerGrid
            players={players}
            hostAccountId={hostAccountId}
            gameId={gameId}
            includeKickOption={includeKickOption}
            gridCols={gridCols}
            t={t}
            isInGame={isInGame}
        />      
    )
}