"use client"

import InGameTranslations from "@/features/i18n/translation-file-interfaces/InGameTranslations";
import { ActiveGameModel, GamePlayerModel } from "../../game-models"
import PlayerGrid from "./PlayersGrid";

interface Props {
    sortedPlayers: GamePlayerModel[];
    game: ActiveGameModel;
    t: InGameTranslations;
}

export default function GameBoardMobilePlayersGrid({ sortedPlayers, game, t }: Props) {
    return (
    <div className="md:hidden w-full">
        <PlayerGrid
            players={sortedPlayers}
            gridCols="grid-cols-3"
            hostAccountId={game.hostAccountId}
            includeKickOption={false}
            gameId={game.id}
            t={t}
        />                 
    </div>
    )
}