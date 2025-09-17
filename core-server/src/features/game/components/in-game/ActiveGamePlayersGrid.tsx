"use client"

import InGameTranslations from "@/features/i18n/translation-file-interfaces/InGameTranslations";
import { useActiveGame } from "../active-game-context"
import PlayerGrid from "./PlayersGrid";

interface Props {
    hostAccountId?: string;
    lobbyId?: string;
    includeKickOption?: boolean;
    gridCols?: string;
    t: InGameTranslations;
}

export default function ActiveGamePlayersGrid({hostAccountId, lobbyId, includeKickOption, gridCols, t}: Props) {
    const { players } = useActiveGame();

    return (
        <PlayerGrid
            players={players}
            hostAccountId={hostAccountId}
            gameId={lobbyId}
            includeKickOption={includeKickOption}
            gridCols={gridCols}
            t={t}
        />      
    )
}