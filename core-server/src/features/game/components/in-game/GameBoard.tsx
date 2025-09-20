import LetterRowGrid from "@/features/word/components/LetterRowGrid";
import ActiveGameWordInput from "../ActiveGameWordInput";
import { useActiveGame } from "../active-game-context";
import InGameProgressionBar from "./InGameProgressionBar";
import LoadingSpinner from "@/components/ui/animation/LoadingSpinner";
import { useEffect, useMemo, useState } from "react";
import { SupportedLanguage } from "@/features/i18n/languages";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";
import InGameTranslations from "@/features/i18n/translation-file-interfaces/InGameTranslations";
import { SettingsTranslations } from "@/features/i18n/translation-file-interfaces/SettingsTranslations";
import Card from "@/components/ui/card/Card";
import GameMetaData from "./GameMetaData";
import ScoreTranslations from "@/features/i18n/translation-file-interfaces/ScoreTranslations";
import { useSounds } from "@/lib/SoundPlayerContext";
import PlayerGrid from "./PlayersGrid";
import { GamePlayerModel } from "../../game-models";
import InGameTimer from "./InGameTimer";

interface Props {
    lang: SupportedLanguage;
    generalTranslations: GeneralTranslations;
    inGameTranslations: InGameTranslations;
    settingsTranslations: SettingsTranslations;
    scoreTranslations: ScoreTranslations;
}

export default function GameBoard({generalTranslations, inGameTranslations, scoreTranslations, settingsTranslations, lang}: Props) {
    const { game, players, currentGuess, currentRound, isThisPlayersTurn, isAnimating, revealedWord, currentPlayerId, recalculateCurrentPlayer, skipCurrentGuess } = useActiveGame();
    const [currentPlayer, setCurrentPlayer] = useState<GamePlayerModel | undefined>(undefined);
    const [currentSubmitFailed, setCurrentSubmitFailed] = useState(false);
    const soundPlayer = useSounds();
    
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
        soundPlayer.playEffect("failing");
        setCurrentSubmitFailed(true);

        setTimeout(() => {
            setCurrentSubmitFailed(false);
        }, 1500);
    }

    // Play sound effect every time it becomes your turn
    useEffect(() => {
        if (!isThisPlayersTurn || game?.gameMode != "online") return;
        
        soundPlayer.playEffect("your-turn");
    }, [isThisPlayersTurn]);

    // Set the current player and update
    useEffect(() => {
        const player = sortedPlayers.find(p => p.accountId == currentPlayerId);
        setCurrentPlayer(player);
    }, [currentPlayerId]);    

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

    // Timer ended so this guess is skipped
    function onTimerZero() {
        skipCurrentGuess();        
        recalculateCurrentPlayer();
    }

    return (
        <>
        {(game && currentRound) ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2">
                     <div className={`w-full flex flex-col items-center justify-center md:gap-2 sm:gap-3`}>

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

                        {/* On mobile show for clearity the current player at the top of the screen */}
                        {currentPlayer && (
                            <div className="block md:hidden w-full">
                                <PlayerGrid
                                    players={[currentPlayer]}
                                    accountIdCurrentPlayer={currentPlayerId}
                                    isInGame={true}
                                />                                 
                            </div>                           
                        )}

                        <div className="flex flex-col-reverse md:flex-col">
                            {(game.nSecondsPerGuess && currentRound.lastGuessUnixUtcTimestamp_InSeconds) && (
                                <div className="w-full flex justify-center">
                                    <InGameTimer
                                        secondsPerGuess={game.nSecondsPerGuess}
                                        lastGuessUnixUtcTimestamp={currentRound.lastGuessUnixUtcTimestamp_InSeconds}
                                        onTimerZero={onTimerZero}
                                    />
                                </div>
                            )}
                            
                            {/* Letter Grid */}
                            <div className={`${getGridScale()} relative`}>
                                <LetterRowGrid
                                    currentGuess={currentGuess}
                                    maxNGuesses={game.nGuessesPerRound}
                                    preFilledRows={currentRound.guesses ?? []}
                                    wordLength={currentRound.wordLength}
                                    currentSubmitFailed={currentSubmitFailed}
                                />

                                {/* Word reveal overlay */}
                                {revealedWord && (
                                    <div className="absolute inset-0 bg-background-secondary/60 rounded-lg flex items-center justify-center transition-all duration-500 ease-out">
                                        <div className="text-center space-y-1 bg-background-secondary/90 p-4 rounded-md">
                                            <div className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
                                                {inGameTranslations.theWordWas}
                                            </div>
                                            <div className="text-3xl font-bold text-primary tracking-widest font-monos">
                                                {revealedWord.toUpperCase()}
                                            </div>
                                        </div>
                                    </div>                                    
                                )}
                            </div>                            
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

                <Card className="col-span-1">
                    <GameMetaData
                        inGameTranslations={inGameTranslations}
                        game={game}
                        sortedPlayers={sortedPlayers}
                        lang={lang}
                        scoreTranslations={scoreTranslations}
                        settingsTranslations={settingsTranslations}
                        currentPlayerAccountId={currentPlayerId}
                        hostUsername={players.find(p => p.isHost)?.username ?? "-"}
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