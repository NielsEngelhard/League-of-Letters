"use client"

import WebSocketStatusIndicator from "@/features/realtime/WebSocketStatusIndicator"
import { GamePlayerModel } from "../../game-models";

interface Props {
    player: GamePlayerModel;
    isCurrentTurn?: boolean;
    turnOrder?: number;
}

export default function InGamePlayerCardMobile({ player, turnOrder = 1, isCurrentTurn = true }: Props) {
    return (
   <div className={`
     relative col-span-1 w-full flex flex-col gap-0 border border-border px-1.5 py-0.5 border-b-4 border-b-primary rounded-lg shadow-md
     ${isCurrentTurn ? "bg-primary/20" : "bg-background"}
   `}>
        {/* top indicators */}
        <div className="flex flex-row w-full justify-center">
             <span className="font-bold">{player.score}</span>
        </div>

        {/* bottom */}
        <span className="truncate text-xs text-center font-medium">
            {player.username}
        </span>

        {/* Top Right connectionstatus */}
        <div className="absolute top-0.5 right-1">
            <WebSocketStatusIndicator 
                connectionStatus="connected"
                showText={false} 
            />
        </div>        

        {/* Top Left this turns position */}
        <div className="absolute top-0 left-0.5">
            <span className="text-xs font-light">{turnOrder}</span>
        </div>
   </div>
    )
}