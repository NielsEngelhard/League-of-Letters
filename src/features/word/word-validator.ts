import { EvaluatedLetter, LetterState } from "./word-models";

export interface DetailedValidationResult {
    validatedWord: EvaluatedLetter[];
    newLetters: EvaluatedLetter[];
    allCorrect: boolean;
}

export class WordValidator {
    static validateAndFilter(guess: string, word: string, previouslyGuessedLetters: EvaluatedLetter[] ): DetailedValidationResult {
        const validatedWord = this.validate(guess, word,);
        const newLetters = this.filterNewLetters(validatedWord, previouslyGuessedLetters);
        
        return {
            validatedWord: validatedWord,
            newLetters: newLetters,
            allCorrect: !validatedWord.some(l => l.state != LetterState.Correct)
        }
    }

    static validate(guess: string, word: string): EvaluatedLetter[] {
        var validatedLetters: EvaluatedLetter[] = new Array(guess.length);

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

            validatedLetters[i] = letterData;            
        }

        return validatedLetters;
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

function addCorrectGuessIfNotAlreadyExists(validatedLetter: EvaluatedLetter, previouslyGuessedLetters: EvaluatedLetter[], newLetters: EvaluatedLetter[]) {
    if (!letterAndStateAndPositionAlreadyExist(validatedLetter, previouslyGuessedLetters)) {
        newLetters.push(validatedLetter);
    }
}

function addWrongGuessIfNotAlreadyExists(validatedLetter: EvaluatedLetter, previouslyGuessedLetters: EvaluatedLetter[], newLetters: EvaluatedLetter[]) {  
    if (!letterAndStateAlreadyExist(validatedLetter, previouslyGuessedLetters)) {
        
        if (!letterAndStateAlreadyExist(validatedLetter, newLetters)) {
            newLetters.push(validatedLetter);
        }
    }
}

function addMisplacedIfNotAlreadyExists(validatedLetter: EvaluatedLetter, previouslyGuessedLetters: EvaluatedLetter[], newLetters: EvaluatedLetter[]) {  
    if (!letterAndStateAlreadyExist(validatedLetter, previouslyGuessedLetters)) {
        
        if (!letterAndStateAlreadyExist(validatedLetter, newLetters)) {
            newLetters.push(validatedLetter);
        }
    }
}

function letterAndStateAlreadyExist(letter: EvaluatedLetter, letters: EvaluatedLetter[]): boolean {
    return letters.some(l => l.letter == letter.letter && l.state == letter.state);
}

function letterAndStateAndPositionAlreadyExist(letter: EvaluatedLetter, letters: EvaluatedLetter[]): boolean {
    return letters.some(l => l.letter == letter.letter && l.state == letter.state && l.position == letter.position);
}
