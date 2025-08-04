import { GamePlayerModel } from "../game-models";
import GameConnectionStatusIndicator from "./GameConnectionStatusIndicator";
import InGamePlayerCard from "./InGamePlayerCard";

interface Props {
    players: GamePlayerModel[];
    currentPlayerId?: string;
}

export default function PlayerList({ players, currentPlayerId }: Props) {

    const disconnectedPlayers: GamePlayerModel[] = players.filter(p => p.isConnected == false);

    return (
            <div className="w-full">
                {players.length > 1 && (
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            {disconnectedPlayers.length > 0 ? (
                                <span className="w-1.5 h-1.5 bg-error rounded-full"></span>
                            ) : (
                                <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                            )}
                            Players ({players.length - disconnectedPlayers.length}/{players.length})
                        </h3>
                        <div className="">
                            <GameConnectionStatusIndicator players={players}  />
                        </div>
                    </div>                    
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {players.sort((a, b) => b.score - a.score).map((player, index) => (
                        <InGamePlayerCard
                            player={player}
                            scorePosition={index + 1}
                            isHisTurn={player.id == currentPlayerId}
                            key={index}
                            isOnlyPlayer={players.length == 1}
                        />
                    ))}
                </div>
            </div>
    )
}