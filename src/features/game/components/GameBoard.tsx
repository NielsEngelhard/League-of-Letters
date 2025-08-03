import LetterRowGrid from "@/features/word/components/LetterRowGrid";

interface Props {

}

export default function GameBoard({  }: Props) {
    return (
        <div className="w-full flex flex-col items-center">
            <LetterRowGrid
                currentGuess="water"
                maxNGuesses={4}
                preFilledRows={[]}
                wordLength={6}                
            >

            </LetterRowGrid>
        </div>
    )
}