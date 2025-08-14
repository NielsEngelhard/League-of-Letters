import LetterRowGrid from "@/features/word/components/LetterRowGrid";
import ActiveGameWordInput from "./ActiveGameWordInput";
import { useActiveGame } from "./active-game-context";
import { useAuth } from "@/features/auth/AuthContext";
import InGamePlayerBar from "./in-game/InGamePlayersBar";
import GameProgressionBar from "./in-game/InGameProgressionBar";
import LoadingSpinner from "@/components/ui/animation/LoadingSpinner";
import SettingsCard from "@/features/settings/components/SettingsCard";

interface Props {}

export default function GameBoard({}: Props) {
    const { game, players, setCurrentGuess, submitGuess, currentGuess, currentRound, isThisPlayersTurn, isAnimating, currentPlayerId } = useActiveGame();
    const { authSession } = useAuth();

    async function onSubmitGuess() {
        submitGuess(authSession?.secretKey ?? "??")
            .then(() => {
                setCurrentGuess("");
            });
    }

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
                    currentPlayerId={currentPlayerId}               
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
                        disabled={!isThisPlayersTurn || isAnimating}
                    />
                </div>

                {/* Settings */}
                <SettingsCard />
            </div>
            ): (
                <LoadingSpinner size="md" />
            )}
        </>
    );
}