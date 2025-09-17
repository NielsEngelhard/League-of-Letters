import LetterRowGrid from "@/features/word/components/LetterRowGrid";
import ActiveGameWordInput from "../ActiveGameWordInput";
import { useActiveGame } from "../active-game-context";
import InGameProgressionBar from "./InGameProgressionBar";
import LoadingSpinner from "@/components/ui/animation/LoadingSpinner";
import { useEffect, useMemo, useState } from "react";
import InGameTimer from "./InGameTimer";
import { getCurrentUtcUnixTimestamp_Seconds } from "@/lib/time-util";
import { SupportedLanguage } from "@/features/i18n/languages";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";
import InGameTranslations from "@/features/i18n/translation-file-interfaces/InGameTranslations";
import { SettingsTranslations } from "@/features/i18n/translation-file-interfaces/SettingsTranslations";
import Card from "@/components/ui/card/Card";
import GameMetaData from "./GameMetaData";
import ScoreTranslations from "@/features/i18n/translation-file-interfaces/ScoreTranslations";
import { PlayBrowserSoundEffect } from "@/lib/sound-player";
import GameBoardMobilePlayersGrid from "./GameBoardMobilePlayersGrid";

interface Props {
    lang: SupportedLanguage;
    generalTranslations: GeneralTranslations;
    inGameTranslations: InGameTranslations;
    settingsTranslations: SettingsTranslations;
    scoreTranslations: ScoreTranslations;
}

export default function GameBoard({generalTranslations, inGameTranslations, scoreTranslations, settingsTranslations, lang}: Props) {
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

    function getGridScale(): string {
        if (!currentRound) return "scale-100";

        if (currentRound.wordLength >= 10) return "scale-55 sm:scale-70 lg:scale-80 xl:scale-90";
        if (currentRound.wordLength >= 9) return "scale-70 sm:scale-80 lg:scale-90 xl:scale-100";
        if (currentRound.wordLength >= 8) return "scale-75 sm:scale-85 lg:scale-90 xl:scale-100";
        if (currentRound.wordLength >= 7) return "scale-85 sm:scale-95 md:scale-100";
        if (currentRound.wordLength >= 6) return "scale-90 md-scale-100";

        return "scale-100";
    }

    function onSubmitGuessFailed() {
        PlayBrowserSoundEffect("failing");
        setCurrentSubmitFailed(true);

        setTimeout(() => {
            setCurrentSubmitFailed(false);
        }, 500);
    }

    // Play sound effect everytime it becomes your turn
    useEffect(() => {
        if (!isThisPlayersTurn || game?.gameMode != "online") return;
        
        PlayBrowserSoundEffect("your-turn");
    }, [isThisPlayersTurn]);

    // Memoize sorted players to avoid recalculating on every render
    const sortedPlayers = useMemo(() => {
        if (players.length === 0 || !currentRound) return players;
        
        return [...players].sort((a, b) => {
        // Get the original indices of players in the array
        const indexA = players.indexOf(a);
        const indexB = players.indexOf(b);
        
        // Calculate turn order based on current round
        // currentRoundIndex 1 = player at index 0 starts
        const startingPlayerIndex = (currentRound.roundNumber - 1) % players.length;
        
        // Calculate the turn position for each player relative to the starting player
        const turnPositionA = (indexA - startingPlayerIndex + players.length) % players.length;
        const turnPositionB = (indexB - startingPlayerIndex + players.length) % players.length;
        
        return turnPositionA - turnPositionB;
        });
    }, [players, currentRound?.roundNumber]);    

    return (
        <>
        {(game && currentRound) ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2">
                     <div className={`w-full flex flex-col items-center justify-center gap-2 sm:gap-3`}>

                     <div className="fixed md:relative top-0 w-full z-50 md:z-0 mb-0 md:mb-3">
                        <InGameProgressionBar
                            currentRound={currentRound}
                            totalRounds={game.totalRounds}
                            timePerGuess={game.nSecondsPerGuess?.toString() ?? "∞"}
                            inGameTranslations={inGameTranslations}
                            guessesPerRound={game.nGuessesPerRound}
                            gameLanguage={game.language}
                        />
                     </div>

                        {/* On mobile show player grid small above the board, on desktop in metadata section */}
                        <GameBoardMobilePlayersGrid
                            game={game}
                            sortedPlayers={sortedPlayers}
                            t={inGameTranslations}
                        />

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
                         <div className={`${getGridScale()} `}>
                            <LetterRowGrid
                                currentGuess={currentGuess}
                                maxNGuesses={game.nGuessesPerRound}
                                preFilledRows={currentRound.guesses ?? []}
                                wordLength={currentRound.wordLength}
                                revealedWord={revealedWord}
                                revealedWordLabel={inGameTranslations.theWordWas}
                                currentSubmitFailed={currentSubmitFailed}
                            />
                         </div>
                        
                        {/* Keyboard/Input */}
                        <div className="w-full mt-2 sm:mt-4 md:max-w-lg">
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
                        inGameTranslations={inGameTranslations}
                        game={game}
                        sortedPlayers={sortedPlayers}
                        lang={lang}
                        scoreTranslations={scoreTranslations}
                        settingsTranslations={settingsTranslations}
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