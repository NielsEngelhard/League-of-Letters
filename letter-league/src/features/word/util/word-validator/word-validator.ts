import { LETTER_CORRECTLY_GUESSED_WITHOUT_MISPLACE } from "../../../../features/score/score-constants";
import { EvaluatedLetter, LetterState, WordState } from "../../word-models";

export interface DetailedValidationResult {
    evaluatedGuess: EvaluatedLetter[];
    score: number;
    allCorrect: boolean;
}

// SUPPORTED SCENARIOS
// 1: LETTER CORRECT WITHOUT MISPLACE

export class WordValidator {
    // guess = the current guess
    // wordState = the actual word and the state the word is in (which letters are already guessed)
    // wrongAndMisplacedLetters = the previously guessed letters that were wrong or misplaced
    static validate(guess: string, wordState: WordState, previouslyGuessedWrongAndMisplacedLetters: EvaluatedLetter[] ): DetailedValidationResult {
        let evaluatedGuess: EvaluatedLetter[] = new Array(guess.length);
        let scoreForThisGuess: number = 0;
        
        // First define the correct letters and the wrong letters
        for (let i = 0; i < guess.length; i++) {
            // Define the guessed letter and define the actual letter
            const guessedLetter = guess[i].toUpperCase();
            const actualLetter = wordState.word[i].toUpperCase();   
            
            // CORRECT
            if (guessedLetter == actualLetter) {
                const newCorrectLetterGuessed = wordState.letterStates[i].guessed == false;

                // CORRECT GUESS WITHOUT MISPLACE
                if (newCorrectLetterGuessed) {
                    scoreForThisGuess += LETTER_CORRECTLY_GUESSED_WITHOUT_MISPLACE;
                }

                wordState.letterStates[i].guessed = true;
                evaluatedGuess[i] = { letter: guessedLetter, position: i + 1, state: LetterState.Correct }
            } 
            // NOT CORRECT (WRONG or MISPLACED)
            else {
                // Not correct, so wrong - later determine if misplaced
                evaluatedGuess[i] = { letter: guessedLetter, position: i + 1, state: LetterState.Wrong }
            }
        }

        // After defining the correct letters, another iteration is needed to handle misplaced scenarios
        for (let i = 0; i < wordState.letterStates.length; i++) {
            // If correct, it is for sure not misplaced
            if (wordState.letterStates[i].guessed == true) continue;
            
            const wrongLetter = guess[i].toUpperCase();
            const wordStateContainsUnguessedLettersOfThisVariant = wordState.letterStates.some(l => l.guessed == false && l.letter.toUpperCase() == wrongLetter);
            
            // The letter is misplaced, because there are still guessed=false letters in the wordState
            if (wordStateContainsUnguessedLettersOfThisVariant) {
                evaluatedGuess[i].state = LetterState.Misplaced;

                // TODO: add score if it is the first misplace
            }
        }

        return {
            evaluatedGuess: evaluatedGuess,
            score: scoreForThisGuess,
            allCorrect: evaluatedGuess.some(evaluatedLetter => evaluatedLetter.state != LetterState.Correct) == false
        }
    }
}
