"use client"

import { LETTER_ANIMATION_TIME_MS } from "@/features/game/game-constants";
import LetterRow from "@/features/word/components/LetterRow";
import { WordStateFactory } from "@/features/word/util/factories/word-state-factory";
import { WordValidator } from "@/features/word/util/word-validator/word-validator";
import { EvaluatedLetter, EvaluatedWord, LetterState, WordState } from "@/features/word/word-models";
import { useEffect, useState } from "react";

interface Props {
    guesses: string[];
    actualWord: string;
}

export default function WordsPlayingBlock({ guesses, actualWord }: Props) {
    const wordState: WordState = WordStateFactory.create({ word: actualWord });

    const [prefilledRows, setPrefilledRows] = useState<EvaluatedWord[]>([]);
    const [currentGuessIndex, setCurrentGuessIndex] = useState(0);

    // Add the word whenever the guess index changes
    useEffect(() => {
        const currentGuess = guesses[currentGuessIndex];
        if (!currentGuess) return;

        const evaluatedWord = WordValidator.validate({
            actualWordState: wordState,
            currentGuessIndex,
            guess: currentGuess,
            previouslyGuessedMisplacedLetters: []
        });

        const newGuess: EvaluatedWord = {
            position: prefilledRows.length,
            evaluatedLetters: evaluatedWord.evaluatedGuess
        };

        setPrefilledRows(prev => [...prev, newGuess]);

        const duration = (LETTER_ANIMATION_TIME_MS * currentGuess.length) + 1500;
        const timeout = setTimeout(() => {
            nextWord();
        }, duration);

        return () => clearTimeout(timeout);
    }, [currentGuessIndex]);

    function nextWord() {
        const nextIndex = (currentGuessIndex + 1) % guesses.length;
        setCurrentGuessIndex(nextIndex);

        // If we've filled all rows, reset
        if (prefilledRows.length + 1 >= guesses.length) {
            setPrefilledRows([]);
        }
    }

    const renderEmptyRows = () => {
        const emptyLetters: EvaluatedLetter[] = Array.from({ length: actualWord.length }, (_, i) => ({
            position: i + 1,
            letter: "",
            state: LetterState.Unguessed
        }));

        return (
          <>
            {Array.from({ length: 6 - prefilledRows.length }, (_, index) => 
                <LetterRow key={`empty-${index}`} letters={emptyLetters} />
            )}
          </>  
        );
    };    

    return (
        <>
            <div className="flex flex-col gap-1.5">
                {prefilledRows.map(row => (
                    <LetterRow
                        key={row.position} 
                        letters={row.evaluatedLetters} 
                        animate={currentGuessIndex == row.position} 
                    />   
                ))}

                {/* Empty rows */}
                {renderEmptyRows()}                
            </div>     
        </>
    );
}
