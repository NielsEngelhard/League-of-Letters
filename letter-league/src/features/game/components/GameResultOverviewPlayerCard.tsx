import Card from "@/components/ui/card/Card";
import { GamePlayerModel } from "../game-models";

interface Props {
    player: GamePlayerModel;
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
            return "bg-gradient-to-r from-primary to-secondary border-primary shadow-lg shadow-primary";
        }
        
        if (isDuel) {
            if (isWinner) {
                return "bg-success/70";
            }
            if (isLoser) {
                return "bg-error/70";
            }
        }
        
        switch (pos) {
            case 1: 
                return "bg-success/70";
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
                    ${isSoloGame ? 'bg-gradient-to-r from-blue-400/20 to-indigo-400/20' : ''}
                `} />
            )}
            
            <Card className={`
                relative transition-all duration-300 ease-out p-4
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
                                    font-semibold text-foreground`}>
                                    {player.username}
                                </div>
                                {getPlayerTitle() && (
                                    <div className="text-xs text-foreground capitalize">
                                        {getPlayerTitle()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right side: Score */}
                        <div className="flex flex-col items-end">
                            <div className={`
                                font-bold text-lg text-foreground
                            `}>
                                {player.score}
                            </div>
                            <div className="text-xs text-foreground font-medium">
                                points
                            </div>
                        </div>
                    </div>
            </Card>
        </div>
    );
}