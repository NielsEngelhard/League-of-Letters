import { EvaluatedWord, LetterState } from "../word-models";

export function mapLetterColors(guesses: EvaluatedWord[], unguessedMisplacedLetters: string[], startingLetter?: string, displayCompletCorrectAsCorrect: boolean = true): Map<string, LetterState> {
    const letterStateMap = new Map<string, LetterState>();
    
    // Track letters that have appeared as both correct and wrong
    const letterHasCorrect = new Set<string>();
    const letterHasWrong = new Set<string>();

    if (startingLetter) {
        const upperStartingLetter = startingLetter.toUpperCase();
        letterStateMap.set(upperStartingLetter, LetterState.Correct);
        letterHasCorrect.add(upperStartingLetter);
    }

    // First pass: collect all states for each letter
    guesses?.forEach((previousGuess) => {
        previousGuess.evaluatedLetters.forEach((evaluatedLetter) => {
            const currentLetter = evaluatedLetter.letter.toUpperCase();
            
            if (evaluatedLetter.state === LetterState.Correct) {
                letterHasCorrect.add(currentLetter);
            } else if (evaluatedLetter.state === LetterState.Wrong) {
                letterHasWrong.add(currentLetter);
            }
        });
    });

    // Second pass: determine final states with priority logic
    guesses?.forEach((previousGuess) => {
        previousGuess.evaluatedLetters.forEach((evaluatedLetter) => {
            const currentLetter = evaluatedLetter.letter.toUpperCase();
            const currentState = letterStateMap.get(currentLetter);

            if (evaluatedLetter.state === LetterState.Correct) {
                // Check if this letter has appeared as both correct and wrong
                if (!displayCompletCorrectAsCorrect && letterHasCorrect.has(currentLetter) && letterHasWrong.has(currentLetter)) {
                    letterStateMap.set(currentLetter, LetterState.CompleteCorrect);
                } else {
                    // Correct takes priority over misplaced and wrong, but not CompleteCorrect
                    if (currentState !== LetterState.CompleteCorrect) {
                        letterStateMap.set(currentLetter, LetterState.Correct);
                    }
                }
            } else if (evaluatedLetter.state === LetterState.Wrong) {
                // Only set to Wrong if no existing state (lowest priority)
                if (!currentState) {
                    letterStateMap.set(currentLetter, LetterState.Wrong);
                }
            }
        });
    });

    // Handle misplaced letters (these should not override CompleteCorrect or correct)
    unguessedMisplacedLetters.forEach(unguessedMisplacedLetter => {
        const upperLetter = unguessedMisplacedLetter.toUpperCase();
        const currentState = letterStateMap.get(upperLetter);
        if (!displayCompletCorrectAsCorrect && currentState !== LetterState.CompleteCorrect && currentState !== LetterState.Correct) {
            letterStateMap.set(upperLetter, LetterState.Misplaced);
        }
    });

    return letterStateMap;
}