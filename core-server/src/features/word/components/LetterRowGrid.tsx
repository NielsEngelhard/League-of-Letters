import { last } from "@/lib/array-util";
import { EvaluatedLetter, EvaluatedWord, LetterState } from "../word-models"
import LetterRow from "./LetterRow";

interface Props {
    preFilledRows: EvaluatedWord[];
    maxNGuesses: number;
    wordLength: number;
    currentGuess: string;
    label?: string;
    revealedWord?: string;
}

export default function LetterRowGrid({ 
    preFilledRows, 
    maxNGuesses, 
    wordLength, 
    currentGuess, 
    label,
    revealedWord
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
            state: LetterState.Unguessed
        }));

        return <LetterRow key="current-guess" letters={letters} />;
    };

    const renderEmptyRow = (index: number) => {
        const emptyLetters: EvaluatedLetter[] = Array.from({ length: wordLength }, (_, i) => ({
            position: i + 1,
            letter: "",
            state: LetterState.Unguessed
        }));

        return <LetterRow key={`empty-${index}`} letters={emptyLetters} />;
    };

    const renderWordReveal = () => {
        if (!revealedWord) return null;

        // If revealedword is guessed, it is already shown, so dont show the revealedword yet another time
        const lastElementContainsOnlyCorrectLetters = last(preFilledRows)?.evaluatedLetters.every(l => l.state == LetterState.Correct);
        if (lastElementContainsOnlyCorrectLetters) {
            return null;
        }

        return (
            <div className="absolute inset-0 bg-background-secondary/60 rounded-lg flex items-center justify-center transition-all duration-500 ease-out">
                <div className="text-center space-y-1 bg-background-secondary/90 p-4 rounded-md">
                    <div className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
                        {label}
                    </div>
                    <div className="text-3xl font-bold text-primary tracking-widest font-monos">
                        {revealedWord.toUpperCase()}
                    </div>
                </div>
            </div>
        );
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

            {/* Word reveal overlay */}
            {renderWordReveal()}
        </div>
    );
}