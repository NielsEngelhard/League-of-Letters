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
    previousGuesses: preFilledRows, 
    maxNGuesses, 
    wordLength, 
    currentGuess, 
    currentSubmitFailed,
    currentGuessIndex
}: Props) {
    const nSkippedGuesses: number = (currentGuessIndex - preFilledRows.length) - 1;
    const nEmptyRows = maxNGuesses - currentGuessIndex;

    const renderPreviousGuesses = () => (
        <>
            {preFilledRows.map((evaluatedWord, index) => (
                <LetterRow 
                    key={`guess-${index}`} 
                    letters={evaluatedWord.evaluatedLetters} 
                    animate={index === preFilledRows.length - 1} 
                />
            ))}
        </>
    );

    const renderSkippedGuesses = () => {
        if (!currentGuessIndex || !preFilledRows) return;


        return (
            <>
                {Array.from({length: nSkippedGuesses}).map((v, index) => (
                    <LetterRow 
                        key={`skip-${index}`} 
                        letters={EvaluatedWordFactory.createSkipped(wordLength, index).evaluatedLetters} 
                        animate={index === preFilledRows.length - 1} 
                    />
                ))}
            </>            
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
                {/* Previous guesses */}
                {renderPreviousGuesses()}

                {/* Skipped guesses */}
                {renderSkippedGuesses()}

                {/* Current guess row */}
                {preFilledRows.length < maxNGuesses && renderCurrentGuess()}
                
                {/* Empty rows */}
                {renderEmptyRows()}
            </div>
        </div>
    );
}