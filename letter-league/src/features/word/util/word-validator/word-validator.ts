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
        // this.filterMisplacedThatDoNoOccurAnymoreFromNewLetters(newLetters, wordState);

        // Update the wordState
        // 1: toggle all new corrects
        // 2: check if the MISPLACED still counts, if not add as WRONG

        return {
            validatedWord: validatedWord,
            newLetters: newLetters,
            allCorrect: !validatedWord.some(l => l.state != LetterState.Correct)
        }
    }

    static updateWordStateAndFilterMisplaced(wordState: WordState, newLetters: EvaluatedLetter[]) {

        // Switch the new correct letters to CORRECT
        for (var i=0; i < newLetters.length; i++) {
            if (newLetters[i].state != LetterState.Correct) return;
            
            const position = newLetters[i].position;

            debugger;
            wordState.letterStates[position-1].guessed = true;
        }

        // If there are new misplaced letters that are not misplaced anymore after the correct letters are determined,
        // => set misplaced letter to wrong
        for (var i=0; i < newLetters.length; i++) {
            if (newLetters[i].state != LetterState.Misplaced) return;
            
            const isStillMisplaced = wordState.letterStates.some(ls => ls.letter == newLetters[i].letter && ls.guessed == false);
            if (isStillMisplaced) return;

            newLetters[i].state = LetterState.Wrong;
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
