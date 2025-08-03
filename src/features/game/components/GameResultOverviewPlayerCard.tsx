import Card from "@/components/ui/card/Card";
import { ActiveGamePlayerModel } from "../game-models";

interface Props {
    player: ActiveGamePlayerModel;
    position: number;
    isWinner?: boolean;
    isLoser?: boolean;
    isPodium?: boolean;
    isSoloGame?: boolean;
    isDuel?: boolean;
}

export default function GameResultOverviewPlayerCard({ 
    player, 
    position, 
    isWinner = false,
    isLoser = false,
    isPodium = false,
    isSoloGame = false,
    isDuel = false
}: Props) {
    const getPositionIcon = (pos: number) => {
        if (isSoloGame) return "🎯";
        if (isDuel) {
            if (isWinner) return "🏆";
            if (isLoser) return "";
        }
        
        switch (pos) {
            case 1: return "🏆";
            case 2: return "🥈";
            case 3: return "🥉";
            default: return `#${pos}`;
        }
    };

    const getPositionColor = (pos: number) => {
        if (isSoloGame) return "text-blue-500";
        if (isDuel) {
            if (isWinner) return "text-yellow-500";
            if (isLoser) return "text-red-400";
        }
        
        switch (pos) {
            case 1: return "text-yellow-500";
            case 2: return "text-gray-400";
            case 3: return "text-amber-600";
            default: return "text-gray-600";
        }
    };

    const getCardStyle = (pos: number) => {
        if (isSoloGame) {
            return "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg shadow-blue-100";
        }
        
        if (isDuel) {
            if (isWinner) {
                return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 shadow-lg shadow-yellow-100";
            }
            if (isLoser) {
                return "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 shadow-md shadow-red-100";
            }
        }
        
        switch (pos) {
            case 1: 
                return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 shadow-lg shadow-yellow-100";
            case 2: 
                return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 shadow-md shadow-gray-100";
            case 3: 
                return "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-md shadow-amber-100";
            default: 
                return "bg-white border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200";
        }
    };

    const getPlayerTitle = () => {
        if (isSoloGame) return "";
        if (isDuel) {
            if (isWinner) return "WINNER";
            if (isLoser) return "LOSER";
        }
        if (isPodium) {
            if (position === 1) return "Champion";
            if (position === 2) return "Runner-up";
            if (position === 3) return "Third Place";
            else return "Tried";
        }
        return null;
    };

    return (
        <div className="relative group">
            {/* Winner glow effect */}
            {(isWinner || isSoloGame) && (
                <div className={`
                    absolute inset-0 rounded-lg blur animate-pulse
                    ${isSoloGame ? 'bg-gradient-to-r from-blue-400/20 to-indigo-400/20' : 'bg-gradient-to-r from-yellow-400/20 to-amber-400/20'}
                `} />
            )}
            
            <Card className={`
                relative transition-all duration-300 ease-out
                ${getCardStyle(position)}
                ${(isWinner || isSoloGame) ? 'transform hover:scale-102' : 'hover:scale-101'}
                ${(isPodium || isSoloGame) ? 'ring-1 ring-black/5' : ''}
            `}>
                <div className="flex items-center justify-between w-full p-1">
                    {/* Left side: Position and name */}
                    <div className="flex items-center gap-3">
                        {/* Position indicator - hidden for solo games */}
                        {!isSoloGame && (
                            <div className={`
                                flex items-center justify-center
                                ${position <= 3 ? 'text-xl' : 'text-sm font-bold'}
                                ${getPositionColor(position)}
                                ${isWinner ? 'animate-pulse' : ''}
                                min-w-[2rem]
                            `}>
                                {getPositionIcon(position)}
                            </div>
                        )}
                        
                        {/* Solo game icon */}
                        {isSoloGame && (
                            <div className={`
                                flex items-center justify-center text-xl
                                ${getPositionColor(position)}
                                animate-pulse min-w-[2rem]
                            `}>
                                {getPositionIcon(position)}
                            </div>
                        )}
                        
                        {/* Player info */}
                        <div className="flex flex-col">
                            <div className={`
                                font-semibold
                                ${(isWinner || isSoloGame) ? 'text-lg' : 'text-base'}
                                ${isSoloGame ? 'text-blue-800' : ''}
                                ${isWinner ? 'text-yellow-800' : ''}
                                ${isLoser ? 'text-red-600' : ''}
                                ${position === 2 && !isDuel ? 'text-gray-700' : ''}
                                ${position === 3 ? 'text-amber-700' : ''}
                            `}>
                                {player.username}
                            </div>
                            {getPlayerTitle() && (
                                <div className="text-xs text-gray-500 capitalize">
                                    {getPlayerTitle()}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right side: Score */}
                    <div className="flex flex-col items-end">
                        <div className={`
                            font-bold text-lg
                            ${(isWinner || isSoloGame) ? 'text-xl' : ''}
                            ${isSoloGame ? 'text-blue-600' : ''}
                            ${isWinner ? 'text-yellow-600' : ''}
                            ${isLoser ? 'text-red-500' : ''}
                            ${position === 2 && !isDuel ? 'text-gray-600' : ''}
                            ${position === 3 ? 'text-amber-600' : ''}
                            ${!isWinner && !isSoloGame && !isLoser ? 'text-gray-700' : ''}
                        `}>
                            {player.score}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                            points
                        </div>
                    </div>
                </div>

                {/* Subtle animation line */}
                {(isWinner || isSoloGame) && (
                    <div className={`
                        absolute bottom-0 left-0 right-0 h-px opacity-60
                        ${isSoloGame ? 'bg-gradient-to-r from-transparent via-blue-400 to-transparent' : 'bg-gradient-to-r from-transparent via-yellow-400 to-transparent'}
                    `} />
                )}
            </Card>
        </div>
    );
}