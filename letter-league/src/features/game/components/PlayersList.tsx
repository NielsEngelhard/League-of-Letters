import Card from "@/components/ui/card/Card";
import { GamePlayerModel } from "../game-models";
import Avatar from "@/components/ui/Avatar";
import { Badge, Crown } from "lucide-react";
import Seperator from "@/components/ui/Seperator";

interface Props {
    players: GamePlayerModel[];        
}

export default function PlayersList({ players }: Props ) {
    return (
        <>
        {players.map((player, index) => (
        <div key={player.id}>
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
                <Avatar>
                    <div>
                        {player.username.charAt(0)}
                    </div>
                </Avatar>
                <div className="flex items-center gap-1 sm:gap-2">
                <span className={`text-sm sm:text-base font-medium ${
                    player.username === 'You' ? 'text-primary' : ''
                }`}>
                    {player.username}
                </span>
                {player.isHost && (
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-warning" />
                )}
                {player.username === 'You' && (
                    <Badge className="text-xs">
                    You
                    </Badge>
                )}
                </div>
            </div>
            <Badge>
                {player.connectionStatus == "connected" ? "Ready" : "Not Ready"}
            </Badge>
            </div>
            {index < players.length - 1 && (
            <Seperator />
            )}
        </div>
        ))}        
        </>
    )
}