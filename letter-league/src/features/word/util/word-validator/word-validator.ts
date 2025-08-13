import { EvaluatedLetter, LetterState } from "../../word-models";

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
