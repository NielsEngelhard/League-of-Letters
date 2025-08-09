import Card from "@/components/ui/card/Card";
import { GamePlayerModel } from "../game-models";
import Title from "@/components/ui/text/Title";
import SubText from "@/components/ui/text/SubText";
import GameResultOverviewPlayerCard from "./GameResultOverviewPlayerCard";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { PICK_GAME_MODE_ROUTE, SOLO_GAME_ROUTE } from "@/app/routes";
import { useRouter } from "next/navigation";

interface Props {
    players: GamePlayerModel[];
}

export default function GameResultOverview({ players }: Props) {
    const router = useRouter();
    
    const sortedPlayers = players.sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0];
    const isSoloGame = players.length === 1;
    const isDuel = players.length === 2;

    const getSubtitle = () => {
        if (isSoloGame) return "Results";
        if (isDuel) return "Duel Results";
        return "Game Results";
    };

    function onPlayAgain() {
        if (isSoloGame) {
            router.push(SOLO_GAME_ROUTE);
        }
    }

    return (
        <div className="relative w-full max-w-lg mx-auto">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl animate-pulse" />
            
            <Card className="relative flex flex-col gap-6 items-center p-6 backdrop-blur-sm border border-white/20">
                {/* Winner celebration effect - only show for multiplayer games */}
                {winner && !isSoloGame && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}

                {/* Header with enhanced styling */}
                <div className="text-center space-y-2">
                    <div className="relative">
                        <Title title="Game Overview" size="sm" color="text" />
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                    </div>
                    <SubText text={getSubtitle()} />
                </div>

                {/* Enhanced results display */}
                <div className="w-full space-y-3">
                    {sortedPlayers.map((player, index) => {
                        const position = index + 1;
                        const isWinner = position === 1 && !isSoloGame;
                        const isLoser = position === 2 && isDuel;
                        const isPodium = position <= 3 && !isSoloGame;
                        
                        return (
                            <div 
                                key={player.userId || index}
                                className={`
                                    transform transition-all duration-500 ease-out
                                    ${isWinner ? 'scale-105' : ''}
                                `}
                                style={{ 
                                    animationDelay: `${index * 100}ms`,
                                    animationFillMode: 'both'
                                }}
                            >
                                <GameResultOverviewPlayerCard 
                                    player={player} 
                                    position={isSoloGame ? 0 : position}
                                    isWinner={isWinner}
                                    isLoser={isLoser}
                                    isPodium={isPodium}
                                    isSoloGame={isSoloGame}
                                    isDuel={isDuel}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Action buttons with enhanced styling */}
                <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                    <Link href={PICK_GAME_MODE_ROUTE} className="flex-1">
                        <Button variant='skeleton' className="w-full">
                            Leave Game
                        </Button>                    
                    </Link>
                    <Button className="flex-1" variant='primary' onClick={onPlayAgain}>
                        Play Again
                    </Button>
                </div>
            </Card>
        </div>
    );
}