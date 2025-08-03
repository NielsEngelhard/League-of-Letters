import LetterRowGrid from "@/features/word/components/LetterRowGrid";
import ActiveGameWordInput from "./ActiveGameWordInput";
import { useActiveGame } from "./active-game-context";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import PlayerList from "./PlayerList";
import GameProgressionBar from "./GameProgressionBar";

interface Props {}

export default function GameBoard({}: Props) {
    const { currentRoundIndex, totalRounds, submitGuess, wordLength, currentRound, maxAttemptsPerRound, players } = useActiveGame();
    const { authSession } = useAuth();
    const [canGuess, setCanGuess] = useState(true);
    const [currentGuess, setCurrentGuess] = useState<string>("");

    async function onSubmitGuess() {
        setCanGuess(false);
        submitGuess(currentGuess, authSession?.secretKey ?? "??")
            .then(() => {
                setCurrentGuess("");
            })
            .finally(() => {
                setCanGuess(true);
            });
    }

    // Mock players data - replace with actual players from context
    const mockPlayers = [
        { id: "1", username: "You", score: 100, isCurrentPlayer: true },
        { id: "2", username: "Player2", score: 85, isCurrentPlayer: false },
        { id: "3", username: "Player3", score: 92, isCurrentPlayer: false },
    ];

    return (
        <div className="w-full flex flex-col items-center gap-6 max-w-2xl mx-auto">
            <GameProgressionBar
                currentRoundIndex={currentRoundIndex}
                totalRounds={totalRounds}
            />

            {/* Players List */}
            <PlayerList
                players={mockPlayers}
                currentPlayerId={mockPlayers[0].id}
            />

            {/* Game Grid */}
            <div className="w-full flex justify-center">
                <LetterRowGrid
                    currentGuess={currentGuess}
                    maxNGuesses={maxAttemptsPerRound}
                    preFilledRows={currentRound.guesses}
                    wordLength={wordLength}
                />
            </div>

            {/* Word Input */}
            <div className="w-full max-w-md">
                <ActiveGameWordInput
                    currentGuess={currentGuess}
                    wordLength={wordLength}
                    onChange={setCurrentGuess}
                    onEnter={onSubmitGuess}
                    disabled={!canGuess}
                />
            </div>
        </div>
    );
}