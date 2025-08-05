import StatusDot from "@/features/realtime/StatusDot";
import { GamePlayerModel } from "../game-models";

interface Props {
    player: GamePlayerModel;
    scorePosition: number;
    isCurrentPlayer?: boolean;
    isHisTurn?: boolean;
    isOnlyPlayer?: boolean;
}

export default function InGamePlayerCard({ player, scorePosition, isCurrentPlayer = false, isHisTurn, isOnlyPlayer = false }: Props) {
    return (
        <div
            key={player.id}
            className={`
                relative overflow-hidden rounded-xl p-3 transition-all duration-200 border border-gray-100 hover:border-gray-200 hover:shadow-sm
                ${isHisTurn && !isOnlyPlayer
                    ? "bg-primary/20 font-bold"
                    : "bg-background-secondary font-medium"
                }
            `}
        >
            {/* Player indicator */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {!isOnlyPlayer && <StatusDot status="connected" />}
                    <span className="text-sm font-med">{player.username}</span>
                </div>
                
                <div className={`
                    text-xs font-bold mr-0.5
                `}>
                    {player.score}
                </div>
            </div>

            {/* Ranking indicator */}
            {!isOnlyPlayer && 
                <div className="absolute top-1 right-1">
                    <div className={`
                        w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold
                        ${scorePosition === 1 ? "bg-yellow-100 text-yellow-600" : 
                            scorePosition === 2 ? "bg-gray-100 text-gray-600" : 
                            scorePosition === 3 ? "bg-orange-100 text-orange-600" : 
                            "bg-gray-50 text-gray-500"}
                    `}>
                        {scorePosition}
                    </div>
                </div>            
            }

            {/* Current player glow effect */}
            {isCurrentPlayer && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-xl" />
            )}
        </div>        
    )
}