import { ScoreCalculator } from "../../../../features/score/score-calculator/score-calculator";
import { EvaluatedLetter, LetterState, WordState } from "../../word-models";

export interface DetailedValidationResult {
    evaluatedGuess: EvaluatedLetter[];
    score: number;
    allCorrect: boolean;
    previouslyGuessedMisplacedLetters: string[]; // Updated version
    actualWordState: WordState; // Updated version
}

export interface ValidateWordRequestData {
    guess: string;
    actualWordState: WordState; // Containing information regarding the actual word and which letters are already guessed (and which not)
    previouslyGuessedMisplacedLetters: string[]; // list of letters that were already guessed before
    currentGuessIndex: number;
}

export class WordValidator {
    static validate(requestData: ValidateWordRequestData): DetailedValidationResult {
        let evaluatedGuess: EvaluatedLetter[] = new Array(requestData.guess.length);
        let score: number = 0;
        
        // First define the correct letters and the wrong letters
        for (let i = 0; i < requestData.guess.length; i++) {
            // Define the guessed letter and define the actual letter
            const guessedLetter = requestData.guess[i].toUpperCase();
            const actualLetter = requestData.actualWordState.word[i].toUpperCase();   
            
            // CORRECT
            if (guessedLetter == actualLetter) {
                const newCorrectLetterGuessed = requestData.actualWordState.letterStates[i].guessed == false;

                // CORRECT GUESS WITHOUT MISPLACE
                if (newCorrectLetterGuessed) {
                    score += ScoreCalculator.calculateScoreForLetterCorrect(guessedLetter, requestData.previouslyGuessedMisplacedLetters);
                }

                requestData.actualWordState.letterStates[i].guessed = true;
                evaluatedGuess[i] = { letter: guessedLetter, position: i + 1, state: LetterState.Correct }
            } 
            // NOT CORRECT (WRONG or MISPLACED)
            else {
                // Not correct, so wrong - later determine if misplaced
                evaluatedGuess[i] = { letter: guessedLetter, position: i + 1, state: LetterState.Wrong }
            }
        }

        // After defining the correct letters, another iteration is needed to handle misplaced scenarios
        // ONLY check letters that were marked as Wrong (not Correct)
        for (let i = 0; i < requestData.guess.length; i++) {
            // Skip letters that are already correct
            if (evaluatedGuess[i].state === LetterState.Correct) { // prevent scenario that one letter can be counted as CORRECT and MISPLACED at the same time
                continue;
            }
            
            // If wrong, check if it should be misplaced
            const wrongLetter = requestData.guess[i].toUpperCase();
            const wordStateContainsUnguessedLettersOfThisVariant = requestData.actualWordState.letterStates.some(l => l.guessed == false && l.letter.toUpperCase() == wrongLetter);
            
            // The letter is misplaced, because there are still guessed=false letters in the wordState
            if (wordStateContainsUnguessedLettersOfThisVariant) {
                evaluatedGuess[i].state = LetterState.Misplaced;                
                
                // Add to misplaced letters if not already
                const letterWasAlreadyGuessedAsMisplacedBefore = requestData.previouslyGuessedMisplacedLetters.some(l => l == wrongLetter);
                if (letterWasAlreadyGuessedAsMisplacedBefore == false) {
                    score += ScoreCalculator.calculateScoreForMisplacedLetter(wrongLetter, requestData.previouslyGuessedMisplacedLetters);
                    requestData.previouslyGuessedMisplacedLetters.push(wrongLetter);
                }
            }
        }

        const guessIsCorrect = evaluatedGuess.some(evaluatedLetter => evaluatedLetter.state != LetterState.Correct) == false;
        if (guessIsCorrect) {
            score += ScoreCalculator.calculateScoreForWordGuessed(requestData.currentGuessIndex);
        }

        return {
            evaluatedGuess: evaluatedGuess,
            score: score,
            allCorrect: guessIsCorrect,
            previouslyGuessedMisplacedLetters: requestData.previouslyGuessedMisplacedLetters,
            actualWordState: requestData.actualWordState
        }
    }
}
