"use client"

import Avatar from "@/components/ui/Avatar";
import { Crown } from "lucide-react";
import Seperator from "@/components/ui/Seperator";
import { useAuth } from "@/features/auth/AuthContext";
import RealtimeStatusIndicator from "@/features/realtime/RealtimeStatusIndicator";
import KickPlayerFromLobbyCommand from "../actions/command/kick-player-from-lobby-command";
import { useEffect, useState } from "react";
import { useActiveGame } from "@/features/game/components/active-game-context";

interface Props {
    hostAccountId?: string;
    lobbyId?: string;
}

export default function OnlineLobbyPlayerList({ hostAccountId, lobbyId }: Props) {
    const { account } = useAuth();
    const [isHost, setIsHost] = useState(false);
    const { players } = useActiveGame();
    
    useEffect(() => {
        setIsHost(account?.id == hostAccountId);
    }, [account, hostAccountId]);
    
    const handleKickPlayer = async (accountIdToKick: string) => {
        if (!lobbyId) return;

        await KickPlayerFromLobbyCommand({
            accountIdToKick: accountIdToKick,
            lobbyId: lobbyId
        });
    };

    return (
        <>
        {players.map((player, index) => (
        <div key={index}>
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
                <Avatar>
                    <div>
                        {player.username.charAt(0)}
                    </div>
                </Avatar>
                <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-sm sm:text-base font-medium">
                    {player.username === account?.username ? (
                        <span className="text-primary">You</span>
                    ): (
                        <span>{player.username}</span>
                       )}
                </span>
                {player.accountId == hostAccountId && (
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-warning" />
                )}
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <RealtimeStatusIndicator 
                    status={player.connectionStatus} 
                    showLabel={true} 
                    showDot={false} 
                    showIcon={true} 
                />
                
                {/* Kick button - only show for host and not for themselves */}
                {(isHost && !player.isHost) == true && (
                    <button
                        onClick={() => handleKickPlayer(player.accountId)}
                        className="p-1 rounded-md hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors"
                        title={`Kick ${player.username}`}
                    >
                        <span className="text-error font-semibold border border-error p-0.5">kick</span>
                    </button>
                )}
            </div>
            </div>
            {index < players.length - 1 && (
                <Seperator />
            )}
        </div>
        ))}
        </>
    )
}