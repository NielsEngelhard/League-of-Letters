import { ActiveGamePlayerModel } from "../game-models";

interface Props {
    players: ActiveGamePlayerModel[];
    currentPlayerId?: string;
}

export default function PlayerList({ players, currentPlayerId }: Props) {

    function isCurrentPlayer(player: ActiveGamePlayerModel): boolean {
        return player.id == currentPlayerId;
    }

    return (
            <div className="w-full">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                        Players ({players.length})
                    </h3>
                    <div className="text-xs text-gray-500">Live</div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {players.map((player, index) => (
                        <div
                            key={player.id}
                            className={`
                                relative overflow-hidden rounded-xl p-3 transition-all duration-200
                                ${isCurrentPlayer(player)
                                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-md"
                                    : "bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm"
                                }
                            `}
                        >
                            {/* Player indicator */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`
                                        w-2 h-2 rounded-full
                                        ${isCurrentPlayer(player) ? "bg-primary animate-pulse" : "bg-green-400"}
                                    `} />
                                    <span className={`
                                        text-sm font-medium truncate
                                        ${isCurrentPlayer(player) ? "text-blue-800" : "text-gray-700"}
                                    `}>
                                        {player.username}
                                        {isCurrentPlayer(player) && (
                                            <span className="ml-1 text-xs text-blue-600">(You)</span>
                                        )}
                                    </span>
                                </div>
                                
                                <div className={`
                                    text-xs font-bold
                                    ${isCurrentPlayer(player) ? "text-blue-600" : "text-gray-600"}
                                `}>
                                    {player.score}
                                </div>
                            </div>

                            {/* Ranking indicator */}
                            <div className="absolute top-1 right-1">
                                <div className={`
                                    w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold
                                    ${index === 0 ? "bg-yellow-100 text-yellow-600" : 
                                      index === 1 ? "bg-gray-100 text-gray-600" : 
                                      index === 2 ? "bg-orange-100 text-orange-600" : 
                                      "bg-gray-50 text-gray-500"}
                                `}>
                                    {index + 1}
                                </div>
                            </div>

                            {/* Current player glow effect */}
                            {isCurrentPlayer(player) && (
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-xl" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
    )
}