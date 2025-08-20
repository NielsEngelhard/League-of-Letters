import { CALCULATE_STREAK_POINTS, LETTER_CORRECTLY_GUESSED_WITHOUT_MISPLACE, POINTS_PER_STREAK_ITEM } from "../../score-constants";
import { ScoreCalculator } from "../score-calculator";
import { EvaluatedLetter, LetterState } from "../../../word/word-models";

describe("calculate bonus points", () => {
    it("should assign streak bonus when the streak threshold is surpassed exactly", () => {

        // Streak of 3 after each other
        const newCorrectLetters: EvaluatedLetter[] = [
            { letter: "A", position: 1, state: LetterState.Correct },
            { letter: "B", position: 2, state: LetterState.Correct },
            { letter: "C", position: 3, state: LetterState.Correct },
        ];

        const score = ScoreCalculator.calculate({
            currentGuessIndex: 6,
            wordGuessed: false,
            newLetters: newCorrectLetters,
            previouslyGuessedLetters: [],
        });

        const expectedStreakScore = CALCULATE_STREAK_POINTS(newCorrectLetters.length);
        expect(score.streakScore).toEqual(expectedStreakScore);
    });

    it("should assign streak bonus when the streak threshold is surpassed by a few", () => {

        // Streak of 5 after each other
        const newCorrectLetters: EvaluatedLetter[] = [
            { letter: "A", position: 5, state: LetterState.Correct },
            { letter: "C", position: 7, state: LetterState.Correct },
            { letter: "B", position: 6, state: LetterState.Correct },            
            { letter: "Q", position: 8, state: LetterState.Correct },
            { letter: "Z", position: 4, state: LetterState.Correct },
        ];

        const score = ScoreCalculator.calculate({
            currentGuessIndex: 6,
            wordGuessed: false,
            newLetters: newCorrectLetters,
            previouslyGuessedLetters: [],
        });

        const expectedStreakScore = CALCULATE_STREAK_POINTS(newCorrectLetters.length);
        expect(score.streakScore).toEqual(expectedStreakScore);
    });   
    
    it("should not assign streak bonus when one of the items in the streak has another letter state", () => {

        // Streak of 5 after each other
        const newCorrectLetters: EvaluatedLetter[] = [
            { letter: "Z", position: 1, state: LetterState.Correct },
            { letter: "A", position: 2, state: LetterState.Wrong },
            { letter: "B", position: 3, state: LetterState.Correct },
            { letter: "C", position: 4, state: LetterState.Correct },
            { letter: "Q", position: 5, state: LetterState.Misplaced },
            { letter: "Q", position: 6, state: LetterState.Correct },
        ];

        const score = ScoreCalculator.calculate({
            currentGuessIndex: 1,
            wordGuessed: false,
            newLetters: newCorrectLetters,
            previouslyGuessedLetters: [],
        });

        expect(score.streakScore).toEqual(0);
    });       
});
