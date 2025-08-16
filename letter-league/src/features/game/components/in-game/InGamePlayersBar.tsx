import RealtimeStatusIndicator from "@/features/realtime/RealtimeStatusIndicator";
import { GamePlayerModel } from "../../game-models";
import InGameConnectionStatusIndicator from "./InGameConnectionStatusIndicator";
import InGamePlayerCard from "./InGamePlayerCard";
import { useEffect } from "react";
import InGameTimer from "./InGameTimer";

interface Props {
    players: GamePlayerModel[];
    currentPlayerId?: string;
}

export default function InGamePlayerBar({ players, currentPlayerId }: Props) {

    const disconnectedPlayers: GamePlayerModel[] = players.filter(p => p.connectionStatus != "connected");
    const isSoloGame: boolean = players.length == 1;

    useEffect(() => {
        console.log("EVEN LOGGEN");
        console.log(players);
    }, [players]);

    return (
            <div className="w-full">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2">                        
                        {isSoloGame ? (
                            <span>
                                {players[0].username}
                            </span>
                        ) : (
                            <>
                            <RealtimeStatusIndicator status={disconnectedPlayers.length == 0 ? "connected" : "disconnected"} />
                            <span>
                                Players ({players.length - disconnectedPlayers.length}/{players.length})
                            </span>                            
                            </>
                        )}
                    </h3>
                    <div className="flex flex-col gap-1 text-end">
                        {isSoloGame ? (
                            <span className="text-primary/50">{players[0].score}pts</span>
                        ) : (
                            <InGameConnectionStatusIndicator players={players} />
                        )}                        
                    </div>
                </div>             
                
                {!isSoloGame && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {players.sort((a, b) => b.score - a.score).map((player, index) => (
                            <InGamePlayerCard
                                player={player}
                                scorePosition={index + 1}
                                isHisTurn={player.accountId == currentPlayerId}
                                key={index}
                            />
                        ))}
                    </div>                    
                )}
            <div>
        </div>
    </div>
    )
}