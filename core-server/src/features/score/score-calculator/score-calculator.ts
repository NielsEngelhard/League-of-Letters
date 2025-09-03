import { LETTER_CORRECT_AFTER_MISPLACED_POINTS, LETTER_CORRECTLY_GUESSED_WITHOUT_MISPLACE_POINTS, LETTER_MISPLACED_POINTS, WORD_GUESSED_FIRST_TRY_BONUS_POINTS, WORD_GUESSED_POINTS, WORD_GUESSED_SECOND_TRY_BONUS_POINTS } from "../score-constants";

export class ScoreCalculator {
    static calculateScoreForLetterCorrect(letter: string, previouslyGuessedMisplacedLetters: string[]): number {
        const letterWasMisplacedBefore = previouslyGuessedMisplacedLetters.some(l => l.toUpperCase() == letter.toUpperCase());
        if (letterWasMisplacedBefore) {
            return LETTER_CORRECT_AFTER_MISPLACED_POINTS;
        } else {
            return LETTER_CORRECTLY_GUESSED_WITHOUT_MISPLACE_POINTS;
        }
    }

    static calculateScoreForMisplacedLetter(letter: string, previouslyGuessedMisplacedLetters: string[]): number {
        const alreadyMarkedAsMisplacedBefore = previouslyGuessedMisplacedLetters.some(l => l.toUpperCase() == letter.toUpperCase());
        if (alreadyMarkedAsMisplacedBefore) {
            return 0;
        } else {
            return LETTER_MISPLACED_POINTS;
        }
    }

    static calculateScoreForWordGuessed(currentGuessIndex: number): number {
        let bonusPoints = 0;
        
        switch(currentGuessIndex) {
            case 1:
                bonusPoints = WORD_GUESSED_FIRST_TRY_BONUS_POINTS;
                break;
            case 2:
                bonusPoints = WORD_GUESSED_SECOND_TRY_BONUS_POINTS;
                break;
        }

        return WORD_GUESSED_POINTS + bonusPoints;
    }
}