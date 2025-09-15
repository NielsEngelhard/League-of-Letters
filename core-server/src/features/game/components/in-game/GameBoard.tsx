import LetterRowGrid from "@/features/word/components/LetterRowGrid";
import ActiveGameWordInput from "../ActiveGameWordInput";
import { useActiveGame } from "../active-game-context";
import InGameProgressionBar from "./InGameProgressionBar";
import LoadingSpinner from "@/components/ui/animation/LoadingSpinner";
import { useEffect, useState } from "react";
import InGameTimer from "./InGameTimer";
import { getCurrentUtcUnixTimestamp_Seconds } from "@/lib/time-util";
import { SupportedLanguage } from "@/features/i18n/languages";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";
import InGameTranslations from "@/features/i18n/translation-file-interfaces/InGameTranslations";
import { SettingsTranslations } from "@/features/i18n/translation-file-interfaces/SettingsTranslations";
import Card from "@/components/ui/card/Card";
import GameMetaData from "./GameMetaData";

interface Props {
    lang: SupportedLanguage;
    generalTranslations: GeneralTranslations;
    inGameTranslations: InGameTranslations;
    settingsTranslations: SettingsTranslations;
}

export default function GameBoard({generalTranslations, inGameTranslations, settingsTranslations, lang}: Props) {
    const { game, players, currentGuess, currentRound, isThisPlayersTurn, isAnimating, revealedWord, currentPlayerId, recalculateCurrentPlayer } = useActiveGame();
    const [initialTimeLeftForThisTurn, setInitialTimeLeftForThisTurn] = useState<number | null>(null);
    const [currentSubmitFailed, setCurrentSubmitFailed] = useState(false); // e.g. invalid word input

    // Update timer if needed
    useEffect(() => {
        if (!game || !currentRound) return;
        if (!currentRound.lastGuessUnixUtcTimestamp_InSeconds || !game.nSecondsPerGuess) return;
        const timeLeftForThisTurn = calculateTimeLeftForThisTurn(currentRound.lastGuessUnixUtcTimestamp_InSeconds, game.nSecondsPerGuess);

        setInitialTimeLeftForThisTurn(timeLeftForThisTurn);
    }, [game?.currentRoundIndex, currentRound?.currentGuessIndex, currentRound?.lastGuessUnixUtcTimestamp_InSeconds, currentPlayerId]);

    function calculateTimeLeftForThisTurn(lastGuessUnixSeconds: number, timePerTurn: number) {
        const diff = getCurrentUtcUnixTimestamp_Seconds() - lastGuessUnixSeconds;
        const timePastForThisTurn = diff % timePerTurn;

        return timePerTurn - timePastForThisTurn;
    }

    function getMobileScale(): string {
        if (!currentRound) return "scale-100";

        if (currentRound.wordLength >= 10) return "scale-50";
        if (currentRound.wordLength >= 9) return "scale-60";
        if (currentRound.wordLength >= 8) return "scale-70";
        if (currentRound.wordLength >= 7) return "scale-80";
        if (currentRound.wordLength >= 6) return "scale-90";

        return "scale-100";
    }

    function onSubmitGuessFailed() {
        setCurrentSubmitFailed(true);

        setTimeout(() => {
            setCurrentSubmitFailed(false);
        }, 500);
    }

    return (
        <>
        {(game && currentRound) ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-2">
                     <div className={`w-full flex flex-col items-center justify-center gap-2 sm:gap-3 ${getMobileScale()} md:scale-100 origin-top`}>

                     <div className="relative top-0 w-full z-50 mb-0 md:mb-3">
                        <InGameProgressionBar
                            currentRound={currentRound}
                            totalRounds={game.totalRounds}
                            timePerGuess={game.nSecondsPerGuess?.toString() ?? "∞"}
                            inGameTranslations={inGameTranslations}
                            guessesPerRound={game.nGuessesPerRound}
                            gameLanguage={game.language}
                        />
                     </div>

                         {/* Timer - smaller on mobile */}
                         {(currentRound.lastGuessUnixUtcTimestamp_InSeconds && initialTimeLeftForThisTurn && game.nSecondsPerGuess) && (
                            <div className="w-full">
                                <InGameTimer
                                    key={`${currentPlayerId}-${currentRound.currentGuessIndex}`}
                                    timePerTurn={game.nSecondsPerGuess}
                                    initialTime={initialTimeLeftForThisTurn}
                                    onTimerEnd={recalculateCurrentPlayer}
                                    isPaused={isAnimating}
                                />   
                            </div>
                        )}
                        
                         {/* Letter Grid */}
                        <LetterRowGrid
                            currentGuess={currentGuess}
                            maxNGuesses={game.nGuessesPerRound}
                            preFilledRows={currentRound.guesses ?? []}
                            wordLength={currentRound.wordLength}
                            revealedWord={revealedWord}
                            revealedWordLabel={inGameTranslations.theWordWas}
                            currentSubmitFailed={currentSubmitFailed}
                        />
                        
                        {/* Keyboard/Input */}
                        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mt-2 sm:mt-4">
                            <ActiveGameWordInput
                                disabled={!isThisPlayersTurn || isAnimating}
                                t={generalTranslations}
                                onSubmitFailed={onSubmitGuessFailed}
                            />                        
                        </div>                        
                    </div>
                </div>

                <Card className="col-span-1 max-h-[725px]">
                    <GameMetaData
                        t={inGameTranslations}
                        game={game}
                        players={players}
                        currentPlayerAccountId={currentPlayerId}
                        lang={lang}
                    />
                </Card>
            </div>
            ): (
                <div className="min-h-screen flex items-center justify-center">
                    <LoadingSpinner size="md" />
                </div>
            )}
        </>
    );
}