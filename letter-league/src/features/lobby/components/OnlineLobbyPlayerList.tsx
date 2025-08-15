import Avatar from "@/components/ui/Avatar";
import { Crown } from "lucide-react";
import Seperator from "@/components/ui/Seperator";
import { useAuth } from "@/features/auth/AuthContext";
import RealtimeStatusIndicator from "@/features/realtime/RealtimeStatusIndicator";
import { GamePlayerModel } from "@/features/game/game-models";

interface Props {
    players?: GamePlayerModel[];
    userHostId?: string;
}

export default function OnlineLobbyPlayerList({ players = [], userHostId }: Props ) {
    const { account } = useAuth();

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
                {player.userId == userHostId && (
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-warning" />
                )}
                </div>
            </div>
                <RealtimeStatusIndicator status={player.connectionStatus} showLabel={true} showDot={false} showIcon={true} />
            </div>
            {index < players.length - 1 && (
                <Seperator />
            )}
        </div>
        ))}        
        </>
    )
}