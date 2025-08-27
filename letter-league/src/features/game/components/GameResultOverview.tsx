import Card from "@/components/ui/card/Card";
import { GamePlayerModel } from "../game-models";
import Title from "@/components/ui/text/Title";
import SubText from "@/components/ui/text/SubText";
import GameResultOverviewPlayerCard from "./GameResultOverviewPlayerCard";
import Button from "@/components/ui/Button";
import { PICK_GAME_MODE_ROUTE, SOLO_GAME_ROUTE } from "@/app/routes";
import { useRouter } from "next/navigation";
import { CardContent, CardHeader } from "@/components/ui/card/card-children";
import { useRouteToPage } from "@/app/useRouteToPage";

interface Props {
    players: GamePlayerModel[];
}

export default function GameResultOverview({ players }: Props) {
    const router = useRouter();
    const route = useRouteToPage();
    
    const sortedPlayers = players.sort((a, b) => b.score - a.score);
    const isSoloGame = players.length === 1;
    const isDuel = players.length === 2;

    const getSubtitle = () => {
        if (isSoloGame) return "Results";
        if (isDuel) return "Duel Results";
        return "Game Results";
    };

    function onPlayAgain() {
        if (isSoloGame) {
            router.push(route(SOLO_GAME_ROUTE));
        }
    }

    return (
        <div className="relative w-full max-w-lg mx-auto">
            <Card>

                <CardHeader>
                <div className="text-center space-y-2">
                    <div className="relative">
                        <Title title="Game Overview" size="sm" color="text" />
                    </div>
                    <SubText text={getSubtitle()} />
                </div>                    
                </CardHeader>

                <CardContent>
                    <div className="w-full space-y-3">
                        {sortedPlayers.map((player, index) => {
                            const position = index + 1;
                            const isWinner = position === 1 && !isSoloGame;
                            const isLoser = position === 2 && isDuel;
                            const isPodium = position <= 3 && !isSoloGame;
                            
                            return (
                                <div 
                                    key={player.accountId || index}
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
                        <Button variant='skeleton' className="w-full flex-1" href={route(PICK_GAME_MODE_ROUTE)}>
                            Leave Game
                        </Button>  
                        <Button className="flex-1" variant='primary' onClick={onPlayAgain}>
                            Play Again
                        </Button>
                    </div>                    
                </CardContent>
            </Card>
        </div>
    );
}
