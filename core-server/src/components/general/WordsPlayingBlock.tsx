"use client"

import { LETTER_ANIMATION_TIME_MS } from "@/features/game/game-constants";
import LetterRow from "@/features/word/components/LetterRow";
import LetterRowGrid from "@/features/word/components/LetterRowGrid";
import { WordStateFactory } from "@/features/word/util/factories/word-state-factory";
import { WordValidator } from "@/features/word/util/word-validator/word-validator";
import { EvaluatedLetter, EvaluatedWord, LetterState, WordState } from "@/features/word/word-models";
import { useEffect, useState } from "react";

export default function WordsPlayingBlock() {
    // Mock words for demonstration - replace with actual prop when ready
    const words = ["LEARNING", "BUILDING", "CREATING", "PLAYING", "THINKING"];
    const actualWord = "THINKING";

    const initialWordState: WordState = WordStateFactory.create(actualWord);

    
    const [wordState, setWordState] = useState<WordState>(initialWordState);
    const [prefilledRows, setPrefilledRows] = useState<EvaluatedWord[]>([]);

    const [currentGuessIndex, setCurrentGuessIndex] = useState(0);

    // Start the animation cycle
    useEffect(() => {
        // Start playing after a short delay
        const initialDelay = setTimeout(() => {
            addCurrentWord();
        }, 500);

        return () => clearTimeout(initialDelay);
    }, []);

    // Handle word cycling
    useEffect(() => {
        const currentWord = words[currentGuessIndex];
        const duration = (LETTER_ANIMATION_TIME_MS * currentWord.length) + 1500;
                
        const timeout = setTimeout(() => {
            nextWord();
        }, duration);

        return () => clearTimeout(timeout);
    }, [currentGuessIndex]);

    function addCurrentWord() {
        const currentGuess = words[currentGuessIndex];
                

        const evaluatedWord = WordValidator.validate({
            actualWordState: wordState,
            currentGuessIndex: currentGuessIndex,
            guess: currentGuess,
            previouslyGuessedMisplacedLetters: []
        });

        const newGuess: EvaluatedWord = {
            position: prefilledRows.length,
            evaluatedLetters: evaluatedWord.evaluatedGuess
        };

        setPrefilledRows(prev => [...prev, newGuess]);
    }

    function nextWord() {
        const nextIndex = (currentGuessIndex + 1) % words.length;
        setCurrentGuessIndex(nextIndex);
                
        // If we've filled all 6 rows, reset
        if (prefilledRows.length >= 6) {
            setPrefilledRows([]);
        }
                
        // Add the next word after a short delay
        setTimeout(() => {
            addCurrentWord();
        }, 100);
    }

    // Helper function to add some visual variety (customize as needed)
    function getRandomLetterState(): LetterState {
        const states = [LetterState.Correct, LetterState.Misplaced, LetterState.Wrong];
        return states[Math.floor(Math.random() * states.length)];
    }

    return (
        <LetterRowGrid
            maxNGuesses={6}
            preFilledRows={prefilledRows}
            wordLength={8}
            currentGuess=""
        />
    );
}