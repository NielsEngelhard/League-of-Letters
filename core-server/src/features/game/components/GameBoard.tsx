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
import { Settings } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { SettingsTranslations } from "@/features/i18n/translation-file-interfaces/SettingsTranslations";
import InGamePlayerBar from "./in-game/InGamePlayersBar";
import Card from "@/components/ui/card/Card";
import { CardContent } from "@/components/ui/card/card-children";

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
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                     <div className={`w-full flex flex-col items-center justify-center gap-2 sm:gap-3 ${getMobileScale()} md:scale-100 origin-top`}>

                     <div className="fixed md:relative top-0 w-full z-50">
                        <InGameProgressionBar
                            currentRound={currentRound}
                            totalRounds={game.totalRounds}
                            timePerGuess={game.nSecondsPerGuess?.toString() ?? "∞"}
                            inGameTranslations={inGameTranslations}
                            currentPlayerUsername={players.find(p => p.accountId == currentPlayerId)?.username}
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

                <Card className="col-span-1">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                        {/* Players */}
                        <div>
                            <InGamePlayerBar
                                players={players}
                                playersLabel="Players"
                                currentPlayerId={currentPlayerId}                        
                            />                             
                        </div>

                        {/* Actions */}
                        <div className="flex flex-row justify-between w-full">
                            <Button variant="skeleton" size="sm" corners="square" type="button" onClick={() => setShowSettings(true)}>
                                <Settings size={16} />
                                {settingsTranslations.settings.title}
                            </Button>                                          
                        </div>                        
                    </CardContent>
                </Card>
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