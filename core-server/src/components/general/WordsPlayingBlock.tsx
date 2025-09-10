"use client"

import { LETTER_ANIMATION_TIME_MS } from "@/features/game/game-constants";
import LetterRowGrid from "@/features/word/components/LetterRowGrid";
import { WordStateFactory } from "@/features/word/util/factories/word-state-factory";
import { WordValidator } from "@/features/word/util/word-validator/word-validator";
import { EvaluatedWord, WordState } from "@/features/word/word-models";
import { useEffect, useState } from "react";

interface Props {
    guesses: string[];
    actualWord: string;
}

export default function WordsPlayingBlock({ guesses, actualWord }: Props) {
    const wordState: WordState = WordStateFactory.create(actualWord);

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

    return (
        <LetterRowGrid
            maxNGuesses={6}
            preFilledRows={prefilledRows}
            wordLength={actualWord.length}
            currentGuess=""
        />
    );
}
