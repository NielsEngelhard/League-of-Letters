"use client"

import { GamePlayerModel } from "../../game-models"
import Avatar from "@/components/ui/Avatar";
import WebSocketStatusIndicator from "@/features/realtime/WebSocketStatusIndicator";
import Tooltip from "@/components/ui/Tooltip";
import { ArrowUp } from "lucide-react";

interface Props {
    sortedPlayers: GamePlayerModel[];
    currentAccountId?: string;
}

export default function GameBoardMobilePlayersGrid({ sortedPlayers, currentAccountId }: Props) {
    return (
        <div className={`grid gap-2 grid-cols-${sortedPlayers?.length ?? 6} w-full md:hidden`}>
            {sortedPlayers.map((player) => (
                <Tooltip content={player.username} key={player.accountId}>
                    <div className="flex flex-col items-center justify-center truncate">
                        <Avatar colorHex={player.colorHex} className={currentAccountId == player.accountId ? 'border-primary border-2' : ''}>
                            <>
                                <div className="text-sm font-extrabold">
                                    {player.username.charAt(0)}
                                </div>

                                {/* Websocket status bottom right */}
                                <div className="absolute right-0 bottom-0 z-10">
                                    <WebSocketStatusIndicator connectionStatus={player.connectionStatus} />
                                </div>

                                {/* Your turn indicator */}
                                {player.accountId == currentAccountId && (
                                    <div className="absolute -bottom-3 -left-3">
                                        <ArrowUp className="font-bold text-primary rotate-45" size={20} />
                                    </div>                                        
                                )}                             
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