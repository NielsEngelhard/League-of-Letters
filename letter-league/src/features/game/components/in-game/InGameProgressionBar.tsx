import PopupCard from "@/components/ui/card/PopupCard";
import { GameRoundModel } from "../../game-models";
import LetterTile from "@/features/word/components/LetterTile";
import { LetterState } from "@/features/word/word-models";

interface Props {
    currentRound: GameRoundModel;
    totalRounds: number;
}

export default function InGameProgressionBar({ currentRound, totalRounds }: Props) {
    return (
        <PopupCard>
            <>
                <div className="flex items-center justify-between">
                    {/* Game Stats */}
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                <span className="text-sm font-semibold text-foreground">
                                    Round {currentRound.roundNumber}/{totalRounds}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-foreground-muted">Time:</span>
                            <span className="text-sm font-mono text-bold">∞</span>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex flex-row gap-2">
                        {/* Round Progress Indicator */}
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="flex gap-1">
                                {Array.from({ length: totalRounds }, (_, i) => (
                                    <div
                                        key={i}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                            i + 1 === currentRound.roundNumber
                                                ? "bg-primary scale-125"
                                                : i + 1 < currentRound.roundNumber
                                                ? "bg-success"
                                                : "bg-foreground-muted"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>       

                        {/* Starting letter */}
                        {currentRound.startingLetter && (
                            <LetterTile letter={currentRound.startingLetter} state={LetterState.Correct} variant="extraSmall" />
                        )}                                         
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(currentRound.roundNumber / totalRounds) * 100}%` }}
                    />
                </div>            
            </>
        </PopupCard>        
    )
}