import LetterRowGrid from "@/features/word/components/LetterRowGrid";
import ActiveGameWordInput from "./ActiveGameWordInput";
import { useActiveGame } from "./active-game-context";
import { useState } from "react";

interface Props {

}

export default function GameBoard({  }: Props) {
    const { activeGame } = useActiveGame();
    const [canGuess, setCanGuess] = useState(true);
    const [currentGuess, setCurrentGuess] = useState<string>("");

    function onSubmitGuess() {
        console.log("SUBMIT guess");
    }

    return (
        <div className="w-full flex flex-col items-center gap-6">
            <div className="flex flex-row justify-between w-full text-sm text-foreground-muted font-monos">
                <div>
                    Round {activeGame.currentRound}/{activeGame.totalRounds}
                </div>

                <div>
                    Unlimited time
                </div>
            </div>

            <LetterRowGrid
                currentGuess={currentGuess}
                maxNGuesses={4}
                preFilledRows={[]}
                wordLength={6}                
            />

            <ActiveGameWordInput
                currentGuess={currentGuess}
                maxLength={activeGame.wordLength}
                onChange={setCurrentGuess}
                onEnter={onSubmitGuess}
                disabled={!canGuess}                   
            />
        </div>
    )
}