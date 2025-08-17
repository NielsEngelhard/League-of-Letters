import LetterRowGrid from "@/features/word/components/LetterRowGrid";
import ActiveGameWordInput from "./ActiveGameWordInput";
import { useActiveGame } from "./active-game-context";
import { useAuth } from "@/features/auth/AuthContext";
import InGamePlayerBar from "./in-game/InGamePlayersBar";
import GameProgressionBar from "./in-game/InGameProgressionBar";
import LoadingSpinner from "@/components/ui/animation/LoadingSpinner";
import SettingsCard from "@/features/account/components/SettingsCard";
import { useEffect } from "react";
import InGameGuessedLettersOverview from "./in-game/InGameGuessedLettersOverview";
import InGameTimer from "./in-game/InGameTimer";

interface Props {}



export default function GameBoard({}: Props) {
    const { game, players, setCurrentGuess, submitGuess, currentGuess, currentRound, isThisPlayersTurn, isAnimating, theWord, currentPlayerId } = useActiveGame();
    const { settings } = useAuth();

    async function onSubmitGuess() {
        submitGuess()
            .then(() => {
                setCurrentGuess("");
            });
    }

    function onChangeInput (i: string) {
        setCurrentGuess(i);
    }

    useEffect(() => {
        console.log("Current guess changed to " + currentGuess);
    }, [currentGuess]);

    return (
        <>
        {(game && currentRound) ? (
            <div className="w-full flex flex-col items-center gap-6 max-w-2xl mx-auto">
                <GameProgressionBar
                    currentRoundIndex={game.currentRoundIndex}
                    totalRounds={game.totalRounds}
                />

                {/* Player bar */}
                <InGamePlayerBar
                    players={players}
                    currentPlayerId={currentPlayerId}               
                />

                {/* Guessed Letters Display (TOP) - ON MOBILE DISPLAY FIXED AT TOP */}
                {(settings.showGuessedLettersBar == true && settings.showLettersOnTopOfScreen) == true && (
                    <div className="fixed md:relative mx-2 top-[60px] md:top-0">
                        <InGameGuessedLettersOverview />
                    </div>
                )}                

                {/* Game Grid */}
                <div className="w-full flex flex-col items-center justify-center gap-2">

                    {game.nSecondsPerGuess && (
                        <InGameTimer initialTime={game.nSecondsPerGuess} />    
                    )}
                                    
                    <LetterRowGrid
                        currentGuess={currentGuess}
                        maxNGuesses={game.nGuessesPerRound}
                        preFilledRows={currentRound.guesses ?? []}
                        wordLength={currentRound.wordLength}
                    />
                </div>

                {/* Word Input OR The Word */}
                <div className="w-full max-w-md">
                    {!theWord ? (
                        <ActiveGameWordInput
                            currentGuess={currentGuess}
                            wordLength={currentRound.wordLength}
                            onChange={onChangeInput}
                            onEnter={onSubmitGuess}
                            disabled={!isThisPlayersTurn || isAnimating}
                        />
                    ) : (
                        <div className="w-full flex flex-col items-center">
                            <span className="text-sm text-foreground-muted">The word was:</span>
                            <span className="text-4xl text-primary font-bold">{theWord}</span>
                        </div>
                    )}
                </div>

                {/* Guessed Letters Display (BOTTOM) */}
                {(settings.showGuessedLettersBar == true && settings.showLettersOnTopOfScreen == false) && (
                    <InGameGuessedLettersOverview />
                )}

                {/* Settings */}
                <SettingsCard />
            </div>
            ): (
                <LoadingSpinner size="md" />
            )}
        </>
    );
}
