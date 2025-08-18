import { EvaluatedLetter, LetterState, WordState } from "../../word-models";

export interface DetailedValidationResult {
    validatedWord: EvaluatedLetter[];
    newLetters: EvaluatedLetter[];
    allCorrect: boolean;
}

export class WordValidator {
    static validateAndFilter(guess: string, wordState: WordState, previouslyGuessedLetters: EvaluatedLetter[] ): DetailedValidationResult {
        const validatedWord = this.validate(guess, wordState.word);
        const newLetters = this.filterNewLetters(validatedWord, previouslyGuessedLetters);
        
        this.updateWordStateAndFilterMisplaced(wordState, newLetters);

        return {
            validatedWord: validatedWord,
            newLetters: newLetters,
            allCorrect: !validatedWord.some(l => l.state != LetterState.Correct)
        }
    }

    static updateWordStateAndFilterMisplaced(wordState: WordState, newLetters: EvaluatedLetter[]) {
        // Count occurrences of each letter in the target word
        const targetLetterCounts = new Map<string, number>();
        for (const char of wordState.word.toUpperCase()) {
            targetLetterCounts.set(char, (targetLetterCounts.get(char) || 0) + 1);
        }

        // Count how many of each letter are already correctly placed
        const correctlyPlacedCounts = new Map<string, number>();
        for (const evaluatedLetter of newLetters) {
            if (evaluatedLetter.state === LetterState.Correct) {
                const letter = evaluatedLetter.letter.toUpperCase();
                correctlyPlacedCounts.set(letter, (correctlyPlacedCounts.get(letter) || 0) + 1);
            }
        }

        // Check misplaced letters and convert to wrong if no remaining positions available
        for (const evaluatedLetter of newLetters) {
            if (evaluatedLetter.state === LetterState.Misplaced) {
                const letter = evaluatedLetter.letter.toUpperCase();
                const totalOccurrencesInTarget = targetLetterCounts.get(letter) || 0;
                const correctlyPlacedCount = correctlyPlacedCounts.get(letter) || 0;
                
                // If all occurrences of this letter are already correctly placed,
                // then this misplaced letter should actually be marked as wrong
                if (correctlyPlacedCount >= totalOccurrencesInTarget) {
                    evaluatedLetter.state = LetterState.Wrong;
                }
            }
        }
    }

    static validate(guess: string, word: string): EvaluatedLetter[] {
        var evaluatedLetters: EvaluatedLetter[] = new Array(guess.length);

        for(var i=0; i<guess.length; i++) {
            const guessedLetter = guess[i].toUpperCase();
            const actualLetter = word[i].toUpperCase();            

            const letterData: EvaluatedLetter = {
                letter: guessedLetter,                
                state: LetterState.Wrong,
                position: -1
            }

            const guessIsCorrect = guessedLetter == actualLetter;
            if (guessIsCorrect) {
                letterData.position = i + 1;
                letterData.state = LetterState.Correct;
            } else if (word.toUpperCase().includes(guessedLetter)) {
                letterData.state = LetterState.Misplaced;
            };

            evaluatedLetters[i] = letterData;            
        }

        return evaluatedLetters;
    }

    // Filter only the newly guessed letters
    static filterNewLetters(validatedWord: EvaluatedLetter[], previouslyGuessedLetters: EvaluatedLetter[]): EvaluatedLetter[] {
        var newLetters: EvaluatedLetter[] = [];

        for(var i=0; i<validatedWord.length; i++) {
            const currentLetter = validatedWord[i];

            if (currentLetter.state == LetterState.Correct) {
                addCorrectGuessIfNotAlreadyExists(currentLetter, previouslyGuessedLetters, newLetters);
            } else if (currentLetter.state == LetterState.Wrong) {
                addWrongGuessIfNotAlreadyExists(currentLetter, previouslyGuessedLetters, newLetters);
            } else if (currentLetter.state == LetterState.Misplaced) {
                addMisplacedIfNotAlreadyExists(currentLetter, previouslyGuessedLetters, newLetters);
            }
        }

        return newLetters;        
    }    
}

function addCorrectGuessIfNotAlreadyExists(evaluatedLetter: EvaluatedLetter, previouslyGuessedLetters: EvaluatedLetter[], newLetters: EvaluatedLetter[]) {
    if (!letterAndStateAndPositionAlreadyExist(evaluatedLetter, previouslyGuessedLetters)) {
        newLetters.push(evaluatedLetter);
    }
}

function addWrongGuessIfNotAlreadyExists(evaluatedLetter: EvaluatedLetter, previouslyGuessedLetters: EvaluatedLetter[], newLetters: EvaluatedLetter[]) {  
    if (!letterAndStateAlreadyExist(evaluatedLetter, previouslyGuessedLetters)) {
        
        if (!letterAndStateAlreadyExist(evaluatedLetter, newLetters)) {
            newLetters.push(evaluatedLetter);
        }
    }
}

function addMisplacedIfNotAlreadyExists(evaluatedLetter: EvaluatedLetter, previouslyGuessedLetters: EvaluatedLetter[], newLetters: EvaluatedLetter[]) {  
    if (!letterAndStateAlreadyExist(evaluatedLetter, previouslyGuessedLetters)) {
        
        if (!letterAndStateAlreadyExist(evaluatedLetter, newLetters)) {
            newLetters.push(evaluatedLetter);
        }
    }
}

function letterAndStateAlreadyExist(letter: EvaluatedLetter, letters: EvaluatedLetter[]): boolean {
    return letters.some(l => l.letter == letter.letter && l.state == letter.state);
}

function letterAndStateAndPositionAlreadyExist(letter: EvaluatedLetter, letters: EvaluatedLetter[]): boolean {
    return letters.some(l => l.letter == letter.letter && l.state == letter.state && l.position == letter.position);
}