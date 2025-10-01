import { EvaluatedWordFactory } from "../util/factories/evaluated-word-factory";
import { EvaluatedLetter, EvaluatedWord, LetterState } from "../word-models"
import LetterRow from "./LetterRow";

interface Props {
    previousGuesses: EvaluatedWord[];
    maxNGuesses: number;
    wordLength: number;
    currentGuess: string;
    currentSubmitFailed?: boolean;
    currentGuessIndex: number;
}

export default function LetterRowGrid({ 
    previousGuesses, 
    maxNGuesses, 
    wordLength, 
    currentGuess, 
    currentSubmitFailed,
    currentGuessIndex
}: Props) {
    const nEmptyRows = maxNGuesses - currentGuessIndex;
    const nPreviousGuesses = currentGuessIndex - 1;

    const renderPreviousGuesses = () => (
        <>
            {Array.from({length: nPreviousGuesses}).map((v, index) => (
                renderPreviousGuess(index + 1)
            ))}
        </>
    );

    const renderPreviousGuess = (position: number) => {
        const previousGuess = previousGuesses.find(g => g.position == position);

        // Skipped row
        if (!previousGuess) {
            return (
                <LetterRow 
                    key={`skip-${position}`} 
                    letters={EvaluatedWordFactory.createSkipped(wordLength, position).evaluatedLetters} 
                    animate={position === currentGuessIndex - 1} 
                />                  
            )
        }

        // Render previous guess
        return (
            <LetterRow 
                key={`guess-${position}`} 
                letters={previousGuess.evaluatedLetters} 
                animate={position === currentGuessIndex - 1} 
            />         
        )
    };

    const renderCurrentGuess = () => {
        const letters: EvaluatedLetter[] = Array.from({ length: wordLength }, (_, index) => ({
            position: index + 1,
            letter: currentGuess[index] || "",
            state: currentSubmitFailed ? LetterState.Wrong : LetterState.Unguessed
        }));

        return (
            <div className={currentSubmitFailed ? 'transition-colors duration-300' : ''}>
                <LetterRow key="current-guess" letters={letters} />
            </div>
        );
    };

    const renderEmptyRows = () => {
        const emptyLetters: EvaluatedLetter[] = Array.from({ length: wordLength }, (_, i) => ({
            position: i + 1,
            letter: "",
            state: LetterState.Unguessed
        }));

        return (
          <>
            {Array.from({ length: nEmptyRows }, (_, index) => 
                <LetterRow key={`empty-${index}`} letters={emptyLetters} />
            )}
          </>  
        );
    };

    return (
        <div className="relative">
            <div className="flex flex-col gap-1.5">
                {/* Previous guesses - or skipped */}
                {renderPreviousGuesses()}

                {/* Current guess row */}
                {currentGuessIndex <= maxNGuesses && renderCurrentGuess()}
                
                {/* Empty rows */}
                {renderEmptyRows()}
            </div>
        </div>
    );
}