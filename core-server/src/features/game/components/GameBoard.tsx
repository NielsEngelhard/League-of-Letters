import LetterRowGrid from "@/features/word/components/LetterRowGrid";
import ActiveGameWordInput from "./ActiveGameWordInput";
import { useActiveGame } from "./active-game-context";
import InGameProgressionBar from "./in-game/InGameProgressionBar";
import LoadingSpinner from "@/components/ui/animation/LoadingSpinner";
import SettingsCard from "@/features/account/components/SettingsCard";
import { useEffect, useState } from "react";
import InGameTimer from "./in-game/InGameTimer";
import { getCurrentUtcUnixTimestamp_Seconds } from "@/lib/time-util";
import { SupportedLanguage } from "@/features/i18n/languages";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";
import InGameTranslations from "@/features/i18n/translation-file-interfaces/InGameTranslations";
import Button from "@/components/ui/Button";
import { ArrowBigLeft, Keyboard, Settings } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { SettingsTranslations } from "@/features/i18n/translation-file-interfaces/SettingsTranslations";
import { LANGUAGE_ROUTE, PICK_GAME_MODE_ROUTE } from "@/app/routes";
import InGamePlayerBar from "./in-game/InGamePlayersBar";

interface Props {
    lang: SupportedLanguage;
    generalTranslations: GeneralTranslations;
    inGameTranslations: InGameTranslations;
    settingsTranslations: SettingsTranslations;
}

export default function GameBoard({generalTranslations, inGameTranslations, settingsTranslations, lang}: Props) {
    const [showSettings, setShowSettings] = useState(false);
    const { game, players, currentGuess, currentRound, isThisPlayersTurn, isAnimating, revealedWord, currentPlayerId, recalculateCurrentPlayer } = useActiveGame();
    const [initialTimeLeftForThisTurn, setInitialTimeLeftForThisTurn] = useState<number | null>(null);

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
    return (
        <>
        {(game && currentRound) ? (
            <div className="">
                {/* Mobile-optimized container with responsive spacing */}
                <div className="w-full flex flex-col items-center gap-3 sm:gap-4 md:gap-6">
                    
                    <div className="fixed md:relative top-0 w-full z-50">
                        <InGameProgressionBar
                            currentRound={currentRound}
                            totalRounds={game.totalRounds}
                            timePerGuess={game.nSecondsPerGuess?.toString() ?? "∞"}
                            inGameTranslations={inGameTranslations}
                            currentPlayerUsername={players.find(p => p.accountId == currentPlayerId)?.username}
                        />
                    </div>

                    <InGamePlayerBar
                        players={players}
                        playersLabel="Players"
                        currentPlayerId={currentPlayerId}                        
                    />

                    {/* Game Grid Section - responsive spacing */}
                    <div className={`w-full flex flex-col items-center justify-center gap-2 sm:gap-3 ${getMobileScale()} md:scale-100 origin-top`}>

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
                        />
                    </div>

                    {/* Word Input Section - responsive sizing and positioning */}
                    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mt-2 sm:mt-4">
                        <ActiveGameWordInput
                            disabled={!isThisPlayersTurn || isAnimating}
                            t={generalTranslations}
                        />                        
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-row justify-between w-full">
                        <Button variant="skeleton" size="sm" corners="square" type="button" onClick={() => setShowSettings(true)}>
                            <Settings size={16} />
                            {settingsTranslations.settings.title}
                        </Button>                                          
                    </div>

                    {/* Spacer to push content up on mobile and prevent keyboard overlap */}
                    <div className="h-4 sm:h-8 md:h-12 flex-shrink-0" />
                </div>

                {/* Back button for mobile */}
                <Button
                    href={LANGUAGE_ROUTE(lang, PICK_GAME_MODE_ROUTE)}
                    size="sm"
                    className="w-full flex md:hidden"
                    corners="square"
                    variant="skeleton">
                    <div className="flex gap-1 items-center">
                        <ArrowBigLeft size={16} />
                        Spel verlaten
                    </div>
                </Button>    
            </div>
            ): (
                <div className="min-h-screen flex items-center justify-center">
                    <LoadingSpinner size="md" />
                </div>
            )}

            <Modal show={showSettings} onClose={() => setShowSettings(false)}>
                <SettingsCard t={settingsTranslations} />
            </Modal>
        </>
    );
}