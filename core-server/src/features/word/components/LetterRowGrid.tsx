import { EvaluatedLetter, EvaluatedWord, LetterState } from "../word-models"
import LetterRow from "./LetterRow";

interface Props {
    preFilledRows: EvaluatedWord[];
    maxNGuesses: number;
    wordLength: number;
    currentGuess: string;
    currentSubmitFailed?: boolean;
}

export default function LetterRowGrid({ 
    preFilledRows, 
    maxNGuesses, 
    wordLength, 
    currentGuess, 
    currentSubmitFailed
}: Props) {
    const remainingRows = maxNGuesses - preFilledRows.length - 1;

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

    const renderEmptyRow = (index: number) => {
        const emptyLetters: EvaluatedLetter[] = Array.from({ length: wordLength }, (_, i) => ({
            position: i + 1,
            letter: "",
            state: LetterState.Unguessed
        }));

        return <LetterRow key={`empty-${index}`} letters={emptyLetters} />;
    };

    return (
        <div className="relative">
            <div className="flex flex-col gap-1.5">
                {/* Previous guesses */}
                {renderPreviousGuesses()}
                
                {/* Current guess row */}
                {preFilledRows.length < maxNGuesses && renderCurrentGuess()}
                
                {/* Empty rows */}
                {Array.from({ length: remainingRows }, (_, index) => 
                    renderEmptyRow(index)
                )}
            </div>
        </div>
    );
}