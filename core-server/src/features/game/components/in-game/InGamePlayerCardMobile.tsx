"use client"

import WebSocketStatusIndicator from "@/features/realtime/WebSocketStatusIndicator"
import { GamePlayerModel } from "../../game-models";
import InGameTranslations from "@/features/i18n/translation-file-interfaces/InGameTranslations";

interface Props {
    player: GamePlayerModel;
    t: InGameTranslations;
    isCurrentTurn?: boolean;
    turnOrder?: number;
    height?: "sm" | "md" | "lg";
    startsNextRound?: boolean;
    hasNextGuess?: boolean;
}

export default function InGamePlayerCardMobile({ player, t, turnOrder = 1, isCurrentTurn = true, height = "lg", startsNextRound = false, hasNextGuess = false }: Props) {
    return (
   <div className="relative col-span-1 w-full flex flex-col gap-0 border border-border p-1 border-b-2 border-b-primary">
        {/* top indicators */}
        <div className="flex flex-row w-full justify-center">
             <span className="font-bold">{player.score}</span>
        </div>

        {/* bottom */}
        <span className="truncate text-xs text-center">
            Username_2000
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