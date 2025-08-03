import LetterRowGrid from "@/features/word/components/LetterRowGrid";
import ActiveGameWordInput from "./ActiveGameWordInput";
import { useActiveGame } from "./active-game-context";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";

interface Props {

}

export default function GameBoard({  }: Props) {
    const { currentRoundIndex, totalRounds, submitGuess, wordLength, currentRound, maxAttemptsPerRound } = useActiveGame();
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
        })
    }

    return (
        <div className="w-full flex flex-col items-center gap-6">
            <div className="flex flex-row justify-between w-full text-sm text-foreground-muted font-monos">
                <div className="flex flex-col">
                    <div>Round: {currentRoundIndex}/{totalRounds}</div>
                    <div>Score: 100</div>
                    <div>Time: ∞</div>
                </div>

                <div>
                    {/* Iets van een cirkel die indicate hoeveel tijd totdat volgende ronde bijv. */}
                </div>

                <div>
                    TODO: PLAYER LIST
                </div>
            </div>

            <LetterRowGrid
                currentGuess={currentGuess}
                maxNGuesses={maxAttemptsPerRound}
                preFilledRows={currentRound.guesses}
                wordLength={wordLength}                
            />

            <ActiveGameWordInput
                currentGuess={currentGuess}
                wordLength={wordLength}
                onChange={setCurrentGuess}
                onEnter={onSubmitGuess}
                disabled={!canGuess}                   
            />
        </div>
    )
}