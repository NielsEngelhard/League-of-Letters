import LetterRowGrid from "@/features/word/components/LetterRowGrid";
import ActiveGameWordInput from "./ActiveGameWordInput";
import { useActiveGame } from "./active-game-context";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import InGamePlayerBar from "./in-game/InGamePlayersBar";
import GameProgressionBar from "./in-game/InGameProgressionBar";
import LoadingSpinner from "@/components/ui/animation/LoadingSpinner";

interface Props {}

export default function GameBoard({}: Props) {
    const { game, players, setCurrentGuess, submitGuess, currentGuess, currentRound } = useActiveGame();
    const { authSession } = useAuth();
    const [isThisPlayersTurn, setIsThisPlayersTurn] = useState(true);

    async function onSubmitGuess() {
        setIsThisPlayersTurn(false);
        submitGuess(authSession?.secretKey ?? "??")
            .then(() => {
                setCurrentGuess("");
            })
            .finally(() => {
                setIsThisPlayersTurn(true);
            });
    }

    useEffect(() => {
        if (!currentGuess || currentGuess == "") return;
        
        // TODO: if not current players turn

        // emitGuessChangedEvent(currentGuess);
        
    }, [currentGuess]);

    return (
        <>
        {game ? (
            <div className="w-full flex flex-col items-center gap-6 max-w-2xl mx-auto">
                <GameProgressionBar
                    currentRoundIndex={game.currentRoundIndex}
                    totalRounds={game.totalRounds}
                />

                {/* Player bar */}
                <InGamePlayerBar
                    players={players}
                    currentPlayerId={players[0].userId}               
                />

                {/* Game Grid */}
                <div className="w-full flex justify-center">
                    <LetterRowGrid
                        currentGuess={currentGuess ?? ""}
                        maxNGuesses={game.nGuessesPerRound}
                        preFilledRows={currentRound?.guesses ?? []}
                        wordLength={game.wordLength}
                    />
                </div>

                {/* Word Input */}
                <div className="w-full max-w-md">
                    <ActiveGameWordInput
                        currentGuess={currentGuess ?? ""}
                        wordLength={game.wordLength}
                        onChange={setCurrentGuess}
                        onEnter={onSubmitGuess}
                        disabled={!isThisPlayersTurn}
                    />
                </div>
            </div>
            ): (
                <LoadingSpinner size="md" />
            )}
        </>
    );
}