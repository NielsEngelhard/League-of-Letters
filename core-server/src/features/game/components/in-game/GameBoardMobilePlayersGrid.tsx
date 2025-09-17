"use client"

import InGameTranslations from "@/features/i18n/translation-file-interfaces/InGameTranslations";
import { ActiveGameModel, GamePlayerModel } from "../../game-models"
import Avatar from "@/components/ui/Avatar";
import WebSocketStatusIndicator from "@/features/realtime/WebSocketStatusIndicator";
import Tooltip from "@/components/ui/Tooltip";

interface Props {
    sortedPlayers: GamePlayerModel[];
    game: ActiveGameModel;
    t: InGameTranslations;
}

export default function GameBoardMobilePlayersGrid({ sortedPlayers, game, t }: Props) {
    return (
        <div className={`grid gap-2 grid-cols-6 w-full md:hidden`}>
            {sortedPlayers.map((player) => (
                <Tooltip content={player.username} key={player.accountId}>
                    <div>temp {player.colorHex}</div>
                <div className="flex flex-col items-center justify-center truncate">
                    <Avatar colorHex={player.colorHex}>
                        <>
                            <div className="text-sm font-extrabold">
                                {player.username.charAt(0)}
                            </div>

                            {/* Websocket status bottom right */}
                            <div className="absolute right-0 bottom-0 z-10">
                                <WebSocketStatusIndicator connectionStatus={player.connectionStatus} />
                            </div>

                            {/* Websocket status bottom right */}
                            <div className="absolute right-0 bottom-0 z-10">
                                <WebSocketStatusIndicator connectionStatus={player.connectionStatus} />
                            </div>       
                        </>                     
                    </Avatar>

                    {/* Score */}
                    <span className="font-bold text-xs">0</span>
                </div>                    
                </Tooltip>
            ))}
        </div>
    )
}