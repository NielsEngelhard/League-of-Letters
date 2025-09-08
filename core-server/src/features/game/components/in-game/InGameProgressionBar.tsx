import PopupCard from "@/components/ui/card/PopupCard";
import { GameRoundModel } from "../../game-models";
import LetterTile from "@/features/word/components/LetterTile";
import { LetterState } from "@/features/word/word-models";
import InGameTranslations from "@/features/i18n/translation-file-interfaces/InGameTranslations";
import { Clock, User } from "lucide-react";

interface Props {
    currentRound: GameRoundModel;
    totalRounds: number;
    timePerGuess: string;
    inGameTranslations: InGameTranslations;
    currentPlayerUsername?: string;
}

export default function InGameProgressionBar({ currentRound, totalRounds, timePerGuess, inGameTranslations, currentPlayerUsername }: Props) {
    return (
        <PopupCard classes="h-[66px] md:max-h-none">
            <>
                <div className="flex items-center justify-between">
                    {/* Game Stats */}
                    <div className="flex items-center gap-3 sm:gap-6">
                        <div className="relative">
                            <div className="flex items-center gap-1 sm:gap-2">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse"></div>
                                <span className="text-xs sm:text-sm font-semibold text-foreground">
                                    <span className="">{inGameTranslations.board.round} </span>
                                    {currentRound.roundNumber}/{totalRounds}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span className="text-xs sm:text-sm font-mono font-medium">{timePerGuess}</span>
                        </div>

                        {currentPlayerUsername && (
                            <div className="flex items-center gap-1">
                                <User size={14} />
                                <span className="text-xs sm:text-sm font-mono font-medium">{currentPlayerUsername}</span>
                            </div>
                        )}                      
                    </div>

                    {/* Right side */}
                    <div className="flex flex-row gap-1 sm:gap-2 items-center">
                        {/* Round Progress Indicator - Mobile: smaller dots, Desktop: current size */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            <div className="flex gap-0.5 sm:gap-1">
                                {Array.from({ length: totalRounds }, (_, i) => (
                                    <div
                                        key={i}
                                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
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

                {/* Progress Bar - Thinner on mobile */}
                <div className="mt-2 sm:mt-3 w-full bg-gray-200 rounded-full h-1 sm:h-1.5 overflow-hidden ">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(currentRound.roundNumber / totalRounds) * 100}%` }}
                    />
                </div>
            </>
        </PopupCard>
    );
}