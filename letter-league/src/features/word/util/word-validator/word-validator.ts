import { ScoreCalculator } from "../../../../features/score/score-calculator/score-calculator";
import { EvaluatedLetter, LetterState, WordState } from "../../word-models";

export interface DetailedValidationResult {
    evaluatedGuess: EvaluatedLetter[];
    score: number;
    allCorrect: boolean;
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
        for (let i = 0; i < requestData.actualWordState.letterStates.length; i++) {
            // If correct, it is for sure not misplaced
            if (requestData.actualWordState.letterStates[i].guessed == true) continue;
            
            const wrongLetter = requestData.guess[i].toUpperCase();
            const wordStateContainsUnguessedLettersOfThisVariant = requestData.actualWordState.letterStates.some(l => l.guessed == false && l.letter.toUpperCase() == wrongLetter);
            
            // The letter is misplaced, because there are still guessed=false letters in the wordState
            if (wordStateContainsUnguessedLettersOfThisVariant) {
                evaluatedGuess[i].state = LetterState.Misplaced;
                score += ScoreCalculator.calculateScoreForMisplacedLetter(wrongLetter, requestData.previouslyGuessedMisplacedLetters);                
            }
        }

        const guessIsCorrect = evaluatedGuess.some(evaluatedLetter => evaluatedLetter.state != LetterState.Correct) == false;
        if (guessIsCorrect) {
            score += ScoreCalculator.calculateScoreForWordGuessed(requestData.currentGuessIndex);
        }

        return {
            evaluatedGuess: evaluatedGuess,
            score: score,
            allCorrect: guessIsCorrect
        }
    }
}
