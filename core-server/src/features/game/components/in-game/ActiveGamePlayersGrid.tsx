"use client"

import InGameTranslations from "@/features/i18n/translation-file-interfaces/InGameTranslations";
import { useActiveGame } from "../active-game-context"
import PlayerGrid from "./PlayersGrid";

interface Props {
    hostAccountId?: string;
    gameId?: string;
    includeKickOption?: boolean;
    t: InGameTranslations;
    showScore?: boolean;
    isInGame?: boolean;
}

export default function ActiveGamePlayersGrid({hostAccountId, gameId, includeKickOption, t, isInGame}: Props) {
    const { players } = useActiveGame();

    return (
        <PlayerGrid
            players={players}
            hostAccountId={hostAccountId}
            gameId={gameId}
            includeKickOption={includeKickOption}
            t={t}
            isInGame={isInGame}
        />      
    )
}