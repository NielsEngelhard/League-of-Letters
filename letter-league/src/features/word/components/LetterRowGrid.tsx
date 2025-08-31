import { EvaluatedLetter, EvaluatedWord, LetterState } from "../word-models"
import LetterRow from "./LetterRow";

interface Props {
    preFilledRows: EvaluatedWord[];
    maxNGuesses: number;
    wordLength: number;
    currentGuess: string;
}

export default function LetterRowGrid({ preFilledRows, maxNGuesses, wordLength, currentGuess }: Props) {

    const nEmptyRows: number = maxNGuesses - preFilledRows.length - 1;

    function displayPreviousGuesses() {
        return (
            <>
                {preFilledRows.map((value, i) => (
                    <LetterRow key={`guess-${i}`} letters={value.evaluatedLetters} animate={preFilledRows.length-1 == i} />
                ))}
            </>
        )
    }

    function displayCurrentGuess() {
        let letters: EvaluatedLetter[] = [];
        
        for(let i=0; i<wordLength; i++) {
            const position = i+1;
            // Empty
            if (currentGuess.length < position) {
                letters = [...letters, ...[{ position: position, letter: "", state: LetterState.Unguessed }]];
   
            // Typed letter
            } else {
                letters = [...letters, ...[{ position: position, letter: currentGuess[i], state: LetterState.Unguessed }]];
            }
        }
        return (
            <LetterRow key="currentguess" letters={letters} />
        )
    }    

    function displayEmptyRow(index: number) {
        const letters: EvaluatedLetter[] = Array(wordLength).fill({});

        return (
            <LetterRow key={index} letters={letters} />
        )
    }    

    return (
        <div className="flex flex-col gap-2">
            {/* Previous guesses */}
            {displayPreviousGuesses()}

            {/* Current guess */}
            {preFilledRows.length < maxNGuesses && displayCurrentGuess()}

            {/* Empty Rows */}
            {Array.from({ length: nEmptyRows }, (_, index) => (
                displayEmptyRow(index)
            ))}
        </div>
    )
}